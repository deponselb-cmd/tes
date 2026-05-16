import React, { useState, useEffect } from 'react';
import { 
  UserCheck, Shield, Mail, Key, Plus, Trash2, Edit2, Loader2, X, Check, 
  Search, Filter, Phone, MapPin, Calendar, DollarSign, Award, Briefcase, 
  TrendingUp, Activity, UserPlus, Star, ChevronRight, Clock
} from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../lib/utils';

interface StaffMember {
  id?: string;
  name: string;
  role: 'Super Admin' | 'Technician' | 'Support' | 'Viewer';
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'on_field' | 'on_leave';
  salary: number;
  joinDate: string;
  address: string;
  performance: {
    tasksCompleted: number;
    tasksPending: number;
    rating: number;
  };
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  
  const [formData, setFormData] = useState<Omit<StaffMember, 'id'>>({
    name: '',
    role: 'Support',
    email: '',
    phone: '',
    status: 'active',
    salary: 0,
    joinDate: new Date().toISOString().split('T')[0],
    address: '',
    performance: {
      tasksCompleted: 0,
      tasksPending: 0,
      rating: 5
    }
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'staff'), (snapshot) => {
      const staffList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StaffMember[];
      setStaff(staffList);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || s.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: staff.length,
    active: staff.filter(s => s.status === 'active' || s.status === 'on_field').length,
    technicians: staff.filter(s => s.role === 'Technician').length,
    avgRating: staff.length ? (staff.reduce((acc, curr) => acc + curr.performance.rating, 0) / staff.length).toFixed(1) : 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'on_field': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
      case 'on_leave': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-red-500 bg-red-500/10 border-red-500/20';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await updateDoc(doc(db, 'staff', editingStaff.id!), { 
          ...formData,
          lastUpdated: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'staff'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      setEditingStaff(null);
      setFormData({
        name: '',
        role: 'Support',
        email: '',
        phone: '',
        status: 'active',
        salary: 0,
        joinDate: new Date().toISOString().split('T')[0],
        address: '',
        performance: {
          tasksCompleted: 0,
          tasksPending: 0,
          rating: 5
        }
      });
    } catch (err) {
      console.error("Staff operation failed:", err);
    }
  };

  const handleEdit = (s: StaffMember) => {
    setEditingStaff(s);
    setFormData({
      name: s.name,
      role: s.role,
      email: s.email,
      phone: s.phone || '',
      status: s.status,
      salary: s.salary || 0,
      joinDate: s.joinDate || new Date().toISOString().split('T')[0],
      address: s.address || '',
      performance: s.performance || { tasksCompleted: 0, tasksPending: 0, rating: 5 }
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this staff member?')) {
      await deleteDoc(doc(db, 'staff', id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-text uppercase tracking-tighter">Manajemen Staff</h2>
          <p className="text-[10px] text-brand-text-muted font-black uppercase tracking-widest opacity-60">Monitor kinerja, ketersediaan, dan penugasan tim</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setEditingStaff(null);
              setFormData({
                name: '',
                role: 'Support',
                email: '',
                phone: '',
                status: 'active',
                salary: 0,
                joinDate: new Date().toISOString().split('T')[0],
                address: '',
                performance: { tasksCompleted: 0, tasksPending: 0, rating: 5 }
              });
              setIsModalOpen(true);
            }}
            className="bg-brand-primary hover:scale-[1.02] active:scale-95 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-brand-primary/30 flex items-center gap-2"
          >
            <UserPlus size={16} /> Tambah Staff
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Team', value: stats.total, icon: UserCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Staff Aktif', value: stats.active, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Teknisi', value: stats.technicians, icon: Shield, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Rating Global', value: `${stats.avgRating}/5`, icon: Award, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5 rounded-3xl border border-brand-border flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shrink-0`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[8px] font-black uppercase text-brand-text-muted tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-xl font-black text-brand-text tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-4 rounded-3xl border border-brand-border flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-primary transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Cari nama staff atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-surface border border-brand-border rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-brand-text outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="flex-1 md:w-48 bg-brand-surface border border-brand-border rounded-2xl px-4 py-3 text-sm font-bold text-brand-text outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="all">Semua Role</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Technician">Technician</option>
            <option value="Support">Support</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-brand-primary" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStaff.map((s) => (
            <motion.div 
              layout
              key={s.id} 
              className="glass-card glass-card-hover rounded-[2rem] border border-brand-border group relative overflow-hidden"
            >
              {/* Status Header */}
              <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-brand-surface/30">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(s.status)}`}>
                  {s.status.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-1.5">
                  <Star size={12} className="text-brand-primary" fill="currentColor" />
                  <span className="text-[10px] font-black text-brand-text">{s.performance?.rating || 5}.0</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-16 h-16 bg-brand-bg border-4 border-brand-surface rounded-[1.5rem] flex items-center justify-center font-black text-brand-primary text-2xl shadow-xl">
                    {s.name[0]}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-lg font-black text-brand-text uppercase tracking-tight truncate">{s.name}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Briefcase size={10} className="text-brand-text-muted" />
                      <p className="text-[9px] font-black text-brand-text-muted uppercase tracking-widest">{s.role}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-brand-surface/50 border border-brand-border">
                    <p className="text-[8px] font-black uppercase text-brand-text-muted mb-1 tracking-widest leading-none">Task Selesai</p>
                    <p className="text-sm font-black text-emerald-500">{s.performance?.tasksCompleted || 0} Task</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-brand-surface/50 border border-brand-border">
                    <p className="text-[8px] font-black uppercase text-brand-text-muted mb-1 tracking-widest leading-none">Task Pending</p>
                    <p className="text-sm font-black text-amber-500">{s.performance?.tasksPending || 0} Task</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-brand-text-muted font-bold group/info">
                    <Mail size={14} className="text-brand-primary group-hover/info:scale-110 transition-transform" />
                    <span className="truncate">{s.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-brand-text-muted font-bold group/info">
                    <Phone size={14} className="text-brand-primary group-hover/info:scale-110 transition-transform" />
                    <span>{s.phone || '-'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-brand-text-muted font-bold group/info">
                    <Calendar size={14} className="text-brand-primary group-hover/info:scale-110 transition-transform" />
                    <span>Joined {s.joinDate || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-brand-border flex items-center justify-between">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(s)}
                    className="p-2.5 bg-brand-surface border border-brand-border rounded-xl text-brand-text-muted hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all active:scale-95"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(s.id!)}
                    className="p-2.5 bg-brand-surface border border-brand-border rounded-xl text-brand-text-muted hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-95"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black uppercase text-brand-text-muted mb-0.5 tracking-widest">Base Salary</p>
                  <p className="text-xs font-black text-brand-text">{formatCurrency(s.salary || 0)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-text/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-brand-bg border border-brand-border rounded-[2.5rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-brand-text uppercase tracking-tighter">
                      {editingStaff ? 'Edit Informasi Staff' : 'Registrasi Staff Baru'}
                    </h3>
                    <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Lengkapi data profesional & identitas</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-surface border border-brand-border text-brand-text-muted hover:text-red-500 transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Nama Lengkap</label>
                    <input 
                      type="text" required value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-brand-surface border border-brand-border rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 text-brand-text"
                      placeholder="Contoh: Budi Santoso"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Email Profesional</label>
                    <input 
                      type="email" required value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-brand-surface border border-brand-border rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 text-brand-text"
                      placeholder="budi@isp.net"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Nomor WhatsApp</label>
                    <input 
                      type="text" value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-brand-surface border border-brand-border rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 text-brand-text"
                      placeholder="081234..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Tanggal Join</label>
                    <input 
                      type="date" value={formData.joinDate}
                      onChange={e => setFormData({...formData, joinDate: e.target.value})}
                      className="w-full bg-brand-surface border border-brand-border rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 text-brand-text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Role Penugasan</label>
                    <select 
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value as any})}
                      className="w-full bg-brand-surface border border-brand-border rounded-2xl px-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 text-brand-text"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Technician">Technician</option>
                      <option value="Support">Support</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Status Kehadiran</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as any})}
                      className="w-full bg-brand-surface border border-brand-border rounded-2xl px-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 text-brand-text"
                    >
                      <option value="active">Active (Office)</option>
                      <option value="on_field">On Field (Teknisi)</option>
                      <option value="on_leave">On Leave</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Gaji Pokok</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted" size={16} />
                      <input 
                        type="number" value={formData.salary}
                        onChange={e => setFormData({...formData, salary: parseFloat(e.target.value)})}
                        className="w-full bg-brand-surface border border-brand-border rounded-2xl pl-10 pr-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 text-brand-text"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Alamat Tinggal</label>
                  <textarea 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    rows={2}
                    className="w-full bg-brand-surface border border-brand-border rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 text-brand-text resize-none"
                    placeholder="Alamat lengkap sesuai identitas..."
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="submit" className="flex-1 bg-brand-primary text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    {editingStaff ? 'Simpan Perubahan' : 'Finalisasi Registrasi'}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 bg-brand-surface text-brand-text py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-brand-border hover:bg-brand-bg transition-all">
                    Batal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

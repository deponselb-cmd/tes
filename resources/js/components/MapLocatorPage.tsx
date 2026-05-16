import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, useMap } from 'react-leaflet';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Customer, GeoMarker } from '../types';
import L from 'leaflet';
import { Search, Layers, Navigation, Plus, MapPin, X, Info, Settings, Trash2, Box, Database, User, Crosshair, Target, RotateCcw, Maximize, Minimize, Activity } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { useTranslation } from '../locales/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

const createCustomIcon = (type: string, status: string) => {
  let color = '#6366f1'; // Indigo (Customer)
  let iconHtml = '';
  const isPulsing = status === 'active';
  const pingClass = isPulsing ? 'marker-ping' : '';

  if (type === 'ODC') {
    color = '#f59e0b'; // Amber
    iconHtml = `<div class="${pingClass}" style="background:${color};width:32px;height:32px;border-radius:8px;border:4px solid white;box-shadow:0 0 15px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:10px;position:relative;">ODC</div>`;
  } else if (type === 'ODP') {
    color = '#10b981'; // Emerald
    iconHtml = `<div class="${pingClass}" style="background:${color};width:28px;height:28px;border-radius:50%;border:4px solid white;box-shadow:0 0 15px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:8px;position:relative;">ODP</div>`;
  } else {
    color = status === 'active' ? '#6366f1' : (status === 'isolated' ? '#ef4444' : '#f59e0b');
    iconHtml = `<div class="${pingClass}" style="background:${color};width:24px;height:24px;border-radius:50%;border:4px solid white;box-shadow:0 0 10px rgba(0,0,0,0.3);position:relative;"></div>`;
  }

  return L.divIcon({
    className: `custom-marker ${pingClass}`,
    html: iconHtml,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

function MapEvents({ onMapClick }: { onMapClick: (e: any) => void }) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function InvalidateSize() {
  const map = useMap();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  return null;
}

export default function MapLocatorPage() {
  const { t } = useTranslation();
  const [markers, setMarkers] = useState<GeoMarker[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-2.5489, 118.0149]);
  const [zoom, setZoom] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<Partial<GeoMarker> | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [isFindingNearest, setIsFindingNearest] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);
  const [nearestInfo, setNearestInfo] = useState<{ name: string; distance: number } | null>(null);

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const qMarkers = query(collection(db, 'markers'));
    const unsubMarkers = onSnapshot(qMarkers, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GeoMarker));
      setMarkers(data);
    });

    const qCustomers = query(collection(db, 'customers'));
    const unsubCustomers = onSnapshot(qCustomers, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
      setCustomers(data.filter(c => c.lat && c.lng));
    });

    return () => {
      unsubMarkers();
      unsubCustomers();
    };
  }, []);

  const handleMapClick = (e: any) => {
    if (isAddingMarker) {
      setSelectedMarker({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        type: 'ODP',
        status: 'active',
        name: '',
        description: '',
        capacity: 16,
        used: 0
      });
      setIsAddingMarker(false);
    } else if (isFindingNearest) {
      const odpMarkers = markers.filter(m => m.type === 'ODP');
      if (odpMarkers.length === 0) return;

      let nearest = odpMarkers[0];
      let minDocs = getDistance(e.latlng.lat, e.latlng.lng, nearest.lat, nearest.lng);

      odpMarkers.forEach(m => {
        const d = getDistance(e.latlng.lat, e.latlng.lng, m.lat, m.lng);
        if (d < minDocs) {
          minDocs = d;
          nearest = m;
        }
      });

      setMapCenter([nearest.lat, nearest.lng]);
      setZoom(18);
      setNearestInfo({ name: nearest.name, distance: minDocs });
    } else if (isMeasuring) {
      setMeasurePoints(prev => [...prev, [e.latlng.lat, e.latlng.lng]]);
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMapCenter([position.coords.latitude, position.coords.longitude]);
        setZoom(15);
      });
    }
  };

  const handleResetView = () => {
    setMapCenter([-2.5489, 118.0149]);
    setZoom(5);
    setNearestInfo(null);
  };

  const handleSaveMarker = async () => {
    if (!selectedMarker?.name) return;
    try {
      if (selectedMarker.id) {
        await updateDoc(doc(db, 'markers', selectedMarker.id), selectedMarker);
      } else {
        const docRef = doc(collection(db, 'markers'));
        await setDoc(docRef, { ...selectedMarker, id: docRef.id });
      }
      setSelectedMarker(null);
    } catch (err) {
      console.error("Error saving marker:", err);
    }
  };

  const handleDeleteMarker = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'markers', id));
      setSelectedMarker(null);
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Error deleting marker:", err);
    }
  };

  const allMapItems = [
    ...markers,
    ...customers.map(c => ({
      id: c.id,
      name: c.name,
      type: 'Customer' as const,
      lat: c.lat!,
      lng: c.lng!,
      status: c.status as any,
      description: c.address,
      extra: c
    }))
  ];

  const filteredItems = allMapItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleFocusItem = (item: any) => {
    setMapCenter([item.lat, item.lng]);
    setZoom(18);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari lokasi, ODC, ODP atau pelanggan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-surface border border-brand-border rounded-xl pl-10 pr-4 py-3 text-sm text-brand-text outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-bold"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-text font-black uppercase tracking-widest outline-none cursor-pointer hover:border-brand-primary"
          >
            <option value="all">Semua Tipe</option>
            <option value="ODC">ODC Only</option>
            <option value="ODP">ODP Only</option>
            <option value="Customer">Pelanggan</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setIsAddingMarker(!isAddingMarker)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
              isAddingMarker 
              ? 'bg-red-500 text-white shadow-red-500/20' 
              : 'bg-brand-primary text-white shadow-brand-primary/20 hover:scale-105 active:scale-95'
            }`}
          >
            <Plus size={14} />
            {isAddingMarker ? 'Batal Tambah' : 'Tambah Infrastruktur'}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
        {/* Sidebar List */}
        <div className="lg:col-span-1 glass-card border border-brand-border rounded-3xl flex flex-col overflow-hidden shadow-sm bg-brand-surface/20">
          <div className="p-5 border-b border-brand-border/50 bg-brand-surface/30">
            <h3 className="text-[10px] font-black uppercase text-brand-text-muted tracking-widest leading-none mb-1">Daftar Infrastruktur</h3>
            <p className="text-[9px] font-bold text-indigo-500 uppercase">{filteredItems.length} Lokasi Terdaftar</p>
          </div>

          <div className="p-4 border-b border-brand-border/30 bg-brand-bg/50">
            <p className="text-[8px] font-black uppercase text-brand-text-muted tracking-widest mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setIsAddingMarker(!isAddingMarker)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  isAddingMarker 
                  ? 'bg-red-500 text-white' 
                  : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white'
                }`}
              >
                <Plus size={12} /> Add Point
              </button>
              <button 
                onClick={() => {
                  setIsMeasuring(!isMeasuring);
                  setMeasurePoints([]);
                  setIsFindingNearest(false);
                  setIsAddingMarker(false);
                }}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  isMeasuring 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-600 hover:text-white'
                }`}
              >
                <Navigation size={12} className={isMeasuring ? 'rotate-45' : ''} /> Measure
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center opacity-40">
                <MapPin size={24} className="mb-2 text-brand-text-muted" />
                <p className="text-[9px] uppercase font-black tracking-widest leading-relaxed">No locations found.</p>
              </div>
            ) : (
              filteredItems.map(item => (
                <div 
                  key={item.id}
                  onClick={() => handleFocusItem(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleFocusItem(item);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  className="w-full text-left p-3 rounded-xl bg-brand-bg border border-brand-border/50 hover:border-brand-primary hover:shadow-lg transition-all group relative overflow-hidden cursor-pointer"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      item.type === 'ODC' ? 'bg-amber-500/10 text-amber-500' : 
                      item.type === 'ODP' ? 'bg-emerald-500/10 text-emerald-500' : 
                      'bg-indigo-500/10 text-indigo-500'
                    }`}>
                      {item.type === 'ODC' ? <Database size={14} /> : item.type === 'ODP' ? <Box size={14} /> : <User size={14} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5 mb-0.5">
                        <span className="text-[7px] font-black uppercase tracking-widest text-brand-text-muted">{item.type}</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                      </div>
                      <p className="text-[11px] font-black text-brand-text uppercase tracking-tight truncate group-hover:text-brand-primary transition-colors">{item.name}</p>
                      <p className="text-[8px] text-brand-text-muted mt-0.5 truncate font-bold leading-none">{item.description}</p>
                    </div>
                  </div>
                  {item.type !== 'Customer' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMarker(item);
                      }}
                      className="absolute top-1.5 right-1.5 p-1 opacity-0 group-hover:opacity-100 bg-brand-surface rounded text-brand-text hover:text-brand-primary transition-all border border-brand-border"
                    >
                      <Settings size={10} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map View */}
        <div className={`lg:col-span-3 glass-card border border-brand-border rounded-3xl relative overflow-hidden shadow-2xl group transition-all duration-300 ${isFullScreen ? 'fixed inset-0 z-[5000] !rounded-none m-0' : ''}`}>
          {isAddingMarker && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
              <Plus size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Klik pada peta untuk menaruh lokasi</span>
            </div>
          )}

          {isFindingNearest && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-pulse">
              <Target size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest font-mono">
                {nearestInfo ? `Nearest: ${nearestInfo.name} (${nearestInfo.distance.toFixed(2)} km)` : 'Klik peta untuk cari ODP terdekat'}
              </span>
              {nearestInfo && (
                <button onClick={() => setNearestInfo(null)} className="ml-2 p-1 hover:bg-white/20 rounded">
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {isMeasuring && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] bg-brand-primary text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
              <Navigation size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest font-mono">
                {measurePoints.length > 1 
                  ? `Jarak: ${measurePoints.reduce((acc, curr, i) => {
                      if (i === 0) return 0;
                      return acc + getDistance(measurePoints[i-1][0], measurePoints[i-1][1], curr[0], curr[1]);
                    }, 0).toFixed(3)} km`
                  : 'Klik titik-titik pada peta untuk ukur jarak'}
              </span>
              <button onClick={() => { setMeasurePoints([]); setIsMeasuring(false); }} className="ml-2 p-1 hover:bg-white/20 rounded">
                <X size={14} />
              </button>
            </div>
          )}

          <MapContainer center={mapCenter} zoom={zoom} scrollWheelZoom={true} className="z-0 w-full h-full">
            <InvalidateSize />
            <MapEvents onMapClick={handleMapClick} />
            <ChangeView center={mapCenter} zoom={zoom} />
            {mapType === 'street' ? (
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            ) : (
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            )}
            {filteredItems.map(item => (
              <Marker key={item.id} position={[item.lat, item.lng]} icon={createCustomIcon(item.type, item.status)}>
                <Popup>
                  <div className="min-w-[240px] p-2 font-sans">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-brand-text-muted">{item.type} Node</span>
                        <h4 className="font-black text-brand-text uppercase tracking-tight text-lg leading-none mt-1">{item.name}</h4>
                      </div>
                      <div className={`p-2 rounded-xl ${
                        item.type === 'ODC' ? 'bg-amber-500/10 text-amber-500' : 
                        item.type === 'ODP' ? 'bg-emerald-500/10 text-emerald-500' : 
                        'bg-indigo-500/10 text-indigo-500'
                      }`}>
                        {item.type === 'ODC' ? <Database size={20} /> : item.type === 'ODP' ? <Box size={20} /> : <User size={20} />}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-[8px] text-brand-text-muted uppercase font-black tracking-widest mb-1.5">Alamat / Deskripsi</p>
                        <p className="text-[10px] font-bold text-brand-text leading-relaxed">{item.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-brand-border/30 pt-4">
                        <div>
                          <p className="text-[8px] text-brand-text-muted uppercase font-black tracking-widest mb-1.5">Status</p>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            item.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        {item.capacity !== undefined && (
                          <div className="text-right">
                            <p className="text-[8px] text-brand-text-muted uppercase font-black tracking-widest mb-1.5">Kapasitas</p>
                            <p className="text-[10px] font-black text-brand-text">{item.used} / {item.capacity} <span className="text-brand-text-muted ml-1">Core</span></p>
                          </div>
                        )}
                        {item.type === 'Customer' && (item as any).extra?.invoiceAmount !== undefined && (
                          <div className="text-right">
                            <p className="text-[8px] text-brand-text-muted uppercase font-black tracking-widest mb-1.5">Tagihan</p>
                            <p className="text-[10px] font-black text-brand-primary">{formatCurrency((item as any).extra.invoiceAmount)}</p>
                          </div>
                        )}
                      </div>

                      {item.type !== 'Customer' && (
                        <button 
                          onClick={() => setSelectedMarker(item)}
                          className="w-full mt-2 py-2.5 bg-brand-surface border border-brand-border rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-text hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <Settings size={14} /> Konfigurasi Node
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Connection Lines */}
            {markers.filter(m => m.connectedTo).map(m => {
              const parent = markers.find(p => p.id === m.connectedTo);
              if (!parent) return null;
              const color = m.type === 'ODP' ? '#f59e0b' : '#10b981';
              return (
                <Polyline 
                  key={`link-${m.id}`} 
                  positions={[[m.lat, m.lng], [parent.lat, parent.lng]]} 
                  pathOptions={{ 
                    color: color, 
                    weight: 3, 
                    dashArray: m.type === 'ODP' ? '' : '10, 10',
                    opacity: 0.6 
                  }} 
                />
              );
            })}

            {/* Measuring Polyline */}
            {measurePoints.length > 1 && (
              <Polyline 
                positions={measurePoints}
                pathOptions={{ color: '#6366f1', weight: 4, dashArray: '5, 10' }}
              />
            )}
            {measurePoints.map((p, i) => (
              <Marker 
                key={`measure-${i}`} 
                position={p} 
                icon={L.divIcon({
                  className: 'bg-brand-primary w-2 h-2 rounded-full border-2 border-white',
                  iconSize: [8, 8]
                })}
              />
            ))}
          </MapContainer>

          {/* Map Overlay Controls */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-3 items-end max-w-[200px]">
            {/* Layer Switcher */}
            <div className="glass-card p-1 rounded-[1.25rem] flex gap-1 shadow-2xl border border-brand-border/20 backdrop-blur-3xl overflow-hidden">
              <button 
                onClick={() => setMapType('street')}
                className={`flex-1 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${mapType === 'street' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-text-muted hover:bg-brand-primary/10'}`}
              >
                Peta
              </button>
              <button 
                onClick={() => setMapType('satellite')}
                className={`flex-1 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${mapType === 'satellite' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-text-muted hover:bg-brand-primary/10'}`}
              >
                Satelit
              </button>
            </div>

            {/* Tool Stack */}
            <div className="flex flex-col gap-2">
              <div className="glass-card p-1.5 rounded-2xl flex flex-col gap-1 shadow-2xl border border-brand-border/20 backdrop-blur-3xl">
                <button 
                  onClick={handleLocateMe}
                  title="Locate Me"
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-brand-text hover:bg-brand-primary hover:text-white transition-all"
                >
                  <Crosshair size={18} />
                </button>
                <button 
                  onClick={handleResetView}
                  title="Reset View"
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-brand-text hover:bg-brand-primary hover:text-white transition-all"
                >
                  <RotateCcw size={18} />
                </button>
                <button 
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-brand-text hover:bg-brand-primary hover:text-white transition-all"
                >
                  {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
              </div>

              <div className="glass-card p-1.5 rounded-2xl flex flex-col gap-1 shadow-2xl border border-brand-border/20 backdrop-blur-3xl">
                <button 
                  onClick={() => {
                    setIsFindingNearest(!isFindingNearest);
                    setNearestInfo(null);
                    setIsAddingMarker(false);
                    setIsMeasuring(false);
                  }}
                  title="Find Nearest ODP"
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isFindingNearest ? 'bg-emerald-500 text-white animate-pulse shadow-lg' : 'text-brand-text hover:bg-emerald-500 hover:text-white'}`}
                >
                  <Target size={18} />
                </button>
                <button 
                  onClick={() => {
                    setIsMeasuring(!isMeasuring);
                    setMeasurePoints([]);
                    setIsFindingNearest(false);
                    setIsAddingMarker(false);
                  }}
                  title="Measure Distance"
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isMeasuring ? 'bg-indigo-500 text-white shadow-lg' : 'text-brand-text hover:bg-indigo-500 hover:text-white'}`}
                >
                  <Navigation size={18} className={isMeasuring ? 'rotate-45' : ''} />
                </button>
              </div>
            </div>

            {/* Stats Dashboard */}
            <div className="hidden xl:block w-full glass-card border border-brand-border/20 p-5 rounded-3xl backdrop-blur-3xl shadow-2xl animate-in fade-in slide-in-from-right-4">
              <p className="text-[9px] font-black uppercase text-brand-text-muted mb-4 tracking-widest leading-none flex items-center gap-2">
                <Activity size={10} className="text-brand-primary" /> Statistik
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-2xl bg-brand-surface/30 border border-brand-border/30">
                  <p className="text-[7px] font-black uppercase text-brand-text-muted opacity-60 mb-1">Total ODC</p>
                  <p className="text-lg font-black text-brand-text tracking-tighter leading-none">{markers.filter(m => m.type === 'ODC').length}</p>
                </div>
                <div className="p-3 rounded-2xl bg-brand-surface/30 border border-brand-border/30">
                  <p className="text-[7px] font-black uppercase text-brand-text-muted opacity-60 mb-1">Total ODP</p>
                  <p className="text-lg font-black text-brand-text tracking-tighter leading-none">{markers.filter(m => m.type === 'ODP').length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block absolute bottom-4 left-4 z-[1000] glass-card border border-brand-border/30 p-4 rounded-2xl backdrop-blur-2xl shadow-2xl transition-all">
            <h4 className="text-[9px] font-black uppercase text-brand-text-muted mb-3 tracking-widest">Legenda</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500 border border-white shadow-lg" />
                <span className="text-[8px] font-black text-brand-text uppercase tracking-widest">ODC</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 border border-white shadow-lg" />
                <span className="text-[8px] font-black text-brand-text uppercase tracking-widest">ODP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500 border border-white shadow-lg" />
                <span className="text-[8px] font-black text-brand-text uppercase tracking-widest">User</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marker Modal */}
      <AnimatePresence>
        {selectedMarker && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMarker(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-brand-bg border border-brand-border rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-brand-text uppercase tracking-tighter">
                    {selectedMarker.id ? 'Edit Node Peta' : 'Tambah Node Baru'}
                  </h3>
                  <p className="text-[10px] text-brand-text-muted font-black uppercase tracking-widest">Konfigurasi infrastruktur fiber optik</p>
                </div>
                <button onClick={() => setSelectedMarker(null)} className="p-2 hover:bg-brand-surface rounded-full transition-colors text-brand-text-muted">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Tipe Node</label>
                    <select 
                      value={selectedMarker.type}
                      onChange={(e) => setSelectedMarker({...selectedMarker, type: e.target.value as any})}
                      className="w-full bg-brand-surface border border-brand-border rounded-2xl px-5 py-4 text-sm text-brand-text font-bold outline-none focus:ring-2 focus:ring-brand-primary/20"
                    >
                      <option value="ODC">ODC (Cabinet)</option>
                      <option value="ODP">ODP (Point)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Status</label>
                    <select 
                      value={selectedMarker.status}
                      onChange={(e) => setSelectedMarker({...selectedMarker, status: e.target.value as any})}
                      className="w-full bg-brand-surface border border-brand-border rounded-2xl px-5 py-4 text-sm text-brand-text font-bold outline-none focus:ring-2 focus:ring-brand-primary/20"
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="broken">Broken</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Nama Node / ID</label>
                  <input 
                    type="text" 
                    value={selectedMarker.name}
                    onChange={(e) => setSelectedMarker({...selectedMarker, name: e.target.value})}
                    placeholder="Contoh: ODP-JKT-01"
                    className="w-full bg-brand-surface border border-brand-border rounded-2xl px-5 py-4 text-sm text-brand-text font-bold outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Terhubung Ke (Parent)</label>
                  <select 
                    value={selectedMarker.connectedTo || ''}
                    onChange={(e) => setSelectedMarker({...selectedMarker, connectedTo: e.target.value})}
                    className="w-full bg-brand-surface border border-brand-border rounded-2xl px-5 py-4 text-sm text-brand-text font-bold outline-none focus:ring-2 focus:ring-brand-primary/20"
                  >
                    <option value="">Tidak Ada Koneksi</option>
                    {markers.filter(m => m.id !== selectedMarker.id && (selectedMarker.type === 'ODP' ? m.type === 'ODC' : true)).map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.type})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Deskripsi / Lokasi Detail</label>
                  <textarea 
                    value={selectedMarker.description}
                    onChange={(e) => setSelectedMarker({...selectedMarker, description: e.target.value})}
                    rows={3}
                    placeholder="Masukkan detail lokasi atau catatan..."
                    className="w-full bg-brand-surface border border-brand-border rounded-2xl px-5 py-4 text-sm text-brand-text font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Kapasitas Port</label>
                    <input 
                      type="number" 
                      value={selectedMarker.capacity}
                      onChange={(e) => setSelectedMarker({...selectedMarker, capacity: Number(e.target.value)})}
                      className="w-full bg-brand-surface border border-brand-border rounded-2xl px-5 py-4 text-sm text-brand-text font-bold outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Terpakai</label>
                    <input 
                      type="number" 
                      value={selectedMarker.used}
                      onChange={(e) => setSelectedMarker({...selectedMarker, used: Number(e.target.value)})}
                      className="w-full bg-brand-surface border border-brand-border rounded-2xl px-5 py-4 text-sm text-brand-text font-bold outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  {selectedMarker.id && (
                    <>
                      {confirmDeleteId === selectedMarker.id ? (
                        <div className="flex-1 flex gap-2 animate-in fade-in slide-in-from-right-2">
                          <button 
                            type="button"
                            onClick={() => handleDeleteMarker(selectedMarker.id!)}
                            className="flex-1 bg-red-500 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                          >
                            Ya, Hapus Data
                          </button>
                          <button 
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-6 bg-brand-surface text-brand-text py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-brand-border hover:bg-brand-bg transition-all"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => setConfirmDeleteId(selectedMarker.id!)}
                          className="p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all border border-red-500/20 shadow-xl shadow-red-500/10"
                        >
                          <Trash2 size={24} />
                        </button>
                      )}
                    </>
                  )}
                  {!confirmDeleteId && (
                    <button 
                      type="button"
                      onClick={handleSaveMarker}
                      className="flex-1 bg-brand-primary text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Simpan Perubahan
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

@extends('layouts.app')

@section('title', 'Customers')
@section('page-title', 'Customer Management')

@section('content')
<div>
    {{-- Stats --}}
    <div class="grid grid-cols-4 gap-3 mb-4">
        <div class="bg-gray-800/50 rounded-lg p-3 text-center"><p class="text-lg font-bold" id="cust-total">0</p><p class="text-[10px] text-gray-500">Total</p></div>
        <div class="bg-emerald-500/10 rounded-lg p-3 text-center"><p class="text-lg font-bold text-emerald-400" id="cust-active">0</p><p class="text-[10px] text-gray-500">Active</p></div>
        <div class="bg-red-500/10 rounded-lg p-3 text-center"><p class="text-lg font-bold text-red-400" id="cust-isolated">0</p><p class="text-[10px] text-gray-500">Isolated</p></div>
        <div class="bg-amber-500/10 rounded-lg p-3 text-center"><p class="text-lg font-bold text-amber-400" id="cust-pending">0</p><p class="text-[10px] text-gray-500">Pending</p></div>
    </div>

    <x-table header="Customers" :actions="'<button onclick=\'showAddCustomerModal()\' class=\'text-[10px] bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition\'>+ Add Customer</button><button onclick=\'exportCustomersCSV()\' class=\'text-[10px] bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-600 transition\'>📤 Export CSV</button>'">
        <x-slot name="thead">
            <th class="text-left py-2 px-2">Name</th>
            <th class="text-left py-2 px-2">Plan</th>
            <th class="text-left py-2 px-2">PPPoE</th>
            <th class="text-left py-2 px-2">Status</th>
            <th class="text-left py-2 px-2">Phone</th>
            <th class="text-right py-2 px-2">Start Date</th>
            <th class="text-center py-2 px-2">Actions</th>
        </x-slot>
        <x-slot name="tbody" id="customers-tbody">
            {{-- Diisi oleh JavaScript --}}
        </x-slot>
    </x-table>
</div>
@endsection

@push('modals')
    <x-modal id="add-customer-modal" title="Add Customer" maxWidth="2xl">
        <form id="customer-form" onsubmit="return false;">
            <input type="hidden" id="customer-id" value="">
            <div class="grid grid-cols-2 gap-4 mb-5">
                <div><label class="text-xs text-gray-400 block mb-1">Full Name *</label><input type="text" id="cust-fullname" placeholder="John Doe" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 outline-none" required></div>
                <div><label class="text-xs text-gray-400 block mb-1">ID Number</label><input type="text" id="cust-idnumber" placeholder="KTP/SIM" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 outline-none"></div>
                <div><label class="text-xs text-gray-400 block mb-1">Phone *</label><input type="tel" id="cust-phone" placeholder="+62 8XX" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 outline-none" required></div>
                <div><label class="text-xs text-gray-400 block mb-1">Email</label><input type="email" id="cust-email" placeholder="email@example.com" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 outline-none"></div>
                <div>
                    <label class="text-xs text-gray-400 block mb-1">Plan *</label>
                    <select id="cust-plan" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none" required>
                        <option value="">Select Plan</option>
                        <option value="Basic 10 Mbps">Basic 10 Mbps</option>
                        <option value="Standard 30 Mbps">Standard 30 Mbps</option>
                        <option value="Premium 50 Mbps">Premium 50 Mbps</option>
                        <option value="Business 100 Mbps">Business 100 Mbps</option>
                    </select>
                </div>
                <div>
                    <label class="text-xs text-gray-400 block mb-1">Status</label>
                    <select id="cust-status" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none">
                        <option value="active">Active</option>
                        <option value="isolated">Isolated</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
                <div><label class="text-xs text-gray-400 block mb-1">PPPoE Username</label><input type="text" id="cust-pppoe" placeholder="auto-generated" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 outline-none"></div>
                <div><label class="text-xs text-gray-400 block mb-1">PPPoE Password</label><input type="text" id="cust-pppoe-pass" placeholder="Set password" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 outline-none"></div>
                <div><label class="text-xs text-gray-400 block mb-1">Start Date</label><input type="date" id="cust-start-date" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none"></div>
            </div>
            <div class="mb-4"><label class="text-xs text-gray-400 block mb-1">Address</label><textarea id="cust-address" placeholder="Full address" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 outline-none h-20"></textarea></div>
            <div class="mb-4"><label class="text-xs text-gray-400 block mb-1">Notes</label><textarea id="cust-notes" placeholder="Additional notes" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 outline-none h-16"></textarea></div>
            <div class="flex gap-2">
                <button type="button" onclick="saveCustomer()" class="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium active:scale-95">Save Customer</button>
                <button type="button" onclick="closeAddCustomerModal()" class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-medium">Cancel</button>
            </div>
        </form>
    </x-modal>
@endpush

@push('scripts')
<script>
    let customersData = [];

    async function loadCustomers() {
        try {
            const res = await fetch('/api/customers');
            customersData = await res.json();
            renderCustomerTable();
            updateStats();
        } catch (e) { console.error(e); }
    }

    function renderCustomerTable() {
        const tbody = document.getElementById('customers-tbody');
        tbody.innerHTML = customersData.length ? '' : '<tr><td colspan="7" class="text-center py-4 text-gray-500">No customers</td></tr>';
        customersData.forEach(c => {
            const badge = c.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : (c.status === 'isolated' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300');
            tbody.innerHTML += `<tr class="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                <td class="py-2.5 px-2">${c.name}</td><td class="py-2.5 px-2">${c.plan}</td><td class="py-2.5 px-2 text-gray-400">${c.pppoe||'-'}</td>
                <td class="py-2.5 px-2"><span class="${badge} px-2 py-0.5 rounded text-[10px]">${c.status}</span></td>
                <td class="py-2.5 px-2 text-gray-400">${c.phone}</td><td class="py-2.5 px-2 text-right text-gray-400">${c.start_date||'-'}</td>
                <td class="py-2.5 px-2 text-center"><button onclick="editCustomer(${c.id})" class="text-indigo-400 text-xs mr-2">✏️</button><button onclick="deleteCustomer(${c.id})" class="text-red-400 text-xs">🗑️</button></td>
            </tr>`;
        });
    }

    function updateStats() {
        document.getElementById('cust-total').textContent = customersData.length;
        document.getElementById('cust-active').textContent = customersData.filter(c => c.status === 'active').length;
        document.getElementById('cust-isolated').textContent = customersData.filter(c => c.status === 'isolated').length;
        document.getElementById('cust-pending').textContent = customersData.filter(c => c.status === 'pending').length;
    }

    window.showAddCustomerModal = function(customer = null) {
        const modal = document.getElementById('add-customer-modal');
        const form = document.getElementById('customer-form');
        form.reset();
        document.getElementById('customer-id').value = customer ? customer.id : '';
        if (customer) {
            document.getElementById('cust-fullname').value = customer.name;
            document.getElementById('cust-phone').value = customer.phone;
            document.getElementById('cust-plan').value = customer.plan;
            document.getElementById('cust-status').value = customer.status;
            document.getElementById('cust-pppoe').value = customer.pppoe || '';
            document.getElementById('cust-start-date').value = customer.start_date || '';
            document.getElementById('cust-address').value = customer.address || '';
            document.getElementById('cust-notes').value = customer.notes || '';
            document.getElementById('cust-email').value = customer.email || '';
            document.getElementById('cust-idnumber').value = customer.id_number || '';
        }
        modal.querySelector('h3').textContent = customer ? 'Edit Customer' : 'Add Customer';
        modal.classList.remove('hidden');
    };

    window.closeAddCustomerModal = () => document.getElementById('add-customer-modal').classList.add('hidden');

    window.editCustomer = (id) => {
        const c = customersData.find(c => c.id == id);
        if (c) showAddCustomerModal(c);
    };

    window.deleteCustomer = async (id) => {
        if (!confirm('Delete?')) return;
        await fetch(`/api/customers/${id}`, { method: 'DELETE' });
        loadCustomers();
        showNotification('Customer deleted', 'success');
    };

    window.saveCustomer = async function() {
        const id = document.getElementById('customer-id').value;
        const data = {
            name: document.getElementById('cust-fullname').value,
            phone: document.getElementById('cust-phone').value,
            plan: document.getElementById('cust-plan').value,
            status: document.getElementById('cust-status').value,
            pppoe: document.getElementById('cust-pppoe').value,
            pppoe_pass: document.getElementById('cust-pppoe-pass').value,
            start_date: document.getElementById('cust-start-date').value,
            address: document.getElementById('cust-address').value,
            notes: document.getElementById('cust-notes').value,
            email: document.getElementById('cust-email').value,
            id_number: document.getElementById('cust-idnumber').value
        };
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/customers/${id}` : '/api/customers';
        const res = await fetch(url, {
            method, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            loadCustomers();
            closeAddCustomerModal();
            showNotification('Customer saved', 'success');
        } else {
            const err = await res.json();
            showNotification(err.message || 'Error', 'error');
        }
    };

    window.exportCustomersCSV = () => {
        if (!customersData.length) { showNotification('No data', 'error'); return; }
        let csv = 'Name,Phone,Plan,Status,PPPoE,Start Date\n';
        customersData.forEach(c => csv += `"${c.name}","${c.phone}","${c.plan}","${c.status}","${c.pppoe||''}","${c.start_date||''}"\n`);
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'customers.csv';
        a.click();
    };

    document.addEventListener('DOMContentLoaded', loadCustomers);
</script>
@endpush
@extends('layouts.app')

@section('title', 'Billing Engine')
@section('page-title', 'Billing Engine')

@section('content')
<div>
    <div class="grid grid-cols-3 gap-4 mb-6">
        <x-stat-card title="Auto Invoice" value="2,847" trend="Invoices this month" icon="zap" iconBg="indigo" iconColor="indigo" />
        <div class="card-hover bg-[#0f1629] rounded-xl border border-gray-800 p-5">
            <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center"><i data-lucide="credit-card" class="w-5 h-5 text-emerald-400"></i></div>
                <div><p class="text-sm font-semibold">Payment Gateway</p><p class="text-[10px] text-gray-500">Midtrans & Xendit active</p></div>
            </div>
            <div class="flex gap-2 mt-2">
                <span class="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Midtrans ✓</span>
                <span class="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Xendit ✓</span>
            </div>
        </div>
        <x-stat-card title="Prorate Engine" value="Auto" trend="Late fee: 5% after 7 days" icon="percent" iconBg="amber" iconColor="amber" />
    </div>

    <x-table header="Recent Invoices" :actions="'<button class=\'text-[10px] bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-500/30 transition\'>Generate All</button><button class=\'text-[10px] bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-600 transition\'>Export PDF</button>'">
        <x-slot name="thead">
            <th class="text-left py-2 font-medium">Invoice</th>
            <th class="text-left py-2 font-medium">Customer</th>
            <th class="text-left py-2 font-medium">Plan</th>
            <th class="text-right py-2 font-medium">Amount</th>
            <th class="text-right py-2 font-medium">Status</th>
        </x-slot>
        <x-slot name="tbody">
            <tr class="border-b border-gray-800/50"><td class="py-2.5">#INV-2024-001</td><td>Ahmad Rizki</td><td>50 Mbps</td><td class="text-right">Rp 350,000</td><td class="text-right"><span class="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Paid</span></td></tr>
            <tr class="border-b border-gray-800/50"><td class="py-2.5">#INV-2024-002</td><td>Siti Nurhaliza</td><td>100 Mbps</td><td class="text-right">Rp 550,000</td><td class="text-right"><span class="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Pending</span></td></tr>
            <tr class="border-b border-gray-800/50"><td class="py-2.5">#INV-2024-003</td><td>Budi Santoso</td><td>30 Mbps</td><td class="text-right">Rp 250,000</td><td class="text-right"><span class="bg-red-500/20 text-red-300 px-2 py-0.5 rounded">Overdue</span></td></tr>
            <tr class="border-b border-gray-800/50"><td class="py-2.5">#INV-2024-004</td><td>Dewi Anggraini</td><td>50 Mbps</td><td class="text-right">Rp 350,000</td><td class="text-right"><span class="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Paid</span></td></tr>
        </x-slot>
    </x-table>
</div>
@endsection
@extends('layouts.app')

@section('title', 'Dashboard')
@section('page-title', 'Dashboard')

@section('content')
<div>
    {{-- Stats --}}
    <div class="grid grid-cols-4 gap-4 mb-6">
        <x-stat-card title="Monthly Revenue" value="Rp 847.2M" trend="↑ 12.5% vs last month" trendColor="text-emerald-400" icon="trending-up" iconBg="indigo" iconColor="indigo" />
        <x-stat-card title="Active Customers" value="2,847" trend="↑ 48 new this week" trendColor="text-emerald-400" icon="users" iconBg="cyan" iconColor="cyan" />
        <x-stat-card title="Unpaid Invoices" value="156" trend="Rp 89.3M pending" trendColor="text-amber-400" icon="alert-circle" iconBg="amber" iconColor="amber" />
        <x-stat-card title="Isolated Users" value="34" trend="Auto-isolir active" trendColor="text-red-400" icon="shield-off" iconBg="red" iconColor="red" />
    </div>

    {{-- Revenue Chart & Churn --}}
    <div class="grid grid-cols-3 gap-4 mb-6">
        <!-- Revenue Chart -->
        <div class="col-span-2 bg-[#0f1629] rounded-xl border border-gray-800 p-5">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-sm font-semibold">Revenue Trend (6 Months)</h3>
                <div class="flex gap-2">
                    <span class="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">Revenue</span>
                    <span class="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">Collected</span>
                </div>
            </div>
            <div class="flex items-end gap-3 h-40">
                @foreach(['Jul' => [60,50], 'Aug' => [65,58], 'Sep' => [70,62], 'Oct' => [75,70], 'Nov' => [85,78], 'Dec' => [95,85]] as $month => $heights)
                    <div class="flex-1 flex flex-col items-center gap-1">
                        <div class="w-full flex gap-1 items-end justify-center h-32">
                            <div class="chart-bar w-5 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t" style="height:{{ $heights[0] }}%"></div>
                            <div class="chart-bar w-5 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t" style="height:{{ $heights[1] }}%"></div>
                        </div>
                        <span class="text-[10px] text-gray-500">{{ $month }}</span>
                    </div>
                @endforeach
            </div>
        </div>
        <!-- Churn Analysis -->
        <div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5">
            <h3 class="text-sm font-semibold mb-4">Churn Analysis</h3>
            <div class="space-y-3">
                <x-churn-bar label="Retention Rate" value="94.2%" color="emerald" width="94" />
                <x-churn-bar label="Churn Rate" value="5.8%" color="red" width="5.8" />
                <x-churn-bar label="Payment Success" value="87.3%" color="indigo" width="87" />
                <x-churn-bar label="SLA Compliance" value="99.1%" color="cyan" width="99" />
            </div>
            <div class="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <p class="text-[10px] text-red-300">⚠ 12 customers at risk of churning (overdue >30 days)</p>
            </div>
        </div>
    </div>

    {{-- MikroTik & Bandwidth --}}
    <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-sm font-semibold">MikroTik Routers</h3><span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">Realtime</span>
            </div>
            <div class="space-y-2">
                <x-router-status name="RB4011 - Main Gateway" cpu="23" ram="45" status="online" />
                <x-router-status name="CCR1036 - Core" cpu="18" ram="62" status="online" />
                <x-router-status name="hEX S - Branch A" cpu="78" ram="81" status="warning" />
                <x-router-status name="RB750Gr3 - Branch B" cpu="12" ram="34" status="online" />
                <x-router-status name="RB951 - Remote Site" cpu="0" ram="0" status="offline" offline="OFFLINE - Last seen 2m ago" />
            </div>
        </div>
        <div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5">
            <h3 class="text-sm font-semibold mb-4">Bandwidth Usage (Live)</h3>
            <x-bandwidth-bar label="Upload" value="2.4" max="5" id="upload" color="cyan" />
            <x-bandwidth-bar label="Download" value="4.1" max="5" id="download" color="indigo" />
            <div class="mt-4 grid grid-cols-3 gap-2 text-center">
                <div class="bg-gray-800/50 rounded-lg p-2"><p class="text-lg font-bold text-white" id="active-sessions">2,103</p><p class="text-[10px] text-gray-500">Active Sessions</p></div>
                <div class="bg-gray-800/50 rounded-lg p-2"><p class="text-lg font-bold text-white" id="uptime-stat">99.7%</p><p class="text-[10px] text-gray-500">Uptime</p></div>
                <div class="bg-gray-800/50 rounded-lg p-2"><p class="text-lg font-bold text-white" id="latency-stat">3ms</p><p class="text-[10px] text-gray-500">Avg Latency</p></div>
            </div>
        </div>
    </div>

    {{-- Recent Activity --}}
    <div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5">
        <h3 class="text-sm font-semibold mb-4">Recent Activity</h3>
        <div class="grid grid-cols-2 gap-3">
            <x-activity icon="check-circle" color="emerald" text="Payment received - Ahmad Rizki" detail="Rp 350,000 via Midtrans • 2m ago" />
            <x-activity icon="shield-off" color="red" text="Auto-isolir triggered - Budi Santoso" detail="Overdue 7 days • 5m ago" />
            <x-activity icon="user-plus" color="indigo" text="New customer registered" detail="Siti Nurhaliza - Plan 50Mbps • 8m ago" />
            <x-activity icon="unlock" color="cyan" text="Auto-unisolir - Dewi Anggraini" detail="Payment confirmed via Xendit • 12m ago" />
        </div>
    </div>
</div>
@endsection
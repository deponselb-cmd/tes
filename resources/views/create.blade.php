@extends('layouts.app')

@section('title', 'Admin Control Panel')
@section('page-title', 'Control Panel')

@section('content')
<div class="space-y-6">
    <!-- System Information -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5 col-span-2">
            <h3 class="text-sm font-semibold mb-4">Server Information</h3>
            <div class="grid grid-cols-2 gap-3 text-xs">
                @foreach($systemInfo as $label => $value)
                    <div class="flex justify-between border-b border-gray-800 py-1.5">
                        <span class="text-gray-400">{{ $label }}</span>
                        <span class="text-white font-medium">{{ $value }}</span>
                    </div>
                @endforeach
            </div>
        </div>
        <div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5">
            <h3 class="text-sm font-semibold mb-4">Resource Usage</h3>
            <div class="space-y-3 text-xs">
                <div>
                    <p class="text-gray-400 mb-1">Memory Usage</p>
                    <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-2 bg-indigo-500 rounded-full" style="width: {{ min(100, (memory_get_usage(true) / (10 * 1024 * 1024)) * 100) }}%"></div>
                    </div>
                    <p class="text-right text-gray-400 mt-0.5">{{ $memoryUsage }}</p>
                </div>
                <div>
                    <p class="text-gray-400 mb-1">Disk Free Space</p>
                    <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-2 bg-emerald-500 rounded-full" style="width: 80%"></div>
                    </div>
                    <p class="text-right text-gray-400 mt-0.5">{{ $diskFree }}</p>
                </div>
                <div class="pt-2">
                    <p class="text-gray-400">Pending Queue Jobs: <span class="text-white font-bold">{{ $queueCount }}</span></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Cache Management & Actions -->
    <div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5">
        <h3 class="text-sm font-semibold mb-4">Cache & Maintenance</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button onclick="performAction('clear-cache')" class="admin-action-btn p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 text-left transition group">
                <i data-lucide="x-circle" class="w-4 h-4 text-amber-400 mb-2 group-hover:scale-110 transition-transform"></i>
                <p class="text-xs font-medium">Clear Application Cache</p>
                <p class="text-[10px] text-gray-500 mt-1">cache:clear</p>
            </button>
            <button onclick="performAction('clear-route')" class="admin-action-btn p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 text-left transition group">
                <i data-lucide="route" class="w-4 h-4 text-indigo-400 mb-2 group-hover:scale-110 transition-transform"></i>
                <p class="text-xs font-medium">Clear Route Cache</p>
                <p class="text-[10px] text-gray-500 mt-1">route:clear</p>
            </button>
            <button onclick="performAction('clear-config')" class="admin-action-btn p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 text-left transition group">
                <i data-lucide="sliders" class="w-4 h-4 text-blue-400 mb-2 group-hover:scale-110 transition-transform"></i>
                <p class="text-xs font-medium">Clear Config Cache</p>
                <p class="text-[10px] text-gray-500 mt-1">config:clear</p>
            </button>
            <button onclick="performAction('clear-view')" class="admin-action-btn p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 text-left transition group">
                <i data-lucide="eye-off" class="w-4 h-4 text-purple-400 mb-2 group-hover:scale-110 transition-transform"></i>
                <p class="text-xs font-medium">Clear View Cache</p>
                <p class="text-[10px] text-gray-500 mt-1">view:clear</p>
            </button>
            <button onclick="performAction('clear-compiled')" class="admin-action-btn p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 text-left transition group">
                <i data-lucide="codepen" class="w-4 h-4 text-cyan-400 mb-2 group-hover:scale-110 transition-transform"></i>
                <p class="text-xs font-medium">Clear Compiled Classes</p>
                <p class="text-[10px] text-gray-500 mt-1">clear-compiled</p>
            </button>
            <button onclick="performAction('restart-queue')" class="admin-action-btn p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 text-left transition group">
                <i data-lucide="refresh-cw" class="w-4 h-4 text-emerald-400 mb-2 group-hover:scale-110 transition-transform"></i>
                <p class="text-xs font-medium">Restart Queue Worker</p>
                <p class="text-[10px] text-gray-500 mt-1">queue:restart</p>
            </button>
        </div>
    </div>

    <!-- Logs Preview (Optional) -->
    <div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-sm font-semibold">Recent Log Entries</h3>
            <button onclick="loadLogs()" class="text-[10px] bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg transition">
                <i data-lucide="refresh-cw" class="w-3 h-3 inline mr-1"></i> Refresh
            </button>
        </div>
        <div id="log-container" class="bg-gray-900 rounded-lg p-3 text-xs text-gray-300 max-h-48 overflow-y-auto font-mono">
            Loading logs...
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    function performAction(action) {
        if (!confirm('Apakah Anda yakin ingin menjalankan aksi ini?')) return;

        fetch('{{ route('control-panel.action') }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: JSON.stringify({ action: action })
        })
        .then(response => response.json())
        .then(data => {
            showNotification(data.message, 'success');
        })
        .catch(error => {
            showNotification('Terjadi kesalahan: ' + error.message, 'error');
        });
    }

    async function loadLogs() {
        try {
            const res = await fetch('{{ route('control-panel.index') }}', { headers: { 'Accept': 'application/json' } });
            // Untuk demo, kita ambil data log dari endpoint khusus. Atau gunakan langsung:
            // Kita bisa buat endpoint API /admin/logs untuk mengembalikan teks.
            // Sementara kita set teks statis.
            document.getElementById('log-container').innerText = 'Log terakhir:\n' + '{{ Storage::disk("local")->exists("laravel.log") ? "Silakan buat fungsi tail log." : "Log file tidak tersedia." }}';
        } catch (e) {
            document.getElementById('log-container').innerText = 'Gagal memuat log.';
        }
    }

    // Panggil saat halaman dimuat
    document.addEventListener('DOMContentLoaded', () => {
        loadLogs();
    });
</script>
@endpush
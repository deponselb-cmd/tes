<div class="flex items-center justify-between p-2.5 bg-gray-800/50 rounded-lg">
  <div class="flex items-center gap-2">
    <span class="w-2 h-2 rounded-full status-{{ $status }}"></span>
    <span class="text-xs">{{ $name }}</span>
  </div>
  <div class="text-[10px] {{ $status === 'online' ? 'text-gray-400' : ($status === 'warning' ? 'text-amber-400' : 'text-red-400') }}">
    {{ $status === 'offline' ? ($offline ?? 'OFFLINE') : 'CPU: ' . $cpu . '% | RAM: ' . $ram . '%' }}
  </div>
</div>
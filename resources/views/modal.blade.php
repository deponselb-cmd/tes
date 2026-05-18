<div class="mb-3">
  <div class="flex justify-between text-xs mb-1">
    <span>{{ $label }}</span>
    <span class="text-{{ $color }}-400">{{ $value }} Gbps / {{ $max }} Gbps</span>
  </div>
  <div class="h-3 bg-gray-800 rounded-full overflow-hidden">
    <div class="h-3 bg-gradient-to-r from-{{ $color }}-600 to-{{ $color }}-400 rounded-full transition-all" style="width: {{ ($value / $max) * 100 }}%"></div>
  </div>
</div>
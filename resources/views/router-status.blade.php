<div>
  <div class="flex justify-between text-xs mb-1">
    <span class="text-gray-400">{{ $label }}</span>
    <span class="text-{{ $color }}-400">{{ $value }}</span>
  </div>
  <div class="h-2 bg-gray-800 rounded-full">
    <div class="h-2 bg-{{ $color }}-500 rounded-full" style="width: {{ $width }}%"></div>
  </div>
</div>
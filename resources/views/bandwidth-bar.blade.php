<div class="flex items-center gap-3 p-2 rounded-lg bg-{{ $color }}-500/5 border border-{{ $color }}-500/20">
  <div class="w-8 h-8 rounded-full bg-{{ $color }}-500/20 flex items-center justify-center">
    <i data-lucide="{{ $icon }}" class="w-4 h-4 text-{{ $color }}-400"></i>
  </div>
  <div>
    <p class="text-xs">{{ $text }}</p>
    <p class="text-[10px] text-gray-500">{{ $detail }}</p>
  </div>
</div>
@props(['title', 'value', 'trend' => null, 'trendColor' => 'text-gray-400', 'icon', 'iconBg', 'iconColor'])

<div class="card-hover gradient-border">
    <div class="p-4">
        <div class="flex justify-between items-start">
            <div>
                <p class="text-[10px] uppercase tracking-wider text-gray-500">{{ $title }}</p>
                <p class="text-2xl font-bold mt-1 text-white">{{ $value }}</p>
                @if($trend)
                    <p class="text-xs {{ $trendColor }} mt-1">{{ $trend }}</p>
                @endif
            </div>
            <div class="w-10 h-10 rounded-lg bg-{{ $iconBg }}-500/20 flex items-center justify-center">
                <i data-lucide="{{ $icon }}" class="w-5 h-5 text-{{ $iconColor }}-400"></i>
            </div>
        </div>
    </div>
</div>
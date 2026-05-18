@props(['header' => null, 'actions' => null, 'footer' => null])

<div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5">
    @if($header)
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-sm font-semibold">{{ $header }}</h3>
            @if($actions)
                <div class="flex gap-2">{!! $actions !!}</div>
            @endif
        </div>
    @endif
    <div class="overflow-x-auto">
        <table class="w-full text-xs">
            <thead>
                <tr class="text-gray-500 border-b border-gray-800">{{ $thead }}</tr>
            </thead>
            <tbody>{{ $tbody }}</tbody>
        </table>
    </div>
    @if($footer)
        {{ $footer }}
    @endif
</div>
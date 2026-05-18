@props(['type' => 'info', 'message'])

<div class="p-4 mb-4 rounded-lg text-sm
    @if($type === 'success') bg-emerald-500/20 text-emerald-300 border border-emerald-500/40
    @elseif($type === 'error') bg-red-500/20 text-red-300 border border-red-500/40
    @else bg-indigo-500/20 text-indigo-300 border border-indigo-500/40
    @endif">
    {{ $message }}
</div>
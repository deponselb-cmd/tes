@props(['id', 'title', 'maxWidth' => 'md'])

<div id="{{ $id }}" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-[#0f1629] rounded-xl border border-gray-800 p-6 w-full max-w-{{ $maxWidth }} max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-bold mb-4">{{ $title }}</h3>
        {{ $slot }}
    </div>
</div>
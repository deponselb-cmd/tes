@extends('layouts.app')
@section('title', 'Edit Inventory Item')
@section('page-title', 'Inventory - Edit Item')
@section('content')
<div class="bg-[#0f1629] rounded-xl border border-gray-800 p-6 max-w-2xl">
    <h3 class="text-lg font-bold mb-6">Edit Item</h3>
    <form method="POST" action="{{ route('inventory.update', $item->id) }}">
        @csrf @method('PUT')
        <!-- field yang sama dengan create, tetapi value diisi dari $item -->
        <div class="grid grid-cols-2 gap-4 mb-5">
            <div><label class="text-xs text-gray-400 block mb-1">Item Name *</label><input type="text" name="item_name" value="{{ $item->item_name }}" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white" required></div>
            <div><label class="text-xs text-gray-400 block mb-1">SKU *</label><input type="text" name="sku" value="{{ $item->sku }}" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white" required></div>
            <div><label class="text-xs text-gray-400 block mb-1">Category</label><select name="category" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"><option {{ $item->category == 'Hardware' ? 'selected' : '' }}>Hardware</option><option {{ $item->category == 'Cable' ? 'selected' : '' }}>Cable</option>...</select></div>
            <div><label class="text-xs text-gray-400 block mb-1">Quantity</label><input type="number" name="quantity" value="{{ $item->quantity }}" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white" min="0" required></div>
            <div><label class="text-xs text-gray-400 block mb-1">Unit Price (Rp)</label><input type="number" name="unit_price" value="{{ $item->unit_price }}" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white" step="1000" required></div>
            <div><label class="text-xs text-gray-400 block mb-1">Reorder Level</label><input type="number" name="reorder_level" value="{{ $item->reorder_level }}" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white" min="0"></div>
        </div>
        <div class="flex gap-3">
            <button type="submit" class="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">Update Item</button>
            <a href="{{ route('inventory.index') }}" class="px-6 py-2 bg-gray-700 text-white rounded-lg text-sm">Cancel</a>
        </div>
    </form>
</div>
@endsection
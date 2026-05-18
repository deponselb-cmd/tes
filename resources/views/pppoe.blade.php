@extends('layouts.app')
@section('title', 'Add Inventory Item')
@section('page-title', 'Inventory - Add Item')
@section('content')
<div class="bg-[#0f1629] rounded-xl border border-gray-800 p-6 max-w-2xl">
    <h3 class="text-lg font-bold mb-6">Add New Item</h3>
    <form method="POST" action="{{ route('inventory.store') }}">
        @csrf
        <div class="grid grid-cols-2 gap-4 mb-5">
            <div><label class="text-xs text-gray-400 block mb-1">Item Name *</label><input type="text" name="item_name" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white" required></div>
            <div><label class="text-xs text-gray-400 block mb-1">SKU *</label><input type="text" name="sku" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white" required></div>
            <div><label class="text-xs text-gray-400 block mb-1">Category</label><select name="category" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"><option>Hardware</option><option>Cable</option><option>Accessories</option><option>Services</option></select></div>
            <div><label class="text-xs text-gray-400 block mb-1">Quantity</label><input type="number" name="quantity" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white" min="0" required></div>
            <div><label class="text-xs text-gray-400 block mb-1">Unit Price (Rp)</label><input type="number" name="unit_price" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white" step="1000" required></div>
            <div><label class="text-xs text-gray-400 block mb-1">Reorder Level</label><input type="number" name="reorder_level" value="10" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white" min="0"></div>
        </div>
        <div class="flex gap-3">
            <button type="submit" class="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">Save Item</button>
            <a href="{{ route('inventory.index') }}" class="px-6 py-2 bg-gray-700 text-white rounded-lg text-sm">Cancel</a>
        </div>
    </form>
</div>
@endsection
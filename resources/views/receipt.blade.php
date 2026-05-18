@extends('layouts.app')
@section('title', 'Stock Report')
@section('page-title', 'Inventory - Stock Report')
@section('content')
<x-table header="Stock Overview" :actions="'<button onclick=\'window.print()\' class=\'text-[10px] bg-gray-700 px-3 py-1.5 rounded-lg\'>🖨 Print</button>'">
    <x-slot name="thead">
        <th class="text-left py-2 px-2">Item</th>
        <th class="text-right py-2 px-2">Current Stock</th>
        <th class="text-right py-2 px-2">Reorder Level</th>
        <th class="text-right py-2 px-2">Unit Price</th>
        <th class="text-right py-2 px-2">Total Value</th>
    </x-slot>
    <x-slot name="tbody">
        @foreach(\App\Models\InventoryItem::all() as $item)
        <tr class="border-b border-gray-800/50">
            <td class="py-2.5 px-2">{{ $item->item_name }}</td>
            <td class="py-2.5 px-2 text-right">{{ $item->quantity }}</td>
            <td class="py-2.5 px-2 text-right">{{ $item->reorder_level }}</td>
            <td class="py-2.5 px-2 text-right">Rp {{ number_format($item->unit_price,0,',','.') }}</td>
            <td class="py-2.5 px-2 text-right">Rp {{ number_format($item->quantity * $item->unit_price,0,',','.') }}</td>
        </tr>
        @endforeach
    </x-slot>
</x-table>
@endsection
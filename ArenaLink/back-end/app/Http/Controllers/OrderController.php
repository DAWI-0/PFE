<?php

namespace App\Http\Controllers;

use App\Models\order;
use App\Models\produit;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(order::all());
    }

    public function show($id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        return response()->json($order);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required',
            'total_amount' => 'required',
            'product_ids' => 'required|array',
            'product_ids.*' => 'required|exists:produits,id',
        ]);
        $order = Order::create($validatedData);
        return response()->json($order, 201);
    }


    public function getOrdersByUserId($userId)
    {
        $orders = Order::where('user_id', $userId)->orderBy('created_at', 'desc')->get();
        $orders->map(function ($order) {
            $productIds = is_array($order->product_ids) ? \Illuminate\Support\Arr::flatten($order->product_ids) : [];
            $order->products = !empty($productIds) ? produit::whereIn('id', $productIds)->get() : [];
            return $order;
        });
        return response()->json($orders);
    }

    public function getOrdersByStatus()
    {
        $orders = order::where('status', "pending")->orderBy('created_at', 'desc')->get();
        $orders->map(function ($order) {
            $productIds = is_array($order->product_ids) ? \Illuminate\Support\Arr::flatten($order->product_ids) : [];
            $order->products = !empty($productIds) ? produit::whereIn('id', $productIds)->get() : [];
            return $order;
        });
        return response()->json($orders);
    }

    public function Confirmer($id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        $order->status = 'confirmed';
        $order->save();

        return response()->json($order);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProduitController extends Controller
{
    public function index()
    {
        return response()->json(['products' => produit::all()], 200);
    }

    public function show($id)
    {
        $product = produit::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        return response()->json(['product' => $product], 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'stock' => 'required|integer|min:0',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('produits', 'public');
            $validatedData['image_url'] = $imagePath;
        }

        $product = produit::create($validatedData);
        return response()->json(['product' => $product], 200);
    }

    public function update(Request $request, $id)
    {
        $product = produit::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'description' => 'nullable|string',
            'category' => 'sometimes|required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'stock' => 'sometimes|required|integer|min:0',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image_url) {
            Storage::disk('public')->delete($product->image_url);
            }
            $imagePath = $request->file('image')->store('produits', 'public');
            $validatedData['image_url'] = $imagePath;
        }

        $product->update($validatedData);
        return response()->json(['product' => $product], 200);
    }

    public function destroy($id)
    {
        $product = produit::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully'], 200);
    }
}

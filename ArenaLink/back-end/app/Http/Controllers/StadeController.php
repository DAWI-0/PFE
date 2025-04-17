<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stade;
use Illuminate\Support\Facades\Storage;

class StadeController extends Controller
{
    public function index()
    {
        $stades = Stade::all();
        return response()->json($stades);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'sport_type' => 'required|string|max:255',
            'capacity' => 'required|integer',
            'price_per_hour' => 'required|integer',
            'user_id' => 'required|exists:users,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('stades', 'public');
            $validatedData['image'] = $imagePath;
        }
        $stade = Stade::create($validatedData);
        return response()->json($stade, 201);
    }

    public function show($id)
    {
        $stade = Stade::findOrFail($id);
        return response()->json($stade);
    }

    public function update(Request $request, $id)
    {
        $stade = Stade::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'address' => 'sometimes|required|string|max:255',
            'capacity' => 'sometimes|required|integer',
            'price_per_hour' => 'sometimes|required|integer',
            'sport_type' => 'sometimes|required|string|max:255',
            'user_id' => 'sometimes|required|exists:users,id',
            'image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($stade->image) {
                Storage::disk('public')->delete($stade->image);
            }
            $imagePath = $request->file('image')->store('stades', 'public');
            $validatedData['image'] = $imagePath;
        }

        $stade->update($validatedData);
        return response()->json($stade);
    }

    public function destroy($id)
    {
        $stade = Stade::findOrFail($id);
        $stade->delete();
        return response()->json(['message' => 'Stade deleted successfully']);
    }
}

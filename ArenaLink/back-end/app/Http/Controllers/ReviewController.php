<?php

namespace App\Http\Controllers;

use App\Models\review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::all();
        $reviews->map(function ($review) {
            $review->user;
        });
        return response()->json($reviews);
    }

    public function show($id)
    {
        $reviews = Review::where('stade_id', $id)->get();

        if (!$reviews) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        $reviews->map(function ($review) {
            $review->user;
        });
        return response()->json($reviews);

    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required',
            'stade_id' => 'required',
            'rating' => 'required',
            'comment' => 'nullable',
        ]);

        $review = Review::create($validatedData);

        return response()->json(['review' => $review], 201);
    }

    public function update(Request $request, $id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        $validatedData = $request->validate([
            'user_id' => 'sometimes|required',
            'stade_id' => 'sometimes|required',
            'rating' => 'sometimes|required',
            'comment' => 'sometimes|required',
        ]);

        $review->update($validatedData);

        return response()->json(['review' => $review]);
    }

    public function destroy($id)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }
        $review->delete();
        return response()->json(['message' => 'Review deleted successfully']);
    }
}

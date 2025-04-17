<?php

namespace App\Http\Controllers;

use App\Models\reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'stade_id' => 'required|integer|exists:stades,id',
            'start_time' => 'required|date_format:Y-m-d\TH:i:s',
            'duration' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'status' => 'required|in:pending,confirmed,cancelled',
        ]);
        $validatedData['start_time'] = \Carbon\Carbon::createFromFormat('Y-m-d\TH:i:s', $validatedData['start_time'])->format('Y-m-d H:i:s');
        $reservation = reservation::create($validatedData);

        return response()->json(['reservation' => $reservation], 201);
    }
}

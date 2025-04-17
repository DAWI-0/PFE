<?php

namespace App\Http\Controllers;

use App\Models\reservation;
use App\Models\stade;
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

    public function index()
    {
        $reservations = reservation::all();
        foreach ($reservations as $reservation) {
            $reservation->user;
            $reservation->stade;
        }
        return response()->json($reservations);
    }
    public function show($id)
    {
        $stade=stade::where("user_id", $id)->first();
        if (!$stade) {
            return response()->json(['message' => 'Stade not found'], 404);
        }
        $reservations = reservation::where('stade_id', $stade->id)->get();
        foreach ($reservations as $reservation) {
            $reservation->user;
        }
        return response()->json($reservations);
    }

    public function showByStadeId($id)
    {
        $stade = stade::find($id);
        if (!$stade) {
            return response()->json(['message' => 'Stade not found'], 404);
        }
        $reservations = reservation::where('stade_id', $stade->id)->get();
        foreach ($reservations as $reservation) {
            $reservation->user;
        }
        return response()->json($reservations);
    }

    public function annuler($id)
    {
        $reservation = reservation::where('id', $id)->first();
        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }
        $reservation->status = 'cancelled';
        $reservation->save();

        return response()->json(['message' => 'Reservation cancelled successfully']);
    }
    public function confirmer($id)
    {
        $reservation = reservation::where('id', $id)->where('status', 'pending')->first();
        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }
        $reservation->status = 'confirmed';
        $reservation->save();

        return response()->json(['message' => 'Reservation confirmed successfully']);
    }

    public function ShowByUserId($id)
    {
        $reservations = reservation::where('user_id', $id)->get();
        foreach ($reservations as $reservation) {
            $reservation->stade;
        }
        return response()->json($reservations);
    }

}

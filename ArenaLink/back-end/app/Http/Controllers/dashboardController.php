<?php

namespace App\Http\Controllers;
use App\Models\order;
use App\Models\produit;
use App\Models\reservation;
use App\Models\stade;
use App\Models\User;

class dashboardController extends Controller
{
    public function Users()
    {
        $data = User::all();
        return response()->json($data->map(function($data){
            return [
                'id' => $data->id,
                'name' => $data->name,
                'email' => $data->email,
                'role' => $data->role
            ];
        }));
    }

    public function Produits()
    {
        $data = produit::all();
        return response()->json($data->map(function($data){
            return [
                'id' => $data->id,
                'nom' => $data->name,  // Changed from $data->name to $data->nom
                'prix' => $data->price,
                'stock' => $data->stock
            ];
        }));
    }

    public function Stades()
    {
        $data = stade::all();
        return response()->json($data->map(function($data){
            return [
                'id' => $data->id,
                'nom' => $data->name   // Changed from $data->name to $data->nom
            ];
        }));
    }

    public function Reservations()
    {
        $data = reservation::all();
        return response()->json($data->map(function($data){
            return [
                'id' => $data->id,
                'user_id' => $data->user_id,
                'stade_id' => $data->stade_id,
                'created_at' => $data->created_at
            ];
        }));
    }

    public function Orders()
    {
        $data = order::all();
        return response()->json($data->map(function($data){
            return [
                'id' => $data->id,
                'user_id' => $data->user_id,
                'total_price' => $data->total_amount,
                'status' => $data->status,
                'created_at' => $data->created_at
            ];
        }));
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\produit;
use App\Models\stade;
use App\Models\User;
use Illuminate\Http\Request;

class dashboardController extends Controller
{
    public function Users(){
        $data=User::all();
        return response()->json($data);
    }
    public function Produits(){
        $data=produit::all();
        return response()->json($data);
    }
    public function Stades(){
        $data=stade::all();
        return response()->json($data);
    }
    public function Reservations(){
        $data=stade::all();
        return response()->json($data);
    }

    public function Orders(){
        $data=stade::all();
        return response()->json($data->map(function($data){
            return [
                'id'=>$data->id,
                'user_id'=>$data->user_id,
                'total_price'=>$data->total_amount,
                'status'=>$data->status,
                'created_at'=>$data->created_at
            ];
        }));
    }

}

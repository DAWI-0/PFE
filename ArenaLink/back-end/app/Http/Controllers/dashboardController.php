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
}

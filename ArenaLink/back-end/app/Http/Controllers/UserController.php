<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class   UserController extends Controller
{
    //
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        $user = user::where("email", "=", $credentials['email'])->first();

        if (Auth::attempt($credentials)) {
            $token = $user->createToken('authToken')->plainTextToken;
            $user = Auth::user();
            return response()->json(['token' => $token], 200);
        }

        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),

        ]);

        $token = $user->createToken('authToken')->plainTextToken;
        return response()->json(['token' => $token], 201);
    }
    public function modifier(Request $request,$id){
       
        $data=$request->validate([

            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',

        ]);
        $data=User::find($id);
        $data->name=$request->name;
        $data->email=$request->email;
        $data->password=$request->password;
        $data->password_confirmation=$request->password_confirmation;
        $data->phone=$request->phone;
        $data->bio=$request->bio;
        $data->country=$request->country;
        $data->city_state=$request->city_state;
        $data->postal_code=$request->postal_code;
        $data->facebook=$request->facebook;
        $data->instagram=$request->instagram;
        $data->linkedin=$request->linkedin;
        $data->twitter=$request->twitter;
        $data->profile_image=$request->profile_image;

        $data->save();
        return response()->json($data);

     
    }




}

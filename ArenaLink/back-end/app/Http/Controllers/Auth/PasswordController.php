<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class PasswordController extends Controller
{
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:6',
            'confirm_password' => 'required|same:new_password',
        ]);
    
        $user = User::find($request->idUser);
    
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
                'status' => 'error'
            ], 401);
        }
    
        try {
            $user->password = Hash::make($request->new_password);
            $user->save();
    
            return response()->json([
                'message' => 'Password updated successfully',
                'status' => 'success'
            ], 200);
    
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An unexpected error occurred while updating the password.',
                'status' => 'error'
            ], 500);
        }
    }
}
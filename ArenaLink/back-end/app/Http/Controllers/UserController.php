<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

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
    public function modifier(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string',
            'country' => 'nullable|string|max:100',
            'city_state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'facebook' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
            'linkedin' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'profile_image' => 'nullable|file|mimes:png,jpg,jpeg|max:2048',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'];
        $user->bio = $validated['bio'];
        $user->country = $validated['country'];
        $user->city_state = $validated['city_state'];
        $user->postal_code = $validated['postal_code'];
        $user->facebook = $validated['facebook'];
        $user->instagram = $validated['instagram'];
        $user->linkedin = $validated['linkedin'];
        $user->twitter = $validated['twitter'];

        if ($request->hasFile('profile_image')) {
            $profileImage = $request->file('profile_image');
            if ($profileImage && $profileImage->isValid()) {
            if ($user->profile_image && Storage::disk('public')->exists($user->profile_image)) {
                Storage::disk('public')->delete($user->profile_image);
            }
            $path = $profileImage->store('profile_images', 'public');
            $user->profile_image = $path;
            }
        }

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json($user, 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Successfully logged out'], 200);
    }




}

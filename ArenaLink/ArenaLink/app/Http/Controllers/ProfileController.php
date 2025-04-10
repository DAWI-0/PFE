<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        
        // Get all validated data
        $validatedData = $request->validated();
        
        // Remove profile_image from validated data as we'll handle it separately
        if (isset($validatedData['profile_image'])) {
            unset($validatedData['profile_image']);
        }
        
        // Update user with the remaining validated data
        $user->fill($validatedData);
        
        // Handle email verification if the email is updated
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }
        
        // Save user data first
        $user->save();
        
        // Handle profile image upload separately
        if ($request->hasFile('profile_image') && $request->file('profile_image')->isValid()) {
            // Delete old image if exists
            if ($user->profile_image && Storage::disk('public')->exists($user->profile_image)) {
                Storage::disk('public')->delete($user->profile_image);
            }
            
            // Store new image
            $path = $request->file('profile_image')->store('profile_images', 'public');
            
            // Update user with new image path
            $user->profile_image = $path;
            $user->save();
        }
        
        return Redirect::route('profile.edit')->with('success', 'Profil mis à jour avec succès!');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        // Delete user profile image if exists
        if ($user->profile_image && Storage::disk('public')->exists($user->profile_image)) {
            Storage::disk('public')->delete($user->profile_image);
        }

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
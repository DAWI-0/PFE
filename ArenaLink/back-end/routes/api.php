<?php

use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();


});



Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/password/reset', [PasswordResetLinkController::class, 'store']);
Route::post('/resetPassword', [NewPasswordController::class, 'store'])->name('password.update');
Route::middleware('auth:sanctum')->post('/modifier/{id}', [UserController::class, 'modifier']);

Route::middleware('auth:sanctum')->post('/logout', [UserController::class, 'logout']);

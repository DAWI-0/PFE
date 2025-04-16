<?php

use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProduitController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();


});



Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/password/reset', [PasswordResetLinkController::class, 'store']);
Route::post('/resetPassword', [NewPasswordController::class, 'store'])->name('password.update');
Route::middleware('auth:sanctum')->post('/modifier/{id}', [UserController::class, 'modifier']);
Route::middleware('auth:sanctum')->post('/changerole/{id}', [UserController::class, 'changerole']);
Route::get('/getAllUsers', [UserController::class, 'getAllUsers']);
Route::post('/Confirmer/{id}', [UserController::class, 'Confirmer']);

Route::middleware('auth:sanctum')->post('/logout', [UserController::class, 'logout']);


Route::get('/produits', [ProduitController::class, 'index']);
Route::get('/produits/{id}', [ProduitController::class, 'show']);
Route::post('/produits', [ProduitController::class, 'store']);
Route::put('/produits/{id}', [ProduitController::class, 'update']);
Route::delete('/produits/{id}', [ProduitController::class, 'destroy']);


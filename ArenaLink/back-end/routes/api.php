<?php

use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\StadeController;

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

Route::prefix("orders")->group(function () {
    Route::get("/", [OrderController::class, "index"]);
    Route::get("/{id}", [OrderController::class, "show"]);
    Route::post("/", [OrderController::class, "store"]);
    Route::get("/user/{id}", [OrderController::class, "getOrdersByUserId"]);
    Route::post("/confirmer/{id}", [OrderController::class, "Confirmer"]);
    Route::get("/status/pending", [OrderController::class, "getOrdersByStatus"]);
});

Route::prefix("stades")->group(function () {
    Route::get("/", [StadeController::class, "index"]);
    Route::get("/{id}", [StadeController::class, "show"]);
    Route::post("/", [StadeController::class, "store"]);
    Route::put("/{id}", [StadeController::class, "update"]);
    Route::delete("/{id}", [StadeController::class, "destroy"]);
});

Route::prefix("reviews")->group(function () {
    Route::get("/", [ReviewController::class, "index"]);
    Route::get("/{id}", [ReviewController::class, "show"]);
    Route::post("/", [ReviewController::class, "store"]);
    Route::put("/{id}", [ReviewController::class, "update"]);
    Route::delete("/{id}", [ReviewController::class, "destroy"]);
});

Route::prefix("reservations")->group(function () {
    Route::get("/", [ReservationController::class, "index"]);
    Route::get("/{id}", [ReservationController::class, "show"]);
    Route::get("/stade/{id}", [ReservationController::class, "showByStadeId"]);
    Route::post("/stade", [ReservationController::class, "store"]);
    Route::POST("/annuler/{id}", [ReservationController::class, "annuler"]);
    Route::POST("/confirmer/{id}", [ReservationController::class, "confirmer"]);
    Route::get("/user/{id}", [ReservationController::class, "showByUserId"]);
});

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\DueController;
use App\Http\Controllers\ExpenseController;

Route::get('/residents', [ResidentController::class, 'index']);
Route::post('/residents', [ResidentController::class, 'store']);
Route::put('/residents/{id}', [ResidentController::class, 'update']);
Route::delete('/residents/{id}', [ResidentController::class, 'destroy']);

Route::get('/houses', [HouseController::class, 'index']);
Route::post('/houses', [HouseController::class, 'store']);
Route::put('/houses/{id}', [HouseController::class, 'update']);
Route::delete('/houses/{id}', [HouseController::class, 'destroy']);
Route::get('/houses/{id}/history', [HouseController::class, 'history']);
Route::post('/houses/{id}/occupy', [HouseController::class, 'occupy']);

Route::get('/dues', [DueController::class, 'index']);
Route::post('/dues', [DueController::class, 'store']);
Route::post('/dues/{id}/pay', [DueController::class, 'pay']);

Route::get('/expenses', [ExpenseController::class, 'index']);
Route::post('/expenses', [ExpenseController::class, 'store']);

Route::get('/reports/summary', [ExpenseController::class, 'summary']);
Route::get('/reports/monthly', [ExpenseController::class, 'monthlyDetail']);

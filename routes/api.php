<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::get('user', 'UsersController@index');
Route::post('register', 'UsersController@store');
Route::post('/user/{id}', 'UsersController@update');


Route::get('client/fetch', 'ClientController@fetch');
Route::get('department/fetch', 'DepartmentController@fetch');

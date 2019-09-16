<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\Http\Controllers\UserController;

Auth::routes();

Route::group([], function () {
    Route::get('/', 'HomeController@index');
    Route::get('/songs/user/isUserAuthenticated', 'UserController@isUserAuthenticated');
});

Route::group(['middleware' => ['auth']], function () {
    Route::get('songs/user/{user_id}', 'SongController@index');
    Route::post('songs/{song_id}', 'SongController@store');
    Route::post('songs/create/{user_id}', 'SongController@create');
    Route::get('songs/{id}', 'SongController@show');
    Route::put('songs/{song}', 'SongController@markAsCompleted');
});




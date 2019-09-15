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

Auth::routes();

Route::get('/', 'HomeController@index');

Route::get('songs/user/{user_id}', 'SongController@index');
Route::post('songs/{song_id}', 'SongController@store');
Route::post('songs/create/{user_id}', 'SongController@create');
Route::get('songs/{id}', 'SongController@show');
Route::put('songs/{song}', 'SongController@markAsCompleted');
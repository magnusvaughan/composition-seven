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

Route::get('email/verify', 'Auth\VerificationController@show')->name('verification.notice');
Route::get('email/verify/{id}', 'Auth\VerificationController@verify')->name('verification.verify');
Route::get('email/resend', 'Auth\VerificationController@resend')->name('verification.resend');

Route::group([], function () {
    Route::get('/songs/user/isUserAuthenticated', 'UserController@isUserAuthenticated');
    Route::get('songs/show/{id}', 'SongController@show');
    Route::view('songs/{id}', 'app');
});

Route::group(['middleware' => ['auth', 'verified']], function () {
    Route::get('/', 'HomeController@index');
    Route::get('songs/user/{user_id}', 'SongController@index');
    Route::post('songs/{song_id}', 'SongController@store');
    Route::post('songs/delete/{song_id}', 'SongController@destroy');
    Route::post('songs/create/{user_id}', 'SongController@create');
    Route::put('songs/{song}', 'SongController@markAsCompleted');
});




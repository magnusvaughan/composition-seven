<?php

namespace App\Http\Controllers;

use App\Song;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SongController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $id = \Auth::id();;
        $user_songs = Song::select('id', 'name', 'created_at', 'updated_at', 'songJson')->where('user_id', $id)->get();
        return $user_songs->toJson();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request, $id)
    {
        $song = new Song();
        $song->name = $request->getContent();
        $song->user_id = $id;
        $empty_song = Storage::disk('local')->get('emptySong.json');
        $song->songJson = $empty_song;
        $song->save();
        $new_song_id = $song->id;
        $user_songs = Song::select('id', 'name', 'created_at', 'updated_at', 'songJson')->where('user_id', $id)->get();
        return ['songs' => $user_songs->toJson(), 'new_song_id' => $new_song_id];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $id)
    {
        $song = Song::find($id);
        $song->songJson = $request->getContent();
        $song->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Song  $song
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $song = Song::where('id', $id)->get();
        return $song->toJson();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Song  $song
     * @return \Illuminate\Http\Response
     */
    public function edit(Song $song)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Song  $song
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Song $song)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Song  $song
     * @return \Illuminate\Http\Response
     */
    public function destroy(Song $song)
    {
        //
    }
}

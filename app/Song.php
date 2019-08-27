<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
    protected $fillable = ['name', 'songJson'];

}


$table->bigIncrements('id');
$table->timestamps();
$table->char('name', 100);
$table->longText('songJson');
$table->integer('user_id');
$table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
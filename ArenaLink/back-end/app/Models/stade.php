<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class stade extends Model
{
    protected $fillable = [
        'name',
        'address',
        'sport_type',
        'capacity',
        'price_per_hour',
        'user_id',
        'image'
    ];
}

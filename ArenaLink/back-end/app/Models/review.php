<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class review extends Model
{
    protected $fillable = [
        'user_id',
        'stade_id',
        'rating',
        'comment',
    ];

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class reservation extends Model
{
    protected $fillable = [
        'user_id',
        'stade_id',
        'start_time',
        'duration',
        'total_price',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function stade()
    {
        return $this->belongsTo(stade::class, 'stade_id');
    }
}

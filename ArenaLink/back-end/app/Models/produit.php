<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class produit extends Model
{
    protected $fillable = [
        'name',
        'price',
        'description',
        'category',
        'image_url',
        'stock',
    ];
}

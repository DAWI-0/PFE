<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class order extends Model
{
    protected $fillable = [
        'user_id',
        'total_amount',
        'status',
        'product_ids'
    ];

    protected $casts = [
        'product_ids' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function produits()
    {
        return Produit::whereIn('id', $this->product_ids)->get();
    }


}

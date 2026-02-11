<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use User;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'subtotal',
        'tax',
        'shipping',
        'total',
        'address_line1',
        'address_line2',
        'city',
        'state',
        'postal_code',
        'country',
        'status'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

<?php
/*

GET|HEAD        Products ............................... Products.index › ProductController@index
POST            Products ............................... Products.store › ProductController@store  
GET|HEAD        Products/create ...................... Products.create › ProductController@create  
GET|HEAD        Products/{Product} ....................... Products.show › ProductController@show  
PUT|PATCH       Products/{Product} ................... Products.update › ProductController@update  
DELETE          Products/{Product} ................. Products.destroy › ProductController@destroy  
GET|HEAD        Products/{Product}/edit .................. Products.edit › ProductController@edit 

*/

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Images;

class Product extends Model
{
    protected $fillable = [
        'name',
        'price',
        'description',
        'parent_id',
        'is_parent',
        'default_image',
        'active',
        'quantity',
    ] ;

    public function images()
    {
        return $this->hasMany(Images::class);
    }
    
/* ======================
    Relationships
======================= */

// Parent category / product
public function parent()
{
    return $this->belongsTo(Product::class, 'parent_id');
}

// Children (sub-categories or products)
public function children()
{
    return $this->hasMany(Product::class, 'parent_id');
}

/* ======================
    Helpers (Recommended)
======================= */

// Check if this is a category
public function isCategory(): bool
{
    return $this->price == 0;
}

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

// Auto update is_parent flag
protected static function booted()
{
    static::saved(function ($product) {
        if ($product->parent_id) {
            Product::where('id', $product->parent_id)
                ->update(['is_parent' => true]);
        }
    });

    static::deleted(function ($product) {
        if ($product->parent_id) {
            $hasChildren = Product::where('parent_id', $product->parent_id)->exists();

            if (! $hasChildren) {
                Product::where('id', $product->parent_id)
                    ->update(['is_parent' => false]);
            }
        }
    });

        static::creating(function ($product) {
            if (auth()->check()) {
                $product->created_by = auth()->id();
            }
        });

        static::updating(function ($product) {
            if (auth()->check()) {
                $product->updated_by = auth()->id();
            }
        });
}
}

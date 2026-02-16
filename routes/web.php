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

use App\Http\Controllers\Admin\AdminDashboard;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\UserController;

use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TodolistController;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Mail\ProductCreated;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');


Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {


/** Product Routes */

        Route::get('Products/categeory', [ProductController::class , "getCategeory"])->name('getCategeory');
        Route::resource('Products', ProductController::class)->parameters(['Products' => 'product']);
        Route::resource('todo', TodolistController::class);

        
        /** Product Routes */
        Route::resource('Cart', CartController::class)->parameters(['Cart' => 'cart']);

    Route::get('/Checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/Checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    Route::resource('orders', OrderController::class);


});

/* Admin Routes */

Route::middleware(['auth', 'verified', 'role:0'])->name('admin.')->group(function () {

    Route::get('admin/dashboard', [AdminDashboard::class, 'dashBoardData'])->name('dashBoardData');

    Route::resource('admin/users', UserController::class);
    
    Route::resource('admin/products', AdminProductController::class);

    Route::post('/admin/products/{id}/toggle-status', [AdminProductController::class, 'toggleActiveStatus'])->name('admin.products.toggleStatus');
    Route::post('/admin/products/upload-csv', [AdminProductController::class, 'uploadCSV'])->name('admin.products.uploadCSV');


    Route::resource('admin/orders', AdminOrderController::class);


    Route::get('admin/products/categeory', [AdminProductController::class, "getCategeory"])->name('products.getCategeory');
    Route::post('admin/p/{product}', [AdminProductController::class, "changeImage"])->name('products.changeImage');
    Route::get('admin/products/{product}/editimage', [AdminProductController::class, "editImage"])->name('products.editImage');


}) ;




require __DIR__.'/settings.php';

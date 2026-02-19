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
use App\Http\Controllers\ProductManager\dashboard;
use App\Http\Controllers\TodolistController;
use App\Http\Controllers\UserDashboard;
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


/* User Routes */
Route::middleware(['auth', 'verified' , 'role:1'])->group(function () {

/** Product Routes */

        Route::get('user/dashboard', [UserDashboard::class, 'dashBoardData'])->name('dashBoardData');

        Route::get('Products/categeory', [ProductController::class , "getCategeory"])->name('getCategeory');
        Route::resource('Products', ProductController::class)->parameters(['Products' => 'product']);
        Route::resource('todo', TodolistController::class);

        
        /** Cart Routes */
        Route::resource('cart', CartController::class);

    Route::get('/Checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/Checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    // Order Routes
    Route::resource('orders', OrderController::class);
    Route::get('/orders/{order}/invoice', [OrderController::class, 'invoice'])->name('orders.invoice');
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


/*Product Manager  */
Route::middleware(['auth', 'verified', 'role:2'])->prefix('productmanager')->name('productmanager.')->group(function () {

    Route::get('/dashboard', [dashboard::class, 'dashboard'])->name('dashboard');
    Route::get('product/categeory', [dashboard::class, "getCategeory"])->name('products.getCategeory');
    Route::post('product/upload-csv', [dashboard::class, 'uploadCSV'])->name('product.uploadCSV');
    Route::post('product/{id}/toggle-status', [dashboard::class, 'toggleActiveStatus'])->name('product.toggleStatus');
    Route::resource('product', controller: dashboard::class);
});

/*Order Manager    */
Route::middleware(['auth', 'verified', 'role:3'])->name('ordermanager.')->group(function () {

});



/*Customer Support */
Route::middleware(['auth', 'verified', 'role:4'])->name('customersupport.')->group(function () {

});


/*Accountant       */
Route::middleware(['auth', 'verified', 'role:5'])->name('accountant.')->group(function () {

});




    require __DIR__.'/settings.php';

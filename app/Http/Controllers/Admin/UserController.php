<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Summary of UserController

* GET|HEAD        admin/users ......................... users.index › Admin\UserController@index  
* POST            admin/users ......................... users.store › Admin\UserController@store  
* GET|HEAD        admin/users/create ................ users.create › Admin\UserController@create  
* GET|HEAD        admin/users/{user} .................... users.show › Admin\UserController@show  
* PUT|PATCH       admin/users/{user} ................ users.update › Admin\UserController@update  
* DELETE          admin/users/{user} .............. users.destroy › Admin\UserController@destroy  
* GET|HEAD        admin/users/{user}/edit ............... users.edit › Admin\UserController@edit  * 

 */
class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::where('role', '!=', 0)
            ->paginate(10);

        return Inertia::render('admin/Users/Index', [
            'users' => $users, 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {

        $user->load([
            'orders.items.product'
        ]);
        
        return Inertia::render('admin/Users/SingleDetails', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|integer|in:0,1,2,3,4,5',
        ]);

        $user->update([
            'role' => $request->role,
        ]);
        
        // Reload user with relations
        $user->load('orders.items.product');

        // Return as Inertia page (not raw JSON)
        return Inertia::render('admin/Users/SingleDetails', [
            'user' => $user,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return Inertia::render('admin/Users/Index', [
            'users' => User::where('role', '!=', 0)
                ->paginate(10),
        ])->with('success', 'User deleted successfully.');
        // return redirect()->route('admin.users.index')
        //     ->with('success', 'User deleted successfully.');
    }
}

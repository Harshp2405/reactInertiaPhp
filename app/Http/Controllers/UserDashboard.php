<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserDashboard extends Controller
{
    public function dashBoardData(User $user)
    {
        $user = auth()->user();

        return Inertia::render('Dash/Index', [
            'user' => $user
        ]);
    }
}

<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class LoginController extends Controller
{
    public function create()
    {
        return Inertia::render('auth/login', [
            'status' => session('status'),
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }
}

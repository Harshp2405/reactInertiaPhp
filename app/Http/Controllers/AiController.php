<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Ai\Tools\EcommerseTool;
use Inertia\Inertia;

class AiController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/Ai/AIChat');
    }

    public function ask(Request $request)
    {
        $request->validate([
            'question' => 'required|string'
        ]);

        $tool = new EcommerseTool();

        $answer = $tool->handle($request);

        return Inertia::render('admin/Ai/AIChat', [
            'answer' => $answer
        ]);
    }
}

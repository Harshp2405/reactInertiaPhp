<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Ai\Tools\EcommerseTool;
use App\Services\GeminiService;
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

        $answer = GeminiService::ask($request->question);

        return Inertia::render('admin/Ai/AIChat', [
            'answer' => $answer
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\GeminiService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Ai\Image;

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
    public function generate(Request $request)
    {
        $apiKey = env('STABILITY_API_KEY');

        try {

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Accept' => 'application/json',
            ])
                ->attach('prompt', 'a futuristic cyberpunk city at night')
                ->attach('output_format', 'png')
                ->post('https://api.stability.ai/v2beta/stable-image/generate/core');

            $data = $response->json();

            Log::alert("API RESPONSE", $data);

            if (!isset($data['artifacts'][0]['base64'])) {
                return response()->json([
                    'error' => 'No image returned',
                    'response' => $data
                ]);
            }

            $image = base64_decode($data['image']);
            Log::info("API RESPONSE image", [ "image"=>$image]);

            $filename = 'images/' . time() . '.png';

            Storage::disk('public')->put($filename, $image);

            return response()->json([
                'image_url' => asset('storage/' . $filename)
            ]);
        } catch (\Exception $e) {

            Log::error($e);

            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function generateui()
    {
        return Inertia::render('admin/Ai/AiImage');
    }
}

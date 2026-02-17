<?php

namespace App\Jobs;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use League\Csv\Reader;
use League\Csv\Statement;

class ImportProductsFromCSV implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    protected $filePath;
    public function __construct($filePath)
    {
        $this->filePath = $filePath;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Make sure file exists
        if (!Storage::exists($this->filePath)) {
            throw new \Exception("CSV file not found: " . $this->filePath);
        }

        $fullPath = Storage::path($this->filePath);

        $csv = Reader::createFromPath($fullPath, 'r');
        $csv->setHeaderOffset(0);

        $stmt = new Statement();
        $records = $stmt->process($csv);

        foreach ($records as $record) {
            Product::create([
                'name' => $record['name'] ?? null,
                'price' => isset($record['price']) ? (float)$record['price'] : 0,
                'description' => $record['description'] ?? null,
                'parent_id' => !empty($record['parent_id']) ? (int)$record['parent_id'] : null,
                'is_parent' => !empty($record['is_parent']) ? 1 : 0,
                'category_id' => !empty($record['category_id']) ? (int)$record['category_id'] : null,
                'default_image' => $record['default_image'] ?? null,
                'active' => isset($record['active']) ? (int)$record['active'] : 1,
                'created_at' => $record['created_at'] ?? now(),
                'updated_at' => $record['updated_at'] ?? now(),
            ]);
        }

        // Optional: delete CSV after import to save space
        Storage::delete($this->filePath);
    }
}
// 105 to 10104
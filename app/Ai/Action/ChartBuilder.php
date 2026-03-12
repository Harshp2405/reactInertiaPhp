<?php

namespace App\Ai\Action;

use Illuminate\Support\Facades\DB;

class ChartBuilder
{
    public static function run(array $data)
    {
        $sql = $data['query'] ?? null;

        if (!$sql) {
            return [
                'success' => false,
                'error' => 'Query missing'
            ];
        }

        try {
            $rows = DB::select($sql);
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }

        return [
            'success' => true,
            'type' => 'chart',
            'labels' => array_column($rows, 'label'),
            'values' => array_column($rows, 'value')
        ];
    }
}

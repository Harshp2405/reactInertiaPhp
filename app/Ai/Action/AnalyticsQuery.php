<?php

namespace App\Ai\Action;

use Illuminate\Support\Facades\DB;

class AnalyticsQuery
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

        $sqlLower = strtolower($sql);

        $blocked = ['delete', 'drop', 'update', 'alter', 'truncate', 'insert'];

        foreach ($blocked as $word) {
            if (str_contains($sqlLower, $word)) {
                return [
                    'success' => false,
                    'error' => 'Unsafe query blocked'
                ];
            }
        }

        if (!str_starts_with($sqlLower, 'select')) {
            return [
                'success' => false,
                'error' => 'Only SELECT queries allowed'
            ];
        }

        try {
            $result = DB::select($sql);
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }

        return [
            'success' => true,
            'data' => $result
        ];
    }
}

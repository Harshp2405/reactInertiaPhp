<?php

namespace App\Ai\Router;

use App\Ai\Action\CreateProduct;
use App\Ai\Action\UpdateProduct;
use App\Ai\Action\DeleteProduct;
use App\Ai\Action\UpdateOrder;
use App\Ai\Action\AnalyticsQuery;
use App\Ai\Action\ChartBuilder;
use App\Http\Controllers\Admin\AdminProductController;
use Illuminate\Http\Request;

class AiActionRouter
{
    public static function run(array $data)
    {
        if (!isset($data['action'])) {
            return ['success' => false, 'error' => 'Invalid AI response'];
        }

        return match ($data['action']) {
            'create_product' => CreateProduct::run($data),

            // 'create_product' => (new AdminProductController())->store(
            //     new Request($data)
            // ),


            'update_product' => UpdateProduct::run($data),
            'delete_product' => DeleteProduct::run($data),
            'update_order'   => UpdateOrder::run($data),
            'analytics_query' => AnalyticsQuery::run($data),
            'build_chart'    => ChartBuilder::run($data),
            default          => ['success' => false, 'error' => 'Unknown action'],
        };
    }
}

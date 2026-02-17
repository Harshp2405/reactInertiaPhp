<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $order->id }}</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 13px;
            color: #333;
        }

        .container {
            width: 100%;
        }

        .header-table {
            width: 100%;
        }

        .company-name {
            font-size: 22px;
            font-weight: bold;
            color: #111;
        }

        .invoice-title {
            font-size: 28px;
            font-weight: bold;
            text-align: right;
        }

        .badge {
            background: #000;
            color: #fff;
            padding: 5px 10px;
            font-size: 12px;
        }

        .section-title {
            font-weight: bold;
            margin-bottom: 6px;
            font-size: 14px;
        }

        .address-box {
            background: #f8f8f8;
            padding: 10px;
            border-radius: 4px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th {
            background: #111;
            color: white;
            padding: 10px;
            text-align: left;
            font-size: 13px;
        }

        td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }

        .text-right {
            text-align: right;
        }

        .totals {
            margin-top: 20px;
            width: 40%;
            float: right;
        }

        .totals td {
            padding: 8px;
        }

        .grand-total {
            font-size: 16px;
            font-weight: bold;
            background: #f1f1f1;
        }

        .footer {
            margin-top: 80px;
            font-size: 12px;
            text-align: center;
            color: #777;
        }

    </style>
</head>

<body>
    <div class="container">

        <!-- HEADER -->
        <table class="header-table">
            <tr>
                <td>
                    <div class="company-name">Your Company Name</div>
                    <div>support@yourstore.com</div>
                </td>
                <td class="invoice-title">
                    INVOICE <br>
                    <span class="badge">#{{ $order->id }}</span>
                </td>
            </tr>
        </table>

        <hr>

        <!-- ORDER INFO -->
        <table style="margin-top: 20px;">
            <tr>
                <td width="50%">
                    <div class="section-title">Billing / Shipping Address</div>
                    <div class="address-box">
                        {{ $order->address_line1 }} <br>
                        @if($order->address_line2)
                        {{ $order->address_line2 }} <br>
                        @endif
                        {{ $order->city }}, {{ $order->state }} - {{ $order->postal_code }} <br>
                        {{ $order->country }}
                    </div>
                </td>

                <td width="50%" class="text-right">
                    <div><strong>Invoice Date:</strong></div>
                    {{ $order->created_at->format('d M Y') }} <br><br>

                    <div><strong>Status:</strong></div>
                    {{ ucfirst($order->status) }}
                </td>
            </tr>
        </table>

        <!-- ITEMS TABLE -->
        <table>
            <thead>
                <tr>
                    <th width="50%">Product</th>
                    <th width="15%">Price</th>
                    <th width="10%">Qty</th>
                    <th width="25%" class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>{{ $item->product->name }}</td>
                    <td>₹ {{ number_format($item->price, 2) }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td class="text-right">₹ {{ number_format($item->total, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- TOTALS -->
        <table class="totals">
            <tr>
                <td>Subtotal</td>
                <td class="text-right">₹ {{ number_format($order->subtotal, 2) }}</td>
            </tr>
            <tr>
                <td>Tax</td>
                <td class="text-right">₹ {{ number_format($order->tax, 2) }}</td>
            </tr>
            <tr>
                <td>Shipping</td>
                <td class="text-right">₹ {{ number_format($order->shipping, 2) }}</td>
            </tr>
            <tr class="grand-total">
                <td>Grand Total</td>
                <td class="text-right">₹ {{ number_format($order->total, 2) }}</td>
            </tr>
        </table>

        <div style="clear: both;"></div>

        <!-- FOOTER -->
        <div class="footer">
            Thank you for your purchase! <br>
            This is a system-generated invoice.
        </div>

    </div>
</body>
</html>


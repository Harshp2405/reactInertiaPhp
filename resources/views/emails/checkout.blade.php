<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f7f7f7; padding:20px;">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; padding:20px; border-radius:6px;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="text-align:center;">
                            <h2 style="margin:0;">Thank you for your order 🎉</h2>
                            
                        </td>
                    </tr>

                    <!-- User Info -->
                    <tr>
                       
                    </tr>

                    <!-- Order Table -->
                    <tr>
                        <td>
                            <table width="100%" cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;">
                                <thead style="background:#f0f0f0;">
                                    <tr>
                                        <th align="left">Product</th>
                                        <th align="center">Qty</th>
                                        <th align="right">Price</th>
                                        <th align="right">Total</th>
                                    </tr>
                                </thead>
                               
                            </table>
                        </td>
                    </tr>

                    <!-- Final Total -->
                    <tr>
                        <td style="padding-top:15px; text-align:right;">
                           
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding-top:20px; text-align:center; color:#777;">
                            <p>If you have any questions, contact us anytime.</p>
                            <p>&copy; {{ date('Y') }} Your Store</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>

<!-- resources/views/emails/order_confirmation.blade.php -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #007BFF;
            font-size: 24px;
            text-align: center;
        }

        h3 {
            color: #333;
            font-size: 20px;
            border-bottom: 2px solid #007BFF;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }

        p, ul {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
        }

        strong {
            color: #333;
        }

        ul {
            padding-left: 20px;
            list-style-type: none;
        }

        ul li {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }

        .total {
            font-weight: bold;
            color: #007BFF;
        }

        .product-image {
            width: 80px;
            height: auto;
            border-radius: 5px;
        }

        .order-summary, .route-details {
            margin-top: 30px;
        }

        .route-details ul {
            padding-left: 20px;
        }

        .footer {
            font-size: 14px;
            text-align: center;
            margin-top: 20px;
            color: #777;
        }

        .footer a {
            color: #007BFF;
            text-decoration: none;
        }

        .email-header {
            text-align: center;
            padding: 10px;
            background-color: #007BFF;
            color: #fff;
            border-radius: 8px 8px 0 0;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <div class="email-header">
            <h1>Order Confirmation</h1>
        </div>

        <p>Thank you for your order! Below are your order details:</p>

        <div class="order-summary">
            <h3>Order ID: {{ $orderData['orderSummary']['orderId'] }}</h3>
            <p><strong>Total Amount:</strong> ${{ $orderData['orderSummary']['totalAmount'] }}</p>
            <p><strong>Discount Applied:</strong> -${{ $orderData['orderSummary']['discountAmount'] }}</p>
            <p><strong>Total After Discount:</strong> ${{ $orderData['orderSummary']['totalAfterDiscount'] }}</p>
        </div>

        <div class="product-list">
            <h4>Products:</h4>
            <ul>
                @foreach ($orderData['cartItems'] as $item)
                    <li>
                        <div style="display: flex; align-items: center;">
                            <img class="product-image" src="{{ $item['image'] }}" alt="{{ $item['productName'] }}">
                            <div style="margin-left: 15px;">
                                <strong>{{ $item['productName'] }}</strong><br>
                                Quantity: {{ $item['quantity'] }} x ${{ $item['price'] }}<br>
                                <span class="total">Total: ${{ $item['totalAmount'] }}</span>
                            </div>
                        </div>
                    </li>
                @endforeach
            </ul>
        </div>

        <div class="route-details">
            <h4>Route Details:</h4>
            <ul>
                @foreach ($orderData['routeDetails'] as $route)
                    <li>
                        <strong>Route Name:</strong> {{ $route['routeName'] }}<br>
                        <strong>Start Location:</strong> {{ $route['supplier'] }}<br>
                        <strong>Warehouse:</strong> {{ $route['warehouse'] }}<br>
                        <strong>Destination Location:</strong> {{ $route['destination'] }}<br>
                        <strong>Estimated Time:</strong> {{ $route['estimatedTime'] }}<br>
                        <strong>Distance:</strong> {{ $route['distance'] }} km
                    </li>
                @endforeach
            </ul>
        </div>

        <div class="footer">
            <p>Thank you for your purchase! We hope you enjoy your order.</p>
            <p>If you have any questions, feel free to <a href="mailto:support@company.com">contact us</a>.</p>
        </div>
    </div>

</body>
</html>

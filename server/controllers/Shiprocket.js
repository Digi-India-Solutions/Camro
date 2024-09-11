const axios = require('axios');
const Order = require('../models/order.model');

exports.ShipRocketLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email and password presence (can be done with express-validator for more detailed validation)
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                msg: "Email and password are required"
            });
        }

        // Making the POST request to ShipRocket login endpoint
        const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
            email,
            password
        });

        // Sending a success response to the client
        return res.status(200).json({
            success: true,
            data: response.data,
            msg: "Login successful"
        });
    } catch (error) {
        console.error("Error logging into ShipRocket:", error.message);
        const errorMsg = error.response ? error.response.data : "No response from ShipRocket server";
        const status = error.response ? error.response.status : 500;
        return res.status(status).json({
            success: false,
            msg: errorMsg
        });
    }
};


exports.MakeOrderReadyToShip = async (req, res) => {
    try {
        const OrderId = req.params.id;
        const { length, breadth, height, weight, token } = req.body;

        if (!OrderId) {
            return res.status(403).json({
                success: false,
                message: "Please Provide Order ID"
            });
        }

        const OrderDetail = await Order.findById(OrderId);

        if (!OrderDetail) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Extract user and address details
        const user = OrderDetail.user;
        const Address = OrderDetail.address[0]; // Assuming the first address is used
        const OrderItems = OrderDetail.product;

        // Extract UTC timestamp for order creation
        const utcTimestamp = OrderDetail.createdAt.toISOString();

        // Map through order items to format them for the request payload
        const orderItemsArray = OrderItems.map(item => ({
            name: item.name,
            sku: item.id || "123", // Use product id as SKU if available
            units: parseInt(item.quantity),
            selling_price: parseFloat(item.price),
            discount: "", // Set discount if applicable
            tax: "", // Set tax if applicable
            hsn: 441122 // Set HSN code if applicable
        }));

        // Data object for the request to Shiprocket API
        const data = {
            "order_id": OrderDetail._id,
            "order_date": utcTimestamp,
            "billing_customer_name": user.name || "Unknown",
            "billing_last_name": "N/A", // Placeholder for last name
            "billing_address": Address.street,
            "billing_address_2": `${Address.city}, ${Address.state}`, // Combining city and state
            "billing_city": Address.city,
            "billing_pincode": Address.pincode,
            "billing_state": Address.state,
            "billing_country": "India", // Assuming orders within India
            "billing_email": user.email,
            "billing_phone": user.phone || "9876543210", // Fallback phone number
            "shipping_is_billing": true, // Assuming billing and shipping are the same
            "order_items": orderItemsArray,
            "payment_method": OrderDetail.PyamentType,
            "shipping_charges": 0,
            "giftwrap_charges": 0,
            "transaction_charges": 0,
            "total_discount": 0,
            "sub_total": parseFloat(OrderDetail.TotalAmount),
            "length": length,
            "breadth": breadth,
            "height": height,
            "weight": weight
        };

        // Sending the request to Shiprocket API
        axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Replace with actual token
            }
        })
        .then(response => {
            console.log('Response:', response.data);
            // Handle response data from Shiprocket
            return res.status(201).json({
                success: true,
                message: "Shipping order created successfully",
                data: response.data
            });
        })
        .catch(error => {
            console.error('Error:', error.response.data);
            // Handle errors from Shiprocket API
            const errorMessage = error.response.data.message || "Error in creating shipping order";
            const errors = error.response.data.errors || [];
            const statusCode = error.response.status || 500;
            return res.status(statusCode).json({
                success: false,
                message: errorMessage,
                errors: errors
            });
        });

    } catch (error) {
        console.log('Error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
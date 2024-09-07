const Order = require("../models/order.model");
const Product = require("../models/product.model");
const sendEmail = require("../utils/sendMail");
const User = require("../models/user.model");
const Payment = require("../models/PaymentModal");
exports.CreateOrder = async (req, res) => {
  try {
    const formData = req.body;

    if (!formData) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const { cartItems, address, TotalAmount,
      PyamentType } = formData;

    // Check if cartItems or address is empty
    if (!cartItems || cartItems.length === 0 || !address || Object.keys(address).length === 0) {
      return res.status(422).json({ error: "Cart items or address is empty" });
    }

    const userId = req.user.id; // Assuming user ID is retrieved correctly

    // Map over cartItems to transform each item into the structure expected by the schema
    const products = cartItems.map(item => ({
      id: item.id,
      name: item.productName, // Assuming productName maps to name
      price: item.price,
      quantity: item.quantity,
      image: [item.image], // Define image as an array of strings
      sizes: item.size // Assuming size maps to sizes
    }));

    const newOrder = new Order({
      product: products, // Pass the transformed products array to the product field
      address: address,
      TotalAmount: TotalAmount,
      PyamentType,
      user: userId
    });
    console.log(newOrder)

    await newOrder.save();

    return res.status(201).json({
      success: true,
      msg: "Order created",
      newOrder
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


//order for me
exports.orderForMe = async (req, res) => {
  try {
    const userId = req.user?.id;

    // Get all orders from the database where the user is equal to the authenticated user
    const userOrders = await Order.find({ user: userId });

    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Orders Found",
      });
    }

    // Fetch payments associated with user's orders
    const payments = await Payment.find({ order: { $in: userOrders.map(order => order._id) } });
    // console.log(payments)
    // Map transaction IDs to corresponding order IDs
    const orderTransactionMap = {};
    payments.forEach(payment => {
      orderTransactionMap[payment.order.toString()] = payment.tranxTionId;
    });

    // Attach transaction IDs to orders
    const ordersWithTransactions = userOrders.map(order => {
      return {
        ...order.toObject(),
        transactionId: orderTransactionMap[order._id.toString()] || null
      };
    });

    console.log(ordersWithTransactions.length)
    res.status(200).json({
      success: true,
      message: "Orders Found",
      data: ordersWithTransactions.reverse(), // Reverse the order of orders if needed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//mark order return and cancel
exports.makeOrderCancelAndReturn = async () => {
  const { orderId, Stauts } = req.body
  //check order in Order

  const CheckAndUpdate = await Order.findById(orderId)

  // check order stauts 
  if (CheckAndUpdate.orderStatus === "Pending") {
    CheckAndUpdate.orderStatus === Stauts
  }

}
//order for admin
exports.orderForAdmin = async (req, res) => {
  try {
    // Fetch orders from the database
    const userOrders = await Order.find();

    // Check if there are any orders
    if (!userOrders.length > 0) {
      return res.status(404).json({
        success: false,
        message: "No Orders Found",
      });
    }

    // Retrieve order IDs from fetched orders
    const orderIds = userOrders.map((order) => order._id);

    // Find payments for the retrieved order IDs
    const payments = await Payment.find({ order: { $in: orderIds } });

    // Map transaction IDs to corresponding order IDs
    const orderTransactionMap = {};
    payments.forEach((payment) => {
      orderTransactionMap[payment.order.toString()] = payment.tranxTionId;
    });

    // Attach transaction IDs to orders
    const ordersWithTransactions = userOrders.map((order) => ({
      ...order.toObject(),
      transactionId: orderTransactionMap[order._id.toString()] || null,
    }));

    res.status(201).json({
      success: true,
      message: "Admin Orders Found with Payments",
      data: ordersWithTransactions,
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//update order
// exports.UpdateOrderStatus = async (req, res) => {
//   try {
//     const { status, orderId } = req.body;

//     console.log(req.body)

//     // Input validation
//     if (!status || !orderId) {
//       return res.status(400).json({ msg: "Missing status or orderId in request body" });
//     }

//     // Find order details
//     const orderDetails = await Order.findById(orderId);

//     // Check if orderDetails is null, indicating that the order with the given ID was not found
//     if (!orderDetails) {
//       return res.status(404).json({ msg: "Order not found" });
//     }

//     // Find and update the order status
//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       { $set: { orderStatus: status } },
//       { new: true }
//     );



//     // For any other status update
//     return res.json({ msg: "Order status updated successfully", order: updatedOrder });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ msg: "Internal Server Error", error: error.message });
//   }
// };
exports.UpdateOrderStatus = async (req, res) => {
  try {
    const { status, orderId } = req.body;

    console.log(req.body);

    // Input validation
    if (!status || !orderId) {
      return res.status(400).json({ msg: "Missing status or orderId in request body" });
    }

    // Find order details
    const orderDetails = await Order.findById(orderId).populate('user');
    console.log(orderDetails);

    // Check if orderDetails is null, indicating that the order with the given ID was not found
    if (!orderDetails) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Find and update the order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { orderStatus: status } },
      { new: true }
    );

    // Send email to the user
    const user = orderDetails.user; // Fetching user details from populated data
    if (user) {
      const options = {
        email: user.Email,
        subject: `Order Status Updated - Your Order #${orderDetails._id}`,
        message: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f6f6f6;
                }
                .container {
                  width: 100%;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  margin: 20px auto;
                  max-width: 600px;
                }
                .header {
                  background-color: #f8f8f8;
                  padding: 20px;
                  text-align: center;
                  color: #ffffff;
                  border-radius: 8px 8px 0 0;
                }
                .header h1{
                  color:#000;
                }
                .header img {
                  max-width: 150px;
                  height: auto;
                }
                .content {
                  padding: 20px;
                  text-align: center;
                }
                .content h2 {
                  color: #dd2c1c;
                  margin-bottom: 10px;
                }
                .content p {
                  font-size: 16px;
                  color: #333333;
                  margin: 15px 0;
                }
                .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 12px;
                  color: #999999;
                  border-top: 1px solid #eeeeee;
                  background-color: #f6f6f6;
                  border-radius: 0 0 8px 8px;
                }
                .contact-info {
                  margin-top: 20px;
                  font-size: 14px;
                }
                .contact-info p {
                  margin: 5px 0;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <img src="https://res.cloudinary.com/dohzhn0ny/image/upload/v1725689947/logo-main_eq5q1c.png" alt="Company Logo" />
                  <h1>Order Status Updated</h1>
                </div>
                <div class="content">
                  <h2>Hello ${user.Name},</h2>
                  <p>Your order with ID <strong>#${orderDetails._id}</strong> has been updated to the following status:</p>
                  <p><strong>Status: ${status}</strong></p>
                  <p>If you have any questions or need further assistance, feel free to reach out to us:</p>
                  <div class="contact-info">
                    <p><strong>Phone:</strong> +91-8595722922</p>
                    <p><strong>Email:</strong> <a href="mailto:sale.camrosteel@gmail.com">sale.camrosteel@gmail.com</a></p>
                  </div>
                </div>
                <div class="footer">
                  &copy; ${new Date().getFullYear()} Camro Company. All rights reserved.
                </div>
              </div>
            </body>
          </html>
        `
      };
    
      await sendEmail(options);
    }
    
    


    // For any other status update
    return res.json({ msg: "Order status updated successfully", order: updatedOrder });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};



exports.getTransactionID = async (req, res) => {

  try {
    const OrderId = req.params.OrderId
    //check Orderid In Payment Modal

    const checkOrder = await Payment.findOne({ order: OrderId })
    if (!checkOrder) {
      return res.status(403).json({
        success: true,
        msg: "No _order Found"
      })
    }
    //send Transaction Id
    const TransactionId = checkOrder.tranxTionId
    res.status(201).json({
      success: true,
      data: TransactionId
    })
  } catch (error) {
    console.log(error)
  }


}

exports.getSingleOrderById = async (req, res) => {
  try {
    // Extract the order ID from the request parameters
    const orderId = req.params.id;

    // Attempt to find the order by its ID
    const order = await Order.findById(orderId);

    // If the order doesn't exist, return a 404 Not Found response
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // If the order is found, return a 200 OK response with the order data
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    // Log the error for server-side debugging
    console.error(error);

    // Return a generic 500 Internal Server Error response
    // In a production environment, you might want to hide specific error details or categorize errors differently
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.deleteOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Attempt to find the order by its ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(403).json({
        success: false,
        msg: "Order Not Found"
      })
    }

    await order.deleteOne();
    res.status(200).json({
      success: true,
      msg: "Order Deleted Succesfully !!"
    })
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}
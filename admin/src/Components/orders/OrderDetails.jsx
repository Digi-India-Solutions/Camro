import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [sUser, setUser] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [dimensions, setDimensions] = useState({ weight: 0.5, length: 10, breadth: 10, height: 5 });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`https://api.camrosteel.com/api/v1/single-order/${id}`);
      setOrder(response.data.data);
      // console.log(response.data.data);

      // Fetch user details automatically
      const res = await axios.get(`https://api.camrosteel.com/api/v1/finduserbyid/${response.data.data.user}`);
      setUser(res.data.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      const res = await axios.post(`https://api.camrosteel.com/api/v1/update-order`, {
        status: newStatus,
        orderId: id
      });
      setStatusUpdated(true);
      // console.log(res.data);
      fetchOrderDetails();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDimensionChange = (e) => {
    setDimensions({
      ...dimensions,
      [e.target.name]: parseFloat(e.target.value)
    });
  };

  const sendOrderToShiprocket = async () => {
    const token = sessionStorage.getItem('shiprocketToken');
    if (!token) {
      console.log('No token found, redirecting to login...');
      navigate(`/shiprocket/login`);
      return;
    }

    if (!sUser.ContactNumber) {
      alert('Please provide a customer phone number.');
      return;
    }

    const orderData = {
      order_id: order._id,
      order_date: order.createdAt,
      pickup_location: 'Primary',
      channel_id: '',
      comment: 'Order for Camro Steel Steller Pressure Cooker',
      billing_customer_name: sUser.Name,
      billing_last_name: '',
      billing_address: order.address[0].street,
      billing_city: order.address[0].city,
      billing_pincode: order.address[0].pincode,
      billing_state: order.address[0].state,
      billing_country: 'India',
      billing_email: sUser.Email,
      billing_phone: sUser.ContactNumber,
      shipping_is_billing: true,
      order_items: order.product.map(item => ({
        name: item.name,
        sku: item.id,
        units: item.quantity,
        selling_price: item.price,
        discount: 0,
        tax: 0,
        hsn: '4412'
      })),
      payment_method: order.PyamentType === 'COD' ? 'COD' : 'Prepaid',
      sub_total: order.TotalAmount,
      length: dimensions.length,
      breadth: dimensions.breadth,
      height: dimensions.height,
      weight: dimensions.weight
    };

    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('Order sent to Shiprocket:', response.data);
      alert('Order successfully sent to Shiprocket!');
    } catch (error) {
      console.error('Error sending order to Shiprocket:', error);
      alert('Failed to send order to Shiprocket.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!order || !sUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto py-4 px-2">
        <h1 className="text-3xl font-bold my-4 text-center">Order Details</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left side: User and Order details in table */}
          <div className="border p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Order Information</h2>
            <table className="table-auto w-full border">
              <tbody>
                <tr className="border">
                  <td className="font-bold p-2 border">Order ID:</td>
                  <td className="p-2">{order._id}</td>
                </tr>
                <tr className="border">
                  <td className="font-bold p-2 border">Total Amount:</td>
                  <td className="p-2">Rs {order.TotalAmount}</td>
                </tr>
                <tr className="border">
                  <td className="font-bold p-2 border">Payment Type:</td>
                  <td className="p-2">{order.PyamentType}</td>
                </tr>
                <tr className="border">
                  <td className="font-bold p-2 border">Order Status:</td>
                  <td className="p-2">{order.orderStatus}</td>
                </tr>
                <tr className="border">
                  <td className="font-bold p-2 border">Address:</td>
                  <td className="p-2">
                    {order.address[0].street}, {order.address[0].city}, {order.address[0].state} - {order.address[0].pincode}
                  </td>
                </tr>
                <tr className="border">
                  <td className="font-bold p-2 border">Created At:</td>
                  <td className="p-2">{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="font-bold p-2 border">Updated At:</td>
                  <td className="p-2">{new Date(order.updatedAt).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            {/* User Details */}
            <h2 className="text-lg font-bold mt-6 mb-2">User Details</h2>
            <table className="table-auto w-full border">
              <tbody>
                <tr className="border">
                  <td className="font-bold p-2 border">Name:</td>
                  <td className="p-2">{sUser.Name}</td>
                </tr>
                <tr className="border">
                  <td className="font-bold p-2 border">Email:</td>
                  <td className="p-2">{sUser.Email}</td>
                </tr>
                <tr>
                  <td className="font-bold p-2 border">Contact Number:</td>
                  <td className="p-2">{sUser.ContactNumber}</td>
                </tr>
              </tbody>
            </table>



            {!statusUpdated && (
              <div className="mt-4">
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  className="border rounded p-2 mb-2"
                >
                  <option value="">All Status</option>
                  <option value="Order Confirmation Pending">Order Confirmation Pending</option>
                  <option value="Confirmed">Confirmed order</option>
                  <option value="Packed">Packed</option>
                  <option value="Dispatched">Order Dispatch</option>
                  <option value="Returned">Order Return</option>
                  <option value="Returned">Cancel Order</option>
                </select>
                <button onClick={handleStatusUpdate} className="bg-blue-500 text-white mx-2 px-4 py-2 rounded">Update Status</button>
              </div>
            )}


            {order.orderStatus === "Dispatched" && (
              <>
                {/* Dimensions Form */}
                <h2 className="text-lg font-bold mt-6 mb-2">Update Dimensions</h2>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block font-bold">Weight (kg):</label>
                    <input
                      type="number"
                      name="weight"
                      value={dimensions.weight}
                      onChange={handleDimensionChange}
                      className="border p-2 rounded w-full"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block font-bold">Length (cm):</label>
                    <input
                      type="number"
                      name="length"
                      value={dimensions.length}
                      onChange={handleDimensionChange}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block font-bold">Breadth (cm):</label>
                    <input
                      type="number"
                      name="breadth"
                      value={dimensions.breadth}
                      onChange={handleDimensionChange}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block font-bold">Height (cm):</label>
                    <input
                      type="number"
                      name="height"
                      value={dimensions.height}
                      onChange={handleDimensionChange}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                </form>

                {/* Proceed to Shiprocket */}
                <button
                  onClick={sendOrderToShiprocket}
                  className={`bg-green-500 my-5  text-white px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending to Shiprocket...' : 'Proceed with Shiprocket'}
                </button>
              </>
            )}



          </div>



          {/* Right side: Product images and details */}
          <div className="border p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Products</h2>
            <div className="space-y-4">
              {order.product.map((item, index) => (
                <div key={index} className="border p-4 rounded flex items-start space-x-4">
                  <img src={item.image[0]} alt={item.name} className="w-24 h-24 object-cover border rounded" />
                  <div>
                    <p className="font-bold mb-1">{item.name}</p>
                    <p className="mb-1">Price: Rs {item.price}</p>
                    <p className="mb-1">Quantity: {item.quantity}</p>
                    <p className="mb-1">Size: {item.sizes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default OrderDetails;

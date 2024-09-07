import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Bill from './Bill';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [sUser, setUser] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`https://api.camrosteel.com/api/v1/single-order/${id}`);
      setOrder(response.data.data);

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
      setStatusMessage(`Order status updated to: ${newStatus}`);
      // console.log(res.data);
      fetchOrderDetails();
    } catch (error) {
      console.error('Error updating order status:', error);
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

            {/* Status Update */}
            <div className="mt-6">
              <label className="block font-bold mb-2">Update Order Status:</label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                className="border rounded p-2 mb-2 w-full"
              >
                <option value="">Select Status</option>
                <option value="Order Confirmation Pending">Order Confirmation Pending</option>
                <option value="Confirmed">Confirmed order</option>
                <option value="Packed">Packed</option>
                <option value="Dispatched">Order Dispatch</option>
                <option value="Returned">Order Return</option>
                <option value="Canceled">Cancel Order</option>
              </select>
              <button onClick={handleStatusUpdate} className="bg-blue-500 text-white px-4 py-2 rounded w-full">Update Status</button>
              {statusMessage && <p className="text-green-500 text-center mt-4">{statusMessage}</p>}
            </div>

            {/* Download PDF */}
            <div className="mt-4">
              <PDFDownloadLink
                document={<Bill order={order} user={sUser} />}
                fileName={`Order_${order._id}.pdf`}
                className="bg-green-500 text-white px-4 py-2 rounded w-full text-center block"
              >
                {({ loading }) =>
                  loading ? 'Generating PDF...' : 'Download PDF'
                }
              </PDFDownloadLink>
            </div>
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

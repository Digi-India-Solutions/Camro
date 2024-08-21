import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import logo from './logo-main.png';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Bill from './Bill';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [sUser, setUser] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusUpdated, setStatusUpdated] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`https://api.camrosteel.com/api/v1/single-order/${id}`);
        setOrder(response.data.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      const res = await axios.post(`https://api.camrosteel.com/api/v1/update-order`, {
        status: newStatus,
        orderId: id
      });
      setStatusUpdated(true);
      console.log(res.data);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handlePrint = async (id) => {
    try {
      const res = await axios.get(`https://api.camrosteel.com/api/v1/finduserbyid/${id}`);
      setUser(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold my-4">Order Details</h1>
      <div className="border rounded p-4">
        <h2 className="text-lg font-bold mb-2">Order ID: {order._id}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className='text-wrap'><strong>Product Name:</strong> {order.product[0].name}</p>
            <p><strong>Price:</strong> Rs{order.product[0].price}</p>
            <p><strong>Quantity:</strong> {order.product[0].quantity}</p>
            <p><strong>Total Amount:</strong> Rs{order.TotalAmount}</p>
            <p><strong>Order Status:</strong> {order.orderStatus}</p>
            <p onClick={() => { handlePrint(order.user) }}><strong>User:</strong> Show User</p>
            {sUser && (
              <div className="max-w-md mx-auto border rounded p-4 mt-4">
                <h2 className="text-lg font-bold mb-2">User Details</h2>
                <p><strong>Name:</strong> {sUser.Name}</p>
                <p><strong>Email:</strong> {sUser.Email}</p>
                <p><strong>Contact Number:</strong> {sUser.ContactNumber}</p>
                {/* Add more fields as needed */}
              </div>
            )}
            <p><strong>Address:</strong> {order.address.map(addr => `${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}`).join(', ')}</p>
            <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
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
                </select>
                <button onClick={handleStatusUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">Update Status</button>
              </div>
            )}
            <div className="mt-4">
              <PDFDownloadLink
                document={<Bill order={order} user={sUser} />}
                fileName={`Order_${order._id}.pdf`}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {({ loading }) =>
                  loading ? 'Generating PDF...' : 'Download PDF'
                }
              </PDFDownloadLink>
            </div>
          </div>
          <div>
            <img src={order.product[0].image[0]} alt={order.product[0].name} className="w-full h-auto max-w-md mx-auto" />
            {statusUpdated && <p className="text-green-500 text-center mt-4">Order status updated successfully!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

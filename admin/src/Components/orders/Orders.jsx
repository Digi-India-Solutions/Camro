import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [adminOrders, setAdminOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(20);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    const fetchOrdersWithUsers = async () => {
      try {
        const response = await axios.get('https://api.camrosteel.com/api/v1/admin-order');
        const orders = response.data.data.reverse();

        const ordersWithUsers = await Promise.all(
          orders.map(async (order) => {
            const userResponse = await axios.get(`https://api.camrosteel.com/api/v1/finduserbyid/${order.user}`);
            const userName = userResponse.data.data.Name;
            return { ...order, userName };
          })
        );

        setAdminOrders(ordersWithUsers);
        setFilteredOrders(ordersWithUsers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchOrdersWithUsers();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this order?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://api.camrosteel.com/api/v1/delete-order/${orderId}`);
      setAdminOrders(adminOrders.filter(order => order._id !== orderId));
      setFilteredOrders(filteredOrders.filter(order => order._id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const filterOrdersByDate = (orders, filter, startDate, endDate) => {
    const today = new Date();
    const filtered = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      switch (filter) {
        case 'Today':
          return orderDate.toDateString() === today.toDateString();
        case 'Yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          return orderDate.toDateString() === yesterday.toDateString();
        case 'This Week':
          const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
          return orderDate >= startOfWeek;
        case 'This Month':
          return orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
        default:
          if (startDate && endDate) {
            return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
          }
          return true;
      }
    });
    return filtered;
  };

  useEffect(() => {
    const filtered = adminOrders.filter(order =>
      order.product[0].name.toLowerCase().includes(searchText.toLowerCase()) &&
      (selectedStatus === '' || order.orderStatus === selectedStatus)
    );
    const dateFilteredOrders = filterOrdersByDate(filtered, filterDate, customStartDate, customEndDate);
    setFilteredOrders(dateFilteredOrders);
  }, [searchText, selectedStatus, filterDate, customStartDate, customEndDate, adminOrders]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Order Confirmation Pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'Confirmed':
        return 'bg-blue-200 text-blue-800';
      case 'Packed':
        return 'bg-green-200 text-green-800';
      case 'Dispatched':
        return 'bg-purple-200 text-purple-800';
      case 'Returned':
        return 'bg-red-200 text-red-800';
      case 'Canceled':
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Orders</h1>
      <div className="flex flex-col sm:flex-row items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by product name"
          className="border rounded p-2"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Select Status</option>
          <option value="Order Confirmation Pending">Order Confirmation Pending</option>
          <option value="Confirmed">Confirmed order</option>
          <option value="Packed">Packed</option>
          <option value="Dispatched">Order Dispatch</option>
          <option value="Returned">Order Return</option>
          <option value="Canceled">Cancel Order</option>
        </select>
        <select
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Dates</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
        </select>
        <div className="flex gap-2">
          <input
            type="date"
            value={customStartDate}
            onChange={e => setCustomStartDate(e.target.value)}
            className="border rounded p-2"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={customEndDate}
            onChange={e => setCustomEndDate(e.target.value)}
            className="border rounded p-2"
            placeholder="End Date"
          />
        </div>
      </div>
      <div className='overflow-x-auto'>
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment method</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.map(order => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/Orders/${order._id}`}>{order._id}</Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.userName}</td>
                <td className="px-6 py-4 whitespace-nowrap">Rs {order.TotalAmount}</td>
                <td className={`px-6 py-4 whitespace-nowrap rounded ${statusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.PyamentType}</td>
                {/* <td className="px-6 py-4 whitespace-nowrap">{order.transactionId || "COD"}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
        <div>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;

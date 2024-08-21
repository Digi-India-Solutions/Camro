import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Pagination from './Pagination'; // Import your Pagination component
import { Link } from 'react-router-dom';

const Orders = () => {
  const [adminOrders, setAdminOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filterDate, setFilterDate] = useState(''); // New state for date filter

  useEffect(() => {
    const fetchOrdersWithUsers = async () => {
      try {
        const response = await axios.get('https://api.camrosteel.com/api/v1/admin-order');
        const orders = response.data.data;

        // Fetch user data for each order
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

  const filterOrdersByDate = (orders, filter) => {
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
    const dateFilteredOrders = filterOrdersByDate(filtered, filterDate);
    setFilteredOrders(dateFilteredOrders);
  }, [searchText, selectedStatus, filterDate, adminOrders]);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Pagination controls
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold my-4">Admin Orders</h1>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search by product name"
          className="border rounded p-2 mr-4"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="border rounded p-2 mr-4"
        >
          <option value="">All Status</option>
          <option value="Order Confirmation Pending">Order Confirmation Pending</option>
          <option value="Confirmed">Confirmed order</option>
          <option value="Packed">Packed</option>
          <option value="Dispatched">Order Dispatch</option>
          <option value="Returned">Order Return</option>
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
      </div>
      <div className='w-full overflow-scroll'>
        <table className="w-[1400px] overflow-scroll divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Payment method</th>
              <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.map(order => (
              <React.Fragment key={order._id}>
                {order.product.map((product, index) => (
                  <tr key={`${order._id}_${index}`}>
                    {index === 0 ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap" rowSpan={order.product.length}>
                          <Link to={`/Orders/${order._id}`}>{order._id}</Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" rowSpan={order.product.length}>
                          {order.userName}
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap"
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '150px', // Adjust the maxWidth as needed
                          }}
                          rowSpan={order.product.length}
                        >
                          {order.product.length > 1 ? 'Multiple Products' : product.name}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">Rs {product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img src={product.image[0]} alt={product.name} className="h-10 w-10 object-cover" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.PyamentType}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.transactionId || "COD"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">Rs {order.TotalAmount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.orderStatus}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-transform transform hover:scale-105"
                          >
                            Delete
                          </button>
                        </td> */}

                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">Rs {product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><img src={product.image[0]} alt={product.name} className="h-10 w-10 object-cover" /></td>
                      </>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
        >
          Previous
        </button>
        <span className="bg-gray-300 text-gray-800 font-bold py-2 px-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;

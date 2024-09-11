import React, { useState } from 'react';
import axios from 'axios';

const ShipRocket = () => {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [orderData, setOrderData] = useState({
        length: '',
        breadth: '',
        height: '',
        weight: '',
        orderId: '',
        token: '',
    });
    const [loginResponse, setLoginResponse] = useState(null);
    const [orderResponse, setOrderResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle login form change
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    // Handle order form change
    const handleOrderChange = (e) => {
        const { name, value } = e.target;
        setOrderData({ ...orderData, [name]: value });
    };

    // Handle login form submit
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('https://api.camrosteel.com/api/v1/ship-rocket-login', loginData);
            setLoginResponse(response.data);
            setOrderData({ ...orderData, token: response.data.data.token });
        } catch (error) {
            setError(error.response?.data?.msg || "Login Failed");
        }
        setLoading(false);
    };

    // Handle order shipment form submit
    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`https://api.camrosteel.com/api/v1/order-ship/${orderData.orderId}`, orderData);
            setOrderResponse(response.data);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to create shipment");
        }
        setLoading(false);
    };

    return (
        <div className="container mt-5">
            <h1>ShipRocket Integration</h1>

            {/* Login Form */}
            <div className="card mb-4">
                <div className="card-header">Login to ShipRocket</div>
                <div className="card-body">
                    <form onSubmit={handleLoginSubmit}>
                        <div className="mb-3">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {loginResponse && (
                        <div className="alert alert-success mt-3">
                            Login Successful! Token: {loginResponse.data.token}
                        </div>
                    )}
                </div>
            </div>

            {/* Error Display */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Order Shipment Form */}
            <div className="card">
                <div className="card-header">Create Shipping Order</div>
                <div className="card-body">
                    <form onSubmit={handleOrderSubmit}>
                        <div className="mb-3">
                            <label>Order ID</label>
                            <input
                                type="text"
                                name="orderId"
                                className="form-control"
                                value={orderData.orderId}
                                onChange={handleOrderChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Length (cm)</label>
                            <input
                                type="number"
                                name="length"
                                className="form-control"
                                value={orderData.length}
                                onChange={handleOrderChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Breadth (cm)</label>
                            <input
                                type="number"
                                name="breadth"
                                className="form-control"
                                value={orderData.breadth}
                                onChange={handleOrderChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Height (cm)</label>
                            <input
                                type="number"
                                name="height"
                                className="form-control"
                                value={orderData.height}
                                onChange={handleOrderChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                className="form-control"
                                value={orderData.weight}
                                onChange={handleOrderChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success" disabled={loading}>
                            {loading ? 'Creating Shipment...' : 'Create Shipment'}
                        </button>
                    </form>

                    {orderResponse && (
                        <div className="alert alert-success mt-3">
                            Shipment Created Successfully! {orderResponse.message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShipRocket;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ShipRocketLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Basic email format validation
    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Check if the fields are filled and email is valid
        if (!email || !password) {
            setMessage('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setMessage('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('https://api.camrosteel.com/api/v1/ship-rocket-login', {
                email,
                password
            });

            // Check if the response contains a token
            if (response.data.data && response.data.data.token) {
                setMessage('Login successful');
                // Store the token in sessionStorage instead of localStorage
                sessionStorage.setItem('shiprocketToken', response.data.data.token);

                // Redirect to order shipment page after login
                // navigate('/shiprocket/order');
            } else {
                setMessage('User not found');
            }
        } catch (error) {
            const status = error.response ? error.response.status : null;

            if (status === 403) {
                setMessage('Invalid email or password. Please try again.');
            } else {
                setMessage('An error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">ShipRocket Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Email:</label>
                        <input
                            type="email"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Password:</label>
                        <input
                            type="password"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold ${
                            loading ? 'cursor-not-allowed opacity-50' : 'hover:bg-indigo-700'
                        }`}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    {message && <div className="mt-4 text-center text-red-700">{message}</div>}
                </form>
            </div>
        </div>
    );
};

export default ShipRocketLogin;

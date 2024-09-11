import React, { useState } from 'react';
import axios from 'axios';

const MakeOrderReadyToShip = ({ orderId }) => {
    const [length, setLength] = useState('');
    const [breadth, setBreadth] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleShipOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const token = localStorage.getItem('shiprocketToken');

        try {
            const response = await axios.post(`https://api.camrosteel.com/api/v1/order-ship/${orderId}`, {
                length,
                breadth,
                height,
                weight,
                token
            });

            setMessage('Order successfully marked as ready to ship');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Error marking order as ready to ship');
            }
        }
    };

    return (
        <div className="container">
            <h2>Make Order Ready to Ship</h2>
            <form onSubmit={handleShipOrder}>
                <div className="form-group">
                    <label>Length (cm):</label>
                    <input
                        type="number"
                        className="form-control"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Breadth (cm):</label>
                    <input
                        type="number"
                        className="form-control"
                        value={breadth}
                        onChange={(e) => setBreadth(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Height (cm):</label>
                    <input
                        type="number"
                        className="form-control"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Weight (kg):</label>
                    <input
                        type="number"
                        className="form-control"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Processing...' : 'Mark as Ready to Ship'}
                </button>
                {message && <div className="alert alert-info mt-2">{message}</div>}
            </form>
        </div>
    );
};

export default MakeOrderReadyToShip;

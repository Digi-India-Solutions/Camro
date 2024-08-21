import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllVoucher = () => {
    const [vouchers, setVouchers] = useState([]);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await axios.get(`https://api.camrosteel.com/api/v1/vouchers`);  // Adjust the endpoint as needed
                setVouchers(response.data.data);
            } catch (error) {
                console.error("Error fetching vouchers:", error);
            }
        };

        fetchVouchers();
    }, []);

    const markActive = async (id) => {
        try {
            await axios.put(`https://api.camrosteel.com/api/v1/vouchers/activateVoucher/${id}`);
            // Update the local state to reflect the change
            setVouchers(vouchers.map(voucher => voucher._id === id ? { ...voucher, Active: true } : voucher));
        } catch (error) {
            console.error("Error marking voucher as active:", error);
        }
    };

    const markInActive = async (id) => {
        try {
            await axios.put(`https://api.camrosteel.com/api/v1/vouchers/deactivateVoucher/${id}`);
            // Update the local state to reflect the change
            setVouchers(vouchers.map(voucher => voucher._id === id ? { ...voucher, Active: false } : voucher));
        } catch (error) {
            console.error("Error marking voucher as inactive:", error);
        }
    };

    const markDelete = async (id) => {
        try {
            await axios.delete(`https://api.camrosteel.com/api/v1/vouchers/deleteVoucher/${id}`);
            // Remove the voucher from local state
            setVouchers(vouchers.filter(voucher => voucher._id !== id));
        } catch (error) {
            console.error("Error deleting voucher:", error);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-300">
                <h4 className="text-lg font-semibold text-gray-700">All Vouchers</h4>
                <Link
                    to="/add-voucher"
                    className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 ease-in-out px-4 py-2 rounded-full shadow-md flex items-center"
                >
                    Add New
                </Link>
            </div>

            <section className="mt-4 p-4 bg-white shadow-md rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th scope="col" className="p-4 text-gray-700 font-medium border-b">Coupon Code</th>
                                <th scope="col" className="p-4 text-gray-700 font-medium border-b">Discount Percentage</th>
                                <th scope="col" className="p-4 text-gray-700 font-medium border-b">Status</th>
                                <th scope="col" className="p-4 text-gray-700 font-medium border-b">Mark Active</th>
                                <th scope="col" className="p-4 text-gray-700 font-medium border-b">Mark In-Active</th>
                                <th scope="col" className="p-4 text-gray-700 font-medium border-b">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers && vouchers.map(voucher => (
                                <tr key={voucher._id} className="hover:bg-gray-50">
                                    <td className="p-4 border-b">{voucher.CouponeCode}</td>
                                    <td className="p-4 border-b">{voucher.HowMuchPercentageof}%</td>
                                    <td className="p-4 border-b">{voucher.Active ? 'Yes' : 'No'}</td>
                                    <td className="p-4 border-b">
                                        <button
                                            className="text-white bg-green-500 hover:bg-green-600 py-1 px-3 rounded"
                                            onClick={() => markActive(voucher._id)}
                                        >
                                            Active
                                        </button>
                                    </td>
                                    <td className="p-4 border-b">
                                        <button
                                            className="text-white bg-red-500 hover:bg-red-600 py-1 px-3 rounded"
                                            onClick={() => markInActive(voucher._id)}
                                        >
                                            De-Active
                                        </button>
                                    </td>
                                    <td className="p-4 border-b">
                                        <button
                                            className="text-white bg-red-500 hover:bg-red-600 py-1 px-3 rounded flex items-center"
                                            onClick={() => markDelete(voucher._id)}
                                        >
                                            Delete 
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}

export default AllVoucher;

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CreateVoucher = ({ onCreate }) => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        CouponeCode: '',
        HowMuchPercentageof: '',
        Active: true,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.CouponeCode || !formData.HowMuchPercentageof) {
            toast.error('Please submit all fields');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`https://api.camrosteel.com/api/v1/vouchers/create-vouchers`, formData);  // Adjust the endpoint as needed
            console.log(response.data.data);
            toast.success('Coupon Code Generated Successfully');
            setIsLoading(false);
            navigate('/all-voucher');
        } catch (error) {
            console.error("Error creating voucher:", error);
            toast.error(error.response.data.error || "Internal Server Error");
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-300">
                <h4 className="text-lg font-semibold text-gray-700">Create Voucher</h4>
                <Link
                    to="/all-voucher"
                    className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 ease-in-out px-4 py-2 rounded-full shadow-md flex items-center"
                >
                    Back 
                </Link>
            </div>

            <div className="max-w-2xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
                <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Coupon Code</label>
                        <input
                            type="text"
                            name="CouponeCode"
                            value={formData.CouponeCode}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Discount Percentage</label>
                        <input
                            type="number"
                            name="HowMuchPercentageof"
                            value={formData.HowMuchPercentageof}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="Active"
                            checked={formData.Active}
                            onChange={(e) => setFormData({ ...formData, Active: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="ml-2 text-gray-700">Active</label>
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`inline-block px-6 py-3 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 ${
                                isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {isLoading ? "Please Wait..." : "Create Voucher"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateVoucher;

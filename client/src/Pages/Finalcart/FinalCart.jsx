import React, { useState, useEffect } from 'react'
import './finalcart.css'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
const FinalCart = () => {
    const FinalCart = sessionStorage.getItem('finalCart') || "{}"; // Set default value as "{}" (empty object) if no data found
    const MakeOrder = JSON.parse(FinalCart);
    const token = sessionStorage.getItem("token")
    if (!token) {
        window.location.href = "/login"
    }
    console.log(MakeOrder)
    const [Order, setOrder] = useState({
        cartItems: MakeOrder.cart || [],
        address: [{
            street: "",
            city: "",
            state: "",
            pincode: ""

        }],
        PyamentType: "",
        TotalAmount: MakeOrder.finalPrice || 0
        // TotalAmount: MakeOrder.totalMRP || 0
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'street' || name === 'city' || name === 'state' || name === 'pincode') {
            setOrder(prevOrder => ({
                ...prevOrder,
                address: {
                    ...prevOrder.address,
                    [name]: value
                }
            }));
        } else {
            setOrder(prevOrder => ({
                ...prevOrder,
                [name]: value
            }));
        }
    };


    function generateMerchantTransactionId() {
        const allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const idLength = 25;
        let transactionId = '';

        for (let i = 0; i < idLength; i++) {
            const randomIndex = Math.floor(Math.random() * allowedCharacters.length);
            transactionId += allowedCharacters.charAt(randomIndex);
        }

        return transactionId;
    }

    function MerchenatId() {
        const allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const idLength = 25;
        let MerchenatIds = '';

        for (let i = 0; i < idLength; i++) {
            const randomIndex = Math.floor(Math.random() * allowedCharacters.length);
            MerchenatIds += allowedCharacters.charAt(randomIndex);
        }

        return MerchenatIds;
    }

    const merchantTransactionId = generateMerchantTransactionId();
    const MerchenatIds = MerchenatId();



    const [PayData, setPayData] = useState({
        amount: MakeOrder.finalPrice,
        Merchenat: MerchenatIds,
        transactionId: merchantTransactionId,
    });
    
    const handlePaySubmit = async () => {
        try {
            const response = await axios.post('https://api.camrosteel.com/api/v2/payment-create', PayData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response);

            const redirectUrl = response.data.paydata.data.instrumentResponse.redirectInfo.url;

            if (redirectUrl) {
                window.location.href = redirectUrl;
                // sessionStorage.removeItem('cart')
                // sessionStorage.removeItem('finalCart')

            } else {
                alert('Something went wrong while creating the payment');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const { street, city, state, pincode } = Order.address[0];
        // const emptyFields = [];

        // if (!street.trim()) {
        //     emptyFields.push('Street');
        // }

        // if (!city.trim()) {
        //     emptyFields.push('City');
        // }

        // if (!state.trim()) {
        //     emptyFields.push('State');
        // }

        // if (!pincode.trim()) {
        //     emptyFields.push('Pincode');
        // }

        // if (emptyFields.length > 0) {
        //     const errorMessage = `Address information is incomplete. Please provide the following fields: ${emptyFields.join(', ')}`;
        //     console.error(errorMessage);
        //     toast.error(errorMessage);
        //     return;
        // }

        if (Order.PyamentType === "Online") {
            console.log(Order)

            await handlePaySubmit();

            try {
                const response = await axios.post('https://api.camrosteel.com/api/v1/create-order', Order, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('Order creation response:', response.data);


            } catch (error) {
                console.error('Order creation Error:', error);
            }
        }
        else {
            console.log(Order)
            try {
                const response = await axios.post('https://api.camrosteel.com/api/v1/create-order', Order, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('Order creation response:', response.data);
                sessionStorage.setItem('orderData', JSON.stringify(Order));

                window.location.href = "/order-confirmed"

            } catch (error) {
                console.error('Order creation Error:', error);
                window.location.href = "/order-fail"

            }
        }
        // console.log(Order);

    };
    return (
        <>
            <ToastContainer />

            <section className="bread">
                <div className="container">
                    <nav aria-label="breadcrumb ">
                        <h2>Complete your order</h2>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item para active" aria-current="page">Complete your order</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section className="container finalcart-page mt-5">
                <div className="row">
                    <div className="col-md-6">
                        <div className="">
                            <p className="h5 font-weight-bold">Order Summary</p>
                            <p className="text-muted">Check your items and select a suitable shipping method.</p>
                            <div className="mt-4 p-3 border rounded bg-white">
                                {MakeOrder && MakeOrder.cart && MakeOrder.cart.length > 0 ? (
                                    MakeOrder.cart.map((item, index) => (
                                        <div key={index} className="d-flex flex-column flex-md-row mb-3 p-2 border rounded">
                                            <img className="m-2 h-100 w-100 rounded border" src={item.image} alt="" style={{ maxWidth: "100px", maxHeight: "100px" }} />
                                            <div className="flex-grow-1 d-flex flex-column justify-content-between px-3 py-2">
                                                <span className="product-name font-weight-bold">{item.productName}</span>
                                                <span className='h6 font-weight-bold'>Quantity: {item.quantity}</span>
                                                <span className="text-danger">{item.size}</span>
                                                <p className="h5 font-weight-bold text-danger">Rs {item.price}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No products in the cart</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mt-4 bg-light p-4 rounded">
                            <p className="h5 font-weight-bold">Billing Address</p>
                            <p className="text-muted">Complete your order by providing your Address details.</p>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mt-3">
                                    <label htmlFor="street" className="font-weight-bold">Street</label>
                                    <input onChange={handleChange} type="text" required={true} id="street" value={Order.address.street} name="street" className="form-control" placeholder="Street Address" />
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="city" className="font-weight-bold">City</label>
                                    <input onChange={handleChange} type="text" required={true} id="city" value={Order.address.city} name="city" className="form-control text-uppercase" placeholder="Enter Your City" />
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="state" className="font-weight-bold">State</label>
                                    <input onChange={handleChange} type="text" required={true} id="state" name="state" value={Order.address.state} className="form-control" placeholder="Enter Your State" />
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="pincode" className="font-weight-bold">Pincode</label>
                                    <input onChange={handleChange} type="text" required={true} id="pincode" value={Order.address.pincode} name="pincode" className="form-control" placeholder="Pincode" />
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="paymentType" className="font-weight-bold">Payment Type</label>
                                    <select onChange={handleChange} value={Order.PyamentType} name="PyamentType" className="form-control">
                                        <option value="">Select Payment Method</option>
                                        <option value="COD">COD</option>
                                        <option value="Online">Online</option>
                                    </select>
                                </div>

                                <div className="mt-4 border-top border-bottom py-2">
                                    <div className="d-flex justify-content-between">
                                        <p className="mb-0 font-weight-bold">Subtotal</p>
                                        <p className="mb-0 font-weight-bold h6">Rs {MakeOrder.totalMRP}</p>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <p className="mb-0 font-weight-bold">Shipping</p>
                                        <div>
                                            <span className='text-success h6 mx-2'>Free</span>
                                            <span className="mb-0 font-weight-bold text-muted text-decoration-line-through">Rs {MakeOrder.shippingFee}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 d-flex justify-content-between">
                                    <p className=" h4 font-weight-bold">Total</p>
                                    <p className="h4 font-weight-bold">Rs {MakeOrder.finalPrice}</p>
                                </div>
                                <button type="submit" className="mt-4 w-100 btn btn-danger">Place Order</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .order-summary-img {
                    max-width: 100px;
                    max-height: 100px;
                }
                .finalcart-page .product-name{
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    margin-bottom:0.5rem;
                }
                .finalcart-page .form-control:focus {
                    border-color: var(--color-main);
                    outline: 0;
                    box-shadow: none;
                }
            `}</style>

        </>
    )
}

export default FinalCart
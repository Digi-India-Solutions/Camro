import React from 'react'
import './OrderConfirm.css'
import { Link } from 'react-router-dom'
import order from './7778129.webp'
const OrderConfirm = () => {
    const orderData = JSON.parse(sessionStorage.getItem('orderData'));
    const userData = JSON.parse(sessionStorage.getItem('user'));
    return (
        <>
            
            <section className="order-confirm my-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h3>Your Trusted CAMRO</h3>
                            <div className="flex-row">
                                <div className="icon"><i className="fa-regular fa-circle-check"></i></div>
                                <div className="content">
                                    <strong>Thank You</strong>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-7">
                        <div className="bordered-box">
                                <h4 className='h4'>Order Information</h4>
                                <div className="row table-inner">
                                    <div className="col-md-6">
                                        <div className="strong">Contact Information</div>
                                        <p>{userData.Name || "N/A"}</p>
                                        <p>{userData.Email || "N/A"}</p>
                                        <p>{userData.ContactNumber || "N/A"}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="strong">Billing address</div>
                                        <p>{orderData.address.street}</p>
                                        <p>{orderData.address.city}, {orderData.address.state}</p>
                                        <p>{orderData.address.pincode}</p>
                                    </div>
                                    
                                    <div className="col-md-6">
                                        <div className="strong">Payment method</div>
                                        <p>{orderData.PyamentType}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="strong">Total Amount</div>
                                        <p>₹{orderData.TotalAmount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-5 ">
                            <div className="bordered-box cart-subtotal">
                                <div className="font-semibold h5 mb-2" style={{ color: 'var(--color-red)' }}>Cart Subtotal</div>
                                <ul>
                                    <li className="flex justify-between mb-1"><span>Sub-Total:</span>₹{orderData.TotalAmount}</li>
                                    <li className="flex justify-between mb-1"><span>Shipping Cost:</span>₹0.00</li>
                                    <li className="flex justify-between border-top pt-2 h6 font-bold"><span>TOTAL:</span>₹{orderData.TotalAmount}</li>
                                </ul>
                            </div>

                            <div className="text-center go-to bg-slate-200">
                                <Link to='/'>CONTINUE SHOPPING</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default OrderConfirm
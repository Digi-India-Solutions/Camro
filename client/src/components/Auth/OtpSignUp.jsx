import React, { useEffect, useState } from 'react'
import Loading from '../Loading/Loading'
import { Link, useParams } from 'react-router-dom';
import bg from './bg.jpg'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OtpSignUp = () => {
    const {email} = useParams()
    useEffect(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        email:email,
        otp: ""
    })

    const handleResendOtpSubmit = async (otpevent) =>{
        otpevent.preventDefault()
        try {
            // console.log(formData)
            const response = await axios.post("https://api.camrosteel.com/api/v1/resend-sign-Otp",formData)
            console.log(response.data);
            
        } catch (error) {
            console.log(error)
        }
    }
    const handleOtpSubmit = async (otpevent) =>{
        otpevent.preventDefault()
        try {
            console.log(formData)
            const response = await axios.post("https://api.camrosteel.com/api/v1/Verify-sign-Otp",formData)
            console.log(response.data);
            console.log(response.data.message);
            toast.success(response.data.message);
            
        } catch (error) {
            console.log(error)
            console.log(error.response.data.message)
            toast.error(error.response.data.message);
        }
    }

  return (
    <>
        <ToastContainer />
            {loading ? (
                <Loading />
            ) : (<section className='login-account'>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6 d-none d-md-block p-0 img-relative">
                            <img src={bg} className='' alt="" />

                            <div className="img-absolute ">
                                <h2>Welcome to <br /> Camro </h2>
                                <p></p>
                            </div>
                        </div>
                        <div className="col-md-6 p-0">
                            <div className="form">
                                <h3>Enter OTP</h3>

                                <form >
                                    <input required type="number" name="otp" value={formData.otp} onChange={handleChange} placeholder='Enter OTP' />

                                    <div className="flex">
                                        <div  className="keep">
                                            <Link onClick={handleResendOtpSubmit}><i className="fa-solid fa-arrow-rotate-left"></i>Resend OTP</Link>
                                        </div>
                                        <div className="member">
                                            
                                        </div>
                                    </div>

                                    <input onClick={handleOtpSubmit} type="submit" value="SIGN IN " />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>)}

        </>
  )
}

export default OtpSignUp
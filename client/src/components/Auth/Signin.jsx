import React, { useEffect } from 'react'
import './Login.css'
import bg from './bg.jpg'
import { useState } from 'react'
import axios from 'axios'
import Loading from '../Loading/Loading'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'

const Signin = () => {
    useEffect(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, []);
    const [loading,setLoading] = useState(false)

    const [formData,setFormData] = useState({
        Name:"",
        ContactNumber:"",
        Email:"",
        Password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        
        // Validate Contact Number: Allow only numbers and limit to 10 digits
        if (name === "ContactNumber") {
            // Remove non-numeric characters
            newValue = newValue.replace(/\D/g, '');
            // Limit to 10 digits
            newValue = newValue.slice(0, 10);
    
          
        }
    
        setFormData((prevData) => {
            return { ...prevData, [name]: newValue };
        });
 
    };
    
    const handleSubmit= async (event) =>{
        setLoading(true)
        event.preventDefault()
        try{
            const response = await axios.post("https://api.camrosteel.com/api/v1/Register",formData)
            console.log(response.data);
            setLoading(false)
            toast.success('OTP Send Successfully !!')
            window.location.href=`/sign-up/confirm-account/${formData.Email}`
        }
        catch(err){
            // console.log(err.response.data.message);
            setLoading(false)
            toast.error(err.response.data.message)

        }finally{

            setLoading(false)
        }
            
        
    }

    

  return (
    <>
    <ToastContainer />
        {loading ? (
        <Loading/>
    ) : ( <section className='login-account'>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6 d-none d-md-block p-0 img-relative">
                        <img src={bg} className=''  alt="" />

                        <div className="img-absolute">
                            <h2>Welcome to <br /> Camro </h2>
                            <p></p>
                        </div>
                    </div>
                    <div className="col-md-6 p-0">
                        <div className="form">
                            <h3>Sign Up Account </h3>

                            <form>

                                <input required type="text" name="Name" onChange={handleChange} value={formData.Name} placeholder='Name' />
                                <input required type="number" name="ContactNumber" onChange={handleChange} value={formData.ContactNumber} placeholder='Mobile Number' />
                                <input required type="email" name="Email" onChange={handleChange} value={formData.Email} placeholder='Email Id' />
                                <input required type="password" name="Password" value={formData.Password} onChange={handleChange} placeholder='Password' />

                                <div className="flex">
                                    <div className="keep">
                                        <i className="fa-solid fa-check"></i> Keep me signed in
                                    </div>
                                    <div className="member">
                                        <Link to="/login">Already a member?</Link>
                                    </div>
                                </div>

                                <input onClick={handleSubmit} type="submit" value="SIGN IN " />
                                                                
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>)}
    </>
  )
}

export default Signin
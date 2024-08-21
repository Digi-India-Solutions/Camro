import React, { useEffect } from 'react'
import './ContactPage.css'
import { Link } from 'react-router-dom'

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
  }, []);

  return (
    <>
      <section className="bread">
        <div className="container">
          <nav aria-label="breadcrumb ">
            <h2>Contact Us</h2>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Contact Us</li>
            </ol>
          </nav>
        </div>
      </section>
      <section id="contact" className="bg-light">

        <h2 className='text-center h1'>Get In Touch With Us </h2>

        <div className="container py-5 my-5">
          <div className="row">
            <div className="col-md-6">
              <div className="contact-info">
                <p><i>Have questions or feedback? Feel free to reach out to us.</i></p>
                <ul className="list-unstyled">
                  <li> Email: <a href="mailto:sale.camrosteel@gmail.com" target="_blank">sale.camrosteel@gmail.com</a></li>
                  <li> Phone: <a href="tel:+918595722922">+91-8595722922</a></li>
                  <li> Address: <a href="javascript:void(0)">C-60/2, Wazirpur Industrial Area Delhi-110052</a></li>
                </ul>
                <div className="social-icons mb-3">
                  <a href="https://www.facebook.com/CamroSteels?mibextid=ZbWKwL" target="_blank" ><i className="fab fa-facebook-f"></i></a>
                  <a href="https://youtube.com/@utensil_camrosteel?si=Gym2MWKq5WQLtGj8" target="_blank" ><i className="fa-brands fa-youtube"></i></a>
                  <a href="https://www.instagram.com/camrosteel?igsh=NmtrZGY3Zms2b2N6" target="_blank" ><i className="fab fa-instagram"></i></a>
                  <a href="https://api.whatsapp.com/send?phone=918595722922" target="_blank" ><i className="fab fa-whatsapp"></i></a>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="contact-form">
                <form action="https://formsubmit.co/sale.camrosteel@gmail.com" method="POST">
                  <div className="form-group">
                    <input type="text" name="Name" id="name" placeholder="Your Name" required />
                  </div>
                  <div className="form-group">
                    <input type="email" name="Email" id="email" placeholder="Your Email" required />
                  </div>
                  <div className="form-group">
                    <textarea id="message" name="Message" rows="5" placeholder="Your Message" required></textarea>
                  </div>
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_next" value="https://camrosteel.com/contact-us" />
                  <input type="hidden" name="_template" value="table" />
                  <button type="submit" className="btn btn-primary">Send Message</button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

export default ContactPage
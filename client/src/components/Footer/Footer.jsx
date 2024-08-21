import React from 'react'
import './Footer.css'
import logo from '../../Assets/newlogo.png'
import { Link } from 'react-router-dom'

import ce from './ce.png';
import fda from './fda.png';
import gmp from './gmp.png';
import iso_2015 from './iso-2015.png';
import iso_45001 from './iso-45001.png'

// Import country images
import uae from './uae.png';
import uk from './uk.png';
import nepal from './nepal.png';
import bhutan from './bhutan.png';

const Footer = () => {

  const certificates = [
    {
      certificateImage: ce,
    },
    {
      certificateImage: fda,
    },
    {
      certificateImage: gmp,
    },
    {
      certificateImage: iso_2015,
    },
    {
      certificateImage: iso_45001,
    }
  ];

  // Create the countries array with image and name assignments
  const countries = [
    {
      countryImg: uae,
      countryName: 'U.A.E'
    },
    {
      countryImg: uk,
      countryName: 'U.K'
    },
    {
      countryImg: nepal,
      countryName: 'Nepal'
    },
    {
      countryImg: bhutan,
      countryName: 'Bhutan'
    }
  ];

  return (
    <>

      <div className="side-icons">
        <div className="sin"><a href="https://www.instagram.com/camrosteel?igsh=NmtrZGY3Zms2b2N6" target="_blank" className="icon insta"><i className="fa-brands fa-instagram"></i></a></div>
        <div className="sin"><a href="https://www.facebook.com/CamroSteels?mibextid=ZbWKwL" target="_blank" className="icon facebook"><i className="fa-brands fa-square-facebook"></i></a></div>
        <div className="sin"><a href="https://youtube.com/@utensil_camrosteel?si=Gym2MWKq5WQLtGj8" target="_blank" className="icon youtube"><i className="fa-brands fa-youtube"></i></a></div>
        <div className="sin what"><a href="https://api.whatsapp.com/send?phone=918595722922" target="_blank" className="icon whatsapp"><i className="fa-brands fa-whatsapp"></i></a></div>
      </div>

      <section className="upper-foot my-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">

              <h5>Our Certifications</h5>
              <div className="imgs">
                {certificates && certificates.map((item, index) => (
                  <img key={index} src={item.certificateImage} alt="certificate" />
                ))}
              </div>

            </div>
            <div className="col-md-6 end">

              <h5>Also Avilable In</h5>
              <div className="imgs">
                {countries && countries.map((county, couIndex) => (
                  <div key={couIndex} className='text-center'>
                    <img  src={county.countryImg} alt="certificate" />
                    {/* <h6 className='pt-2'>{county.countryName}</h6> */}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="row">
            <div className="col-md-3 ">
              <div className="logo"><img loading="lazy" decoding="async" src={logo} alt="logo" /></div>
              <p>
                <strong>Address :</strong>
                <a href="javascript:void(0)">C-60/2, Wazirpur Industrial Area Delhi-110052</a>
              </p>
              <p>
                <strong>Contact Us :</strong>
                <a href="tel:+918595722922 ">+91-8595722922</a>

              </p>
              <p> <strong>Email :</strong>  <a href='mailto:sale.camrosteel@gmail.com'>sale.camrosteel@gmail.com</a></p>

            </div>
            <div className="col-md-3">
              <div className="head">Quick Links</div>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/categories">Our Categories</Link></li>
                <li><Link to="/about-us">About us</Link></li>
                <li><Link to="/faqs">FAQ's</Link></li>
                <li><Link to="/contact-us">Contact Us</Link></li>

              </ul>
            </div>
            <div className="col-md-3">
              <div className="head">Follow us </div>
              <div className='flex mr-2'>
                <a target="_blank" href="https://www.instagram.com/camrosteel?igsh=NmtrZGY3Zms2b2N6" className="icon"><i className="fa-brands fa-instagram"></i></a>
                <a target="_blank" href="https://www.facebook.com/CamroSteels?mibextid=ZbWKwL" className="icon"><i className="fa-brands fa-square-facebook"></i></a>
                <a target="_blank" href="https://youtube.com/@utensil_camrosteel?si=Gym2MWKq5WQLtGj8" className="icon"><i className="fa-brands fa-youtube"></i></a>
                <a target="_blank" href="https://api.whatsapp.com/send?phone=918595722922" className="icon"><i className="fa-brands fa-whatsapp"></i></a>
              </div>

            </div>
            <div className="col-md-3">
              <div className="head">Policy</div>
              <ul>
                <li><Link to="/term-and-condition-policy">Terms & Condition</Link></li>
                <li><Link to="/shipping-policy">Shipping & Delivery</Link></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/return-and-refund-policy">Return & Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="col-12 text-center py-2">
            <div className="copyright">
              <p>© 2024, CAMRO - <Link to="https://www.digiindiasolutions.com/" target="_blank">DIGI INDIA SOLUTIONS</Link></p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
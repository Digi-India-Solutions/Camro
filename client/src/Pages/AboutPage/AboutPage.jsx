import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './AboutPage.css'
import MetaTag from '../../components/Meta/MetaTag';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
  }, []);
  return (
    <>
    <MetaTag
        title="About Us - Camrosteel"
        description="Welcome to CAMRO Products, one of the fastest growing manufacturers of stainless steel kitchenware and cookware. Discover our commitment to quality, innovation, and customer satisfaction."
        keyword="CAMRO Products, stainless steel kitchenware, cookware manufacturer, quality kitchen products"
      />
      <section className="bread mb-5">
        <div className="container">
          <nav aria-label="breadcrumb">
            <h2>About Us</h2>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">About Us</li>
            </ol>
          </nav>
        </div>
      </section>

      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4 text-center">Welcome to CAMRO Products</h1>
            <p className="custom-paragraph">
              Thank you for your interest in CAMRO Products. As you know, we are one of the <span className="highlight">fastest growing</span> manufacturers of stainless steel kitchenware and a full range of cookware.
            </p>
            <p className="custom-paragraph">
              CAMRO's pioneering spirit has been showcased in its wide variety of products specially designed with over <span className="highlight">15 years of experience</span> in the cookware industry and complete production of finished goods with a present setup spanning a total area of <span className="highlight">40,000 square feet</span>.
            </p>
            <p className="custom-paragraph">
              CAMRO's quality story begins with choosing the highest quality raw materials and combining them with the best handcrafting and automation. Nowadays, <span className="highlight">technology and design</span> are the most vital aspects of manufacturing the most up-to-date, long-lasting, design-oriented, and ergonomic products. In our desire to make the finest product, our designers and engineers examine every detail of knowledge gained through the years, along with our passion for trademark excellence.
            </p>
            <p className="custom-paragraph">
              Here, there is a genuine passion in everything we touch, the way we concentrate on the smallest details, and our focus on handcrafted quality and solutions. This unbridled commitment to quality makes our products truly special. We are dedicated to bringing you an <span className="highlight">exceptional experience</span> and providing value-added solutions that not only address your kitchen and gifting needs but go beyond your expectations. As a result, the unique design of CAMRO products indicates perfect usage with customer satisfaction.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutPage
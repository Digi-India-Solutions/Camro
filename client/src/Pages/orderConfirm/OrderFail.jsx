import React from 'react';
import Fail from './5576278.webp'
import { Link } from 'react-router-dom';
const OrderFailPage = () => {
  return (
    <>
    
    <section className="fail-order mt-3">
      <div className="container">
        <div className="row">
          <div className="col-md-6  mx-auto">
            <div className="container py-5 d-flex flex-column justify-content-center align-items-center min-vh-60 bg-light">
              <h1 className="text-danger font-weight-bold mb-4">Order Failed</h1>
              <p className="text-lg text-center text-muted mb-8">Sorry, your order could not be processed at this time.</p>
              <img src={Fail} alt="Order Fail" className="w-50 h-auto mb-8" />
              <Link to="/" className="text-primary h5">Return to Homepage</Link>
            </div>

          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default OrderFailPage;

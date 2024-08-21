import React from 'react'
import error from "./404.png"
import { Link } from 'react-router-dom'
import MetaTag from '../../components/Meta/MetaTag'

const ErrorPage = () => {
    return (
        <>
        <MetaTag
                title="404 - Not Found - Camrosteel"
                description="Sorry, the page you are looking for could not be found. Explore Camrosteel for top-quality kitchenware and cookware."
                keyword="404, Not Found, Camrosteel, kitchenware, cookware"
            />
            <section className="min-vh-100 d-flex align-items-center bg-gray-100">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 text-center">
                            <h1 className="text-danger font-weight-bold mb-4">404 - Not Found</h1>
                            <p className="text-lg text-muted mb-5">Sorry, the page you are looking for could not be found.</p>
                            <img src={error} alt="404 Error" className="w-50 img-fluid mb-5" />
                            <Link to="/"  className="h4 text-primary d-block">Return to Homepage</Link>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default ErrorPage
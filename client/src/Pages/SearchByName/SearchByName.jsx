import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import NoImage from './no-product-8316266-6632286.webp'
const SearchByName = () => {

    const { name } = useParams()
    const [productData, setProductData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const handleData = async () => {
        try {

            const response = await axios.get(`https://api.camrosteel.com/api/v1/search?searchTerm=${name}&currentPage=${currentPage}`);
            console.log(response.data);
            setProductData(response.data.data)
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleData()
    }, [currentPage, name])
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    return (
        <>
            <section className="bread">
                <div className="container">
                    <nav aria-label="breadcrumb ">
                        <h2>Search By {name}</h2>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/categories">Categories</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{name}</li>
                        </ol>
                    </nav>
                </div>
            </section>


            <section className="container mt-5">
                <div className="row">
                    <div className="grid-4">
                        {productData.length > 0 ? (
                            productData.map((item, index) => (
                                <div className="singleProduct" key={index}>
                                    <Link to={`/Products/${item.productName}/${item._id}`}>
                                        <div className="img">
                                            <img
                                                loading="lazy"
                                                decoding="async"
                                                src={item.img}
                                                onError={(e) => { e.target.src = "https://i.ibb.co/pPwsHpx/no-image-icon-23494.png" }}
                                                className="front-img"
                                                alt={item.productName}
                                            />
                                            <img
                                                loading="lazy"
                                                decoding="async"
                                                src={item.img}
                                                onError={(e) => { e.target.src = "https://i.ibb.co/pPwsHpx/no-image-icon-23494.png" }}
                                                className="back-img"
                                                alt={item.productName}
                                            />
                                            <span className={`property ${item.property === "Top Selling" ? 'topSelling' : ''} ${item.property === "Trending" ? 'topSelling' : ''} ${item.property === "New Arrival" ? 'bestseller' : ''} ${item.property === "Hot Product" ? 'hotProduct' : ''} ${item.property === "" ? 'p-0' : ''}`}>{item.property}</span>
                                        </div>
                                        <div className="pro-content">
                                            <div className="product-name">{item.productName}</div>
                                            <div className="mrp">
                                                {item.sizes.length > 0 && (
                                                    <div className="mrp">
                                                        <div className="cut-price">MRP: ₹{item.sizes[0].originalPrice}</div>
                                                        <div className="original-price">OFFER PRICE: ₹{item.sizes[0].discoPrice}</div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="addToCart">
                                                <div>Add To Cart <i className="fa-solid fa-bag-shopping"></i></div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (

                            <div className='d-flex position-relative align-items-center justify-content-center w-100 text-center mx-auto'>
                                <img style={{width:'100%'}}  src={NoImage} alt='' />
                            </div>
                        )}
                    </div>

                </div>
                <div className="pagination flex items-center justify-center mt-4">
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="mr-2 px-3 py-1 btn btn-danger disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed">
                        Previous
                    </button>
                    <span className="text-danger text-lg font-weight-bold mx-4">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="ml-2 px-3 py-1 btn btn-danger disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed">
                        Next
                    </button>

                </div>

            </section>
        </>
    )
}

export default SearchByName
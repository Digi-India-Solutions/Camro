import React, { useEffect, useRef, useState } from 'react'
import './SingleProductPage.css'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Subhead from '../../components/Subhead/Subhead';
import MetaTag from '../../components/Meta/MetaTag';
const SingleProductPage = () => {
    const { id } = useParams()
    console.log(id)
    const [singleData, setData] = useState([]);
    const [info, setInfo] = useState("");
    const [sizes, setSize] = useState([]);
    const [images, setImages] = useState()
    const [num, setNum] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [active, setActive] = useState(null);

    const [filterProductData, setFilterProductData] = useState([])

    const handleActiveClick = (size) => {
        setActive(size);
        // console.log(size)
    }

    const handleIncreaseNumber = () => {
        if (num >= 8) {
            setNum(num)
        }
        else {
            setNum(num + 1);
        }

    }
    const handleDecreaseNumber = () => {
        if (num == 1) {
            setNum(num)
        }
        else {
            setNum(num - 1);
        }
    }


    const handleProductData = async () => {
        try {
            const response = await axios.post(`https://api.camrosteel.com/api/v1/single-product/${id}`)
            console.log(response.data.data)

            setInfo(response.data.data.addInfo)
            setSize(response.data.data.sizes)


            setData(response.data.data)

            if (response.data.data.sizes.length > 0) {
                setActive(response.data.data.sizes[0]);
            }
            handleFilterData()
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddToCart = () => {
        console.log("object")
        if (active === null || num <= 0) {
            toast.error('Select Size and Quantity is Greater Than Zero');
        } else {
            const selectedSize = active.size;
            const selectedQuantity = num;
            const selectedPrice = active.discoPrice;
            const productName = singleData.productName;
            const productId = singleData._id;
            const image = singleData.img; // Assuming you have an array of images and you want to save the first one

            // Construct product details object
            const productDetails = {
                id: productId,
                name: productName,
                size: selectedSize,
                quantity: selectedQuantity,
                price: selectedPrice,
                img: image
            };

            // Retrieve existing cart items from sessionStorage
            const cartItems = JSON.parse(sessionStorage.getItem('cart')) || [];

            // Check if the product with the same ID and size already exists in the cart
            const existingProductIndex = cartItems.findIndex(item => item.id === productId && item.size === selectedSize);

            if (existingProductIndex !== -1) {
                // If the product already exists, update its quantity

                cartItems[existingProductIndex].quantity += selectedQuantity;
                console.log("i am hit")
            } else {
                // If the product doesn't exist, add it to the cart
                cartItems.push(productDetails);
                console.log("i am hit second")

            }

            // Store the updated cart items back in sessionStorage
            sessionStorage.setItem('cart', JSON.stringify(cartItems));

            // Optionally, you can dispatch an action to update the cart state in Redux
            // dispatch(addToCart(productDetails));

            // Show a success message
            toast.success('Product added to cart');
        }
    };

    const handleFilterData = async () => {
        try {
            const response = await axios.get("https://api.camrosteel.com/api/v1/all-product");
            console.log(response.data.data);
            const productss = response.data.data
            const filterProduct = productss.filter((it) => it.Category === singleData.Category)
            setFilterProductData(filterProduct)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        handleProductData();
    }, [id]);
    useEffect(() => {
        handleFilterData();
    }, [singleData])


    const [slideImage, setSlideImage] = useState(singleData?.img);

    const changeImage = (newImage) => {
        setSlideImage(newImage);
    };

    if (!singleData) {
        return <div>Loading...</div>; // or a loader component while data is fetched
    }


    return (
        <>
        {singleData && (
                <MetaTag
                    title={`${singleData.productName} - CAMRO Products`}
                    description={`Explore ${singleData.productName} from CAMRO Products. Find details, pricing, and more. Shop now!`}
                    keyword={`CAMRO Products, ${singleData.productName}, kitchenware, cookware`}
                />
            )}

            <ToastContainer />
            <section className="bread">
                <div className="container">
                    <nav aria-label="breadcrumb ">
                        <h2>{singleData.Category}</h2>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to={`/ProductBy-Category/${singleData.Category}`}>{singleData.Category}</Link></li>
                            <li className="breadcrumb-item para active" aria-current="page">{singleData.productName}</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section className="container mt-5 product-page">
                <div className="row">
                    <div className="col-md-5 mb-4">
                        <div className="big-img">
                            <img
                                src={slideImage ? slideImage : singleData?.img}
                                onError={(e) => {
                                    e.target.src = 'https://i.ibb.co/pPwsHpx/no-image-icon-23494.png';
                                }}
                                alt={singleData.productName}
                                loading="lazy"
                                className="imgd"
                                decoding="async"
                            />
                        </div>
                        <div className='small-img mt-2'>
                            <img
                                src={singleData?.img}
                                onError={(e) => { e.target.src = "https://i.ibb.co/pPwsHpx/no-image-icon-23494.png" }}
                                alt={singleData.productName}
                                loading='lazy'
                                className='imgd cursor-pointer'
                                decoding='async'
                                onMouseOver={() => changeImage(singleData?.img)}
                            />
                            <img
                                src={singleData?.secondImg}
                                onError={(e) => { e.target.src = "https://i.ibb.co/pPwsHpx/no-image-icon-23494.png" }}
                                alt={singleData.productName}
                                loading='lazy'
                                className='imgd cursor-pointer'
                                decoding='async'
                                onMouseOver={() => changeImage(singleData?.secondImg)}
                            />
                            <img
                                src={singleData?.thirdImage}
                                onError={(e) => { e.target.src = "https://i.ibb.co/pPwsHpx/no-image-icon-23494.png" }}
                                alt={singleData.productName}
                                loading='lazy'
                                className='imgd cursor-pointer'
                                decoding='async'
                                onMouseOver={() => changeImage(singleData?.thirdImage)}
                            />
                            <img
                                src={singleData?.fourthImage}
                                onError={(e) => { e.target.src = "https://i.ibb.co/pPwsHpx/no-image-icon-23494.png" }}
                                alt={singleData.productName}
                                loading='lazy'
                                className='imgd cursor-pointer'
                                decoding='async'
                                onMouseOver={() => changeImage(singleData?.fourthImage)}
                            />
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="details">
                            <h2>{singleData.productName}</h2>

                            <div className="line-det">
                                <div className="pricing ">
                                    <h5>Offer Price :</h5>
                                    <div className="actual-price">₹ {active ? (active.discoPrice) : (singleData.discoPrice)} </div>
                                    <div className="cut-price">₹{active ? (active.originalPrice) : (singleData.originalPrice)}</div>
                                </div>


                                <div className="size-btns">
                                    {sizes.map((proSize, index) => (
                                        <button key={index} className={`${active === proSize ? 'active' : ''}`} onClick={() => { handleActiveClick(proSize) }} >{proSize.size}</button>
                                    ))}
                                </div>

                                <div className="btns">
                                    <div className="quantity-input">
                                        <i className="fa-solid fa-chevron-down" id="minus" onClick={handleDecreaseNumber}></i>
                                        <input type="number" min="1" value={num} max="8" readonly name="quantity" id="quantity" />
                                        <i className="fa-solid fa-chevron-up" id="plus" onClick={handleIncreaseNumber}></i>
                                    </div>
                                    <div className="addToCart">
                                        <button onClick={handleAddToCart}>Add To Cart</button>
                                    </div>

                                </div>

                                <p className="desc my-2 ">{singleData.Desc}</p>

                                <table className='table table-bordered'>
                                    <tbody>
                                        <tr>
                                            <th scope="row">Brand : </th>
                                            <td>{singleData.vendor ? singleData.vendor : "Camro Steels"}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">SKU : </th>
                                            <td>{singleData.sku}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Availablity : </th>
                                            <td>{singleData.avilable ? 'Available' : 'Not Avilable'} in Stock</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Product Type : </th>
                                            <td>{singleData.productType}</td>
                                        </tr>

                                    </tbody>
                                </table>

                            </div>

                        </div>
                    </div>
                </div>

            </section>

            <Subhead title="Related Products" para="" />
            {/* filterProductData */}
            <section>
                <div className="container">
                    <div className="grid-4">
                        {filterProductData && filterProductData.map((itemfil, indexfil) => (
                            <div className="singleProduct" key={indexfil}>
                                <Link to={`/Products/${itemfil.productName}/${itemfil._id}`}>
                                    <div className="img">
                                        <img
                                            loading="lazy"
                                            decoding="async"
                                            src={itemfil.img}
                                            onError={(e) => { e.target.src = "https://i.ibb.co/pPwsHpx/no-image-icon-23494.png" }}
                                            className="front-img"
                                            alt={itemfil.productName}
                                        />
                                        <img
                                            loading="lazy"
                                            decoding="async"
                                            src={itemfil.img}
                                            onError={(e) => { e.target.src = "https://i.ibb.co/pPwsHpx/no-image-icon-23494.png" }}
                                            className="back-img"
                                            alt={itemfil.productName}
                                        />
                                        <span className={`property ${itemfil.property === "Top Selling" ? 'topSelling' : ''} ${itemfil.property === "Trending" ? 'topSelling' : ''} ${itemfil.property === "New Arrival" ? 'bestseller' : ''} ${itemfil.property === "Hot Product" ? 'hotProduct' : ''} ${itemfil.property === "" ? 'p-0' : ''}`}>{itemfil.property}</span>
                                    </div>
                                    <div className="pro-content">
                                        <div className="product-name">{itemfil.productName}</div>
                                        <div className="mrp">
                                            {itemfil.sizes.length > 0 && (
                                                <div className="mrp">
                                                    <div className="cut-price">MRP: ₹{itemfil.sizes[0].originalPrice}</div>
                                                    <div className="original-price">OFFER PRICE: ₹{itemfil.sizes[0].discoPrice}</div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="addToCart">
                                            <div>Add To Cart <i className="fa-solid fa-bag-shopping"></i></div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* {filterProductData.length > 3  (
                        <div className="view-more">
                            <Link to={`/ProductBy-Category/${filterProductData[0].Category}`} >View All Products <i className="fa-solid fa-arrow-right"></i> </Link>
                        </div>
                    )} */}

                </div>
            </section>

        </>
    )
}

export default SingleProductPage
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';

const TrendingProd = () => {
  const [productData, setProductData] = useState([])
  const [showAll, setShowAll] = useState(false);
  const handleData = async () => {
    try {
      const response = await axios.get("https://api.camrosteel.com/api/v1/all-product");
      // console.log(response.data.data);
      const productss = response.data.data
      const filterProduct = productss.filter((item) => item.property === "Trending")
      setProductData(filterProduct)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleData()
  }, [])
  return (
    <>
      <section className="new-arrival">
        <div className="container">
          <div className="grid-4">
            {productData && productData.slice(0, showAll ? productData.length : 8).map((item, index) => (
              <div className="singleProduct" key={index}>
                <Link to={`/Products/${item.productName}/${item._id}`}>
                  <div className="img">
                    <img
                        loading="lazy"
                        decoding="async"
                        src={item.secondImg}
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
            ))}
          </div>
          {productData.length > 8 && !showAll && (
            <div className="view-more">
              <Link onClick={() => setShowAll(true)} >View All Products <i className="fa-solid fa-arrow-right"></i> </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default TrendingProd
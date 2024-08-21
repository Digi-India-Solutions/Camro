import React from 'react'
import Carasol from '../../components/Carasol/Carasol'
import Subhead from '../../components/Subhead/Subhead'
import NewArrival from '../../components/FilterProduct/NewArrival'
import TrendingProduct from '../../components/FilterProduct/TrendingProd'
import HotProduct from '../../components/FilterProduct/HotProduct'
import TopSelling from '../../components/FilterProduct/TopSelling'
import CategoryPro from '../../components/CategoryPro/CategoryPro'

import bn1 from './bn1.jpg'
import Testimonial from '../../components/Testimonial/Testimonial'
import Faq from '../../components/Faq/Faq'
import MetaTag from '../../components/Meta/MetaTag'

const HomePage = () => {
  return (
    <>
      <MetaTag 
        title={'Top Kitchenware Appliances Manufacturer in India - Camrosteel'}
        description={'Discover top-tier Kitchenware Appliances from expert manufacturer! Enhance your cooking experience with our reliable and innovative products. Shop now!'}
        keyword={'CAMRO Products, kitchenware, cookware, stainless steel, innovative kitchen appliances, quality kitchenware'} 
      />
      <Carasol />
      <Subhead title="Our Categories" para="" />
      <CategoryPro />
      <Subhead title="Top Selling" para="Best of Health & Convenience." />
      <TopSelling />
      <section className="photu">
        <div className="container-fluid">
          <img src={bn1} alt="" />
        </div>
      </section>
      <Subhead title="New Arrivals" para="Best of Health & Convenience." />
      <NewArrival />
      <Subhead title="Trending Products" para="Discover what's hot in every home!" />
      <TrendingProduct />
      <Subhead title="Hot Products" para="Best of Health & Convenience." />
      <HotProduct />

      <Faq />
      <Testimonial />
    </>
  )
}

export default HomePage
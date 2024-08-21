import React from 'react';
import Helmet from 'react-helmet';

const MetaTag = ({ 
    title = 'Top Kitchenware Appliances Manufacturer in India - Camrosteel', 
    description = 'Discover top-tier Kitchenware Appliances from expert manufacturer! Enhance your cooking experience with our reliable and innovative products. Shop now!', 
    keyword = 'CAMRO Products, kitchenware, cookware, stainless steel, innovative kitchen appliances, quality kitchenware' 
}) => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keyword" content={keyword} />
      </Helmet>
    </>
  );
};

export default MetaTag;

import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CategoryPro from '../../components/CategoryPro/CategoryPro'
import MetaTag from '../../components/Meta/MetaTag';
const CategoryPage = () => {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, []);

    return (
        <>
            <MetaTag
                title={'Our Categories - CAMRO Products'}
                description={'Explore the wide range of kitchenware categories offered by CAMRO Products, including Triply Pressure Cookers, Stainless Steel Pressure Cookers, Non-Stick Cookware, and more.'}
                keyword={'CAMRO Products, kitchenware categories, Triply Pressure Cookers, Stainless Steel Pressure Cookers, Triply Cookware Series, Induction Bottom Series, Non-Stick Cookware, Triply Honey Comb Cookware, Heavy Round Bottom, Gift Sets, Repairing Kit'} 
            />
            <section className="bread mb-5">
                <div className="container">
                    <nav aria-label="breadcrumb ">
                        <h2>Our Categories</h2>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Categories</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <CategoryPro/>
            
        </>
    )
}

export default CategoryPage
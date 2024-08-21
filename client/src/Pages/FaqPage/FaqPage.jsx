import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import MetaTag from '../../components/Meta/MetaTag';

const FaqPage = () => {

    const faqs = [
        {
            question: "What is the general return policy at The Camro Steel?",
            answer: "It is a 7-day return policy. We offer you complete peace of mind while ordering at The Camro Steel – you can return all items within 7 days of receipt of goods. Please ensure that the product is unused & the tags, boxes / other packaging is intact. We care about your safety and hygiene, and we're happy to accept returns on unused cookware products. To make sure our products stay clean and safe for everyone, we can only accept items that haven't been used. You have 7 days from delivery to return any unused items. This policy helps keep all our products in perfect condition. We hope you understand and cooperate with us on this. If you have any questions or need more information, our friendly customer service team is ready to help. For pre-paid orders, we will reverse the payment to the source. In case of COD, we process a NEFT payment in the registered name of the customer."
        },
        {
            question: "What should I do if I receive a damaged item, wrong product, or missing units in my order?",
            answer: "If an item is damaged, missing, or incorrect, please send a photo of the outer packaging and products received to our customer care. Reach us at sale.camrosteel@gmail.com or call us on 85957 22922 within 7 days of receipt of the product. We will issue either a full refund or send the correct item in exchange, as per your request."
        },
        {
            question: "Can I cancel the order?",
            answer: "You can cancel an order within 3 hours of placing the order. You can simply refuse to accept the parcel at the time of delivery as orders will not be returned once delivered."
        },
        {
            question: "Will I get a refund if I don't get a replacement/exchange as requested?",
            answer: "Replacements/exchanges are subject to the availability of stock with the seller. If the product is out of stock or a replacement/exchange cannot be issued, a full refund will be provided upon successful pickup of the product at no extra cost."
        }
    ];
    
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);
    return (
        <>
        <MetaTag
                title="Frequently Asked Questions - Camrosteel"
                description="Find answers to frequently asked questions about Camrosteel products. Learn about our materials, warranty, support, and more."
                keyword="Camrosteel, frequently asked questions, kitchenware, cookware, stainless steel"
            />
            <section className="bread mb-5">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <h2>FAQ's</h2>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">FAQ's</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <div className="container faq my-5">
                
                <div className="accordion" id="faqAccordion">
                    
                    {faqs.map((faq, index) => (
                        <div className="accordion-item" key={index}>
                            <h2 className="accordion-header" id={`heading${index}`}>
                                <button
                                    className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse${index}`}
                                    aria-expanded={index === 0 ? 'true' : 'false'}
                                    aria-controls={`collapse${index}`}
                                >
                                    {faq.question}
                                </button>
                            </h2>
                            <div
                                id={`collapse${index}`}
                                className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                                aria-labelledby={`heading${index}`}
                                data-bs-parent="#faqAccordion"
                            >
                                <div className="accordion-body">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

        </>
    )
}

export default FaqPage
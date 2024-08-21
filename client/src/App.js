import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './Pages/HomePage/HomePage';
import Login from './components/Auth/Login';
import Signin from './components/Auth/Signin';
import ForgetPassword from './components/Auth/ForgetPassword';
import SingleProductPage from './Pages/SingleProductPage/SingleProductPage';
import CategoryPage from './Pages/CategoryPage/CategoryPage';
import CategoryProduct from './Pages/CategoryProduct/CategoryProduct';
import SearchByName from './Pages/SearchByName/SearchByName';
import TermCondition from './Pages/Policy/TermConditions';
import ShippingDelivery from './Pages/Policy/ShippingDelivery';
import PrivcayAndPolicy from './Pages/Policy/PrivcayAndPolicy';
import ReturnAndRefund from './Pages/Policy/ReturnAndRefund';
import ProfilePage from './Pages/Profile/ProfilePage';
import FinalCart from './Pages/Finalcart/FinalCart';
import OrderConfirm from './Pages/orderConfirm/OrderConfirm';
import OrderFailPage from './Pages/orderConfirm/OrderFail';
import ErrorPage from './Pages/ErrorPage/ErrorPage';
import ShopPage from './Pages/ShopPage/ShopPage';
import ContactPage from './Pages/ContactPage/ContactPage';
import OtpSignUp from './components/Auth/OtpSignUp';
import AboutPage from './Pages/AboutPage/AboutPage';
import FaqPage from './Pages/FaqPage/FaqPage';

function App() {
  return (
    <>
      <BrowserRouter>

        <Header/>
        <Routes>
          <Route path='/' element={<HomePage />} />

          {/* ---- Authentication ----  */}
          <Route path='/login' element={<Login />} />
          <Route path='/login/forget-password' element={<ForgetPassword />} />
          <Route path='/sign-up' element={<Signin />} />
          <Route path='/sign-up/confirm-account/:email' element={<OtpSignUp />} />

          <Route path='/Products/:name/:id' element={<SingleProductPage />} />
          <Route path='/ProductBy-Category/:name' element={<CategoryProduct />} />
          <Route path='/categories' element={<CategoryPage />} />
          <Route path='/shop' element={<ShopPage />} />

          <Route path='/search-by/:name' element={<SearchByName />} />

          <Route path='/Make-Order-Complete' element={<FinalCart />} />
          
          <Route path='/order-confirmed' element={<OrderConfirm />} />
          <Route path='/order-Fail' element={<OrderFailPage />} />
          <Route path='/*' element={<ErrorPage />} />

          {/* Policies  Page ---  */}
          <Route path='/term-and-condition-policy' element={<TermCondition />} />
          <Route path='/shipping-Policy' element={<ShippingDelivery />} />
          <Route path='/privacy-policy' element={<PrivcayAndPolicy />} />
          <Route path='/return-and-refund-policy' element={<ReturnAndRefund />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/contact-us' element={<ContactPage />} />

          <Route path='/about-us' element={<AboutPage />} />
          <Route path='/faqs' element={<FaqPage />} />
          
        </Routes>
        <Footer/>
        
      </BrowserRouter>
    </>
  );
}

export default App;

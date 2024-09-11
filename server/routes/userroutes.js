const express = require('express')
const Image = require('../models/AllImages')
const { RegisterUser, LogginUser, LogoutUser, getUserIdbyUser, createContact, getContacts, getAllUser, changePassword, PasswordChangeRequest, ResendOtp, VerifyOtp, verifyOtpForSignIn, ResendSignOtp } = require('../controllers/usercontroller')
const { createProduct, getAllProducts, getOneProduct, updateProduct, deleteProduct, getProductByKeywords, getAllCategoryWithImagesAndNumberOfProducts, getProductsByProductNameOrCategory, ImageUpload, getAllImages } = require('../controllers/productController')
const { protect } = require('../middleware/authmiddlleware')
const { CreateOrder, orderForMe, orderForAdmin, UpdateOrderStatus, getTransactionID, getSingleOrderById, deleteOrderById } = require('../controllers/orderController')
const { createBanner, getllbanner, deleteBanner, markInactiveBanner, getAllActiveBanners, toggleBannerActiveStatus, makeCategories, getAllCategories, deleteCategoryById, makeTags, getTags, deleteTags, createVouchers, editVoucher, deleteVoucher, getVouchers, updateCategories } = require('../controllers/WebpageController')
const router = express.Router()
const multer = require('multer');
const {   CreateMainCategorey,
    UpdateMainCategorey,
    GetAllMainCategorey,
    GetSubCategreyByMainCategorey,
    deleteMainCategorey } = require('../controllers/MainCategory')
const { getAllVouchers, applyVoucher, createVoucher, activateVoucher, deactivateVoucher } = require('../controllers/VoucherController')
const { ShipRocketLogin, MakeOrderReadyToShip } = require('../controllers/Shiprocket')
const cloudinary = require('cloudinary').v2;
// const fs = require('fs');
// const path = require('path');
const storage = multer.memoryStorage()
const multerUploads = multer({ storage }).array('images')
const SingleUpload = multer({ storage }).single('image')
router.post('/Register', RegisterUser)
router.post('/Password-change-request', PasswordChangeRequest)
router.post('/Resend-Otp', ResendOtp)
router.post('/Verify-sign-Otp', verifyOtpForSignIn)
router.post('/resend-sign-Otp', ResendSignOtp)


router.post('/Verify-Otp/:email/:newPassword', VerifyOtp)

router.post('/changePassword', protect, changePassword)

router.post('/Contact', createContact)
router.get('/getContact', getContacts)
router.get('/getAllUser', getAllUser)

router.post('/Login', LogginUser)
router.get('/Logout', protect, LogoutUser)
router.get('/Products/:category', getProductByKeywords)
// router.get('/All-images', getAllImages)
// router.post('/image', upload.single("image"), ImageUpload)

router.post('/create-product', multerUploads, createProduct)
router.get('/all-product', getAllProducts)
router.post('/single-product/:id', getOneProduct)
router.patch('/update-product/:id', multerUploads, updateProduct)
router.delete('/delete-product/:id', deleteProduct)
router.get('/get-Transication-id/:OrderId', getTransactionID);
router.post('/create-order', protect, CreateOrder)
router.get('/my-order', protect, orderForMe)
router.get('/admin-order', orderForAdmin)
router.get('/single-order/:id', getSingleOrderById)

router.delete('/delete-order/:id',deleteOrderById)

router.get('/finduserbyid/:user_id', getUserIdbyUser)
router.get('/getAllCategorey', getAllCategoryWithImagesAndNumberOfProducts)
router.post('/update-order', UpdateOrderStatus)

router.post('/Bannercreate', SingleUpload, createBanner);

// Route for getting all banners
router.get('/Bannerall', getllbanner);
router.get('/All-Active-Banner', getAllActiveBanners);

router.get('/search', getProductsByProductNameOrCategory);
// Route for deleting a banner
router.delete('/Bannerdelete/:id', deleteBanner);

// Route for marking a banner as inactive
router.put('/Banner/inactive/:id', markInactiveBanner);
router.put('/Banner/active/:id', toggleBannerActiveStatus);
// Web Page Controllers ROutes = ==============================================
router.post('/Make-categories', SingleUpload, makeCategories)
router.put('/Update-Categories/:id',SingleUpload,updateCategories)
router.get('/get-categories', getAllCategories)
router.post('/delete-categories/:id', deleteCategoryById)

router.post('/Make-tags', makeTags)
router.get('/get-tags', getTags)
router.post('/delete-tags/:id', deleteTags)
router.post('/Make-vouchers', createVouchers)
router.get('/get-vouchers', getVouchers)
router.post('/edit-vouchers', editVoucher)

router.post('/delete-tags/:id', deleteVoucher)

// Main Category

router.post('/Create-Main-Category', CreateMainCategorey);
router.put('/Update-Main-Category/:id', UpdateMainCategorey);
router.get('/Get-All-Main-Categories', GetAllMainCategorey);
router.get('/Get-Sub-Categories-By-Main-Category/:id', GetSubCategreyByMainCategorey);
router.delete('/Delete-Main-Category/:id', deleteMainCategorey);

//  ======VOUCHERS     =//
router.get('/vouchers', getAllVouchers)
router.post('/apply-vouchers', applyVoucher)
router.post('/vouchers/create-vouchers', createVoucher)
router.put('/vouchers/activateVoucher/:id', activateVoucher)
router.put('/vouchers/deactivateVoucher/:id', deactivateVoucher)
router.delete('/vouchers/deleteVoucher/:id', deleteVoucher)

//====================SHIP-ROCKET  ROUTES=========================//
router.post('/ship-rocket-login', ShipRocketLogin)
router.post('/order-ship/:id', MakeOrderReadyToShip)

module.exports = router 

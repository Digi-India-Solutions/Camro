const Product = require("../models/product.model");
const Image = require('../models/AllImages')
const Category = require('../models/Categorey.model')
const cloudinary = require("cloudinary").v2;
const fs = require('fs').promises;
const path = require('path');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
exports.createProduct = async (req, res) => {
  const files = req.files;
  try {
    // Destructure all fields from req.body as per the schema
    const {
      productName,
      property,
      sizes,
      originalPrice,
      discoPrice,
      vendor,
      sku,
      avilable,
      productType,
      Desc,
      Category,
      addInfo
    } = req.body;

    console.log('Received sizes:', sizes);

    let parsedSizes;
    try {
      // Directly parse the sizes JSON string
      parsedSizes = JSON.parse(sizes);
    } catch (parseError) {
      console.error('Error parsing sizes JSON:', parseError);
      return res.status(400).json({ error: 'Invalid sizes format' });
    }

    const uploadedImages = [];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const tempFilePath = path.join(__dirname, `temp_${file.originalname}`);

      // Write the buffer data to the temporary file
      await fs.writeFile(tempFilePath, file.buffer);

      // Upload the temporary file to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
        folder: 'camro-cookers',
        public_id: file.originalname
      });

      // Push the secure URL of the uploaded image to the array
      uploadedImages.push(uploadResult.secure_url);

      // Remove the temporary file after uploading
      await fs.unlink(tempFilePath);
    }

    // console.log('Uploaded images:', uploadedImages);

    // Create a new product instance
    const newProduct = new Product({
      productName,
      property,
      img: uploadedImages[0],
      secondImg: uploadedImages[1] || uploadedImages[0],
      thirdImage: uploadedImages[2] || uploadedImages[0],
      fourthImage: uploadedImages[3] || uploadedImages[0],// Ensure images is an array of strings
      sizes: parsedSizes, // Included sizes in the product creation
      originalPrice,
      discoPrice,
      vendor,
      sku,
      avilable,
      productType,
      Desc,
      Category,
      addInfo,
    });

    // Save the new product to the database
    await newProduct.save();
    // Respond with the created product
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    const files = req.files;
    console.log("I Am Hit With This Data",req.body)

    let parsedSizes;
    try {
      parsedSizes = JSON.parse(updatedFields.sizes);
    } catch (parseError) {
      console.error('Error parsing sizes JSON:', parseError);
      return res.status(400).json({ error: 'Invalid sizes format' });
    }
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const uploadedImages = [];
    if (files && files.length > 0) {
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const tempFilePath = path.join(__dirname, `temp_${file.originalname}`);

        await fs.writeFile(tempFilePath, file.buffer);

        const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
          folder: 'camro-cookers',
          public_id: file.originalname
        });

        uploadedImages.push(uploadResult.secure_url);
        await fs.unlink(tempFilePath);
      }
    }

    const mergedFields = { ...existingProduct.toObject(), ...updatedFields, sizes: parsedSizes };
    if (uploadedImages.length > 0) {
      if (uploadedImages[0]) mergedFields.img = uploadedImages[0];
      if (uploadedImages[1]) mergedFields.secondImg = uploadedImages[1];
      if (uploadedImages[2]) mergedFields.thirdImage = uploadedImages[2];
      if (uploadedImages[3]) mergedFields.fourthImage = uploadedImages[3];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: mergedFields },
      { new: true }
    );
    console.log("After Updates",updatedProduct)

    return res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {},
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Error",
    });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Products Found",
      });
    }
    return res.status(200).json({
      success: true,
      data: products,
      message: "Products Found",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Error",
    });
  }
};

// Get a single product
exports.getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const productData = await Product.findById(id);

    if (!productData) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: productData,
      message: "Product found",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Error",
    });
  }
};

exports.getProductByKeywords = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(req.params)
    let products = await Product.find({ Category: category });

    // Check if products were found
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for the given keyword' });
    }

    // Send the products as a response
    res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getProductsByProductNameOrCategory = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    const pageSize = 10;
    const currentPage = Number(req.query.currentPage) || 1;

    const searchWords = searchTerm.split(' ');

    const orConditions = searchWords.map(word => ({
      $or: [
        { productName: { $regex: new RegExp(word, 'i') } },
        { category: { $regex: new RegExp(word, 'i') } }
      ]
    }));

    const products = await Product.find({
      $or: orConditions
    })
      .limit(pageSize)
      .skip((currentPage - 1) * pageSize);

    const totalProducts = await Product.countDocuments({
      $or: orConditions
    });

    const totalPages = Math.ceil(totalProducts / pageSize);

    res.status(200).json({
      totalCount: totalProducts,
      totalPages: totalPages,
      currentPage: currentPage,
      pageSize: pageSize,
      data: products
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.getAllCategoryWithImagesAndNumberOfProducts = async (req, res) => {
  try {
    const getAllCategories = await Category.find()
    console.log(getAllCategories)
    res.status(200).json({
      success: true,
      data: getAllCategories
    });
  } catch (error) {
    console.error('Error fetching categories with images and number of products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

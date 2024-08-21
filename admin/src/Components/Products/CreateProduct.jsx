import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const CreateProduct = () => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    property: "",
    vendor: "",
    sizes: [],
    sku: "",
    available: true,
    productType: "",
    Desc: "",
    Category: "",
    addInfo: {
      base: "",
      material: "",
      dishwasherSafe: "",
      packageContent: "",
      warranty: 0,
      certification: "",
    },
    files: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("addInfo.")) {
      const fieldName = name.split(".")[1]; // Extract the field name
      setFormData((prevData) => ({
        ...prevData,
        addInfo: {
          ...prevData.addInfo,
          [fieldName]: value // Update the specific nested property
        }
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index][field] = value;
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const addSize = () => {
    setFormData((prevData) => ({
      ...prevData,
      sizes: [
        ...prevData.sizes,
        {
          id: prevData.sizes.length,
          size: "",
          originalPrice: 0,
          discoPrice: 0,
          discountPercent: 0
        },
      ],
    }));
  };

  const handleDiscountChange = (index, discountPercent) => {
    const originalPrice = formData.sizes[index].originalPrice;
    const discountedPrice = originalPrice - (originalPrice * discountPercent / 100);
    handleSizeChange(index, 'discoPrice', discountedPrice); // Update discounted price
    handleSizeChange(index, 'discountPercent', discountPercent); // Update discountPercent
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));

    setFormData((prevData) => ({
      ...prevData,
      files: files
    }));

    setImagePreviews(previews);
  };

  const [categoriesList, setCategoriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://api.camrosteel.com/api/v1/get-categories');
        setCategoriesList(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('https://api.camrosteel.com/api/v1/get-tags');
        setTags(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const removeSize = (index) => {
    const updatedSizes = formData.sizes.filter((_, idx) => idx !== index);
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key) && key !== 'sizes' && key !== 'files') {
        submitData.append(key, formData[key]);
      }
    }
    submitData.append('sizes', JSON.stringify(formData.sizes));
    formData.files.forEach((file, index) => {
      submitData.append('images', file);
    });
    try {
      const response = await axios.post('https://api.camrosteel.com/api/v1/create-product', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      toast.success("Product Created Successfully");
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Create Product</h2>
      <p>**For Create Banner First upload Images in Upload-Images Tab</p>
      <Link to="/upload" className="text-blue-400 underline">Upload-images</Link>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Information */}
        <div className='flex w-full items-center justify-center gap-2'>
          <div className='w-1/2'>
            <input type="text" required value={formData.productName} onChange={handleChange} name="productName" placeholder="Product Name" className="block w-full border-[1px] p-2 mt-1 rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
          </div>
          <div className='w-1/2'>
            <select
              id="tags"
              name="property"
              required value={formData.property}
              onChange={handleChange}
              className="block w-full border-[1px] p-2 mt-1 rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            >
              <option required value="">Select a tag</option>
              {tags.map(tag => (
                <option key={tag._id} required value={tag.title}>{tag.title}</option>
              ))}
            </select>
          </div>
        </div>
        <div className='flex gap-2'>
          <input type="text" required value={formData.vendor} onChange={handleChange} name="vendor" placeholder="Vendor" className="block w-full border-[1px] p-2 mt-1 rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
          <input type="text" required value={formData.sku} onChange={handleChange} name="sku" placeholder="SKU" className="block w-full border-[1px] p-2 mt-1 rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
        </div>
        {/* <div className='flex gap-2'>
          <input type="text"  value={formData.productType} onChange={handleChange} name="productType" placeholder="Product Type" className="block w-full border-[1px] p-2 mt-1 rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
        </div> */}
        <div className="mb-4">
          {imagePreviews.length > 0 && (
            <div className="image-previews flex gap-2 items-start">
              {imagePreviews.map((src, index) => (
                <img key={index} src={src} alt={`Preview ${index}`} className="w-24 h-24 object-cover mb-2 rounded-md" />
              ))}
            </div>
          )}
        </div>
        {/* Image Upload */}
        <div className='flex gap-2'>
          <div className='w-1/2'>
            <select
              id="Category"
              name="Category"
              required value={formData.Category}
              onChange={handleChange}
              className="block w-full border-[1px] p-2 mt-1 rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            >
              <option required value="">Select a Category</option>
              {categoriesList.map(tag => (
                <option key={tag._id} required value={tag.title}>{tag.title}</option>
              ))}
            </select>
          </div>
          <div className='w-1/2'>
            <input type="file" name="images" multiple className="block w-full border-[1px] p-2 mt-1 rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" onChange={handleFileChange} />
          </div>
        </div>
        {/* Additional Information */}
        <div className='flex gap-2'>
          <input type="text" required value={formData.addInfo.base} onChange={handleChange} name="addInfo.base" placeholder="Base" className="block w-full mt-1 rounded-md border-gray-900 border-[1px] p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
          <input type="text" required value={formData.addInfo.material} onChange={handleChange} name="addInfo.material" placeholder="Material" className="block w-full mt-1 rounded-md border-gray-900 border-[1px] p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
          <input type="text" required value={formData.addInfo.dishwasherSafe} onChange={handleChange} name="addInfo.dishwasherSafe" placeholder="Dishwasher Safe" className="block w-full mt-1 rounded-md border-gray-900 border-[1px] p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
        </div>
        <div className='flex gap-2'>
          <input type="text" required value={formData.addInfo.packageContent} onChange={handleChange} name="addInfo.packageContent" placeholder="Package Content" className="block w-full mt-1 rounded-md border-gray-900 border-[1px] p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
          <input type="number" required value={formData.addInfo.warranty} onChange={handleChange} name="addInfo.warranty" placeholder="Warranty" className="block w-full mt-1 rounded-md border-gray-900 border-[1px] p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
          <input type="text" required value={formData.addInfo.certification} onChange={handleChange} name="addInfo.certification" placeholder="Certification" className="block w-full mt-1 rounded-md border-gray-900 border-[1px] p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
        </div>
        {
          formData.sizes.map((size, index) => (
            <div key={index} className="flex w-full space-x-4 items-center">
              <div className='w-1/2'>
                <label htmlFor={`size_${index}`}>Size:</label>
                <input type="text" id={`size_${index}`} required value={size.size} onChange={(e) => handleSizeChange(index, 'size', e.target.value)} name="size" placeholder="Size" className="flex-1 px-2 block w-full rounded-md border-gray-900 border-[1px] py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
              </div>
              <div className='w-1/2'>
                <label htmlFor={`originalPrice_${index}`}>Original Price:</label>
                <input type="text" id={`originalPrice_${index}`} required value={size.originalPrice} onChange={(e) => handleSizeChange(index, 'originalPrice', e.target.value)} name="originalPrice" placeholder="Original Price" className="w-32 px-2 block rounded-md border-gray-900 border-[1px] py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
              </div>
              <div className='w-1/2'>
                <label htmlFor={`discountPercent_${index}`}>Discount %:</label>
                <input
                  type="text"
                  id={`discountPercent_${index}`}
                  required value={size.discountPercent}
                  onChange={(e) => handleDiscountChange(index, e.target.value)}
                  name="discountPercent"
                  placeholder="Discount %"
                  className="w-32 block rounded-md border-gray-900 border-[1px] py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 px-2 focus:ring-opacity-50"
                />
              </div>
              <div className='w-1/2'>
                <label htmlFor={`discountedPrice_${index}`}>Discounted Price:</label>
                <input type="text" id={`discountedPrice_${index}`} required value={size.discoPrice} onChange={(e) => handleSizeChange(index, 'discoPrice', e.target.value)} name="discountedPrice" placeholder="Discounted Price" className="w- px-2 block rounded-md border-gray-900 border-[1px] py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
              </div>
              <button type="button" onClick={() => removeSize(index)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-500 focus:ring-opacity-50">Remove</button>
            </div>
          ))
        }
        <button type="button" onClick={addSize} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50">Add Size</button>
        <textarea required value={formData.Desc} onChange={handleChange} name="Desc" placeholder="Description" className="block w-full mt-1 rounded-md border-gray-900 border-[1px] p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50">Submit</button>
      </form>
    </div>
  );
};

export default CreateProduct;

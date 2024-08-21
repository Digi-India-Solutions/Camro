import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageModal from './ImageModal';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast'
import Loader from '../../Home/Loader';
const EditPoject = () => {
  const { id } = useParams()
  const [formData, setFormData] = useState({
    productName: "",
    property: "",
    originalPrice: "",
    discoPrice: "",
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
  const [isLoading, setIsLoading] = useState(true);


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
    setFormData({
      ...formData,
      sizes: [
        ...formData.sizes,
        {
          id: formData.sizes.length,
          size: "",
          originalPrice: 0,
          discoPrice: 0,
        },
      ],
    });
  };

  const removeSize = (index) => {
    const updatedSizes = formData.sizes.filter((_, idx) => idx !== index);
    setFormData({ ...formData, sizes: updatedSizes });
  };
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));

    setFormData((prevData) => ({
      ...prevData,
      files: files
    }));

    setImagePreviews(previews);
  };


  const handleEdit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();

    // Append non-nested fields
    for (const key in formData) {
      if (formData.hasOwnProperty(key) && key !== 'sizes' && key !== 'files' && key !== 'addInfo') {
        submitData.append(key, formData[key]);
      }
    }

    // Append sizes array
    submitData.append('sizes', JSON.stringify(formData.sizes));

    // Append files
    if (Array.isArray(formData.files)) {
      formData.files.forEach((file) => {
        submitData.append('images', file);
      });
    }

    // Append nested addInfo object
    for (const key in formData.addInfo) {
      if (formData.addInfo.hasOwnProperty(key)) {
        submitData.append(`addInfo[${key}]`, formData.addInfo[key]);
      }
    }

    setIsLoading(true);
    try {
      const res = await axios.patch(`https://api.camrosteel.com/api/v1/update-product/${id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(res.data);
      toast.success("Product Updated Successfully");
      setIsLoading(false);

      // Reloading the page if necessary
      window.location.reload();
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating product:", error.response ? error.response.data : error.message);
      toast.error("Failed to update product. Please try again.");
    }
  };


  const singleProducts = async () => {
    try {
      const response = await axios.post(`https://api.camrosteel.com/api/v1/single-product/${id}`)
      console.log(response.data.data)
      setFormData(response.data.data);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    singleProducts()
  }, [id])
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.camrosteel.com/api/v1/get-tags');
        setTags(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.camrosteel.com/api/v1/get-categories');

        setCategoriesList(response.data.data);


        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setIsLoading(false); // Update loading state even if there's an error
      }
    };

    fetchData();
  }, []);
  const handleDiscountChange = (index, discountPercent) => {
    const originalPrice = formData.sizes[index].originalPrice;
    const discountedPrice = originalPrice - (originalPrice * discountPercent / 100);
    handleSizeChange(index, 'discoPrice', discountedPrice); // Update discounted price
    // Update discountPercent
    const updatedSizes = [...formData.sizes];
    updatedSizes[index].discountPercent = discountPercent;
    setFormData({ ...formData, sizes: updatedSizes });
  };

  return (

    <div className="max-w-4xl mx-auto px-4 py-8">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

          {/* <Link to="/upload" className="text-blue-400 underline">Upload-images</Link> */}
          <form onSubmit={handleEdit} className="space-y-4">
            {/* Product Information */}
            <div className='flex w-ful items-center justify-center\l gap-2'>

              <div className='w-1/2'>
                <input type="text" value={formData.productName} onChange={handleChange} name="productName" placeholder="Product Name" className="block w-full border-[1px] p-2 mt-1 rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
              </div>
              <div className='w-1/2'>
                <select
                  id="tags"
                  name="property"
                  value={formData.selectedTag}
                  onChange={handleChange}
                  className="block w-full border-[1px] p-2 mt-1 rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  <option value="">Select a tag</option>
                  {tags.map(tag => (
                    <option key={tag._id} value={tag.title}>{tag.title}</option>
                  ))}
                </select>
              </div>

            </div>
            {/* <div className='flex gap-2'>
              <input type="text" value={formData.originalPrice} onChange={handleChange} name="originalPrice" placeholder="originalPrice" className="block w-full border-[1px] p-2 mt-1 rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
              <input type="text" value={formData.discoPrice} onChange={handleChange} name="discoPrice" placeholder="discountPrice" className="block w-full border-[1px] p-2 mt-1 rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
            </div> */}
            <div className='flex gap-2'>
              <input type="text" value={formData.vendor} onChange={handleChange} name="vendor" placeholder="Vendor" className="block w-full border-[1px] p-2 mt-1 rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
              <input type="text" value={formData.sku} onChange={handleChange} name="sku" placeholder="SKU" className="block w-full border-[1px] p-2 mt-1 rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
            </div>

            <div className='flex gap-2'>
              <input type="text" value={formData.productType} onChange={handleChange} name="productType" placeholder="Product Type" className="block w-full border-[1px] p-2 mt-1 rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
            </div>
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

              <div className='w-full'>
                <input type="file" name="images" multiple className="block w-full border-[1px] p-2 mt-1 rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" onChange={handleFileChange} />
              </div>
            </div>


            <div className='flex  gap-2'>
              <div className='w-full'>
                <select
                  id="Category"
                  name="Category"
                  value={formData.Category}
                  onChange={handleChange}
                  className="block w-full border-[1px] p-2 mt-1 rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  <option value="">Select a Category</option>
                  {categoriesList.map(tag => (
                    <option key={tag._id} value={tag.title}>{tag.title}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Additional Information */}
            {/* <div className='flex gap-2'>
              <input type="text" value={formData.addInfo.base} onChange={handleChange} name="addInfo.base" placeholder="Base" className="block w-full mt-1 rounded-md border-gray-900 border-[1px] p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
              <input type="text" value={formData.addInfo.material} onChange={handleChange} name="addInfo.material" placeholder="Material" className="block w-full mt-1 rounded-md border-gray-900 border-[1px] p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
              <input type="text" value={formData.addInfo.dishwasherSafe} onChange={handleChange} name="addInfo.dishwasherSafe" placeholder="Dishwasher Safe" className="block w-full mt-1 rounded-md border-gray-900 border-[1px] p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
            </div> */}
            {/* <div className='flex gap-2'>
              <input type="text" value={formData.addInfo.packageContent} onChange={handleChange} name="addInfo.packageContent" placeholder="Package Content" className="block w-full mt-1 rounded-md border-gray-900 border-[1px] p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
              <input type="number" value={formData.addInfo.warranty} onChange={handleChange} name="addInfo.warranty" placeholder="Warranty" className="block w-full mt-1 rounded-md border-gray-900 border-[1px] p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
              <input type="text" value={formData.addInfo.certification} onChange={handleChange} name="addInfo.certification" placeholder="Certification" className="block w-full mt-1 rounded-md border-gray-900 border-[1px] p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
            </div> */}
            {
              formData.sizes.map((size, index) => (
                <div key={index} className="flex w-full space-x-4 items-center">
                  <div className='w-1/2'>
                    <label htmlFor={`size_${index}`}>Size:</label>
                    <input type="text" id={`size_${index}`} value={size.size} onChange={(e) => handleSizeChange(index, 'size', e.target.value)} name="size" placeholder="Size" className="flex-1 block w-full rounded-md border-gray-900 border-[1px] py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
                  </div>
                  <div className='w-1/2'>
                    <label htmlFor={`originalPrice_${index}`}>Original Price:</label>
                    <input type="text" id={`originalPrice_${index}`} value={size.originalPrice} onChange={(e) => handleSizeChange(index, 'originalPrice', e.target.value)} name="originalPrice" placeholder="Original Price" className="w-32 block rounded-md border-gray-900 border-[1px] py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
                  </div>
                  <div className='w-1/2'>
                    <label htmlFor={`discountPercent_${index}`}>Discount %:</label>
                    <input
                      type="text"
                      id={`discountPercent_${index}`}
                      value={size.discountPercent}
                      onChange={(e) => handleDiscountChange(index, e.target.value)}
                      name="discountPercent"
                      placeholder="Discount %"
                      className="w-32 block rounded-md border-gray-900 border-[1px] py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    />
                  </div>
                  <div className='w-1/2'>
                    <label htmlFor={`discountedPrice_${index}`}>Discounted Price:</label>
                    <input type="text" id={`discountedPrice_${index}`} value={size.discoPrice} onChange={(e) => handleSizeChange(index, 'discoPrice', e.target.value)} name="discountedPrice" placeholder="Discounted Price" className="w-32 block rounded-md border-gray-900 border-[1px] py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
                  </div>
                  <button type="button" onClick={() => removeSize(index)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-500 focus:ring-opacity-50">Remove</button>
                </div>
              ))
            }


            <button type="button" onClick={addSize} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50">Add Size</button>
            <textarea value={formData.Desc} onChange={handleChange} name="Desc" placeholder="Description" className="block w-full mt-1 rounded-md border-gray-900 border-[1px] p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />

            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50">Submit</button>
          </form>
        </>

      )}

    </div>
  );
};

export default EditPoject;

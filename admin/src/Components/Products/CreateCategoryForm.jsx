import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateCategoryForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    image: null, // Changed initial value to null for image file
  });
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // If it's a file input, update image with the selected file
    if (name === 'image') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Set loading state to true
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('image', formData.image); // Append image file to form data

      const res = await axios.post('https://api.camrosteel.com/api/v1/Make-categories', formDataToSend);
      console.log('Category created successfully!', formData);
      toast.success('Category created successfully!');
      console.log(res.data);
      setFormData({
        title: '',
        image: null, // Reset image to null after successful submission
      });
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setLoading(false); // Set loading state to false after submission
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="w-[690px] min-h-[300px] glass mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* File Input Field */}
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleChange}
          className="hidden" // Hide the file input field
        />
        <label htmlFor="image" className="block w-full bg-blue-500 text-white py-2 px-4 rounded-md mb-4 hover:bg-blue-600 focus:outline-none focus:bg-blue-600 cursor-pointer">
          Select Image
        </label>

        {/* Show Selected Image */}
        {formData.image && (
          <img
            src={URL.createObjectURL(formData.image)}
            alt="Selected Image"
            className="w-32 h-32 mb-4"
          />
        )}

        {/* Submit Button with Loading State */}
        <button
          type="submit"
          className={`w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading} // Disable button when loading is true
        >
          {/* i love y */}
          {loading ? 'Creating Category...' : 'Create Category'}
        </button>
      </form>
    </div>
  );
};

export default CreateCategoryForm;

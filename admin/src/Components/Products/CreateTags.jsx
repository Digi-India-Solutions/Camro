import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageModal from './ImageModal';
import toast from 'react-hot-toast'
const CreateTags = () => {
  const [formData, setFormData] = useState({
    title: '',
    TagColour: "", // Assuming CatImg is a file
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send form data to server or perform other actions as needed
      const res = await axios.post('https://api.camrosteel.com/api/v1/Make-tags',formData)
      console.log('Tags created successfully!', formData);
      // Reset form after successful submission
      toast.success("Tags created successfully!")
      console.log(res.data)
      setFormData({
        title: '',
        CatImg: '',
      });
    } catch (error) {
      console.error('Error creating Tags:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="w-[300px] h-[300px] border-2 border-black mx-auto p-6 bg-white rounded-lg shadow-md">
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

        <div className="mb-4">
          <label htmlFor="Colour" className="block text-gray-700 font-bold mb-2">Colour</label>
          <input
            type="text"
            id="title"
            name="TagColour"
            value={formData.TagColour}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
      
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
        >
          Create Tag
        </button>

      </form>
    </div>
  );
};

export default CreateTags;

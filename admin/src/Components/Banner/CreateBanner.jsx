import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CreateBanner = () => {
  const [isLoading,setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    image: null, // Initially set to null
    active: true,
  });
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // State to hold selected image

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "image") {
      // Handle image file separately
      const selectedFile = files[0];
      setFormData((prevData) => ({
        ...prevData,
        image: selectedFile,
      }));
      setSelectedImage(URL.createObjectURL(selectedFile)); // Set the selected image for preview
    } else {
      // Handle other input changes
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("image", formData.image); // Append the image file
      formDataToSend.append("active", formData.active);

      const response = await axios.post(
        "https://api.camrosteel.com/api/v1/Bannercreate",
        formDataToSend
      );
      console.log(response.data);
      setMessage("Banner created successfully!");
      setIsLoading(false)
      setFormData({
        ...formData, // Spread the existing formData
        title: '',
        image:''   // Update the title field to an empty string
      });
    } catch (error) {
      console.error("Error creating banner:", error);
      setIsLoading(false)

      setMessage("Error creating banner. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl  p-5 min-h-[60vh] border-2 mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Create Banner</h1>
      {/* <p>**For Create Banner First upload Images in Upload-Images Tab</p> */}
      {/* <Link to="/upload" className="text-blue-400 underline">
        Upload-images
      </Link> */}
      <form onSubmit={handleSubmit} className="space-y-4 mt-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title:
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image:
          </label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          {selectedImage && ( // Display selected image preview if available
            <img
              src={selectedImage}
              alt="Selected Image"
              className="mt-2 rounded"
              style={{ maxWidth: "200px" }}
            />
          )}
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.active}
            name="active"
            onChange={(e) =>
              setFormData({ ...formData, active: e.target.checked })
            }
            className="mr-2 rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
          />
          <label className="text-sm text-gray-700">Active</label>
        </div>

        <button
          type="submit"
          disabled={isLoading ? true:false}
          className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isLoading ? 'cursor-not-allowed':'cursor-pointer'}  `}
        >
          {isLoading ? 'Please Wait Banner Is Making....':'Create Banner'}
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default CreateBanner;

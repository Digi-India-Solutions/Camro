import React, { useRef, useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setMessage('Please select at least one file.');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await axios.post('https://api.camrosteel.com/api/v1/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage('An error occurred while uploading the images.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleClearFiles = () => {
    setSelectedFiles([]);
  };

  const triggerFileSelectPopup = () => fileInputRef.current.click();

  return (
    <div className=" flex items-center justify-center flex-col min-h-dvh min-w-xl mx-auto p-6 bg-gray-100 rounded-md">
      <h2 className="text-xl font-semibold mb-4">Image Upload</h2>
    <div>
    <div
        className="border-dashed border-2 border-gray-300 p-4 mb-4 cursor-pointer"
        onClick={triggerFileSelectPopup} // Add click functionality
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          name="images"
          accept="image/*"
          onChange={handleFileChange}
          multiple
          className="hidden"
        />
        <p className="text-center text-gray-500">Drag and drop files here, or click to select files</p>
      </div>
      {selectedFiles.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold">Selected Files ({selectedFiles.length})</h3>
          <ul className="list-disc list-inside">
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
          <button
            onClick={handleClearFiles}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md"
          >
            Clear Files
          </button>
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={uploading || selectedFiles.length === 0}
        className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md ${
          (uploading || selectedFiles.length === 0) && 'opacity-50 cursor-not-allowed'
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
    </div>
  );
};

export default ImageUpload;

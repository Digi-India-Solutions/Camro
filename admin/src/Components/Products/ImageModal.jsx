import React, { useState } from 'react';

const ImageModal = ({ isOpen, onClose, images, handleImageClick }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const toggleImageSelection = (imageUrl) => {
    let updatedSelection = [...selectedImages];
    const selectedIndex = selectedImages.indexOf(imageUrl);

    if (selectedIndex === -1) {
      updatedSelection.push(imageUrl);
    } else {
      updatedSelection = selectedImages.filter((image) => image !== imageUrl);
    }

    setSelectedImages(updatedSelection);
  };

  const handleImageDoubleClick = (imageUrl) => {
    setSelectedImages([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Select an Image</h3>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((album) =>
                    album.img.map((image) => (
                      <div
                        key={image._id}
                        className={`cursor-pointer relative ${
                          selectedImages.includes(image.ImgUrl) ? 'border-4 border-blue-500' : ''
                        }`}
                        onClick={() => {
                          toggleImageSelection(image.ImgUrl);
                          handleImageClick(image.ImgUrl);
                        }}
                        onDoubleClick={() => handleImageDoubleClick(image.ImgUrl)}
                      >
                        {selectedImages.includes(image.ImgUrl) && (
                          <div className="absolute top-2 left-2 bg-white text-blue-500 font-bold p-1 rounded-full z-10">
                            {selectedImages.indexOf(image.ImgUrl) + 1}
                          </div>
                        )}
                        <img
                          src={image.ImgUrl}
                          alt={image.Name}
                          className="rounded-lg h-32 object-cover transition-transform duration-300"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;

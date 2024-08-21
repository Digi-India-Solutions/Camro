import React, { useState } from 'react';
import axios from 'axios';

const EditCategoryModal = ({ isOpen, onClose, category, onCategoryUpdated }) => {
    const [title, setTitle] = useState(category.title);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.put(`https:///api.camrosteel.com/api/v1/Update-Categories/${category._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Category updated successfully:', response.data);
            onCategoryUpdated();
            onClose();
        } catch (error) {
            console.error('Error updating category:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl mb-4">Edit Category</h2>
                <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-400 p-2 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Category Image</label>
                        <input type="file" onChange={handleImageChange} className="w-full border border-gray-400 p-2 rounded-md" />
                        {category.CatImg && !image && (
                            <img src={category.CatImg} alt={category.title} className="w-24 h-24 object-cover mt-2" />
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="mr-2 bg-gray-500 text-white py-2 px-4 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategoryModal;

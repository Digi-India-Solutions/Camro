import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import EditCategoryModal from './EditCatgories'; // Ensure this path is correct
import toast from 'react-hot-toast';

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(7); 

  const fetchData = async (page) => {
    try {
      const response = await axios.get('https://api.camrosteel.com/api/v1/get-categories');
      const Cate = response.data.data;
      setCategories(Cate.reverse());
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setIsLoading(false); // Update loading state even if there's an error
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.post(`https://api.camrosteel.com/api/v1/delete-categories/${id}`);
      toast.success('Category deleted successfully:', id);
      fetchData(currentPage);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleCategoryUpdated = async () => {
    setIsEditModalOpen(false);
    fetchData(currentPage);
  };

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Link to="/Create-Categories" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          + Add Category
        </Link>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : currentCategories.length === 0 ? (
        <p>No categories available.</p>
      ) : (
        <div>
          <table className="w-full text-center">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">S.No</th>
                <th className="border border-gray-400 px-4 py-2">Title</th>
                <th className="border border-gray-400 px-4 py-2">Category Image</th>
                <th className="border border-gray-400 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.map((category, index) => (
                <tr key={category._id}>
                  <td className="border border-gray-400 px-4 py-2">{indexOfFirstCategory + index + 1}</td>
                  <td className="border border-gray-400 px-4 py-2">{category.title}</td>
                  <td className="border flex items-center justify-center border-gray-400 px-4 py-2">
                    <img src={category.CatImg} alt={category.title} className="w-12 h-12 object-cover rounded-full" />
                  </td>
                  <td className="border border-gray-400 space-x-3 px-4 py-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
            >
              Previous
            </button>
            <span className="bg-gray-300 text-gray-800 font-bold py-2 px-4">{currentPage}</span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastCategory >= categories.length}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {isEditModalOpen && (
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          category={currentCategory}
          onCategoryUpdated={handleCategoryUpdated}
        />
      )}
    </div>
  );
};

export default AllCategories;

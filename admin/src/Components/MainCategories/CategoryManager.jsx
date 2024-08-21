import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({ title: '', SubCategorey: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchCategories();
    fetchAvailableCategories();
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://api.camrosteel.com/api/v1/get-All-Main-Categories');
      setCategories(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const fetchAvailableCategories = async () => {
    try {
      const response = await axios.get('https://api.camrosteel.com/api/v1/get-categories');
      setAvailableCategories(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch available categories');
    }
  };

  const handleCreateEdit = async () => {
    try {
      if (isEditMode) {
        await axios.put(`https://api.camrosteel.com/api/v1/Update-Main-Category/${currentCategory._id}`, currentCategory);
        toast.success('Category updated successfully');
      } else {
        await axios.post('https://api.camrosteel.com/api/v1/Create-Main-Category', currentCategory);
        toast.success('Category created successfully');
      }
      fetchCategories();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://api.camrosteel.com/api/v1/Delete-Main-Category/${id}`);
      toast.success('Category deleted successfully');
      fetchCategories();
      setDeleteCategoryId(null);
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const openCreateModal = () => {
    setCurrentCategory({ title: '', SubCategorey: [] });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setCurrentCategory(category);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const openDeleteConfirmation = (id) => {
    setDeleteCategoryId(id);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

  const handleSubCategoryChange = (event) => {
    const { value } = event.target;
    if (!currentCategory.SubCategorey.includes(value)) {
      setCurrentCategory({ ...currentCategory, SubCategorey: [...currentCategory.SubCategorey, value] });
    }
  };

  const removeSubCategory = (subCategory) => {
    setCurrentCategory({
      ...currentCategory,
      SubCategorey: currentCategory.SubCategorey.filter((item) => item !== subCategory)
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Category Manager</h1>
        <button onClick={openCreateModal} className="bg-blue-500 text-white px-4 py-2 rounded">Create Category</button>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Subcategories</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((category) => (
            <tr key={category._id}>
              <td className="py-2 px-4 border-b">{category.title}</td>
              <td className="py-2 px-4 border-b">{category.SubCategorey.join(', ')}</td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => openEditModal(category)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button onClick={() => openDeleteConfirmation(category._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(categories.length / itemsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl mb-4">{isEditMode ? 'Edit Category' : 'Create Category'}</h2>
            <input
              type="text"
              placeholder="Title"
              className="w-full mb-4 px-4 py-2 border rounded"
              value={currentCategory.title}
              onChange={(e) => setCurrentCategory({ ...currentCategory, title: e.target.value })}
            />
            <div className="mb-4">
              <label className="block mb-2">Subcategories</label>
              <div className="flex items-center mb-2">
                <select
                  className="w-full px-4 py-2 border rounded"
                  onChange={handleSubCategoryChange}
                  defaultValue=""
                >
                  <option value="" disabled>Select Subcategory</option>
                  {availableCategories.map((cat) => (
                    <option key={cat._id} value={cat.title}>{cat.title}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap">
                {currentCategory.SubCategorey.map((subCat) => (
                  <div key={subCat} className="bg-gray-200 px-4 py-2 rounded mr-2 mb-2 flex items-center">
                    {subCat}
                    <button
                      onClick={() => removeSubCategory(subCat)}
                      className="ml-2 text-red-500"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
              <button onClick={handleCreateEdit} className="bg-blue-500 text-white px-4 py-2 rounded">{isEditMode ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteCategoryId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this category?</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setDeleteCategoryId(null)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
              <button onClick={() => handleDelete(deleteCategoryId)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;

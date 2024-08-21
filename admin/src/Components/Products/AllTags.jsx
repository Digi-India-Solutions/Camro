import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast'

const AllTags = () => {
    const [tags, setTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const handleDeleteTag = async (id) => {
        try {
            await axios.post(`https://api.camrosteel.com/api/v1/delete-tags/${id}`);
            // Update tags after successful deletion
            setTags(tags.filter(tag => tag._id !== id));
            toast.success('Tag deleted successfully:')
        } catch (error) {
            console.error('Error deleting tag:', error);
            // Implement error handling, such as displaying an error message to the user
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Tags</h2>
                <Link to="/Create-tags" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    + Add Tag
                </Link>
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : tags.length === 0 ? (
                <p>No tags available.</p>
            ) : (
                <table className="w-full text-center">
                    <thead>
                        <tr>
                            <th className="border border-gray-400 px-4 py-2">Title</th>
                            <th className="border border-gray-400 px-4 py-2">Tag Colour</th>
                            <th className="border border-gray-400 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tags.map((tag) => (
                            <tr key={tag._id}>
                                <td className="border border-gray-400 px-4 py-2">{tag.title}</td>
                                <td className="border border-gray-400 px-4 py-2">
                                    <span className="inline-block w-4 h-4 ml-2" style={{ backgroundColor: tag.TagColour }}></span>
                                </td>
                                <td className="border border-gray-400 px-4 py-2">
                                    <button onClick={() => handleDeleteTag(tag._id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AllTags;

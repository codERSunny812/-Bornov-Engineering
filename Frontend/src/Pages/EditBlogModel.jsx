// EditBlogModal.js
import { useState, useEffect } from "react";
import axios from "axios";

const EditBlogModal = ({ blogId, closeModal }) => {
    const [blog, setBlog] = useState({ title: "", content: "" });
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/blogs/${blogId}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setBlog(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch blog:", err);
            }
        };

        fetchBlog();
    }, [blogId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URI}/blogs/${blogId}`, blog,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            closeModal(); // Close modal after updating the blog
        } catch (err) {
            console.error("Failed to update blog:", err);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Blog</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={blog.title}
                            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium">
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={blog.content}
                            onChange={(e) => setBlog({ ...blog, content: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg"
                            rows="6"
                        />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Save Changes
                    </button>
                </form>
                <button onClick={closeModal} className="mt-4 text-red-500">Close</button>
            </div>
        </div>
    );
};

export default EditBlogModal;

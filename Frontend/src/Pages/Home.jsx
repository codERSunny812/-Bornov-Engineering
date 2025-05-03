import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import EditBlogModal from "./EditBlogModel";
import Header from '../component/Header';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/blogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogs(res.data);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setError("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (blogId) => {
    setSelectedBlogId(blogId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBlogId(null);
  };

  const deleteBlog = async (blogId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/blogs/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert("Failed to delete blog.");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("users");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser._id);
    }
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Header />
      <h1 className="text-3xl font-bold mb-6">Your Blogs</h1>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : blogs.length === 0 ? (
        <div className="flex flex-col gap-4">
          <p>No blogs found. Create your first post!</p>
          <Link
            to="/create-blog"
            className="mt-10 px-4 py-2 w-44 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create Blog
          </Link>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Link
              to="/create-blog"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Create More Blogs
            </Link>
          </div>

          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white shadow-md rounded-lg p-4 mb-4 border"
            >
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-gray-700 mt-2">
                {blog.content.length > 150
                  ? blog.content.substring(0, 150) + "..."
                  : blog.content}
              </p>
              <div className="text-sm text-gray-500 mt-3">
                <p>
                  <span className="font-medium">Author:</span>{" "}
                  {blog.author && blog.author.name ? blog.author.name : "Unknown"}
                </p>
                <p>
                  <span className="font-medium">Posted:</span>{" "}
                  {blog.createdAt
                    ? new Date(blog.createdAt).toLocaleString()
                    : "Date unknown"}
                </p>
              </div>

              {userId === blog.author?._id && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openModal(blog._id)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {showModal && (
        <EditBlogModal
          blogId={selectedBlogId}
          closeModal={() => {
            closeModal();
            fetchBlogs(); // Refresh list after edit
          }}
        />
      )}
    </div>
  );
};

export default Home;

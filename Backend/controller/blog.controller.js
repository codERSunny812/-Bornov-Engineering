const blogModel = require("../models/blog.model");


exports.createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const author = req.user.id;
        const newBlog = new blogModel({ title, content, author });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Get all blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await blogModel.find({ author: req.user.id }).sort({ createdAt: -1 }).populate('author','name');
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const blog = await blogModel.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update a blog
exports.updateBlog = async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const updatedBlog = await blogModel.findByIdAndUpdate(
            req.params.id,
            { title, content, author },
            { new: true }
        );
        if (!updatedBlog) return res.status(404).json({ message: 'Blog not found' });
        res.json(updatedBlog);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await blogModel.findOneAndDelete({ _id: req.params.id, author: req.user.id });
        if (!blog) return res.status(404).json({ message: 'Not found or unauthorized' });
        res.json({ message: 'Blog deleted' });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

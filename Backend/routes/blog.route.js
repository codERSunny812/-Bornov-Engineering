const express = require('express')
const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } = require('../controller/blog.controller')

const blogRouter = express.Router()

blogRouter.post('/',createBlog);
blogRouter.get('/',getAllBlogs);
blogRouter.get('/:id',getBlogById);
blogRouter.put('/:id',updateBlog);
blogRouter.delete('/:id',deleteBlog)

module.exports=blogRouter

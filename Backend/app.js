const express = require('express');
const connectDB = require('./DB/DB');
const Userrouter = require('./routes/user.route');
require('dotenv').config();
const cors = require('cors');
const blogRouter = require('./routes/blog.route');
const authMiddleware = require('./middleware/auth.middleware');
connectDB();



const app = express();
const PORT = process.env.PORT || 3000;
const FrontEndUri=process.env.FRONT_END_URI;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors({
    origin: FrontEndUri,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // Allows cookies/auth headers
}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", FrontEndUri);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/users',Userrouter);
app.use('/api/v1/blogs',authMiddleware,blogRouter)


// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

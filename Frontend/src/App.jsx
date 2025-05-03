import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Pages/SignUp';
import Login from './Pages/Login';
import ProtectedRoute from './utils/ProctectedRoute';
import Home from './Pages/Home';
import CreateBlog from './Pages/CreateBlog';

console.log(import.meta.env.VITE_BACKEND_URI)

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={
          <ProtectedRoute>
           <Home/>
          </ProtectedRoute>
        } />
        <Route path='/create-blog' element={<CreateBlog/>} />
        
      </Routes>
    </Router>
  );
};

export default App;

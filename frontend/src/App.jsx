import React from 'react'
import "./index.css"
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Search from './components/Search'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './auth/Dashboard'
import Register from './auth/Register'
import Login from './auth/Login'
import Home from './pages/Home'
import ProductDetails from './pages/ProjuctDetails'
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css';
import ReviewPage from './components/ReviewPage'
const App = () => {

  return (
    <div>
      <Navbar /> {/* ✅ Show navbar on all pages */}

      <Routes>
        <Route path="/" element={<Home />} />
        
      <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/allreviews' element={<ReviewPage/>}/>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/productdetails/:id" element={<ProductDetails />} />
      </Routes>
      <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      <Footer />
    </div>
  )
}

export default App

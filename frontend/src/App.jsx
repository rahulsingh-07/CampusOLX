import React from 'react'
import "./index.css"
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './auth/Dashboard'
import Register from './auth/Register'
import Login from './auth/Login'
import Home from './pages/Home'
const App = () => {

  return (
    <div>
      <BrowserRouter>
      <Navbar /> {/* ✅ Show navbar on all pages */}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
    </div>
  )
}

export default App

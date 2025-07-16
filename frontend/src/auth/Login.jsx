
import React,{useState} from 'react';

import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const {login,logout,user}=useAuth();
  const navigate=useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      await login({username,password});
      navigate('/');
    } catch (e) {
      const errmsg=e.message || 'Failed to login';
      toast.error(errmsg);
    }
  };

  const handleLogout=()=>{
    logout();
  }

   if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-green-200">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Logged in as <span className="text-black">{user.username}</span>
          </h2>
          <button
            onClick={handleLogout}
            className="py-2 px-6 bg-red-500 text-white rounded-md hover:bg-red-600 active:scale-95 transition-all duration-150"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <div className="card-body space-y-4">
          <h2 className="text-2xl font-bold text-center">Login to Your Account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white text-base font-medium rounded-md 
             hover:bg-green-700 active:scale-95 transition-all duration-150 shadow-sm"
          >
            Login
          </button>
        </form>

          <div className="divider">OR</div>

          <button className="btn btn-outline w-full">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </button>

          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="link link-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

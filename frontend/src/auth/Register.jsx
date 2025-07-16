import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { toast } from 'react-toastify';

 
const Register = () => {
   const [username, setUsername] = useState('');
   
   const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit=async e=>{
    e.preventDefault();
    if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return; 
  }
    try {
      const msg = await register({ username,email, password});
      toast.success(msg.message);
      navigate('/login');
    } catch (err) {
      const errorMsg = err.message || 'Failed to register';
      toast.error(errorMsg);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <div className="card-body space-y-4">
          <h2 className="text-2xl font-bold text-center">Create an Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-md shadow-inner">
            {/* Username */}
            <div>
              <label className="block font-medium mb-1 text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block font-medium mb-1 text-gray-700">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 pr-10 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-3 text-gray-600"
              >
                {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block font-medium mb-1 text-gray-700">Confirm Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 pr-10 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-9 right-3 text-gray-600"
              >
                {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded transition duration-200"
            >
              Register
            </button>
          </form>
          <div className="divider">OR</div>

          <button className="btn btn-outline w-full">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Sign up with Google
          </button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

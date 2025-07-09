import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <div className="card-body space-y-4">
          <h2 className="text-2xl font-bold text-center">Login to Your Account</h2>

          <input type="email" placeholder="Email" className="input input-bordered w-full" />
          <input type="password" placeholder="Password" className="input input-bordered w-full mt-2" />

          <button className="btn btn-primary w-full mt-2">Login</button>

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

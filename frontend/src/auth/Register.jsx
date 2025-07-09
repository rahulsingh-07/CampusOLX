import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <div className="card-body space-y-4">
          <h2 className="text-2xl font-bold text-center">Create an Account</h2>

          <input type="text" placeholder="Full Name" className="input input-bordered w-full" />
          <input type="email" placeholder="Email" className="input input-bordered w-full" />
          <input type="password" placeholder="Password" className="input input-bordered w-full" />
          <input type="password" placeholder="Confirm Password" className="input input-bordered w-full" />

          <button className="btn btn-primary w-full mt-2">Register</button>

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

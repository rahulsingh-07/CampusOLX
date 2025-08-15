import { Link } from 'react-router-dom';
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { toast } from 'react-toastify';


const Register = () => {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [otpLoading, setOtpLoading] = useState(false);

  const { register, sendOtp } = useAuth();
  const navigate = useNavigate();

  // ⏱ OTP Countdown Timer
  useEffect(() => {
    let timer;
    if (otpSent && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, otpTimer]);

  const handleSendOtp = async () => {
    if (!username || !email) {
      toast.warn('Please enter username and email first');
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
  setOtpLoading(true);
    try {
      const res = await sendOtp({username, email, password}); // ✅ make API call to /send-otp
      toast.success(res.message || 'OTP sent to your email');
      setOtpSent(true);
      setOtpTimer(300); // Reset timer to 5 mins
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP');
    }finally {
    setOtpLoading(false);
  }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!otp) {
      toast.warn("Please enter OTP");
      return;
    }
    try {
      const msg = await register({ username, email, password, otp });
      toast.success(msg.message);
      navigate('/login');
    } catch (err) {
      const errorMsg = err.message || 'Failed to register';
      toast.error(errorMsg);
    }
  };
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
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
            {/* add send otp and able regiter or verify otp btn here  */}
            {/* Send OTP button (shows only before OTP is sent) */}
            {!otpSent && (
              <button
                type="button"
                onClick={handleSendOtp}
                className="btn btn-primary w-full"
                disabled={!username || !email || !password || password !== confirmPassword}
              >
                Send OTP
              </button>
            )}

            {/* OTP input & Register button (shows only after OTP is sent) */}
            {otpSent && (
              <>
                <div>
                  <label className="block font-medium mb-1 text-gray-700">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the OTP"
                    className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-full"
                  disabled={!otp}
                >
                  Register
                </button>

                {/* Resend OTP or countdown */}
                {otpTimer > 0 ? (
                  <p className="text-sm text-center text-gray-500">
                    Resend OTP in {formatTime(otpTimer)}
                  </p>
                ) : (
                  <p
  onClick={!otpLoading ? handleSendOtp : undefined}
  className={`text-sm text-center ${otpLoading ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 cursor-pointer underline'}`}
>
  {otpLoading ? 'Sending...' : 'Resend OTP'}
</p>
                )}
              </>
            )}
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

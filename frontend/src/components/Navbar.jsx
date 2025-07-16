import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcHome } from "react-icons/fc";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');


    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };
    const handleLogout = () => {
        logout();
        navigate('/');
    };
    return (
        <div className="navbar shadow-sm bg-amber-200">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">
                    <FcHome size={40} />
                </Link>
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Search"
                    className="input input-bordered w-24 md:w-auto"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                />
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="User Avatar"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
                    >
                        <li>
                            <label className="flex cursor-pointer gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5" />
                                    <path
                                        d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                                </svg>
                                <input type="checkbox" value="dark" className="toggle theme-controller" />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                            </label>
                        </li>
                        {!user && (
                            <>
                                <Link className='hover:bg-gray-200 p-2 rounded' to="/login">Login</Link>

                                <Link className='hover:bg-gray-200 p-2 rounded' to="/register">Sign Up</Link>
                            </>
                        )}
                        {user && (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="hover:bg-gray-200 px-4 py-2 rounded"
                                >
                                    Dhasboard
                                </Link>

                                {user && user.role.includes("ROLE_ADMIN") && (
                                    <Link
                                        to="/admin"
                                        className="hover:bg-gray-200 px-4 py-2 rounded"
                                    >
                                        Admin
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-medium ml-4"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;

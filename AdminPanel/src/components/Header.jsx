import React from 'react';
import { Link } from 'react-router-dom';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Header() {

    const handleLogout = () => {
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        window.location.href = '/login'
    };

    return (
        <header className="shadow-md sticky z-50 top-0 rounded-lg bg-white">
            <ToastContainer />
            <nav className="border-b border-gray-200 px-4 lg:px-6 py-2.5 flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/" className="flex items-center">
                        <img
                            src="./vetpetso.jpg"
                            className="mr-3 h-10 rounded-lg"
                            alt="Logo"
                        />
                    </Link>
                </div>
                <div>
                    <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800 px-4 py-2"><RiLogoutCircleRLine className='w-7 h-7' /></button>
                </div>
            </nav>
        </header>
    );
}

export default Header;

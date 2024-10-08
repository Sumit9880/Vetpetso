import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [galleryOpen, setGalleryOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setMenuOpen(false);
        setGalleryOpen(false);
    };

    const toggleGallery = () => {
        setGalleryOpen((prev) => !prev);
    };

    return (
        <header className="shadow-md sticky z-50 top-0 bg-white">
            <nav className="border-b border-gray-200 px-4 lg:px-6 py-2.5">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4">
                    <Link to="/" className="flex items-center">
                        <img
                            src="./vetpetso.jpg"
                            className="mr-3 h-12 rounded-full"
                            alt="Logo"
                            style={{mixBlendMode: 'multiply'}}
                        />
                    </Link>
                    <div className="lg:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-800 hover:text-gray-900 focus:outline-none"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        </button>
                    </div>
                    <div
                        className={`${menuOpen ? 'block' : 'hidden'
                            } w-full lg:flex lg:w-auto lg:order-1`}
                    >
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0 lg:items-center">
                            <li>
                                <NavLink
                                    to="/"
                                    onClick={closeMenu}
                                    className={({ isActive }) => ` font-bold ${isActive ? 'text-secondary' : 'text-gray-600'} block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-secondary lg:p-0`}
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/about"
                                    onClick={closeMenu}
                                    className={({ isActive }) => ` font-bold ${isActive ? 'text-secondary' : 'text-gray-600'} block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-secondary lg:p-0`}
                                >
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/events"
                                    onClick={closeMenu}
                                    className={({ isActive }) => ` font-bold ${isActive ? 'text-secondary' : 'text-gray-600'} block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-secondary lg:p-0`}
                                >
                                    Events
                                </NavLink>
                            </li>
                            <li className="relative">
                                <button
                                    onClick={toggleGallery}
                                    className="font-bold text-gray-600 block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-secondary lg:p-0"
                                >
                                    Gallery
                                </button>
                                {galleryOpen && (
                                    <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                                        <li>
                                            <NavLink
                                                to="/videogallery"
                                                onClick={closeMenu}
                                                className={({ isActive }) => `block px-4 py-2 text-sm font-bold ${isActive ? 'text-secondary' : 'text-gray-600'} hover:bg-gray-50 hover:text-secondary`}
                                            >
                                                Video Gallery
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/photogallery"
                                                onClick={closeMenu}
                                                className={({ isActive }) => `block px-4 py-2 text-sm font-bold ${isActive ? 'text-secondary' : 'text-gray-600'} hover:bg-gray-50 hover:text-secondary`}
                                            >
                                                Photo Gallery
                                            </NavLink>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            {/* <li>
                                <NavLink
                                    to="/history"
                                    onClick={closeMenu}
                                    className={({ isActive }) => ` font-bold ${isActive ? 'text-secondary' : 'text-gray-600'} block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-secondary lg:p-0`}
                                >
                                    History
                                </NavLink>
                            </li> */}
                            <li>
                                <NavLink
                                    to="/history"
                                    onClick={closeMenu}
                                    className={({ isActive }) => ` font-bold ${isActive ? 'bg-white text-secondary' : 'bg-secondary text-white'} block py-2 pr-4 pl-3 duration-200 border border-secondary hover:bg-white hover:text-secondary lg:py-2 lg:px-6 rounded-2xl`}
                                >
                                   History
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/contact"
                                    onClick={closeMenu}
                                    className={({ isActive }) => ` font-bold ${isActive ? 'text-secondary' : 'text-gray-600'} block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-secondary lg:p-0`}
                                >
                                    Contact Us
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;

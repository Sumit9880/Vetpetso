import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-white border-y">
                <div className="flex flex-col items-center sm:flex-row sm:justify-between p-5">
                    <span className="text-sm text-gray-500 mb-2 sm:mb-0">
                        © 2024{' '}
                        <a href="https://etenraltechservices.com/" className="hover:underline">
                            Etenral Tech Services
                        </a>
                        . All Rights Reserved.
                    </span>
                    <div className="flex mt-2 space-x-5">
                        <Link to="#" className="text-gray-500 hover:text-gray-900">
                            <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 8 19"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="sr-only">Facebook page</span>
                        </Link>

                    </div>
                </div>
        </footer>
    );
}

export default Footer;

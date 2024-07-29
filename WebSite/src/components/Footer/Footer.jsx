import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-footer border-t text-gray-800">
            <div className="mx-auto w-full max-w-screen-xl p-4 pb-6 pt-8 ">
                <div className="flex flex-col lg:flex-row lg:justify-between">
                    <div className="lg:pl-6 flex flex-col lg:flex-col items-center lg:items-center space-y-4 lg:space-y-4 mb-6 lg:mb-0">
                        <Link to="/" className="flex items-center mb-4 lg:mb-0">
                            <img
                                src="./vetpetso.jpg"
                                className="h-24 md:h-28 lg:h-32"
                                alt="Logo"
                                style={{ mixBlendMode: 'multiply' }}
                            />
                        </Link>
                        <div className="text-center lg:text-center flex flex-col items-center lg:items-center">
                            <span className="text-xs text-gray-600">
                                © 2024{' '}
                                <a href="https://etenraltechservices.com/" className="hover:underline text-blue-400 font-medium">
                                    पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ
                                </a>
                                . All Rights Reserved.
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div>
                            <h2 className="mb-4 text-xs sm:text-sm md:text-base font-semibold uppercase text-gray-900">Resources</h2>
                            <ul className="text-gray-600 text-sm">
                                <li className="mb-2">
                                    <Link to="/" className="hover:underline">
                                        Home
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/about" className="hover:underline">
                                        About Us
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/events" className="hover:underline">
                                        Events
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/history" className="hover:underline">
                                        History
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/contact" className="hover:underline">
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-4 text-xs sm:text-sm md:text-base font-semibold uppercase text-gray-900">Follow us</h2>
                            <ul className="text-gray-600 text-sm">
                                <li className="mb-2">
                                    <a
                                        href="https://facebook.com/"
                                        className="hover:underline"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Facebook
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a
                                        href="https://instagram.com/"
                                        className="hover:underline"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Intagram
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-4 text-xs sm:text-sm md:text-base font-semibold uppercase text-gray-900">Legal</h2>
                            <ul className="text-gray-600 text-sm">
                                <li className="mb-2">
                                    <Link to="/privacypolicy" className="hover:underline">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/termsofuse" className="hover:underline">
                                        Terms of Use
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-700 sm:mx-auto " />
                <div className="flex flex-col items-center sm:flex-row sm:justify-between px-6">
                    <span className="text-sm mb-4 sm:text-xs sm:mb-0">
                        Designed & Developed by{' '}
                        <a href="https://etenraltechservices.com/" className="hover:underline text-blue-400">
                            Etenral Tech Services
                        </a>
                    </span>
                    <div className="flex space-x-4 md:space-x-6">
                        <a
                            href="https://www.instagram.com/eternal_tech_services/"
                            className="hover:text-pink-600"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.423.401.55.2.95.444 1.37.864.42.42.665.82.865 1.37.16.452.347 1.253.4 2.422.059 1.268.071 1.648.071 4.851s-.012 3.584-.071 4.85c-.054 1.17-.24 1.97-.401 2.423a3.902 3.902 0 0 1-.864 1.37c-.42.42-.82.665-1.37.865-.452.16-1.253.347-2.422.4-1.268.059-1.648.071-4.851.071s-3.584-.012-4.85-.071c-1.17-.054-1.97-.24-2.423-.401a3.902 3.902 0 0 1-1.37-.864 3.902 3.902 0 0 1-.865-1.37c-.16-.452-.347-1.253-.4-2.422-.059-1.268-.071-1.648-.071-4.851s.012-3.584.071-4.85c.054-1.17.24-1.97.401-2.423a3.902 3.902 0 0 1 .864-1.37 3.902 3.902 0 0 1 1.37-.865c.452-.16 1.253-.347 2.422-.4 1.268-.059 1.648-.071 4.851-.071m0-2.163c-3.259 0-3.667.014-4.947.072-1.278.058-2.155.24-2.91.51-.789.283-1.465.664-2.14 1.34-.676.675-1.057 1.352-1.34 2.14-.27.755-.452 1.632-.51 2.91-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.058 1.278.24 2.155.51 2.91.283.789.664 1.465 1.34 2.14.675.676 1.352 1.057 2.14 1.34.755.27 1.632.452 2.91.51 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.278-.058 2.155-.24 2.91-.51.789-.283 1.465-.664 2.14-1.34.676-.675 1.057-1.352 1.34-2.14.27-.755.452-1.632.51-2.91.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.278-.24-2.155-.51-2.91a5.85 5.85 0 0 0-1.34-2.14c-.675-.676-1.352-1.057-2.14-1.34-.755-.27-1.632-.452-2.91-.51-1.28-.058-1.688-.072-4.947-.072z"
                                />
                                <path
                                    d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324zm0 10.161a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.882 1.44 1.44 0 0 0 0-2.882z"
                                />
                            </svg>
                            <span className="sr-only">Instagram page</span>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/eternal-tech-services-bb9307320/"
                            className="hover:text-blue-700"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zm-2.8 7.6h5.6v12h-5.6V11.1zM21 11.1h-5.6v1.4h.01c.09-.17.32-.4.67-.56 1.4-.81 3.28-1.1 4.4-1.1 1.7 0 2.4.7 2.4 2.1v7.5h-5.6v-7.5c0-1.4-.75-2.1-2.4-2.1-1.4 0-3 1.7-3.5 3.4h-.01v-1.4z"
                                />
                            </svg>
                            <span className="sr-only">LinkedIn page</span>
                        </a>
                        {/* <a
                            href="https://twitter.com/"
                            className="hover:text-blue-500"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M22.46 6.003c-.807.358-1.675.598-2.577.705a4.516 4.516 0 0 0 1.98-2.482 9.026 9.026 0 0 1-2.87 1.096A4.516 4.516 0 0 0 16.116 5c-2.494 0-4.52 2.028-4.52 4.52 0 .354.04.699.117 1.031A12.857 12.857 0 0 1 3.423 4.623a4.495 4.495 0 0 0-.61 2.268c0 1.567.798 2.947 2.01 3.762a4.505 4.505 0 0 1-2.05-.566v.057c0 2.184 1.552 4.006 3.605 4.42a4.526 4.526 0 0 1-2.045.078c.578 1.807 2.245 3.127 4.224 3.162a9.058 9.058 0 0 1-5.62 1.945c-.364 0-.722-.021-1.075-.061a12.798 12.798 0 0 0 6.905 2.021c8.28 0 12.812-6.868 12.812-12.812 0-.196-.004-.392-.014-.586a9.17 9.17 0 0 0 2.256-2.334z"
                                />
                            </svg>
                            <span className="sr-only">Twitter page</span>
                        </a> */}
                        <a
                            href="https://x.com/Eternal_Tech24"
                            className="hover:text-blue-500"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                                />
                            </svg>
                            <span className="sr-only">Twitter page</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

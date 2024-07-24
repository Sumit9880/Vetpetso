import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MdCardMembership } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { CgWebsite } from "react-icons/cg";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { FaFileMedical } from "react-icons/fa6";
import { SiGoogleforms } from "react-icons/si";
import { VscGraph } from "react-icons/vsc";
import { RiMenuUnfoldLine, RiMenuFoldLine } from "react-icons/ri";

const Sidebar = () => {

    let initialValue = {
        website: false,
        member: false,
        master: false,
        case: false,
        report: false,
        dashboard: false
    }
    const [activeLink, setActiveLink] = useState('/');
    const [isSmall, setIsSmall] = useState(false);
    const [tabs, setTabs] = useState(initialValue);

    const handleSetActiveLink = (link) => {
        setActiveLink(link);
    };

    const toggle = (name) => {
        setIsSmall(false);
        setTabs({
            ...initialValue,
            [name]: !tabs[name]
        })
    }

    const toggleSize = useCallback(() => {
        setTabs(initialValue);
        setIsSmall(prevState => !prevState);
    }, []);

    return (
        <div className={`bg-gray-800 text-white ${isSmall ? 'w-18' : 'w-72'} flex flex-col transition-all duration-300 ease-in-out sticky top-0`}>
            <div className={`p-4 text-2xl font-bold ${isSmall ? 'flex-col items-center' : 'flex items-center justify-between'} `}>
                {isSmall ? "" : <span className="flex items-center text-red-500 tracking-wide">Vet<span className="ml-1 flex items-center text-white tracking-wide">PetSo</span></span>}
                <button onClick={toggleSize} className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-300">
                    {isSmall ? <RiMenuUnfoldLine className='w-6 h-6' /> : <RiMenuFoldLine className='w-6 h-6' />}
                </button>
            </div>
            <div className="overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
                <ul className="flex-grow pb-10">
                    <li>
                        <Link to="/" className={`block px-4 py-2 hover:bg-gray-700 ${isSmall ? 'text-sm' : ''}${activeLink === '/' ? 'bg-blue-600 text-white' : ''}`} onClick={() => { handleSetActiveLink('/'), toggle('dashboard') }}>
                            {isSmall ? <RxDashboard className='w-5 h-5' /> : <span className='flex items-center'><RxDashboard className='w-5 h-5 mr-2' />Dashboard</span>}
                        </Link>
                    </li>
                    <li>
                        <div className={`px-4 py-2 hover:bg-gray-700 cursor-pointer flex justify-between ${isSmall ? 'text-sm' : ''}`} onClick={() => toggle('website')}>
                            <span>{isSmall ? <CgWebsite className='w-6 h-6' /> : <span className='flex items-center'><CgWebsite className='w-5 h-5 mr-2' />Website</span>}</span>
                            {!isSmall && <button className="focus:outline-none">
                                {tabs.website ? <FaAngleUp className='w-4 h-4' /> : <FaAngleDown className='w-4 h-4' />}
                            </button>}
                        </div>
                        <ul className={`${tabs.website ? 'block' : 'hidden'} ml-4 `}>
                            <li>
                                <Link to="/events" className={`block px-7 text-gray-400 hover:text-white py-1  rounded-lg mx-1 ${isSmall ? 'text-sm' : ''} ${activeLink === '/events' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/events')}>Events</Link>
                            </li>
                            <li>
                                <Link to="/banners" className={`block px-7 text-gray-400 hover:text-white py-1  rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/banners' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/banners')}>Banners</Link>
                            </li>
                            <li>
                                <Link to="/notice" className={`block px-7 text-gray-400 hover:text-white py-1  rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/notice' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/notice')}>Notice</Link>
                            </li>
                            <li>
                                <Link to="/gallery" className={`block px-7 text-gray-400 hover:text-white py-1  rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/gallery' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/gallery')}>Gallery</Link>
                            </li>
                            <li>
                                <Link to="/history" className={`block px-7 text-gray-400 hover:text-white py-1  rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/history' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/history')}>History</Link>
                            </li>
                            <li>
                                <Link to="/commitee" className={`block px-7 text-gray-400 hover:text-white py-1  rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/commitee' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/commitee')}>Commitee</Link>
                            </li>
                            <li>
                                <Link to="/contactUs" className={`block px-7 text-gray-400 hover:text-white py-1  rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/contactUs' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/contactUs')}>Contact Us</Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <div className={`px-4 py-2 hover:bg-gray-700 cursor-pointer flex justify-between ${isSmall ? 'text-sm' : ''}`} onClick={() => toggle('member')}>
                            <span>{isSmall ? <MdCardMembership className='w-6 h-6' /> : <span className='flex items-center'><MdCardMembership className='w-5 h-5 mr-2' />Member</span>}</span>
                            {!isSmall && <button className="focus:outline-none">
                                {tabs.member ? <FaAngleUp className='w-4 h-4' /> : <FaAngleDown className='w-4 h-4' />}
                            </button>}
                        </div>
                        <ul className={`${tabs.member ? 'block' : 'hidden'} ml-4 `}>
                            <li>
                                <Link to="/members" className={`block px-7 text-gray-400 hover:text-white py-1 rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/members' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/members')}>Members</Link>
                            </li>
                            <li>
                                <Link to="/memberrequest" className={`block px-7 text-gray-400 hover:text-white py-1 rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/memberrequest' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/memberrequest')}>Member Requests</Link>
                            </li>
                        </ul>
                    </li>
                    {/* <li>
                        <div className={`px-4 py-2 hover:bg-gray-700 cursor-pointer flex justify-between ${isSmall ? 'text-sm' : ''}`} onClick={() => toggle('case')}>
                            <span>{isSmall ? <FaFileMedical className='w-6 h-6' /> : <span className='flex items-center'><FaFileMedical className='w-5 h-5 mr-2' />Case Paper</span>}</span>
                            {!isSmall && <button className="focus:outline-none">
                                {tabs.case ? <FaAngleUp className='w-4 h-4' /> : <FaAngleDown className='w-4 h-4' />}
                            </button>}
                        </div>
                        <ul className={`${tabs.case ? 'block' : 'hidden'} ml-4 `}>
                            <li>
                                <Link to="/banners/homepage" className={`block px-7 text-gray-400 hover:text-white py-1 rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/homepage' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/homepage')}>Homepage Banners</Link>
                            </li>
                            <li>
                                <Link to="/banners/sidebar" className={`block px-7 text-gray-400 hover:text-white py-1 rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/sidebar' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/sidebar')}>Sidebar Banners</Link>
                            </li>
                        </ul>
                    </li> */}
                    <li>
                        <div className={`px-4 py-2 hover:bg-gray-700 cursor-pointer flex justify-between ${isSmall ? 'text-sm' : ''}`} onClick={() => toggle('master')}>
                            <span>{isSmall ? <SiGoogleforms className='w-6 h-6' /> : <span className='flex items-center'><SiGoogleforms className='w-5 h-5 mr-2' />Master Forms</span>}</span>
                            {!isSmall && <button className="focus:outline-none">
                                {tabs.master ? <FaAngleUp className='w-4 h-4' /> : <FaAngleDown className='w-4 h-4' />}
                            </button>}
                        </div>
                        <ul className={`${tabs.master ? 'block' : 'hidden'} ml-4 `}>
                            <li>
                                <Link to="/breed" className={`block px-7 text-gray-400 hover:text-white py-1 rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/breed' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/breed')}>Animal Breed</Link>
                            </li>
                            <li>
                                <Link to="/casetype" className={`block px-7 text-gray-400 hover:text-white py-1 rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/casetype' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/casetype')}>Case Type</Link>
                            </li>
                            <li>
                                <Link to="/university" className={`block px-7 text-gray-400 hover:text-white py-1 rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/university' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/university')}>University</Link>
                            </li>
                            <li>
                                <Link to="/plan" className={`block px-7 text-gray-400 hover:text-white py-1 rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/plan' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/plan')}>Subscription Plan</Link>
                            </li>
                            <li>
                                <Link to="/district" className={`block px-7 text-gray-400 hover:text-white py-1 rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/district' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/district')}>District</Link>
                            </li>
                            <li>
                                <Link to="/taluka" className={`block px-7 text-gray-400 hover:text-white py-1 rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/taluka' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/taluka')}>Taluka</Link>
                            </li>
                            <li>
                                <Link to="/cast" className={`block px-7 text-gray-400 hover:text-white py-1 rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/cast' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/cast')}>Cast</Link>
                            </li>
                            <li>
                                <Link to="/animalSample" className={`block px-7 text-gray-400 hover:text-white py-1 rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/animalSample' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/animalSample')}>Animal Sample</Link>
                            </li>
                            <li>
                                <Link to="/animalType" className={`block px-7 text-gray-400 hover:text-white py-1 rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/animalType' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/animalType')}>Animal Type</Link>
                            </li>

                        </ul>
                    </li>
                    {/* <li>
                        <div className={`px-4 py-2 hover:bg-gray-700 cursor-pointer flex justify-between ${isSmall ? 'text-sm' : ''}`} onClick={() => toggle('report')}>
                            <span>{isSmall ? <VscGraph className='w-6 h-6' /> : <span className='flex items-center'><VscGraph className='w-5 h-5 mr-2' />Reports</span>}</span>
                            {!isSmall && <button className="focus:outline-none">
                                {tabs.report ? <FaAngleUp className='w-4 h-4' /> : <FaAngleDown className='w-4 h-4' />}
                            </button>}
                        </div>
                        <ul className={`${tabs.report ? 'block' : 'hidden'} ml-4 `}>
                            <li>
                                <Link to="/banners/homepage" className={`block px-7 text-gray-400 hover:text-white py-1 rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/homepage' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/homepage')}>Homepage Banners</Link>
                            </li>
                            <li>
                                <Link to="/banners/sidebar" className={`block px-7 text-gray-400 hover:text-white py-1 rounded-lg mx-1 ${isSmall ? 'text-sm' : ''}${activeLink === '/sidebar' ? 'bg-blue-600 text-white' : ''}`} onClick={() => handleSetActiveLink('/sidebar')}>Sidebar Banners</Link>
                            </li>
                        </ul>
                    </li> */}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;

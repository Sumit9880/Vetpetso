import React from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { Transition } from '@headlessui/react';

const ContactDrawer = ({ isOpen, onClose, data }) => {

    return (
        <Transition
            show={isOpen}
            as={React.Fragment}
            enter="transform transition ease-in-out duration-500"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
        >
            <div className={`fixed inset-0 overflow-hidden z-50`}>
                <div className="absolute inset-0 overflow-hidden mr-1">
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-5 transition-opacity" onClick={onClose}></div>
                    <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
                        <div className="relative w-screen max-w-md">
                            <div className="h-full rounded-l-xl flex flex-col bg-white shadow-xl">
                                <div className="px-4 sm:px-6">
                                    <div className="flex h-16 items-center border-b justify-between sticky top-0 bg-white z-10">
                                        <h2 className="text-lg font-bold text-gray-900">Contact Message</h2>
                                        <div className="ml-3 h-7 flex items-center">
                                            <button className="bg-white rounded-md " onClick={onClose}>
                                                <IoCloseCircleOutline className="h-7 w-7 hover:text-red-500 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative flex-1 overflow-y-auto px-4 sm:px-6">
                                    <div className="mt-6">
                                        <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
                                        <p className="pl-6 text-sm text-gray-700"><span className='font-bold'>Name: </span>{data.NAME}</p>
                                        <p className="pl-6 text-sm text-gray-700"><span className='font-bold'>Email: </span>{data.EMAIL}</p>
                                        <p className="pl-6 text-sm text-gray-700"><span className='font-bold'>Mobile No: </span>{data.MOBILE}</p>
                                        <h3 className="mt-2 first-letter:text-lg font-bold text-gray-900">Message</h3>
                                        <p className="pl-6 text-sm text-gray-700">{data.MESSAGE}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end px-4 sm:px-6 sticky bottom-0 h-14 items-center border-t  bg-white z-10">
                                    <button type="button" className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-normal px-4 py-1.5 rounded" onClick={onClose}>Close</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div >
            </div >
        </Transition >
    );
};

export default ContactDrawer;

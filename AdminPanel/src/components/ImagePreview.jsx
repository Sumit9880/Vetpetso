import React from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { STATIC_URL } from '../utils/api';

const ImagePreview = ({ open, setOpen, url }) => {
    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center ${open ? '' : 'hidden'}`}>
            <div className="bg-white w-2/3 p-4 rounded-lg shadow-md overflow-y-auto max-h-full">
                <div className='flex justify-between px-5 pb-5 items-center'>
                    <h2 className="text-xl font-bold m-2">Preview</h2>
                    <button className="text-gray-500 hover:text-red-500" onClick={setOpen}>
                        <IoCloseCircleOutline className="h-7 w-7" />
                    </button>
                </div>
                <img
                    src={STATIC_URL + url}
                    className="w-full object-cover rounded-lg mb-4"
                    alt="Banner"
                />
            </div>
        </div>
    );
};

export default ImagePreview;

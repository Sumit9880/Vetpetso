import React, { useState, useRef } from 'react';
import { apiPost, apiUpload } from '../utils/api';
import { toast } from 'react-toastify';
import Loader from './Loader';

const BannerPopup = ({ isOpen, onClose, fetchData }) => {
    const initialData = {
        NAME: '',
        STATUS: true,
        URL: ''
    };
    const [bannerData, setBannerData] = useState(initialData);
    const fileInputRef = useRef(null);
    const [loader, setLoader] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setBannerData({ ...bannerData, [name]: newValue });
    };

    const resetForm = () => {
        setBannerData(initialData);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };
    console.log(loader);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoader(true);
            const res = await apiPost('api/banner/create', bannerData);
            if (res.code === 200) {
                toast.success("Created Successfully!")
                resetForm();
                fetchData();
                setLoader(false);
            } else {
                toast.error('Failed to Create')
                console.error('Failed to fetch banners:', res.message);
                setLoader(false);
            }
        } catch (error) {
            toast.error('Somthing Went Wrong')
            console.error('API call failed:', error);
        }
    };

    const handleUpload = async (e) => {
        try {
            setLoader(true);
            e.preventDefault();
            const file = e.target.files[0];
            const res = await apiUpload('upload/banners', file);
            if (res.code === 200) {
                setBannerData({ ...bannerData, URL: res.name });
                toast.success('Uploaded Successfully')
                setLoader(false);
            } else {
                toast.error('Failed to upload:')
                console.error('Failed to upload:', res.message);
                setLoader(false);
            }
        } catch (error) {
            toast.error('Somthing Went Wrong')
            console.error('Upload failed:', error);
        }
    };

    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center ${isOpen ? '' : 'hidden'}`}>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Add Banner</h2>
                <div className="flex w-96 flex-col">
                    {
                        loader ? <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div> :
                            <>
                                <input type="text" placeholder="Name" name="NAME" className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full" onChange={handleChange} value={bannerData.NAME} />
                                <input ref={fileInputRef} type="file" accept="image/*" className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full" onChange={handleUpload} />
                            </>
                    }
                </div>
                <div className="flex justify-end">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2" onClick={handleSubmit}>Submit</button>
                    <button disabled={loader} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md" onClick={resetForm}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default BannerPopup;

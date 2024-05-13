import React, { useState, useRef } from 'react';
import { apiPost, apiUpload } from '../utils/api';

const BannerPopup = ({ isOpen, onClose, fetchData }) => {
    const initialData = {
        NAME: '',
        STATUS: true,
        URL: ''
    };
    const [bannerData, setBannerData] = useState(initialData);
    const fileInputRef = useRef(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await apiPost('api/banner/create', bannerData);
            if (res.code === 200) {
                alert('Created Successfully');
                resetForm();
                fetchData();
            } else {
                alert('Failed');
                console.error('Failed to fetch banners:', res.message);
            }
        } catch (error) {
            console.error('API call failed:', error);
        }
    };

    const handleUpload = async (e) => {
        try {
            e.preventDefault();
            const file = e.target.files[0];
            const res = await apiUpload('upload/banners', file);
            if (res.code === 200) {
                setBannerData({ ...bannerData, URL: res.name });
                alert('Uploaded Successfully');
            } else {
                console.error('Failed to upload:', res.message);
                alert('Failed');
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center ${isOpen ? '' : 'hidden'}`}>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Add Banner</h2>
                <input type="text" placeholder="Name" name="NAME" className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full" onChange={handleChange} value={bannerData.NAME} />
                <input ref={fileInputRef} type="file" accept="image/*" className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full" onChange={handleUpload} />
                <div className="flex justify-end">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2" onClick={handleSubmit}>Submit</button>
                    <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md" onClick={resetForm}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default BannerPopup;

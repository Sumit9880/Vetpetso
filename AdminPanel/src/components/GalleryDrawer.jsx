import React, { useState, useEffect, useRef } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { LiaToggleOnSolid, LiaToggleOffSolid } from 'react-icons/lia';
import { apiUpload, apiPost, apiPut, STATIC_URL } from '../utils/api';
import { Transition } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './Loader';

const GalleryDrawer = ({ isOpen, onClose, data }) => {
    const initialFormData = {
        ID: '',
        TITLE: '',
        DATE: '',
        SUMMARY: '',
        // DESCRIPTION: '',
        STATUS: false,
        URL: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [loader, setLoader] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (data?.ID !== undefined) {
            setFormData(data);
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoader(true);
            const method = formData.ID ? 'api/gallery/update' : 'api/gallery/create';
            const res = await (formData.ID ? apiPut(method, formData) : apiPost(method, formData));
            if (res.code === 200) {
                toast.success(res.message)
                if (!formData.ID) {
                    setFormData(initialFormData);
                }
            } else {
                toast.error(res.message)
                console.error(res.message);
            }
        } catch (error) {
            toast.error('Somthing Went Wrong')
            console.error('API call failed:', error);
        } finally {
            setLoader(false);
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    const handleUpload = async (e) => {
        try {
            setLoader(true);
            e.preventDefault();
            const file = e.target.files[0];
            const res = await apiUpload('upload/gallery', file);
            if (res.code === 200) {
                setFormData({ ...formData, URL: res.name });
                toast.success(res.message);
            } else {
                console.error('Failed to upload:', res.message);
                toast.error(res.message)
            }
        } catch (error) {
            toast.error('Somthing Went Wrong')
            console.error('API call failed:', error);
        } finally {
            setLoader(false);
        }
    };

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
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-5 transition-opacity" onClick={resetForm}></div>
                    <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
                        <div className="relative w-screen max-w-md">
                            <div className="h-full rounded-l-xl flex flex-col bg-white shadow-xl">
                                <ToastContainer />
                                <div className="px-4 sm:px-6">
                                    <div className="flex h-16 items-center border-b justify-between sticky top-0 bg-white z-10">
                                        <h2 className="text-lg font-bold text-gray-900">{formData.ID ? 'Update Gallery' : 'Add Gallery'}</h2>
                                        <div className="ml-3 h-7 flex items-center">
                                            <button className="bg-white rounded-md " onClick={resetForm}>
                                                <IoCloseCircleOutline className="h-7 w-7 hover:text-red-500 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative flex-1 overflow-y-auto px-4 sm:px-6">
                                    {
                                        loader && <Loader />
                                    }
                                    <form onSubmit={handleSubmit} className={`${loader ? 'hidden' : ''} py-4`}>
                                        <div className="mt-4">
                                            <label htmlFor="TITLE" className="block pl-1 mt-1 font-medium text-gray-700">Title</label>
                                            <input type="text" name="TITLE" id="TITLE" className="mt-1 p-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.TITLE} onChange={handleChange} />
                                        </div>
                                        <div className="mt-1">
                                            <label htmlFor="STATUS" className="block pl-1 mt-1 font-medium text-gray-700">Status</label>
                                            <button type="button" className=" w-full" onClick={() => setFormData({ ...formData, STATUS: !formData.STATUS })}>
                                                {formData.STATUS ? <LiaToggleOnSolid className="h-10 w-10 text-blue-500" /> : <LiaToggleOffSolid className="text-blue-500 h-10 w-10" />}
                                            </button>
                                        </div>
                                        <div className="mt-1">
                                            <label htmlFor="TYPE" className="block pl-1 mt-1 font-medium text-gray-700">District</label>
                                            <select id="TYPE" name="TYPE" className="mt-1 p-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.TYPE} onChange={handleChange}>
                                                <option value="" className="bg-blue-200">Select</option>
                                                <option key="P" value="P" className="bg-blue-200">Photo</option>
                                                <option key="V" value="V" className="bg-blue-200">Video</option>
                                            </select>
                                        </div>
                                        <div className="mt-1">
                                            {
                                                formData.TYPE === "P" ? (
                                                    <>
                                                        <label className="block pl-1 mt-1 font-medium text-gray-700">Upload Photo</label>
                                                        {
                                                            formData.URL && <div className="flex items-center justify-center">
                                                                <img src={STATIC_URL + "Gallery/" + formData.URL} alt="Image" className="h-16 rounded-lg" />
                                                            </div>
                                                        }
                                                        <input ref={fileInputRef} type="file" name="file" id="file" className="mt-1 p-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={handleUpload} />
                                                    </>
                                                ) : formData.TYPE === "V" ? (
                                                    <>
                                                        <label htmlFor="URL" className="block pl-1 mt-1 font-medium text-gray-700">Video Url</label>
                                                        {
                                                            formData.URL && <div className="flex items-center justify-center">
                                                                <iframe
                                                                    width="100"
                                                                    height="70"
                                                                    src={formData.URL}
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                    className="rounded-xl hover:scale-105 transition duration-300"
                                                                />
                                                            </div>
                                                        }
                                                        <input type="text" name="URL" id="URL" className="mt-1 p-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.URL} onChange={handleChange} />
                                                    </>
                                                ) : null
                                            }

                                        </div>
                                    </form>
                                </div>
                                <div className="flex justify-end px-4 sm:px-6 sticky bottom-0 h-14 items-center border-t  bg-white z-10">
                                    <button type="button" className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-normal px-4 py-1.5 rounded" onClick={resetForm}>Cancel</button>
                                    <button disabled={loader} type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-normal px-4 py-1.5 rounded" onClick={handleSubmit}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Transition>
    );
};

export default GalleryDrawer;

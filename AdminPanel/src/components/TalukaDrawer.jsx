import React, { useState, useEffect } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { LiaToggleOnSolid, LiaToggleOffSolid } from 'react-icons/lia';
import { apiPost, apiPut } from '../utils/api';
import { Transition } from '@headlessui/react';

const TalukaDrawer = ({ isOpen, onClose, data }) => {
    const initialFormData = {
        ID: '',
        NAME: '',
        NAME_MR: '',
        STATUS: false,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [district, setDistrict] = useState([]);

    useEffect(() => {
        if (data?.ID !== undefined) {
            setFormData(data);
        }
        getDistrict();
    }, [data]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: newValue });
    };

    const getDistrict = async () => {
        try {
            const res = await (apiPost('api/district/get', {}));
            if (res.code === 200) {
                setDistrict(res.data)
            } else {
                // alert('Failed');
                console.error('Failed to get district:', res.message);
            }
        } catch (error) {
            console.error('API call failed:', error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = formData.ID ? 'api/taluka/update' : 'api/taluka/create';
            const res = await (formData.ID ? apiPut(method, formData) : apiPost(method, formData));
            if (res.code === 200) {
                const successMessage = formData.ID ? 'Updated Successfully' : 'Created Successfully';
                alert(successMessage);
                resetForm();
                onClose();
            } else {
                alert('Failed');
                console.error('Failed to Create');
            }
        } catch (error) {
            console.error('API call failed:', error);
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
        onClose();
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
                                <div className="px-4 sm:px-6">
                                    <div className="flex h-16 items-center border-b justify-between sticky top-0 bg-white z-10">
                                        <h2 className="text-lg font-bold text-gray-900">{formData.ID ? 'Update Taluka' : 'Add Taluka'}</h2>
                                        <div className="ml-3 h-7 flex items-center">
                                            <button className="bg-white rounded-md " onClick={resetForm}>
                                                <IoCloseCircleOutline className="h-7 w-7 hover:text-red-500 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative flex-1 overflow-y-auto px-4 sm:px-6">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mt-4">
                                            <label htmlFor="DISTRICT_ID" className="block text-sm font-medium text-gray-700">District</label>
                                            <select id="DISTRICT_ID" name="DISTRICT_ID" className="mt-1 p-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.DISTRICT_ID} onChange={handleChange}>
                                                <option value="" className="bg-blue-200">Select</option>
                                                {
                                                    district?.map((d) => <option key={d.ID} value={d.ID} className="bg-blue-200">{d.NAME}</option>)
                                                }
                                            </select>
                                        </div>
                                        <div className="mt-1">
                                            <label htmlFor="NAME" className="block text-sm font-medium text-gray-700">Name</label>
                                            <input type="text" name="NAME" id="NAME" className="mt-1 p-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.NAME} onChange={handleChange} />
                                        </div>
                                        <div className="mt-1">
                                            <label htmlFor="STATUS" className="block text-sm font-medium text-gray-700">Status</label>
                                            <button type="button" className="w-full" onClick={() => setFormData({ ...formData, STATUS: !formData.STATUS })}>
                                                {formData.STATUS ? <LiaToggleOnSolid className="h-10 w-10 text-blue-500" /> : <LiaToggleOffSolid className="text-blue-500 h-10 w-10" />}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div className="flex justify-end px-4 sm:px-6 sticky bottom-0 h-14 items-center border-t  bg-white z-10">
                                    <button type="button" className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-normal px-4 py-1.5 rounded" onClick={resetForm}>Cancel</button>
                                    <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-normal px-4 py-1.5 rounded" onClick={handleSubmit}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Transition>
    );
};

export default TalukaDrawer;

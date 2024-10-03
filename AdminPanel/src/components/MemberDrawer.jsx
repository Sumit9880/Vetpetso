import React, { useState, useEffect, useRef } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { LiaToggleOnSolid, LiaToggleOffSolid } from 'react-icons/lia';
import { apiUpload, apiPost, apiPut, STATIC_URL } from '../utils/api';
import { Transition } from '@headlessui/react';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './Loader';

const MemberDrawer = ({ isOpen, onClose, data }) => {
    const initialFormData = {
        ID: '',
        NAME: '',
        ADDRESS: '',
        MOBILE_NUMBER: '',
        EMAIL: '',
        DATE_OF_BIRTH: '',
        PIN_CODE: '',
        FATHER_NAME: '',
        VILLAGE: '',
        TALUKA: 0,
        DISTRICT: 0,
        CAST: 0,
        SUB_CAST: '',
        DURATION_OF_CURRENT_ADDRESS: '',
        EDUCATIONAL_QUALIFICATION: '',
        PROF_EDUCATION_QUALIFICATION: '',
        VET_STOCKMAN_TRANING_COURSE: 0,
        LIVESTOCK_SUPERVISOR_COURSE: 0,
        DAIRY_BUSSINES_MANAGEMENT: 0,
        DIPLOMA_IN_VETERINARY_MEDICINE: 0,
        WORKING_CITY: '',
        WORKING_TALUKA: 0,
        WORKING_DISTRICT: 0,
        WORKING_CITY_PINCODE: '',
        WORK_MOBILE_NUMBER: '',
        WORK_EMAIL_ID: '',
        WORK_DURATION: '',
        INTERESTED_PLACES_TO_WORK: '',
        APPLICATION_DATE_TIME: '',
        APPLICATION_PLACE: '',
        CONCENTERS_NAME: '',
        CONCENTERS_ADDRESS: '',
        CONCENTERS_MOBILE_NUMBER: '',
        LEAVING_CERTIFICATE: '',
        EDUCATIONAL_CERTIFICATE: '',
        PROFILE_PHOTO: '',
        ADHAR_CARD: '',
        PAN_CARD: '',
        EXPERIENCE_LETTER: '',
        APPLICATION_NO: '',
        EXECUTIVE_MEETING_DATE: null,
        IS_APPROVED_BY_PRESIDENCY: '',
        IS_APPROVED_CHAIRMAN: '',
        IS_APPROVED_EXECUTIVE: '',
        REJECTED_REMARK: '',
        STATUS: '',
        IS_ACTIVE: '',
        APPROVED_DATE: null,
        PASSWORD: '',
        MEMBER_REGISTRATION_NO: '',
        MEMBER_SIGN: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const fileInputRef = useRef(null);
    const [district, setDistrict] = useState([]);
    const [course, setCourse] = useState([]);
    const [taluka, setTaluka] = useState([]);
    const [cast, setCast] = useState([]);
    const [validation, setValidation] = useState({});
    const [loader, setLoader] = useState(false);

    const validationSchema = Yup.object().shape({
        NAME: Yup.string().required('Name is required'),
        DISTRICT: Yup.string().required('District is required'),
        TALUKA: Yup.string().required('Taluka is required'),
        ADDRESS: Yup.string().required('Address is required'),
        EMAIL: Yup.string().email('Invalid email address').required('Email is required'),
        MOBILE_NUMBER: Yup.string().required('Phone is required'),
        DATE_OF_BIRTH: Yup.string().required('Date of birth is required'),
        APPLICATION_DATE_TIME: Yup.string().required('Application date is required'),
        WORK_EMAIL_ID: Yup.string().email('Invalid email address'),
    });

    const validate = async () => {
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            return false;
        } catch (error) {
            const validationErrors = {};
            if (error instanceof Yup.ValidationError) {
                error.inner.forEach((e) => {
                    validationErrors[e.path] = e.message;
                });
            }
            setValidation(validationErrors);
            return true;
        }
    }

    let workTluka = taluka
    if (formData.WORKING_DISTRICT !== null && formData.WORKING_DISTRICT !== 0 && formData.WORKING_DISTRICT !== undefined) {
        workTluka = taluka?.filter(item => item.DISTRICT_ID == formData.WORKING_DISTRICT)
    }

    let talukaData = taluka
    if (formData.DISTRICT !== null && formData.DISTRICT !== 0 && formData.DISTRICT !== undefined) {
        talukaData = taluka?.filter(item => item.DISTRICT_ID == formData.DISTRICT)
    }

    const getDropDownData = async () => {
        try {
            const resDistrict = await apiPost("api/district/get", {});
            const resCourse = await apiPost("api/university/get", {});
            const resTaluka = await apiPost("api/taluka/get", {});
            const resCast = await apiPost("api/cast/get", {});
            setTaluka(resTaluka.data)
            setDistrict(resDistrict.data)
            setCourse(resCourse.data)
            setCast(resCast.data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (data?.ID !== undefined) {
            setFormData(data);
        }
        getDropDownData();
    }, [data]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = await validate()
        if (!errors) {
            try {
                setLoader(true);
                if (!formData.ID) {
                    formData.APPROVED_DATE = new Date().toISOString().slice(0, 19).replace('T', ' ');
                }
                const method = formData.ID ? 'api/member/update' : 'api/member/register';
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
            }finally{
                setLoader(false);
            }
        } else {
            toast.warn('Please fill all required fields');
            console.log('validation error')
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setValidation({});
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    const handleUpload = async (e, name, url) => {
        try {
            setLoader(true);
            e.preventDefault();
            const file = e.target.files[0];
            const res = await apiUpload(url, file);
            if (res.code === 200) {
                setFormData({ ...formData, [name]: res.name });
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
                        <div className="relative w-screen" style={{ maxWidth: 'calc(100vw - 15rem)' }}>
                            <div className="h-full rounded-l-xl flex flex-col bg-white shadow-xl">
                                <ToastContainer />
                                <div className="px-4 sm:px-6">
                                    <div className="flex h-16 items-center border-b justify-between sticky top-0 bg-white z-10">
                                        <h2 className="text-lg font-bold text-gray-900">{formData.ID ? 'Update Member' : 'Add Member'}</h2>
                                        <div className="ml-3 h-7 flex items-center">
                                            <button className="bg-white rounded-md " onClick={resetForm}>
                                                <IoCloseCircleOutline className="h-7 w-7 hover:text-red-500 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative flex-1 overflow-y-auto px-4 sm:px-6 bg-gray-50">
                                    {
                                        loader && <Loader />
                                    }
                                    <form onSubmit={handleSubmit} className={`${loader ? 'hidden' : ''} py-4`}>
                                        <div className="flex gap-4">
                                            <div className='w-1/2'>
                                                <label htmlFor="NAME" className="block pl-1 mt-1 font-medium text-gray-700">Member Name <span className='text-red-500'>*</span></label>
                                                <input type="text" name="NAME" id="NAME" className="mt-1 p-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.NAME} onChange={handleChange} />
                                                {validation.NAME && <span className='text-red-500 text-sm'>{validation.NAME}</span>}
                                            </div>
                                            <div className='w-1/4'>
                                                <label htmlFor="MOBILE_NUMBER" className="block pl-1 mt-1 font-medium text-gray-700">Mobile Number <span className='text-red-500'>*</span></label>
                                                <input type="Number" name="MOBILE_NUMBER" id="MOBILE_NUMBER" className="mt-1 p-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.MOBILE_NUMBER} onChange={handleChange} />
                                                {validation.MOBILE_NUMBER && <span className='text-red-500 text-sm'>{validation.MOBILE_NUMBER}</span>}
                                            </div>
                                            <div className='w-1/2'>
                                                <label htmlFor="EMAIL" className="block pl-1 mt-1 font-medium text-gray-700">Email <span className='text-red-500'>*</span></label>
                                                <input type="email" name="EMAIL" id="EMAIL" className="mt-1 p-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.EMAIL} onChange={handleChange} />
                                                {validation.EMAIL && <span className='text-red-500 text-sm'>{validation.EMAIL}</span>}
                                            </div>
                                        </div>
                                        <div className="mt-2 flex gap-4">
                                            <div className='w-1/2'>
                                                <label htmlFor="FATHER_NAME" className="block pl-1 mt-1 font-medium text-gray-700">Father Name</label>
                                                <input type="text" name="FATHER_NAME" id="FATHER_NAME" className="mt-1 p-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.FATHER_NAME} onChange={handleChange} />
                                            </div>
                                            <div className='w-1/4'>
                                                <label htmlFor="DATE_OF_BIRTH" className="block pl-1 mt-1 font-medium text-gray-700">Date of Birth</label>
                                                <input type="date" name="DATE_OF_BIRTH" id="DATE_OF_BIRTH" style={{ padding: '5px' }} className="mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.DATE_OF_BIRTH} onChange={handleChange} />
                                            </div>
                                            <div className="w-1/4">
                                                <label htmlFor="CAST" className="block pl-1 mt-1 font-medium text-gray-700">Cast</label>
                                                <select id="CAST" name="CAST" className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.CAST} onChange={handleChange}>
                                                    <option value="0" className="bg-blue-200">Select</option>
                                                    {
                                                        cast?.map((d) => <option key={d.ID} value={d.ID} className="bg-blue-200">{d.NAME}</option>)
                                                    }
                                                </select>
                                            </div>
                                            <div style={{ width: '23%' }}>
                                                <label htmlFor="IS_ACTIVE" className="block pl-1 mt-1 font-medium text-gray-700">Status</label>
                                                <button type="button" id="IS_ACTIVE" name="IS_ACTIVE" className=" w-full" onClick={() => setFormData({ ...formData, IS_ACTIVE: !formData.IS_ACTIVE })}>
                                                    {formData.IS_ACTIVE ? <LiaToggleOnSolid className="h-10 w-10 text-blue-500" /> : <LiaToggleOffSolid className="text-blue-500 h-10 w-10" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex gap-4">
                                            <div className='w-1/2'>
                                                <label htmlFor="ADDRESS" className="block pl-1 mt-1 font-medium text-gray-700">Address</label>
                                                <input type="text" name="ADDRESS" id="ADDRESS" className="mt-1 p-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.ADDRESS} onChange={handleChange} />
                                            </div>
                                            <div className='w-1/4'>
                                                <label htmlFor="DURATION_OF_CURRENT_ADDRESS" className="block pl-1 mt-1 font-medium text-gray-700">Duration of Current Address</label>
                                                <input type="text" name="DURATION_OF_CURRENT_ADDRESS" id="DURATION_OF_CURRENT_ADDRESS" className="mt-1 p-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.DURATION_OF_CURRENT_ADDRESS} onChange={handleChange} />
                                            </div>
                                            <div className='w-1/4'>
                                                <label htmlFor="PIN_CODE" className="block pl-1 mt-1 font-medium text-gray-700">Pin Code</label>
                                                <input type="Number" name="PIN_CODE" id="PIN_CODE" className="mt-1 p-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.PIN_CODE} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="mt-2 flex gap-4">
                                            <div className='w-1/3'>
                                                <label htmlFor="VILLAGE" className="block pl-1 mt-1 font-medium text-gray-700">Village</label>
                                                <input type="text" name="VILLAGE" id="VILLAGE" style={{ padding: '5px' }} className="mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.VILLAGE} onChange={handleChange} />
                                            </div>
                                            <div className="w-1/3">
                                                <label htmlFor="DISTRICT" className="block pl-1 mt-1 font-medium text-gray-700">District</label>
                                                <select id="DISTRICT" name="DISTRICT" className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.DISTRICT} onChange={handleChange}>
                                                    <option value="0" className="bg-blue-200">Select</option>
                                                    {
                                                        district?.map((d) => <option key={d.ID} value={d.ID} className="bg-blue-200">{d.NAME}</option>)
                                                    }
                                                </select>
                                            </div>
                                            <div className="w-1/3">
                                                <label htmlFor="TALUKA" className="block pl-1 mt-1 font-medium text-gray-700">Taluka</label>
                                                <select id="TALUKA" name="TALUKA" className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.TALUKA} onChange={handleChange}>
                                                    <option value="0" className="bg-blue-200">Select</option>
                                                    {
                                                        talukaData?.map((d) => <option key={d.ID} value={d.ID} className="bg-blue-200">{d.NAME}</option>)
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex gap-4">
                                            <div className='w-1/3'>
                                                <label htmlFor="EDUCATIONAL_QUALIFICATION" className="block pl-1 mt-1 font-medium text-gray-700">Educational Qualification</label>
                                                <input type="text" name="EDUCATIONAL_QUALIFICATION" id="EDUCATIONAL_QUALIFICATION" style={{ padding: '5px' }} className="mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.EDUCATIONAL_QUALIFICATION} onChange={handleChange} />
                                            </div>
                                            <div className='w-1/3'>
                                                <label htmlFor="PROF_EDUCATION_QUALIFICATION" className="block pl-1 mt-1 font-medium text-gray-700">Prof. Educational Qualification</label>
                                                <input type="text" name="PROF_EDUCATION_QUALIFICATION" id="PROF_EDUCATION_QUALIFICATION" style={{ padding: '5px' }} className="mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.PROF_EDUCATION_QUALIFICATION} onChange={handleChange} />
                                            </div>
                                            <div className="w-1/3">
                                                <label htmlFor="VET_STOCKMAN_TRANING_COURSE" className="block pl-1 mt-1 font-medium text-gray-700">Vet. Stockman Training Course</label>
                                                <select id="VET_STOCKMAN_TRANING_COURSE" name="VET_STOCKMAN_TRANING_COURSE" className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.VET_STOCKMAN_TRANING_COURSE} onChange={handleChange}>
                                                    <option value="0" className="bg-blue-200">Select</option>
                                                    {
                                                        course?.filter(item => item.TYPE === 'A')?.map((d) => <option key={d.ID} value={d.ID} className="bg-blue-200">{d.NAME}</option>)
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex gap-4">
                                            <div className="w-1/3">
                                                <label htmlFor="LIVESTOCK_SUPERVISOR_COURSE" className="block pl-1 mt-1 font-medium text-gray-700">Livestock Supervisor Course</label>
                                                <select id="LIVESTOCK_SUPERVISOR_COURSE" name="LIVESTOCK_SUPERVISOR_COURSE" className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.LIVESTOCK_SUPERVISOR_COURSE} onChange={handleChange}>
                                                    <option value="0" className="bg-blue-200">Select</option>
                                                    {
                                                        course?.filter(item => item.TYPE === 'B')?.map((d) => <option key={d.ID} value={d.ID} className="bg-blue-200">{d.NAME}</option>)
                                                    }
                                                </select>
                                            </div>
                                            <div className="w-1/3">
                                                <label htmlFor="DAIRY_BUSSINES_MANAGEMENT" className="block pl-1 mt-1 font-medium text-gray-700">Dairy Business Management</label>
                                                <select id="DAIRY_BUSSINES_MANAGEMENT" name="DAIRY_BUSSINES_MANAGEMENT" className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.DAIRY_BUSSINES_MANAGEMENT} onChange={handleChange}>
                                                    <option value="0" className="bg-blue-200">Select</option>
                                                    {
                                                        course?.filter(item => item.TYPE === 'C').map((d) => <option key={d.ID} value={d.ID} className="bg-blue-200">{d.NAME}</option>)
                                                    }
                                                </select>
                                            </div>
                                            <div className="w-1/3">
                                                <label htmlFor="DIPLOMA_IN_VETERINARY_MEDICINE" className="block pl-1 mt-1 font-medium text-gray-700">Diploma in Veterinaryinary Medicine</label>
                                                <select id="DIPLOMA_IN_VETERINARY_MEDICINE" name="DIPLOMA_IN_VETERINARY_MEDICINE" className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.DIPLOMA_IN_VETERINARY_MEDICINE} onChange={handleChange}>
                                                    <option value="0" className="bg-blue-200">Select</option>
                                                    {
                                                        course?.filter(item => item.TYPE === 'D')?.map((d) => <option key={d.ID} value={d.ID} className="bg-blue-200">{d.NAME}</option>)
                                                    }
                                                </select>
                                            </div>

                                        </div>
                                        <div className="mt-2 flex gap-4">
                                            <div className='w-1/3'>
                                                <label htmlFor="WORKING_CITY" className="block pl-1 mt-1 font-medium text-gray-700">Working City</label>
                                                <input type="text" name="WORKING_CITY" id="WORKING_CITY" style={{ padding: '5px' }} className="mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.WORKING_CITY} onChange={handleChange} />
                                            </div>
                                            <div className='w-1/3'>
                                                <label htmlFor="WORKING_CITY_PINCODE" className="block pl-1 mt-1 font-medium text-gray-700">Working City Pincode</label>
                                                <input type="Number" name="WORKING_CITY_PINCODE" id="WORKING_CITY_PINCODE" style={{ padding: '5px' }} className="mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.WORKING_CITY_PINCODE} onChange={handleChange} />
                                            </div>
                                            <div className="w-1/3">
                                                <label htmlFor="WORKING_DISTRICT" className="block pl-1 mt-1 font-medium text-gray-700">Working District</label>
                                                <select id="WORKING_DISTRICT" name="WORKING_DISTRICT" className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.WORKING_DISTRICT} onChange={handleChange}>
                                                    <option value="0" className="bg-blue-200">Select</option>
                                                    {
                                                        district?.map((d) => <option key={d.ID} value={d.ID} className="bg-blue-200">{d.NAME}</option>)
                                                    }
                                                </select>
                                            </div>
                                            <div className="w-1/3">
                                                <label htmlFor="WORKING_TALUKA" className="block pl-1 mt-1 font-medium text-gray-700">Working Taluka</label>
                                                <select id="WORKING_TALUKA" name="WORKING_TALUKA" className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.WORKING_TALUKA} onChange={handleChange}>
                                                    <option value="0" className="bg-blue-200" style={{ padding: '10px' }}>Select</option>
                                                    {
                                                        workTluka?.map((d) => <option key={d.ID} value={d.ID} className="bg-blue-100 ">{d.NAME}</option>)
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex gap-4">
                                            <div className='w-1/3'>
                                                <label htmlFor="WORK_MOBILE_NUMBER" className="block pl-1 mt-1 font-medium text-gray-700">Work Mobile Number</label>
                                                <input type="Number" name="WORK_MOBILE_NUMBER" id="WORK_MOBILE_NUMBER" style={{ padding: '5px' }} className="mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.WORK_MOBILE_NUMBER} onChange={handleChange} />
                                            </div>
                                            <div className='w-1/3'>
                                                <label htmlFor="WORK_EMAIL_ID" className="block pl-1 mt-1 font-medium text-gray-700">Work Email</label>
                                                <input type="e" name="WORK_EMAIL_ID" id="WORK_EMAIL_ID" style={{ padding: '5px' }} className="mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.WORK_EMAIL_ID} onChange={handleChange} />
                                                {validation.WORK_EMAIL_ID && <span className='text-red-500 text-sm'>{validation.WORK_EMAIL_ID}</span>}
                                            </div>
                                            <div className='w-1/3'>
                                                <label htmlFor="WORK_DURATION" className="block pl-1 mt-1 font-medium text-gray-700">Work Duration</label>
                                                <input type="text" name="WORK_DURATION" id="WORK_DURATION" style={{ padding: '5px' }} className="mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.WORK_DURATION} onChange={handleChange} />
                                            </div>
                                            <div className='w-1/3'>
                                                <label htmlFor="INTERESTED_PLACES_TO_WORK" className="block pl-1 mt-1 font-medium text-gray-700">Interested Palce to Work</label>
                                                <input type="text" name="INTERESTED_PLACES_TO_WORK" id="INTERESTED_PLACES_TO_WORK" style={{ padding: '5px' }} className="mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.INTERESTED_PLACES_TO_WORK} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="mt-2 flex gap-4">
                                            <div className='w-1/3'>
                                                <label htmlFor="CONCENTERS_NAME" className="block pl-1 mt-1 font-medium text-gray-700">Concenters Name</label>
                                                <input type="text" disabled={formData.ID} name="CONCENTERS_NAME" id="CONCENTERS_NAME" style={{ padding: '5px' }} className="mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.CONCENTERS_NAME} onChange={handleChange} />
                                            </div>
                                            <div className='w-1/3'>
                                                <label htmlFor="CONCENTERS_ADDRESS" className="block pl-1 mt-1 font-medium text-gray-700">Concenters Address</label>
                                                <input type="text" disabled={formData.ID} name="CONCENTERS_ADDRESS" id="CONCENTERS_ADDRESS" style={{ padding: '5px' }} className="mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.CONCENTERS_ADDRESS} onChange={handleChange} />
                                            </div>
                                            <div className='w-1/3'>
                                                <label htmlFor="CONCENTERS_MOBILE_NUMBER" className="block pl-1 mt-1 font-medium text-gray-700">Concenters Mobile Number</label>
                                                <input type="Number" disabled={formData.ID} name="CONCENTERS_MOBILE_NUMBER" id="CONCENTERS_MOBILE_NUMBER" style={{ padding: '5px' }} className="mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.CONCENTERS_MOBILE_NUMBER} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="mt-2 flex gap-4">
                                            <div className='w-1/3'>
                                                <label htmlFor="APPLICATION_PLACE" className="block pl-1 mt-1 font-medium text-gray-700">Application Place</label>
                                                <input type="text" disabled={formData.ID} name="APPLICATION_PLACE" id="APPLICATION_PLACE" style={{ padding: '5px' }} className="mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.APPLICATION_PLACE} onChange={handleChange} />
                                            </div>
                                            <div className='w-1/3'>
                                                <label htmlFor="APPLICATION_DATE_TIME" className="block pl-1 mt-1 font-medium text-gray-700">Application Date</label>
                                                <input type="date" disabled={formData.ID} name="APPLICATION_DATE_TIME" id="APPLICATION_DATE_TIME" style={{ padding: '5px' }} className="mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={formData.APPLICATION_DATE_TIME} onChange={handleChange} />
                                            </div>
                                            <div className='w-1/3'>
                                                <label htmlFor="MEMBER_SIGN" className="block pl-1 mt-1 font-medium text-gray-700">Member Sign</label>
                                                <input ref={fileInputRef} disabled={formData.ID} type="file" name="MEMBER_SIGN" id="MEMBER_SIGN" className="mt-1 p-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => handleUpload(e, 'MEMBER_SIGN', 'upload/memberSign')} />
                                            </div>
                                        </div>
                                        <div className="mt-2 flex gap-4">
                                            <div className='w-1/3'>
                                                <label htmlFor='PROFILE_PHOTO' className="block pl-1 mt-1 font-medium text-gray-700">Profile Photo</label>
                                                <input ref={fileInputRef} type="file" name="PROFILE_PHOTO" id="PROFILE_PHOTO" className="mt-1 p-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => handleUpload(e, 'PROFILE_PHOTO', 'upload/profilePhoto')} />
                                            </div>
                                            <div className='w-1/3'>
                                                <label htmlFor="ADHAR_CARD" className="block pl-1 mt-1 font-medium text-gray-700">Adhar Card</label>
                                                <input ref={fileInputRef} type="file" name="ADHAR_CARD" id="ADHAR_CARD" className="mt-1 p-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => handleUpload(e, 'ADHAR_CARD', 'upload/adharCard')} />
                                            </div>
                                            <div className='w-1/3'>
                                                <label htmlFor='PAN_CARD' className="block pl-1 mt-1 font-medium text-gray-700">PAN Card</label>
                                                <input ref={fileInputRef} type="file" name="PAN_CARD" id="PAN_CARD" className="mt-1 p-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => handleUpload(e, 'PAN_CARD', 'upload/panCard')} />
                                            </div>
                                        </div>
                                        <div className="mt-2 flex gap-4">
                                            <div className='w-1/3'>
                                                <label htmlFor="LEAVING_CERTIFICATE" className="block pl-1 mt-1 font-medium text-gray-700">School Leaving Certificate</label>
                                                <input ref={fileInputRef} type="file" name="LEAVING_CERTIFICATE" id="LEAVING_CERTIFICATE" className="mt-1 p-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => handleUpload(e, 'LEAVING_CERTIFICATE', 'upload/leavingCretificate')} />
                                            </div>
                                            <div className='w-1/3'>
                                                <label htmlFor="EDUCATIONAL_CERTIFICATE" className="block pl-1 mt-1 font-medium text-gray-700">Educational Certificate</label>
                                                <input ref={fileInputRef} type="file" name="EDUCATIONAL_CERTIFICATE" id="EDUCATIONAL_CERTIFICATE" className="mt-1 p-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => handleUpload(e, 'EDUCATIONAL_CERTIFICATE', 'upload/educationalCretificate')} />
                                            </div>
                                            <div className='w-1/3'>
                                                <label htmlFor="EXPERIENCE_LETTER" className="block pl-1 mt-1 font-medium text-gray-700">Experience Letter</label>
                                                <input ref={fileInputRef} type="file" name="EXPERIENCE_LETTER" id="EXPERIENCE_LETTER" className="mt-1 p-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => handleUpload(e, 'EXPERIENCE_LETTER', 'upload/experienceLetter')} />
                                            </div>
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

export default MemberDrawer;

import React, { useState, useEffect } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { apiPost } from '../utils/api';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlanPreview = ({ isOpen, onClose, id }) => {
    const [fetchData, setFetchData] = useState({
        MEMBER_ID: id,
        PLAN_ID: "",
        TAKEN_DATETIME: null,
        TYPE: ""
    });

    const [plans, setPlans] = useState([]);
    const [isMap, setIsMap] = useState(false);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (id) {
            getData();
        }
    }, [id]);

    const getData = async () => {
        setLoader(true);
        try {
            const res = await apiPost('api/memberPlanMapping/get', {
                filter: `AND MEMBER_ID = ${id} AND STATUS = 1`,
                sortKey: "ID",
                sortValue: "DESC",
                pageSize: 1,
                pageIndex: 1
            });
            const resPlan = await apiPost('api/plan/get', {});
            setFetchData(res?.data[0]);
            setPlans(resPlan.data);
        } catch (error) {
            console.error('API call failed:', error);
        } finally {
            setLoader(false);
        }
    };

    const closeView = () => {
        setIsMap(false);
        onClose();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const type = plans.find((plan) => plan.ID == fetchData?.PLAN_ID).TYPE;
        fetchData.TYPE = type;
        fetchData.MEMBER_ID = id;
        try {
            const res = await apiPost('api/memberPlanMapping/mapPlan', fetchData)
            if (res.code === 200) {
                toast.success(res.message);
                closeView();
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFetchData({ ...fetchData, [name]: newValue });
    };

    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center ${isOpen ? '' : 'hidden'}`}>
            <div style={{ width: '500px' }} className="bg-white p-6 rounded-lg shadow-lg">
                <ToastContainer />
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{isMap ? 'Member Plan Mapping' : 'Member Plan Details'}</h2>
                    <button className="text-gray-600 hover:text-red-500" onClick={closeView}>
                        <IoCloseCircleOutline className="h-7 w-7" />
                    </button>
                </div>
                {
                    loader ? <div className='h-24 w-96 flex justify-center items-center m-4'> <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"> </div></div> :

                        fetchData?.ID ? (
                            <div className="p-8 bg-gray-50 rounded-lg shadow-inner">
                                <div className="grid grid-cols-[120px_1fr] gap-1">
                                    <p className="text-md text-gray-700 ">
                                        <span className="font-semibold">Plan Name</span>
                                    </p>
                                    <p className="text-md text-gray-700 ">: {fetchData?.NAME}</p>

                                    <p className="text-md text-gray-700 ">
                                        <span className="font-semibold">Plan Amount</span>
                                    </p>
                                    <p className="text-md text-gray-700 ">: {fetchData?.AMOUNT}</p>

                                    <p className="text-md text-gray-700 ">
                                        <span className="font-semibold">Plan Type</span>
                                    </p>
                                    <p className="text-md text-gray-700 ">
                                        : {fetchData?.TYPE === "Y" ? "Yearly" : fetchData?.TYPE === "M" ? "Monthly" : fetchData?.TYPE === "LT" ? "Lifetime" : ""}
                                    </p>

                                    <p className="text-md text-gray-700 ">
                                        <span className="font-semibold">Taken Date</span>
                                    </p>
                                    <p className="text-md text-gray-700 ">
                                        : {fetchData?.TAKEN_DATETIME ? new Date(fetchData?.TAKEN_DATETIME).toLocaleString() : ''}
                                    </p>

                                    <p className="text-md text-gray-700 ">
                                        <span className="font-semibold">Is Active</span>
                                    </p>
                                    <p className="text-md text-gray-700 ">: {fetchData?.STATUS === 1 ? "Yes" : "No"}</p>

                                    <p className="text-md text-gray-700 ">
                                        <span className="font-semibold">Validity</span>
                                    </p>
                                    <p className="text-md text-gray-700 ">
                                        : {fetchData?.END_DATE ? new Date(fetchData?.END_DATE).toLocaleDateString() : ''}
                                    </p>
                                </div>
                            </div>
                        ) : isMap ? (
                            <div className="p-8 pb-0 bg-gray-50 rounded-lg shadow-inner">
                                <form onSubmit={handleSubmit} >
                                    <div className="mt-4">
                                        <label htmlFor="PLAN_ID" className="block text-sm font-medium text-gray-700">Select Plan</label>
                                        <select id="PLAN_ID" name="PLAN_ID" className="mt-1 p-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={fetchData?.PLAN_ID} onChange={handleChange}>
                                            <option value="" className="bg-blue-200">Select</option>
                                            {
                                                plans?.map((d) => <option key={d.ID} value={d.ID} className="bg-blue-200">{d.NAME}</option>)
                                            }
                                        </select>
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="TAKEN_DATETIME" className="block text-sm font-medium text-gray-700">Taken Date</label>
                                        <input type="date" name="TAKEN_DATETIME" id="TAKEN_DATETIME" className="mt-1 p-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={fetchData?.TAKEN_DATETIME} onChange={handleChange} />
                                    </div>
                                </form>
                                <div className="flex justify-end px-4 sm:px-6 sticky bottom-0 h-14 items-center z-10 mt-6">
                                    <button type="button" className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-normal px-4 py-1.5 rounded" onClick={closeView}>Cancel</button>
                                    <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-normal px-4 py-1.5 rounded" onClick={handleSubmit}>Submit</button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-10 bg-gray-50 rounded-lg shadow-inner flex flex-col justify-center items-center">
                                <p className="text-lg text-gray-700 pb-5">Currently This Member Has No Plan</p>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4" onClick={() => setIsMap(true)}>Map Plan</button>
                            </div>
                        )
                }
            </div>
        </div>
    );
};

export default PlanPreview;

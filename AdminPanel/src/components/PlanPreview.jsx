import React, { useState, useEffect } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { apiPost } from '../utils/api';
import 'react-toastify/dist/ReactToastify.css';

const PlanPreview = ({ isOpen, onClose, id }) => {
    const [fetchData, setFetchData] = useState({});
    const [plans, setPlans] = useState([]);
    const [isMap, setIsMap] = useState(false);
    useEffect(() => {
        getData();
    }, [id]);

    const getData = async () => {
        try {
            const res = await apiPost('api/memberPlanMapping/get', {
                filter: `AND MEMBER_ID = ${id} AND STATUS = 1`,
                sortKey: "ID",
                sortValue: "DESC",
                pageSize: 1,
                pageIndex: 1
            });
            const resPlan = await apiPost('api/memberPlanMapping/get', {});
            setFetchData(res.data[0]);

        } catch (error) {
            console.error('API call failed:', error);
        }
    };

    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center ${isOpen ? '' : 'hidden'}`}>
            <div style={{ width: '500px' }} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Member Plan Details</h2>
                    <button className="text-gray-600 hover:text-red-500" onClick={onClose}>
                        <IoCloseCircleOutline className="h-7 w-7" />
                    </button>
                </div>
                {
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
                        <p className="text-md text-gray-700">No Data Found</p>
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

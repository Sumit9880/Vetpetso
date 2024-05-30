import React, { useState, useEffect } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { apiPost } from '../utils/api';
import 'react-toastify/dist/ReactToastify.css';

const PlanPreview = ({ isOpen, onClose, id }) => {
    const [fetchData, setFetchData] = useState([]);

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
            if (res.code === 200) {
                setFetchData(res.data[0]);
            } else {
                console.error('Failed to get member:', res.message);
            }
        } catch (error) {
            console.error('API call failed:', error);
        }
    };

    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center ${isOpen ? '' : 'hidden'}`}>
            <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Member Plan Details</h2>
                    <button className="text-gray-600 hover:text-red-500" onClick={onClose}>
                        <IoCloseCircleOutline className="h-7 w-7" />
                    </button>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
                    <p className="text-md text-gray-700 mb-2"><span className="font-semibold">Plan Name : </span> {fetchData?.NAME}</p>
                    <p className="text-md text-gray-700 mb-2"><span className="font-semibold">Plan Amount : </span> {fetchData?.AMOUNT}</p>
                    <p className="text-md text-gray-700 mb-2">
                        <span className="font-semibold">Plan Type : </span> {fetchData?.TYPE === "Y" ? "Yearly" : fetchData?.TYPE === "M" ? "Monthly" : fetchData?.TYPE === "LT" ? "Lifetime" : ""}
                    </p>
                    <p className="text-md text-gray-700 mb-2"><span className="font-semibold">Taken Date : </span> {fetchData?.TAKEN_DATETIME ? new Date(fetchData?.TAKEN_DATETIME).toLocaleString() : ''}</p>
                    <p className="text-md text-gray-700 mb-2"><span className="font-semibold">Is Active : </span> {fetchData?.STATUS === 1 ? "Yes" : "No"}</p>
                    <p className="text-md text-gray-700"><span className="font-semibold">Validity : </span> {fetchData?.END_DATE ? new Date(fetchData?.END_DATE).toLocaleDateString() : ''}</p>
                </div>
            </div>

        </div>
    );
};

export default PlanPreview;

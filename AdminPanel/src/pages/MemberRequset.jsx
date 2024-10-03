import React, { useState, useEffect, useCallback } from 'react';
import { apiPost } from "../utils/api";
import { IoEyeOutline } from "react-icons/io5";
import MemberPreview from '../components/MemberPreview';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

function MemberRequsets() {
    const [memberRequsets, setMemberRequsets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState({
        pages: 1,
        current: 1,
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [memberRequset, setMemberRequset] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        getData();
    }, [searchTerm, pageIndex.current, pageSize, isDrawerOpen]); // Add isDrawerOpen to dependencies

    const getData = useCallback(async () => {
        setLoader(true);
        try {
            const filter = searchTerm ? `AND (NAME LIKE '%${searchTerm}%' OR EMAIL LIKE '%${searchTerm}%') AND STATUS IN ("P","R")` : ' AND STATUS IN ("P","R")';
            const res = await apiPost("api/member/get", {
                filter,
                pageSize,
                pageIndex: pageIndex.current,
                sortKey: "LASTUPDATED",
                sortValue: "DESC"
            });

            if (res.code === 200) {
                setMemberRequsets(res.data);
                let NPages = Math.ceil(res.count / pageSize) ? Math.ceil(res.count / pageSize) : 1;
                setPageIndex({
                    ...pageIndex,
                    pages: NPages,
                })
            } else {
                console.error("Failed to fetch MemberRequsets:", res.message);
            }
        } catch (error) {
            console.error("API call failed:", error);
        } finally {
            setLoader(false);
        }
    }, [searchTerm, pageIndex.current, pageSize]);

    const handleSearch = useCallback(async (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
        setPageIndex({ pages: 1, current: 1 });
    }, []);
    const handleOpenDrawer = (data) => {
        setMemberRequset(data);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <div className="container mx-auto p-3 bg-gray-50 rounded h-full">
            <div className='flex justify-between my-2 items-center'>
                <h1 className="text-2xl font-bold mb-2 text-start">Member Requsets</h1>
                <div className="flex justify-end mb-2">
                    <input
                        type="text"
                        placeholder="Search Member Requsets..."
                        id='memberRequsetSearch'
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-64 h-9 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 px-2 mx-4 py-1"
                    />
                </div>
            </div>
            <MemberPreview isOpen={isDrawerOpen} onClose={handleCloseDrawer} data={memberRequset} />
            <div className="overflow-x-auto" style={{ height: 'calc(100vh - 214px)' }}>
                {/* <div className="max-h-96 overflow-y-auto"> */}
                <table className="table-auto w-full border-collapse rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 rounded-lg">
                            <th className="px-2 py-2 border border-gray-300">Actions</th>
                            <th className="px-2 py-2 border border-gray-300">Name</th>
                            <th className="px-2 py-2 border border-gray-300">Mobile No</th>
                            <th className="px-2 py-2 border border-gray-300">Address</th>
                            <th className="px-2 py-2 border border-gray-300">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {memberRequsets?.map(memberRequset => (
                            <tr key={memberRequset.ID} className="bg-white">
                                <td className="px-2 border border-gray-200 text-center">
                                    <button className="py-2 text-center" onClick={() => handleOpenDrawer(memberRequset)}><IoEyeOutline className="text-blue-500 hover:text-blue-700 h-5 w-5" /></button>
                                </td>
                                <td className="px-2 border border-gray-200">{memberRequset.NAME}</td>
                                <td className="px-2 border border-gray-200 text-center">{memberRequset.MOBILE_NUMBER}</td>
                                <td className="px-2 border border-gray-200">{memberRequset.ADDRESS}</td>
                                <td className={`px-2 border border-gray-200 text-center${memberRequset.IS_ACTIVE ? " text-green-500" : " text-red-500"}`}>{memberRequset.IS_ACTIVE ? "On" : "Off"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {memberRequsets.length > 0 || loader ? null :
                    <div className='item-center w-full mt-10'>
                        <img
                            id="noData"
                            src="./empty.png"
                            className="h-28 rounded-lg mx-auto"
                            alt="No Data"
                        />
                        <h1 className='text-center text-xl font-semibold text-gray-400'>No Member Requsets</h1>
                    </div>}
                {
                    loader && <Loader />
                }
                {/* </div> */}
                <Pagination
                    pages={pageIndex.pages}
                    current={pageIndex.current}
                    onPageChange={(page) => setPageIndex({ ...pageIndex, current: page })}
                />
            </div>
        </div >
    );
}

export default MemberRequsets;

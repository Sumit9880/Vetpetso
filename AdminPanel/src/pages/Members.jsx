import React, { useState, useEffect, useCallback } from 'react';
import { apiPost } from "../utils/api";
import { LiaEditSolid } from "react-icons/lia";
import MemberDrawer from '../components/MemberDrawer';
import Pagination from '../components/Pagination';
import MemberPreview from '../components/MemberPreview';
import { IoEyeOutline } from "react-icons/io5";
import PlanPreview from '../components/PlanPreview';
import { ToastContainer } from 'react-toastify';
import Loader from '../components/Loader';

function Members() {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState({
        pages: 1,
        current: 1,
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [preview, setPreview] = useState({
        member: false,
        plan: false,
    });
    const [member, setMember] = useState({});
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        getData();
    }, [searchTerm, pageIndex.current, pageSize, isDrawerOpen]); // Add isDrawerOpen to dependencies

    const getData = useCallback(async () => {
        setLoader(true);
        try {
            const filter = searchTerm ? ` AND STATUS = "A" AND (NAME LIKE '%${searchTerm}%' OR EMAIL LIKE '%${searchTerm}%')` : ' AND STATUS = "A"';
            const res = await apiPost("api/member/get", {
                filter,
                pageSize,
                pageIndex: pageIndex.current,
                sortKey: "LASTUPDATED",
                sortValue: "DESC"
            });

            if (res.code === 200) {
                setMembers(res.data);
                let NPages = Math.ceil(res.count / pageSize) ? Math.ceil(res.count / pageSize) : 1;
                setPageIndex({
                    ...pageIndex,
                    pages: NPages,
                })
            } else {
                console.error("Failed to fetch Members:", res.message);
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
        setMember(data);
        setIsDrawerOpen(true);
    };

    const handleOpenPreview = (data, type) => {
        setMember(data);
        setPreview({ ...preview, [type]: true });
        // setPreview({ ...preview, member: true });
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <div className="container mx-auto p-3 bg-gray-100 rounded h-full">
            <ToastContainer />
            <div className='flex justify-between my-2 items-center'>
                <h1 className="text-2xl font-bold mb-2 text-start">Member Management</h1>
                <div className="flex justify-end mb-2">
                    <input
                        type="text"
                        placeholder="Search Members..."
                        id="membersSearch"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-64 h-9 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-1"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-sm text-white font-bold px-4 h-9 rounded mx-4"
                        onClick={() => handleOpenDrawer({})}
                    >
                        Add Member
                    </button>
                    <MemberDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} data={member} />
                    <PlanPreview isOpen={preview.plan} onClose={() => setPreview({ ...preview, plan: false })} id={member.ID} />
                    <MemberPreview isOpen={preview.member} onClose={() => setPreview({ ...preview, member: false })} data={member} />
                </div>
            </div>
            <div className="overflow-x-auto overflow-y-auto" style={{ height: 'calc(100vh - 214px)' }}>
                {/* <div className="overflow-y-auto"> */}
                <table className="table-auto w-full border-collapse rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 rounded-lg">
                            <th className="px-2 py-2 border border-gray-300">Name</th>
                            <th className="px-2 py-2 border border-gray-300">Mobile No</th>
                            <th className="px-2 py-2 border border-gray-300">Address</th>
                            <th className="px-2 py-2 border border-gray-300">Plan</th>
                            <th className="px-2 py-2 border border-gray-300">Status</th>
                            <th className="px-2 py-2 border border-gray-300">Plan Details</th>
                            <th className="px-2 py-2 border border-gray-300">View</th>
                            <th className="px-2 py-2 border border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members?.map(member => (
                            <tr key={member.ID} className="bg-white">
                                <td className="px-2 border border-gray-200">{member.NAME}</td>
                                <td className="px-2 border border-gray-200 text-center">{member.MOBILE_NUMBER}</td>
                                <td className="px-2 border border-gray-200">{member.ADDRESS}</td>
                                <td className="px-2 border border-gray-200">{member.PLAN_NAME}</td>
                                <td className={`px-2 border border-gray-200 text-center${member.IS_ACTIVE ? " text-green-500" : " text-red-500"}`}>{member.STATUS ? "On" : "Off"}</td>
                                <td className="px-2 border border-gray-200 text-center">
                                    <button className="py-2 text-center" onClick={() => handleOpenPreview(member, "plan")}><IoEyeOutline className="text-blue-500 hover:text-blue-700 h-5 w-5" /></button>
                                </td>
                                <td className="px-2 border border-gray-200 text-center">
                                    <button className="py-2 text-center" onClick={() => handleOpenPreview(member, "member")}><IoEyeOutline className="text-blue-500 hover:text-blue-700 h-5 w-5" /></button>
                                </td>
                                <td className="px-2 border border-gray-200 text-center">
                                    <button className="py-2 text-center" onClick={() => handleOpenDrawer(member)}><LiaEditSolid className="text-blue-500 hover:text-blue-700 h-5 w-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {members.length > 0 || loader ? null :
                    <div className='item-center w-full mt-10'>
                        <img
                            id="noData"
                            src="./empty.png"
                            className="h-28 rounded-lg mx-auto"
                            alt="No Data"
                        />
                        <h1 className='text-center text-xl font-semibold text-gray-400'>No Data</h1>
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

export default Members;

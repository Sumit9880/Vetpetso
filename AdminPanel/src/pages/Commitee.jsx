import React, { useState, useEffect, useCallback } from 'react';
import { apiPost, STATIC_URL } from "../utils/api";
import { LiaEditSolid } from "react-icons/lia";
import CommiteeDrawer from '../components/CommiteeDrawer';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

function Commitee() {
    const [commities, setCommities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState({
        pages: 1,
        current: 1,
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [commitee, setCommitee] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        getData();
    }, [searchTerm, pageIndex.current, pageSize, isDrawerOpen]);

    const getData = useCallback(async () => {
        setLoader(true);
        try {
            const filter = searchTerm ? `AND (TITLE LIKE '%${searchTerm}%' OR SUMMARY LIKE '%${searchTerm}%')` : '';
            const res = await apiPost("api/commitee/get", {
                filter,
                pageSize,
                pageIndex: pageIndex.current,
                sortKey: "LASTUPDATED",
                sortValue: "DESC"
            });

            if (res.code === 200) {
                setCommities(res.data);
                let NPages = Math.ceil(res.count / pageSize) ? Math.ceil(res.count / pageSize) : 1;
                setPageIndex({
                    ...pageIndex,
                    pages: NPages,
                })
            } else {
                console.error("Failed to fetch commities:", res.message);
            }
        } catch (error) {
            console.error("API call failed:", error);
        } finally {
            setLoader(false);
        }
    }, [searchTerm, pageIndex.current, pageSize]); // Memoize the getData function

    const handleSearch = useCallback(async (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
        setPageIndex({ pages: 1, current: 1 });
    }, []); // Memoize the handleSearch function

    const handleOpenDrawer = (data) => {
        setCommitee(data);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <div className="container mx-auto p-3 bg-gray-50 rounded h-full">
            <div className='flex justify-between my-2 items-center'>
                <h1 className="text-2xl font-bold mb-2 text-start">Commitee Master</h1>
                <div className="flex justify-end mb-2">
                    <input
                        type="text"
                        placeholder="Search commities..."
                        id='commiteeSearch'
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-64 h-9 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-1"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-sm text-white font-bold px-4 h-9 rounded mx-4"
                        onClick={() => handleOpenDrawer(null)}
                    >
                        Add New
                    </button>
                    <CommiteeDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} data={commitee} />
                </div>
            </div>
            <div className="overflow-x-auto" style={{ height: 'calc(100vh - 214px)' }}>
                {/* <div className="max-h-96 overflow-y-auto"> */}
                <table className="table-auto w-full border-collapse border border-gray-400 rounded-lg">
                    <thead className="bg-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-2 py-2 border border-gray-300 w-24">Image</th>
                            <th className="px-2 py-2 border border-gray-300 w-52">Name</th>
                            <th className="px-2 py-2 border border-gray-300">Message</th>
                            <th className="px-2 py-2 border border-gray-300">Position</th>
                            <th className="px-2 py-2 border border-gray-300">Status</th>
                            <th className="px-2 py-2 border border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commities?.map(commitee => (
                            <tr key={commitee.ID} className="bg-white">
                                <td className="p-2 border border-gray-200">
                                    <div className="flex items-center justify-center">
                                        <img src={STATIC_URL + "Commitee/" + commitee.URL} alt={commitee.NAME} className="w-16 h-16 rounded-full" />
                                    </div>
                                </td>
                                <td className="px-2 border border-gray-200">{commitee.NAME}</td>
                                <td className="px-2 border border-gray-200">{commitee.MESSAGE.length > 170 ? commitee.MESSAGE.substring(0, 170) + "..." : commitee.MESSAGE}</td>
                                <td className="px-2 border border-gray-200 text-center">{commitee.POSITION}</td>
                                <td className={`px-2 border border-gray-200 text-center${commitee.STATUS ? " text-green-500" : " text-red-500"}`}>{commitee.STATUS ? "On" : "Off"}</td>
                                <td className="px-2 border border-gray-200 text-center">
                                    <button className="py-2 text-center" onClick={() => handleOpenDrawer(commitee)}><LiaEditSolid className="text-blue-500 hover:text-blue-700 h-5 w-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {commities.length > 0 || loader ? null :
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

export default Commitee;

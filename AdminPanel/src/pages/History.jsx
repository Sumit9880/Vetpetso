import React, { useState, useEffect, useCallback } from 'react';
import { apiPost, STATIC_URL } from "../utils/api";
import { LiaEditSolid } from "react-icons/lia";
import HistoryDrawer from '../components/HistoryDrawer';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

function History() {
    const [histories, setHistories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState({
        pages: 1,
        current: 1,
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        getData();
    }, [searchTerm, pageIndex.current, pageSize, isDrawerOpen]); // Add isDrawerOpen to dependencies

    const getData = useCallback(async () => {
        setLoader(true);
        try {
            const filter = searchTerm ? `AND (TITLE LIKE '%${searchTerm}%' OR SUMMARY LIKE '%${searchTerm}%')` : '';
            const res = await apiPost("api/history/get", {
                filter,
                pageSize,
                pageIndex: pageIndex.current,
                sortKey: "LASTUPDATED",
                sortValue: "DESC"
            });

            if (res.code === 200) {
                setHistories(res.data);
                let NPages = Math.ceil(res.count / pageSize) ? Math.ceil(res.count / pageSize) : 1;
                setPageIndex({
                    ...pageIndex,
                    pages: NPages,
                })
            } else {
                console.error("Failed to fetch histories:", res.message);
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
        setHistory(data);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <div className="container mx-auto p-3 bg-gray-100 rounded h-full">
            <div className='flex justify-between my-2 items-center'>
                <h1 className="text-2xl font-bold mb-2 text-start">History Master</h1>
                <div className="flex justify-end mb-2">
                    <input
                        type="text"
                        placeholder="Search histories..."
                        id='historySearch'
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-64 h-9 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-1"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-sm text-white font-bold px-4 h-9 rounded mx-4"
                        onClick={() => handleOpenDrawer(null)}
                    >
                        Add History
                    </button>
                    <HistoryDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} data={history} />
                </div>
            </div>
            <div className="overflow-x-auto" style={{ height: 'calc(100vh - 214px)' }}>
                {/* <div className="max-h-96 overflow-y-auto"> */}
                <table className="table-auto w-full border-collapse border border-gray-400 rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 rounded-lg">
                            <th className="px-2 py-2 border border-gray-300 w-24">Image</th>
                            <th className="px-2 py-2 border border-gray-300">Summary</th>
                            <th className="px-2 py-2 border border-gray-300">History Date</th>
                            <th className="px-2 py-2 border border-gray-300">Status</th>
                            <th className="px-2 py-2 border border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {histories?.map(history => (
                            <tr key={history.ID} className="bg-white">
                                <td className="p-2 border border-gray-200">
                                    <div className="flex items-center justify-center">
                                        <img src={STATIC_URL + "History/" + history.URL} alt="history" className="w-16 h-16 rounded-full" />
                                    </div>
                                </td>
                                <td className="px-2 border border-gray-200">{history.SUMMARY.length > 170 ? history.SUMMARY.substring(0, 170) + "..." : history.SUMMARY}</td>
                                <td className="px-2 border border-gray-200 text-center">{new Date(history.DATE).toLocaleDateString("en-GB")}</td>
                                <td className={`px-2 border border-gray-200 text-center${history.STATUS ? " text-green-500" : " text-red-500"}`}>{history.STATUS ? "On" : "Off"}</td>
                                <td className="px-2 border border-gray-200 text-center">
                                    <button className="py-2 text-center" onClick={() => handleOpenDrawer(history)}><LiaEditSolid className="text-blue-500 hover:text-blue-700 h-5 w-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {histories.length > 0 || loader ? null :
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

export default History;

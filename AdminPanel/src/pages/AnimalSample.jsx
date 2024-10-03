import React, { useState, useEffect, useCallback } from 'react';
import { apiPost } from "../utils/api";
import { LiaEditSolid } from "react-icons/lia";
import AnimalSampleDrawer from '../components/AnimalSampleDrawer';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

function AnimalSample() {
    const [animalSamples, setAnimalSamples] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState({
        pages: 1,
        current: 1,
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [animalSample, setAnimalSample] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        getData();
    }, [searchTerm, pageIndex.current, pageSize, isDrawerOpen]); // Add isDrawerOpen to dependencies

    const getData = useCallback(async () => {
        setLoader(true);
        try {
            const filter = searchTerm ? `AND (NAME LIKE '%${searchTerm}%')` : '';
            const res = await apiPost("api/animalSample/get", {
                filter,
                pageSize,
                pageIndex: pageIndex.current,
                sortKey: "ID",
                sortValue: "ASC"
            });

            if (res.code === 200) {
                setAnimalSamples(res.data);
                let NPages = Math.ceil(res.count / pageSize) ? Math.ceil(res.count / pageSize) : 1;
                setPageIndex({
                    ...pageIndex,
                    pages: NPages,
                })
            } else {
                console.error("Failed to fetch :", res.message);
            }
        } catch (error) {
            console.error("API call failed:", error);
        }finally {
            setLoader(false);
        }
    }, [searchTerm, pageIndex.current, pageSize]); // Memoize the getData function

    const handleSearch = useCallback(async (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
        setPageIndex({ pages: 1, current: 1 });
    }, []); // Memoize the handleSearch function

    const handleOpenDrawer = (data) => {
        setAnimalSample(data);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <div className="container mx-auto p-3 bg-gray-50 rounded h-full">
            <div className='flex justify-between my-2 items-center'>
                <h1 className="text-2xl font-bold mb-2 text-start">Animal Samples</h1>
                <div className="flex justify-end mb-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        id='animalSampleSearch'
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
                    <AnimalSampleDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} data={animalSample} />
                </div>
            </div>
            <div className="overflow-x-auto" style={{ height: 'calc(100vh - 214px)' }}>
                {/* <div className=" overflow-y-auto"> */}
                <table className="table-auto w-full border-collapse border border-gray-400 rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 rounded-lg">
                            <th className="px-2 py-2 border border-gray-300">Seq No.</th>
                            <th className="px-2 py-2 border border-gray-300">Name</th>
                            <th className="px-2 py-2 border border-gray-300">Status</th>
                            <th className="px-2 py-2 border border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {animalSamples?.map(animalSample => (
                            <tr key={animalSample.ID} className="bg-white">
                                <td className="px-2 border border-gray-200">{animalSample.ID}</td>
                                <td className="px-2 border border-gray-200">{animalSample.NAME}</td>
                                <td className={`px-2 border border-gray-200 text-center${animalSample.STATUS ? " text-green-500" : " text-red-500"}`}>{animalSample.STATUS ? "On" : "Off"}</td>
                                <td className="px-2 border border-gray-200 text-center">
                                    <button className="py-2 text-center" onClick={() => handleOpenDrawer(animalSample)}><LiaEditSolid className="text-blue-500 hover:text-blue-700 h-5 w-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {animalSamples.length > 0 || loader ? null :
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

export default AnimalSample;

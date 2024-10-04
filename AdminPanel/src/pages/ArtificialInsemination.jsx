import React, { useState, useEffect, useCallback } from 'react';
import { apiPost } from "../utils/api";
import Pagination from '../components/Pagination';
import { ToastContainer } from 'react-toastify';
import { FiFilter } from "react-icons/fi";
import Loader from '../components/Loader';
import DatePickerComponent from '../components/DatePickerComponent';
import MultiSelectComponent from '../components/MultiSelectComponent';
import { BsPrinter } from "react-icons/bs";
import { TbFileExport } from "react-icons/tb";

function ArtificialInsemination() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState({
        pages: 1,
        current: 1,
    });
    const [loader, setLoader] = useState(false);

    let defaulFilter = {
        isDrawerOpen: false,
        startDate: null,
        endDate: null,
        taluka: null,
        districts: null
    }
    const [filters, setFilters] = useState(defaulFilter);
    const [filterOptions, setFilterOptions] = useState({
        taluka: [],
        districts: [],
    });

    const getDropDownData = async () => {
        try {
            const resDistrict = await apiPost("api/district/get", { filter: ` AND STATUS = 1` });
            const resTaluka = await apiPost("api/taluka/get", { filter: ` AND STATUS = 1` });
            setFilterOptions({
                taluka: resTaluka?.data?.map(item => ({
                    label: item.NAME,
                    value: item.ID
                }))
                ,
                districts: resDistrict?.data?.map(item => ({
                    label: item.NAME,
                    value: item.ID
                }))

            });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getData();
        getDropDownData()
    }, [searchTerm, pageIndex.current, pageSize, filters]);

    const getData = useCallback(async () => {
        setLoader(true);
        try {
            let filterConditions = ` `;

            if (filters.districts?.length) {
                filterConditions += ` AND DISTRICT IN (${filters.districts})`;
            }
            if (filters.taluka?.length) {
                filterConditions += ` AND TALUKA IN (${filters.taluka})`;
            }
            if (filters.startDate && filters.endDate) {
                filterConditions += ` AND REGISTRATION_DATE BETWEEN '${new Date(filters.startDate).toISOString().slice(0, 10)}' AND '${new Date(filters.endDate).toISOString().slice(0, 10)}'`
            }
            if (searchTerm) {
                filterConditions += ` AND (DOCTOR_NAME LIKE '%${searchTerm}%' OR MOBILE_NUMBER LIKE '%${searchTerm}%')`;
            }

            const res = await apiPost("api/aiDetails/get", {
                filter: filterConditions,
                pageSize,
                pageIndex: pageIndex.current,
                sortKey: "LASTUPDATED",
                sortValue: "DESC",
            });

            if (res.code === 200) {
                setData(res.data);
                const totalPages = Math.ceil(res.count / pageSize) || 1;
                setPageIndex(prev => ({ ...prev, pages: totalPages }));
            } else {
                console.error("Failed to fetch ArtificialInsemination:", res.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoader(false);
        }
    }, [searchTerm, pageIndex.current, pageSize, filters]);


    const handleSearch = useCallback(async (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
        setPageIndex({ pages: 1, current: 1 });
    }, []);

    const handleApply = () => {
        setFilters({ ...filters, isDrawerOpen: false });
        setPageIndex({ pages: 1, current: 1 });
        getData();
    };

    const handleClear = () => {
        setFilters(defaulFilter);
        setPageIndex({ pages: 1, current: 1 });
    };

    return (
        <div className="container mx-auto p-3 bg-gray-50 rounded h-full">
            <ToastContainer />
            <div className='flex justify-between my-2 items-center'>
                <h1 className="text-2xl font-bold mb-2 text-start">Artificial Insemination Report</h1>
                <div className="flex justify-end mb-2">
                    <div className='cursor-pointer flex items-center justify-center w-9 h-9 mr-2 border border-gray-300 bg-white p-1 rounded-lg' onClick={() => setFilters({ ...filters, isDrawerOpen: !filters.isDrawerOpen })}>
                        <TbFileExport size={20} className='text-gray-600 hover:text-gray-800' />
                    </div>
                    <div className='cursor-pointer flex items-center justify-center w-9 h-9 mr-2 border border-gray-300 bg-white p-1 rounded-lg' onClick={() => setFilters({ ...filters, isDrawerOpen: !filters.isDrawerOpen })}>
                        <FiFilter size={20} className='text-gray-600 hover:text-gray-800' />
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        id="ArtificialInseminationSearch"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-64 h-9 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-1"
                    />
                </div>
            </div>
            <div className="overflow-x-auto overflow-y-auto" style={{ height: 'calc(100vh - 214px)', width: 'calc(200vh - 100px)' }}>
                <div className={`text-center bg-gray-200 rounded-lg mb-2 ${filters.isDrawerOpen ? '' : 'hidden'} flex p-2`}>
                    <div className="">
                        <h1 className="block pl-1 font-medium text-gray-700 text-left">Registration Date:</h1>
                        <div className="flex items-center space-x-2">
                            <DatePickerComponent
                                label=""
                                selectedDate={filters.startDate}
                                onChangeDate={(date) => setFilters({ ...filters, startDate: date })}
                                placeholder="From Date"
                            />
                            <h1 className="text-center text-gray-500 font-medium">to</h1>
                            <DatePickerComponent
                                label=""
                                selectedDate={filters.endDate}
                                onChangeDate={(date) => setFilters({ ...filters, endDate: date })}
                                placeholder="To Date"
                            />
                        </div>
                    </div>
                    <div className='pl-2'>
                        <MultiSelectComponent
                            label="District:"
                            options={filterOptions.districts}
                            selectedOptions={filters.districts}
                            onChangeOptions={(selectedOptions) => setFilters({ ...filters, districts: selectedOptions })}
                            placeholder="Select district"
                            isMulti={true}
                        />
                    </div>
                    <div className='pl-2'>
                        <MultiSelectComponent
                            label="Taluka:"
                            options={filterOptions.taluka}
                            selectedOptions={filters.taluka}
                            onChangeOptions={(selectedOptions) => setFilters({ ...filters, taluka: selectedOptions })}
                            placeholder="Select taluka"
                            isMulti={true}
                        />
                    </div>
                    <div className='flex justify-center items-end pl-4'>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-sm text-white font-bold px-4 h-9 rounded"
                            onClick={handleApply}
                        >
                            Apply
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-700 text-sm text-white font-bold px-4 h-9 rounded mx-4"
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                    </div>

                </div>
                <table className="table-fixed w-full border-collapse rounded-lg">
                    <thead className="bg-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-2 py-2 border border-gray-300 w-20">Print</th>
                            <th className="px-2 py-2 border border-gray-300 w-48">Registration Date</th>
                            <th className="px-2 py-2 border border-gray-300 w-64">Doctor Name</th>
                            <th className="px-2 py-2 border border-gray-300 w-64">Owner Name</th>
                            <th className="px-2 py-2 border border-gray-300 w-32">Owner Mobile</th>
                            <th className="px-2 py-2 border border-gray-300 w-40">Animal Identity</th>
                            <th className="px-2 py-2 border border-gray-300 w-40">Animal Type</th>
                            <th className="px-2 py-2 border border-gray-300 w-40">Breed</th>
                            <th className="px-2 py-2 border border-gray-300 w-40">Semen Type</th>
                            <th className="px-2 py-2 border border-gray-300 w-64">Semen Company</th>
                            <th className="px-2 py-2 border border-gray-300 w-36">Semen Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map(item => (
                            <tr key={item.ID} className="bg-white">
                                <td className="px-2 border border-gray-200 text-center">
                                    <button className="py-2 text-center" ><BsPrinter className="text-blue-500 hover:text-blue-700 h-5 w-5" /></button>
                                </td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{new Date(item.REGISTRATION_DATE).toLocaleString('en-IN')}</td>
                                <td className="px-2 py-1.5 border border-gray-200">{item.DOCTOR_NAME}</td>
                                <td className="px-2 py-1.5 border border-gray-200">{item.OWNER_NAME}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.MOBILE_NUMBER}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.ANIMAL_IDENTITY_NO}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.ANIMAL_TYPE_NAME}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.BREED_NAME}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.SEMEN_TYPE}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.SEMEN_COMPANY_NAME}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.SEMEN_VOLUME}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.length > 0 || loader ? null :
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

export default ArtificialInsemination;

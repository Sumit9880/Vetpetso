import React, { useState, useEffect, useCallback } from 'react';
import { apiPost } from "../utils/api";
import Pagination from '../components/Pagination';
import { ToastContainer } from 'react-toastify';
import { FiFilter } from "react-icons/fi";
import Loader from '../components/Loader';
import DatePickerComponent from '../components/DatePickerComponent';
import MultiSelectComponent from '../components/MultiSelectComponent';

function MembersWiseCases() {
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
        districts: null,
        doctor: null
    }
    const [filters, setFilters] = useState(defaulFilter);
    const [filterOptions, setFilterOptions] = useState({
        taluka: [],
        districts: [],
        doctor: [],
    });

    const getDropDownData = async () => {
        try {
            const resDistrict = await apiPost("api/district/get", { filter: ` AND STATUS = 1` });
            const resTaluka = await apiPost("api/taluka/get", { filter: ` AND STATUS = 1` });
            const resDoctor = await apiPost("api/member/get", {});
            setFilterOptions({
                taluka: resTaluka?.data?.map(item => ({
                    label: item.NAME,
                    value: item.ID
                })),
                districts: resDistrict?.data?.map(item => ({
                    label: item.NAME,
                    value: item.ID
                })),
                doctor: resDoctor?.data?.map(item => ({
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
            if (filters.doctor?.length) {
                filterConditions += ` AND MEMBER_ID IN (${filters.doctor})`;
            }
            if (searchTerm) {
                filterConditions += ` AND (DOCTOR_NAME LIKE '%${searchTerm}%' OR MOBILE_NUMBER LIKE '%${searchTerm}%')`;
            }

            const res = await apiPost("api/summary/getMemberCount", {
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
                console.error("Failed to fetch MembersWiseCases:", res.message);
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
                <h1 className="text-2xl font-bold mb-2 text-start">Member Wise Summary</h1>
                <div className="flex justify-end mb-2">
                    <div className='cursor-pointer flex items-center justify-center w-9 h-9 mr-2 border border-gray-300 bg-white p-1 rounded-lg' onClick={() => setFilters({ ...filters, isDrawerOpen: !filters.isDrawerOpen })}>
                        <FiFilter size={20} className='text-gray-600 hover:text-gray-800' />
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        id="membersWiseCasesSearch"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-64 h-9 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-1"
                    />
                </div>
            </div>
            <div className="overflow-x-auto overflow-y-auto" style={{ height: 'calc(100vh - 214px)' }}>
                <div className={`text-center bg-gray-200 rounded-lg mb-2 ${filters.isDrawerOpen ? '' : 'hidden'} p-2`}>
                    <div className='flex justify-end items-end'>
                        <button
                            className="flex items-center justify-center h-9 mr-2 px-2 border text-blue-600 rounded-lg hover:text-blue-700"
                            onClick={handleClear}
                        >
                            Clear Filters
                        </button>
                    </div>
                    <div className='flex items-center'>
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
                                placeholder="Select District"
                                isMulti={true}
                            />
                        </div>
                        <div className='pl-2'>
                            <MultiSelectComponent
                                label="Taluka:"
                                options={filterOptions.taluka}
                                selectedOptions={filters.taluka}
                                onChangeOptions={(selectedOptions) => setFilters({ ...filters, taluka: selectedOptions })}
                                placeholder="Select Taluka"
                                isMulti={true}
                            />
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <div >
                            <MultiSelectComponent
                                label="Doctor Name:"
                                options={filterOptions.doctor}
                                selectedOptions={filters.doctor}
                                onChangeOptions={(selectedOptions) => setFilters({ ...filters, doctor: selectedOptions })}
                                placeholder="Select Doctor Name"
                                isMulti={true}
                            />
                        </div>
                    </div>
                </div>
                <table className="table-auto w-full border-collapse rounded-lg">
                    <thead className={`bg-gray-200 ${filters.isDrawerOpen ? '' : 'sticky top-0 z-10'} `}>
                        <tr>
                            <th className="px-2 py-2 border border-gray-300">Doctor Name</th>
                            <th className="px-2 py-2 border border-gray-300">Patient Cases</th>
                            <th className="px-2 py-2 border border-gray-300">Artificial Insemination</th>
                            <th className="px-2 py-2 border border-gray-300">Vaccination</th>
                            <th className="px-2 py-2 border border-gray-300">Open</th>
                            <th className="px-2 py-2 border border-gray-300">Closed</th>
                            <th className="px-2 py-2 border border-gray-300">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map(item => (
                            <tr key={item.ID} className="bg-white">
                                <td className="px-2 py-1.5 border border-gray-200">{item.DOCTOR_NAME}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.CASES}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.AI}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.VACCINATION}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center text-green-500">{item.CLOSED}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center text-red-500">{item.OPEN}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center text-orange-500">{item.TOTAL}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {data.length > 0 || loader ? null : (
                    <div className='item-center w-full mt-10'>
                        <img
                            id="noData"
                            src="./empty.png"
                            className="h-28 rounded-lg mx-auto"
                            alt="No Data"
                        />
                        <h1 className='text-center text-xl font-semibold text-gray-400'>No Data</h1>
                    </div>
                )}

                {loader && <Loader />}

                <Pagination
                    pages={pageIndex.pages}
                    current={pageIndex.current}
                    onPageChange={(page) => setPageIndex({ ...pageIndex, current: page })}
                />
            </div>
        </div >
    );
}

export default MembersWiseCases;

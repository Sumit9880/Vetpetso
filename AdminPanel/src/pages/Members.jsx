import React, { useState, useEffect, useCallback } from 'react';
import { apiPost } from "../utils/api";
import { LiaEditSolid } from "react-icons/lia";
import MemberDrawer from '../components/MemberDrawer';
import Pagination from '../components/Pagination';
import MemberPreview from '../components/MemberPreview';
import { IoEyeOutline } from "react-icons/io5";
import PlanPreview from '../components/PlanPreview';
import { ToastContainer } from 'react-toastify';
import { FiFilter } from "react-icons/fi";
import Loader from '../components/Loader';
import DatePickerComponent from '../components/DatePickerComponent';
import MultiSelectComponent from '../components/MultiSelectComponent';

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

    let defaulFilter = {
        isDrawerOpen: false,
        startDate: null,
        endDate: null,
        taluka: null,
        districts: null
    }
    const [filters, setFilters] = useState(defaulFilter);
    console.log("filters", filters);

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
    }, [searchTerm, pageIndex.current, pageSize, isDrawerOpen, filters]);

    const getData = useCallback(async () => {
        setLoader(true);
        try {
            let filterConditions = ` AND STATUS = "A"`;

            if (filters.districts?.length) {
                // const districtFilter = filters.districts.map(d => `'${d.value}'`).join(',');
                filterConditions += ` AND DISTRICT IN (${filters.districts})`;
            }
            if (filters.taluka?.length) {
                // const talukaFilter = filters.taluka.map(t => `'${t.value}'`).join(',');
                filterConditions += ` AND TALUKA IN (${filters.taluka})`;
            }
            if (filters.startDate && filters.endDate) {
                filterConditions += ` AND APPROVED_DATE BETWEEN '${new Date(filters.startDate).toISOString().slice(0, 10)}' AND '${new Date(filters.endDate).toISOString().slice(0, 10)}'`
            }
            if (searchTerm) {
                filterConditions += ` AND (NAME LIKE '%${searchTerm}%' OR EMAIL LIKE '%${searchTerm}%')`;
            }

            const res = await apiPost("api/member/get", {
                filter: filterConditions,
                pageSize,
                pageIndex: pageIndex.current,
                sortKey: "LASTUPDATED",
                sortValue: "DESC",
            });

            if (res.code === 200) {
                setMembers(res.data);
                const totalPages = Math.ceil(res.count / pageSize) || 1;
                setPageIndex(prev => ({ ...prev, pages: totalPages }));
            } else {
                console.error("Failed to fetch Members:", res.message);
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

    const handleOpenDrawer = (data) => {
        setMember(data);
        setIsDrawerOpen(true);
    };

    const handleOpenPreview = (data, type) => {
        setMember(data);
        setPreview({ ...preview, [type]: true });
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

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
        <div className="container mx-auto p-3 bg-gray-100 rounded h-full">
            <ToastContainer />
            <div className='flex justify-between my-2 items-center'>
                <h1 className="text-2xl font-bold mb-2 text-start">Member Management</h1>
                <div className="flex justify-end mb-2">
                    <div className='cursor-pointer flex items-center justify-center w-9 h-9 mr-2 border border-gray-300 p-1 rounded' onClick={() => setFilters({ ...filters, isDrawerOpen: !filters.isDrawerOpen })}>
                        <FiFilter size={20} className='text-gray-600 hover:text-gray-800' />
                    </div>
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
                <div className={`text-center bg-gray-200 rounded-lg mb-2 ${filters.isDrawerOpen ? '' : 'hidden'} flex p-2`}>
                    <div className="">
                        <h1 className="text-left pl-2 text-gray-700 font-medium">Joining Date:</h1>
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
                    <div className='flex justify-center items-end pl-2'>
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

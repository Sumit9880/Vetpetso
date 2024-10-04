import { useState } from 'react'
import DatePickerComponent from './DatePickerComponent'
import { ToastContainer, toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { apiPost } from '../utils/api';
import { IoCloseCircleOutline } from 'react-icons/io5';

function Exel({ open, setOpen, credentials }) {

    const [loader, setLoader] = useState(false)
    const [filters, setFilters] = useState({
        startDate: null,
        endDate: null
    })
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    const getData = async () => {
        setLoader(true);
        try {
            if (filters.startDate && filters.endDate) {
                let filterConditions = ` AND REGISTRATION_DATE BETWEEN '${new Date(filters.startDate).toISOString().slice(0, 10)}' AND '${new Date(filters.endDate).toISOString().slice(0, 10)}'`;

                const res = await apiPost(credentials.url, {
                    filter: filterConditions,
                    sortKey: "ID",
                    sortValue: "ASC",
                });

                if (res.code === 200) {

                    const worksheet = XLSX.utils.json_to_sheet(res.data);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, credentials.name);

                    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                    const blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
                    const fileName = `${credentials.name} ${new Date(filters.startDate).toLocaleDateString()} to ${new Date(filters.endDate).toLocaleDateString()}.xlsx`;

                    const link = document.createElement('a');
                    const url = URL.createObjectURL(blob);
                    link.href = url;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    toast.success("Excel downloaded successfully");
                } else {
                    toast.error("Failed to fetch data");
                    console.error("Error fetching data:", res.message);
                }
            } else {
                toast.warning("Please Select Date Range");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoader(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setFilters({ startDate: null, endDate: null });
    };

    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${open ? 'block' : 'hidden'}`}>
            <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg w-1/3 h-1/3">
                    <ToastContainer />
                    <div className="flex justify-between items-center mx-2 mb-4">
                        <h1 className="text-xl font-bold ">Select Date Range :</h1>
                        <button className="text-gray-500 hover:text-red-500" onClick={handleClose}>
                            <IoCloseCircleOutline className="h-7 w-7" />
                        </button>
                    </div>
                    <div className="flex justify-center items-center space-x-2 my-2">
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
                    <div className="flex justify-center items-center space-x-2">
                        <button
                            onClick={getData}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded mt-4"
                            disabled={loader}
                        >
                            Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Exel
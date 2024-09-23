import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

const DatePickerComponent = ({ label, selectedDate, onChangeDate, placeholder }) => {
    return (
        <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1 text-left pl-2">{label}</label>
            <div className="relative w-40"> {/* Controlled width */}
                <DatePicker
                    selected={selectedDate}
                    onChange={onChangeDate}
                    className="w-full pl-10 pr-4 h-9 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <FaCalendarAlt />
                </span>
            </div>
        </div>
    );
};

export default DatePickerComponent;

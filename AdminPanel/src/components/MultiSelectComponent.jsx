import React from 'react';
import Select from 'react-select';

const customStyles = {
    control: (provided) => ({
        ...provided,
        backgroundColor: '#f9fafb', // Tailwind's gray-100
        borderColor: '#d1d5db', // Tailwind's gray-300
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#60a5fa', // Tailwind's blue-400
        },
        // minHeight: '10px', // Set a consistent height
        borderRadius: '0.375rem', // Tailwind's rounded-md
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#e5e7eb', // Tailwind's gray-200
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#111827', // Tailwind's gray-900
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: '#6b7280', // Tailwind's gray-500
        '&:hover': {
            backgroundColor: '#3b82f6', // Tailwind's blue-500
            color: 'white',
        },
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#9ca3af', // Tailwind's gray-400
    }),
};

const MultiSelectComponent = ({ label, options, selectedOptions, onChangeOptions, placeholder,isMulti }) => {
    return (
        <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1 text-left pl-2">{label}</label>
            <Select
                value={selectedOptions}
                onChange={onChangeOptions}
                options={options}
                isMulti={isMulti}
                className="w-full"
                styles={customStyles}
                placeholder={placeholder}
            />
            {/* <p className="mt-2 text-sm text-gray-500">Select multiple options.</p> */}
        </div>
    );
};

export default MultiSelectComponent;

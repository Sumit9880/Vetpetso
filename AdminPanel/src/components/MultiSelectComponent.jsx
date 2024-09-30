import React from 'react';
import Select from 'react-select';

const customStyles = {
    control: (provided) => ({
        ...provided,
        backgroundColor: '#f9fafb',
        borderColor: '#d1d5db',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#60a5fa',
        },
        borderRadius: '0.375rem',
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#e5e7eb',
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#111827',
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: '#6b7280',
        '&:hover': {
            backgroundColor: '#3b82f6',
            color: 'white',
        },
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#9ca3af',
    }),
};

const MultiSelectComponent = ({ label, options, selectedOptions, onChangeOptions, placeholder, isMulti }) => {
    const handleChange = (selected) => {
        if (isMulti) {
            const values = selected ? selected.map(option => option.value).join(',') : '';
            onChangeOptions(values);
        } else {
            const value = selected ? selected.value : '';
            onChangeOptions(value);
        }
    };

    const getSelectedValues = () => {
        if (isMulti) {
            return selectedOptions ? options.filter(option => selectedOptions.split(',').includes(option.value.toString())) : [];
        } else {
            return selectedOptions
                ? options.find(option => option.value === selectedOptions) || null
                : null;
        }
    };

    return (
        <div className="flex flex-col">
            <label className="block pl-1 mt-2 font-medium text-gray-700 text-left">{label}</label>
            <Select
                value={getSelectedValues()}
                onChange={handleChange}
                options={options}
                isMulti={isMulti}
                className="w-full mt-1"
                styles={customStyles}
                placeholder={placeholder}
            />
        </div>
    );
};

export default MultiSelectComponent;

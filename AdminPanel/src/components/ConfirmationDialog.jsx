import React, { useState, useEffect } from 'react';
import { CiCircleCheck } from 'react-icons/ci';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { apiPost } from '../utils/api';
import { toast } from 'react-toastify';

const ConfirmationDialog = ({ open, setOpen, fetchData }) => {
  const [updateData, setUpdateData] = useState(fetchData);

  useEffect(() => {
    setUpdateData(fetchData);
  }, [fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateData({ ...updateData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiPost('api/member/approveReject', updateData);
      if (res.code === 200) {
        toast.success("Approved Successfully!")
        setOpen(false);
      } else {
        toast.error(res.message)
        console.error('API call failed:', res.message);
      }
    } catch (error) {
      toast.error('Somthing Went Wrong')
      console.error('API call failed:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    fetchData.STATUS = "";
  }

  return (
    <div className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center ${open ? '' : 'hidden'}`}>
      <div className="bg-white w-1/3 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold m-2">Are you sure?</h2>
        <div className="sm:flex sm:items-start p-2">
          <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-${updateData.STATUS === "R" ? 'red' : 'green'}-100 sm:mx-0 sm:h-10 sm:w-10`}>
            {updateData.STATUS === "R" ? <IoCloseCircleOutline className="h-6 w-6 text-red-600" /> : <CiCircleCheck className="h-6 w-6 text-green-600" />}
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <p className="text-sm text-gray-500">
              Are you sure you want to Approve this request? This action cannot be undone.
            </p>
            {updateData.STATUS === "R" && (
              <div>
                <label htmlFor="REJECTED_REMARK" className="block text-sm font-semibold text-gray-900">Remark : </label>
                <textarea type="text area" name="REJECTED_REMARK" id="REJECTED_REMARK" className="mt-1 p-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value={updateData.REJECTED_REMARK} onChange={handleChange} />
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-50 py-2 sm:flex sm:flex-row-reverse p-2">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-1.5 text-sm font-normal text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
            onClick={handleSubmit}
          >
            Yes
          </button>
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-white px-4 py-1.5 text-sm font-normal text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={handleClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;

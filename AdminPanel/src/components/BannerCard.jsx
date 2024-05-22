import React, { useEffect, useState } from "react";
import { STATIC_URL } from "../utils/api";
import { MdDeleteOutline } from "react-icons/md";
import { apiPost } from "../utils/api";
import { toast } from 'react-toastify';

const BannerCard = ({ data, fetchData }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const image = new Image();
        image.onload = () => setImageLoaded(true);
        image.src = STATIC_URL + "Banners/" + data.URL;
    }, [data.URL]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this banner?");
        if (confirmDelete) {
            try {
                const res = await apiPost("api/banner/remove", {
                    ID: data.ID,
                    URL: data.URL
                });

                if (res.code === 200) {
                    toast.success("Banner Deleted Successfully!")
                    fetchData();
                } else {
                    toast.error("Failed to Delete Banner. Please try again.")
                    console.error("Failed to Delete Banner:", res.message);
                }
            } catch (error) {
                toast.error("Something went wrong. Please try again.");
                console.error("API call failed:", error);
            }
        }
    }

    return (
        <div className="w-full lg:w-72 p-2 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]  rounded-lg  transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="h-36 md:h-52 lg:h-36 w-full rounded-lg overflow-hidden">
                <img
                    className={`w-full ${imageLoaded ? '' : 'h-full'} object-cover`}
                    src={STATIC_URL + "Banners/" + data.URL}
                    alt="Banner Image"
                    style={{ aspectRatio: '16/9' }}
                />
            </div>
            <div className="flex justify-between items-center mt-2">
                <h2 className="text-lg text-start font-normal">{data.NAME}</h2>
                <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
                    <MdDeleteOutline className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default BannerCard;

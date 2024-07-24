import React, { useState, useEffect } from 'react';
import { apiPost } from '../utils/api';
import BannerCard from '../components/BannerCard';
import { IoIosAddCircleOutline } from "react-icons/io";
import BannerPopup from '../components/BannerPopup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/Loader';

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [loader, setLoader] = useState(false);
    const MAX_BANNERS = 5;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoader(true);
        try {
            const res = await apiPost("api/banner/get", {
                filter: " AND STATUS = 1",
                sortKey: "LASTUPDATED",
                sortValue: "DESC"
            });

            if (res.code === 200) {
                setBanners(res.data);
            } else {
                console.error("Failed to fetch banners:", res.message);
            }
        } catch (error) {
            console.error("API call failed:", error);
        } finally {
            setLoader(false);
        }
    }

    const handleAddBanner = () => {
        if (banners.length < MAX_BANNERS) {
            setShowPopup(true);
        }
    };

    const handlePopupClose = () => {
        setShowPopup(false);
    };

    return (
        <div className="container mx-auto p-3 pb-8 bg-gray-100 rounded">
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-8 text-start">Banners</h1>
            <div className="flex flex-wrap justify-center gap-6">
                {
                    loader ? <Loader /> :
                        (
                            <>
                                {banners?.map(data => (
                                    <BannerCard key={data.ID} data={data} fetchData={fetchData} />
                                ))}
                                {banners.length < MAX_BANNERS &&
                                    <div className="w-full lg:w-72 p-2 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-gray-200 rounded-lg transform hover:scale-105 transition duration-300 ease-in-out flex flex-col items-center cursor-pointer" onClick={handleAddBanner}>
                                        <div className="h-36 md:h-52 lg:h-40 w-full rounded-lg overflow-hidden flex items-center justify-center flex-col">
                                            <IoIosAddCircleOutline className="w-10 h-10 text-gray-600 mb-2" />
                                            <p className="text-center">Add Banner</p>
                                        </div>
                                    </div>
                                }
                            </>
                        )
                }
            </div>
            <BannerPopup isOpen={showPopup} onClose={handlePopupClose} fetchData={fetchData} />
        </div>
    );
};

export default Banners;

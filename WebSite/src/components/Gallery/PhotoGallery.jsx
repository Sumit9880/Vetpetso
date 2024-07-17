import React, { useState, useEffect, useCallback } from 'react';
import { apiPost, STATIC_URL } from "../../utils/api";
import Pagination from '../Others/Pagination';
import Loader from '../Others/Loader';

function PhotoGallery() {
    const [photos, setPhotos] = useState([]);
    const [pageSize, setPageSize] = useState(9);
    const [pageIndex, setPageIndex] = useState({
        pages: 1,
        current: 1,
    });
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        getData();
    }, [pageIndex.current, pageSize]);

    const getData = useCallback(async () => {
        setLoader(true);
        try {
            const res = await apiPost("gallery/get", {
                filter: " AND STATUS = 1 AND TYPE = 'P'",
                pageSize,
                pageIndex: pageIndex.current,
                sortKey: "LASTUPDATED",
                sortValue: "DESC"
            });

            if (res.code === 200) {
                setPhotos(res.data);
                let NPages = Math.ceil(res.count / pageSize) ? Math.ceil(res.count / pageSize) : 1;
                setPageIndex({
                    ...pageIndex,
                    pages: NPages,
                })
            } else {
                console.error("Failed to fetch photos:", res.message);
            }
        } catch (error) {
            console.error("API call failed:", error);
        } finally {
            setLoader(false);
        }
    }, [pageIndex.current, pageSize]);

    return (
        <div className="my-10 px-4">
            <div className="mb-6 flex justify-center items-center">
                <h3 className="text-3xl text-center text-primary font-poppins font-semibold relative heading_section inline-block">
                    Photo Gallery
                </h3>
            </div>
            <div className="text-center mb-8">
                <p className="text-gray-700 max-w-3xl mx-auto">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum beatae delectus nulla, quia magnam eaque labore consectetur, debitis vitae esse possimus, quam similique saepe ratione placeat numquam velit. Magni, distinctio!
                </p>
            </div>
            {loader ? (
                <Loader />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                        <div
                            key={photo.ID}
                            className="p-3 rounded-xl flex justify-center items-center w-94 h-94 relative"
                        >
                            <div className="w-full h-64 relative">
                                <img
                                    src={STATIC_URL + "Gallery/" + photo.URL}
                                    alt={photo.TITLE}
                                    className="rounded-xl w-full h-full object-cover hover:scale-105 transition duration-300"
                                />
                            </div>
                            <div className="absolute top-0 left-0 border-t-2 border-l-2 border-primary w-20 h-20 rounded-tl-2xl"></div>
                            <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-secondary w-20 h-20 rounded-br-2xl"></div>
                        </div>
                    ))}
                </div>
            )}
            <Pagination
                pages={pageIndex.pages}
                current={pageIndex.current}
                onPageChange={(page) => setPageIndex({ ...pageIndex, current: page })}
            />
        </div>
    );
}

export default PhotoGallery;

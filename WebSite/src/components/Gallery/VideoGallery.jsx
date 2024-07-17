import React, { useState, useEffect, useCallback } from 'react';
import { apiPost } from "../../utils/api";
import Pagination from '../Others/Pagination';

function VideoGallery() {
    const [videos, setVideos] = useState([]);
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
                filter: " AND STATUS = 1 AND TYPE = 'V'",
                pageSize,
                pageIndex: pageIndex.current,
                sortKey: "LASTUPDATED",
                sortValue: "DESC"
            });

            if (res.code === 200) {
                setVideos(res.data);
                let NPages = Math.ceil(res.count / pageSize) ? Math.ceil(res.count / pageSize) : 1;
                setPageIndex({
                    ...pageIndex,
                    pages: NPages,
                })
            } else {
                console.error("Failed to fetch videos:", res.message);
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
                    Video Gallery
                </h3>
            </div>
            <div className="text-center mb-8">
                <p className="text-gray-700 max-w-3xl mx-auto">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum beatae delectus nulla, quia magnam eaque labore consectetur, debitis vitae esse possimus, quam similique saepe ratione placeat numquam velit. Magni, distinctio!
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                    <div key={video.ID} className="p-3 rounded-xl flex justify-center items-center w-94 h-94 relative">
                        <iframe
                            width="100%"
                            height="250"
                            src={video.URL}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-xl hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-0 right-0 border-t-2 border-r-2 border-primary w-20 h-20 rounded-tr-2xl"></div>
                        <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-secondary w-20 h-20 rounded-bl-2xl"></div>
                    </div>
                ))}
            </div>
            <Pagination
                pages={pageIndex.pages}
                current={pageIndex.current}
                onPageChange={(page) => setPageIndex({ ...pageIndex, current: page })}
            />
        </div>
    );
}

export default VideoGallery;

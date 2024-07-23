import React, { useState, useEffect, useCallback } from 'react';
import { apiPost, STATIC_URL } from "../utils/api";
import { LiaEditSolid } from "react-icons/lia";
import GalleryDrawer from '../components/GalleryDrawer';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

function Gallery() {
    const [galleries, setGalleries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState({
        pages: 1,
        current: 1,
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [gallery, setGallery] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        getData();
    }, [searchTerm, pageIndex.current, pageSize, isDrawerOpen]); // Add isDrawerOpen to dependencies

    const getData = useCallback(async () => {
        setLoader(true);
        try {
            const filter = searchTerm ? `AND (TITLE LIKE '%${searchTerm}%' OR SUMMARY LIKE '%${searchTerm}%')` : '';
            const res = await apiPost("api/gallery/get", {
                filter,
                pageSize,
                pageIndex: pageIndex.current,
                sortKey: "LASTUPDATED",
                sortValue: "DESC"
            });

            if (res.code === 200) {
                setGalleries(res.data);
                let NPages = Math.ceil(res.count / pageSize) ? Math.ceil(res.count / pageSize) : 1;
                setPageIndex({
                    ...pageIndex,
                    pages: NPages,
                })
            } else {
                console.error("Failed to fetch galleries:", res.message);
            }
        } catch (error) {
            console.error("API call failed:", error);
        } finally {
            setLoader(false);
        }
    }, [searchTerm, pageIndex.current, pageSize]); // Memoize the getData function

    const handleSearch = useCallback(async (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
        setPageIndex({ pages: 1, current: 1 });
    }, []); // Memoize the handleSearch function

    const handleOpenDrawer = (data) => {
        setGallery(data);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <div className="container mx-auto p-3 bg-gray-100 rounded h-full">
            <div className='flex justify-between my-2 items-center'>
                <h1 className="text-2xl font-bold mb-2 text-start">Gallery Master</h1>
                <div className="flex justify-end mb-2">
                    <input
                        type="text"
                        placeholder="Search galleries..."
                        id='gallerySearch'
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-64 h-9 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-1"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-sm text-white font-bold px-4 h-9 rounded mx-4"
                        onClick={() => handleOpenDrawer(null)}
                    >
                        Add Gallery
                    </button>
                    <GalleryDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} data={gallery} />
                </div>
            </div>
            <div className="overflow-x-auto" style={{ height: 'calc(100vh - 214px)' }}>
                {/* <div className="max-h-96 overflow-y-auto"> */}
                <table className="table-auto w-full border-collapse border border-gray-400 rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 rounded-lg">
                            <th className="px-2 py-2 border border-gray-300">View</th>
                            <th className="px-2 py-2 border border-gray-300">Title</th>
                            <th className="px-2 py-2 border border-gray-300">Type</th>
                            <th className="px-2 py-2 border border-gray-300">Status</th>
                            <th className="px-2 py-2 border border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {galleries?.map(gallery => (
                            <tr key={gallery.ID} className="bg-white">
                                <td className="p-2 border border-gray-200">
                                    <div className="flex items-center justify-center">
                                        {
                                            gallery.TYPE == "P" ?
                                                <img src={STATIC_URL + "Gallery/" + gallery.URL} alt={gallery.NAME} className="w-16 h-16 rounded-full" />
                                                :
                                                <iframe
                                                    width="100"
                                                    height="70"
                                                    src={gallery.URL}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="rounded-xl hover:scale-105 transition duration-300"
                                                />
                                        }
                                    </div>
                                </td>
                                <td className="px-2 border border-gray-200">{gallery.TITLE?.substring(0, 40)}...</td>
                                <td className="px-2 border border-gray-200">{gallery.TYPE == "P" ? "Photo" : (gallery.TYPE == "V" ? "Video" : "Both")}</td>
                                <td className={`px-2 border border-gray-200 text-center${gallery.STATUS ? " text-green-500" : " text-red-500"}`}>{gallery.STATUS ? "On" : "Off"}</td>
                                <td className="px-2 border border-gray-200 text-center">
                                    <button className="py-2 text-center" onClick={() => handleOpenDrawer(gallery)}><LiaEditSolid className="text-blue-500 hover:text-blue-700 h-5 w-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {galleries.length > 0 || loader ? null :
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

export default Gallery;

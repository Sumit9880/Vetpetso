import React, { useState, useEffect, useCallback } from "react";
import EventCard from "./EventCard";
import aos from "aos";
import "aos/dist/aos.css";
import { apiPost, STATIC_URL } from "../../utils/api";
import { FaCalendarAlt } from "react-icons/fa";

const Events = () => {
    const [latestEvent, setLatestEvent] = useState(null);
    const [eventsData, setEventsData] = useState([]);
    const [disableLoadMore, setDisableLoadMore] = useState(false);
    const pageSize = 6;
    const [pageIndex, setPageIndex] = useState(1);

    useEffect(() => {
        aos.init();
        getData();
    }, []);

    const getData = useCallback(async () => {
        try {
            const res = await apiPost("events/get", {
                filter: ` AND STATUS = 1`,
                pageSize,
                pageIndex,
                sortKey: "LASTUPDATED",
                sortValue: "DESC"
            });

            if (res.code === 200) {
                const eventData = res.data;
                if (pageIndex === 1 && eventData.length > 0) {
                    setLatestEvent(eventData[0]);
                }
                setEventsData(prevData => [...prevData, ...eventData]);
                if (res.count <= eventsData.length + eventData.length) {
                    setDisableLoadMore(true);
                }
                setPageIndex(prevIndex => prevIndex + 1);
            } else {
                console.error("Failed to fetch events:", res.message);
            }
        } catch (error) {
            console.error("API call failed:", error);
        }
    }, [eventsData, pageIndex]);

    const loadMoreData = () => {
        getData();
    };

    const renderEventCards = useCallback(() => {
        return eventsData.map(event => (
            <EventCard key={event.ID} data={event} />
        ));
    }, [eventsData]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 pt-10">
            <div className="mb-6 flex justify-center items-center">
                <h3 className="text-3xl text-center text-primary font-poppins font-semibold relative heading_section inline-block max-w-full" >
                    Events
                </h3>
            </div>
            {latestEvent && (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden md:flex md:space-x-6">
                    <div className="md:w-5/12 lg:w-5/12 flex items-center justify-center">
                        <img
                            className="max-w-full h-auto object-contain"
                            src={STATIC_URL + "Events/" + latestEvent.URL}
                            alt="event image"
                        />
                    </div>
                    <div className="p-6 md:w-7/12 lg:w-6/12 flex flex-col justify-center">
                        <h2 className="text-xl text-quinary italic font-bold md:text-2xl mb-4">
                            {latestEvent?.TITLE}
                        </h2>
                        <div className="flex items-center mb-4 text-sm text-gray-500">
                            <FaCalendarAlt className="mr-2" />
                            <p>{formatDate(latestEvent.EVENT_DATE)}</p>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            {latestEvent?.SUMMARY}
                        </p>
                    </div>
                </div>
            )}
            <div className="p-4 flex flex-col rounded-lg items-center lg:flex-row justify-between mt-7 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out w-full">
                <h1 className="text-xl font-semibold text-center lg:text-start text-white drop-shadow-md">
                    Other Events :
                </h1>
            </div>
            <div className="my-8 items-center flex flex-col">
                <div className="flex flex-wrap justify-center gap-6">
                    {renderEventCards()}
                </div>
                {!disableLoadMore && (
                    <button
                        className="text-center text-white bg-secondary p-2 hover:bg-green-600 transition-colors hover:duration-500 rounded-md w-24 mt-10"
                        data-aos="fade-left"
                        onClick={loadMoreData}
                    >
                        Load More
                    </button>
                )}
            </div>
        </div>
    );
};

export default Events;

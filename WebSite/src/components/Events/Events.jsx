import React, { useState, useEffect, useCallback } from "react";
import EventCard from "./EventCard";
import aos from "aos";
import "aos/dist/aos.css";
import { apiPost, STATIC_URL } from "../../utils/api";

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
            const res = await apiPost("api/events/get", {
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

    return (
        <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 pt-10">
            {latestEvent && (
                <div className="mb-8">
                    <img
                        className="w-full lg:h-screen sm:h-full object-cover rounded-sm mb-4"
                        src={STATIC_URL + "Events/" + latestEvent.URL}
                        alt="Latest Event"
                    />
                    <h2 className="text-2xl font-semibold text-center lg:text-left">
                        Latest Event
                    </h2>
                    <p className="text-center lg:text-left">
                        {latestEvent.SUMMARY}
                    </p>
                </div>
            )}
            <div className="flex flex-col items-center lg:flex-row justify-between">
                <div>
                    <h1 className="text-4xl font-semibold text-center lg:text-start">
                        Other Events
                    </h1>
                </div>
            </div>
            <div className="my-8 items-center flex flex-col">
                <div className="flex flex-wrap justify-center gap-6">
                    {renderEventCards()}
                </div>
                {!disableLoadMore && (
                    <button
                        className="text-center text-white bg-green-500 p-2 hover:bg-green-600 transition-colors hover:duration-500 rounded-md w-24 mt-10"
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

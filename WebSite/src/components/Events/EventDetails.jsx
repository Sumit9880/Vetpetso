import React from "react";
import { useLocation } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import { STATIC_URL } from "../../utils/api";

const EventDetails = () => {
    const location = useLocation();
    const eventData = location.state;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
    if (!eventData) {
        return (
            <div className="container mx-auto mt-10 p-4">
                <p className="text-center text-gray-600">No event data available.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto mt-10 p-4">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
                <h1 className="text-3xl font-medium mb-4 lg:text-4xl">{eventData.TITLE}</h1>
                <div className="flex items-center mb-4">
                    <FaCalendarAlt className="text-gray-500 mr-2" />
                    <p className="text-gray-600">{formatDate(eventData.EVENT_DATE)}</p>
                </div>
                <h3 className="text-xl font-medium mb-4">Summary</h3>
                <p className="text-gray-600 mb-4 leading-relaxed lg:leading-normal">
                    {eventData.SUMMARY}
                </p>
                <img
                    src={STATIC_URL + "Events/" + eventData.URL}
                    alt="Event"
                    className="w-full h-full lg:h-screen object-cover rounded-md mb-6"
                />
                <div>
                    <h3 className="text-xl font-medium mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed lg:leading-normal">
                        {eventData.DESCRIPTION}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;

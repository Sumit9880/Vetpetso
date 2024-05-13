import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import aos from "aos";
import "aos/dist/aos.css";
import { STATIC_URL } from "../../utils/api";

const EventCard = ({ data }) => {
  useEffect(() => {
    aos.init();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="w-full lg:w-72 p-2 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] space-y-4 rounded-lg cursor-pointer hover:scale-105 transition duration-300 ease-in-out" data-aos="zoom-in-right" data-aos-duration="1000">
      <Link to='/eventdetails' state={data} className="flex flex-col h-full">
        <div className="h-full">
          <img
            className="h-64 md:h-96 lg:h-48 w-full rounded-lg object-cover"
            src={STATIC_URL + "Events/" + data.URL}
            alt="Event Image"
          />
        </div>
        <div className="bg-gray-300 rounded-full py-1 px-4 mt-2 text-sm text-gray-700 text-left mr-28">
          <p>{formatDate(data.EVENT_DATE)}</p>
        </div>
        <div className="flex flex-col flex-grow justify-between p-2">
          <h2 className="text-lg text-start font-semibold mt-2">{data.TITLE}</h2>
          <p className="text-start text-sm">{data.SUMMARY}</p>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;

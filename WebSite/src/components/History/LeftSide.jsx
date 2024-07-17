import React from 'react'
import aos from "aos";
import "aos/dist/aos.css";
import { STATIC_URL } from "../../utils/api";

function LeftSide({ data }) {
    return (
        <>
            <div className="flex flex-col md:flex-row items-center justify-center" data-aos="zoom-in-left" data-aos-duration="1000">
                <div className="md:w-1/2 p-10 flex flex-col justify-center items-center">
                    <div className="w-full max-w-md text-center">
                        <h2 className="text-3xl text-left font-bold text-senary mb-4">{new Date(data.DATE).getFullYear()}</h2>
                        <p className="text-lg text-left leading-relaxed text-gray-700">
                            {data.SUMMARY}
                        </p>
                    </div>
                </div>
                <div className="md:w-1/2 flex justify-center items-center p-6 md:border-l-2 md:border-b-0 border-gray-300 rounded-3xl">
                    <img
                        src={STATIC_URL + "History/" + data.URL}
                        alt="history"
                        className="rounded-lg mx-auto max-w-xs md:max-w-sm"
                    />
                </div>
            </div>
            <div className='flex justify-center'>
                <p className="text-center text-gray-600 history_left w-40"></p>
            </div>
        </>
    )
}

export default LeftSide
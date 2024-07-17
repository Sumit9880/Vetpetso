import React, { useState, useEffect, useCallback } from "react";
import LeftSide from './LeftSide'
import RightSide from './RightSide'
import aos from "aos";
import "aos/dist/aos.css";
import { apiPost } from "../../utils/api";

function History() {
    const [historysData, setHistorysData] = useState([]);
    const [disableLoadMore, setDisableLoadMore] = useState(false);
    const pageSize = 6;
    const [pageIndex, setPageIndex] = useState(1);

    useEffect(() => {
        aos.init();
        getData();
    }, []);

    const getData = useCallback(async () => {
        try {
            const res = await apiPost("history/get", {
                filter: ` AND STATUS = 1`,
                pageSize,
                pageIndex,
                sortKey: "ID",
                sortValue: "ASC"
            });

            if (res.code === 200) {
                const historyData = res.data;
                setHistorysData(prevData => [...prevData, ...historyData]);
                if (res.count <= historysData.length + historyData.length) {
                    setDisableLoadMore(true);
                }
                setPageIndex(prevIndex => prevIndex + 1);
            } else {
                console.error("Failed to fetch history:", res.message);
            }
        } catch (error) {
            console.error("API call failed:", error);
        }
    }, [historysData, pageIndex]);

    const loadMoreData = () => {
        getData();
    };

    const renderHistories = useCallback(() => {
        return historysData.map(event =>
            event.ID % 2 === 0 ? (
                <LeftSide key={event.ID} data={event} />
            ) : (
                <RightSide key={event.ID} data={event} />
            )
        );
    }, [historysData]);


    return (
        <div>
            <div>
                <img src='./hist.jpg' alt="history" />
            </div>
            <div className="mt-10">
                <div className="mb-6 flex justify-center items-center">
                    <h3 className="text-3xl text-center text-primary font-poppins font-semibold relative heading_section inline-block max-w-full" data-aos="zoom-in-right" data-aos-duration="1000">
                        Experience Our Journey
                    </h3>
                </div>
                <div className="mb-6 flex justify-center items-center">
                    <img src='./start.png' alt="start" data-aos="zoom-in-down" data-aos-duration="1000" className='w-12' />
                </div>
                {renderHistories()}
            </div>
            <div className="flex justify-center">
                {!disableLoadMore ? (
                    <button
                        className="text-center text-white bg-secondary p-2 hover:bg-green-600 transition-colors hover:duration-500 rounded-md w-24 my-6"
                        data-aos="fade-left"
                        onClick={loadMoreData}
                    >
                        Load More
                    </button>
                ) : (
                    <div className="my-6 flex justify-center items-center">
                        <img src='./race.png' alt="start" data-aos="zoom-in-down" data-aos-duration="1000" className='w-16' />
                    </div>
                )
                }
            </div>
        </div>
    )
}

export default History
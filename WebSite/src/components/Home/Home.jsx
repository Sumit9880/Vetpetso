import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { apiPost, STATIC_URL } from "../../utils/api";
import aos from "aos";
import "aos/dist/aos.css";

function Home() {
    const [images, setImages] = useState([]);
    useEffect(() => {
        getData();
        aos.init();
    }, []);

    const getData = async () => {
        try {
            const res = await apiPost("banner/get", {
                filter: " AND STATUS = 1",
                sortKey: "LASTUPDATED",
                sortValue: "DESC"
            });

            if (res.code === 200) {
                setImages(res.data);
            } else {
                console.error("Failed to fetch events:", res.message);
            }
        } catch (error) {
            console.error("API call failed:", error);
        }
    };

    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
    };

    let counts = {
        MEMBERS: 0,
        EVENTS: 0,
        AI: 0,
        VACCINATIONS: 0,
        CASES: 0
    }

    return (
        <div className="mx-auto w-full max-w-7xl">
            <Slider {...carouselSettings} className="rounded-lg overflow-hidden mt-2">
                {images.map((image) => (
                    <div key={image.ID} className="relative rounded-lg overflow-hidden">
                        <img
                            className="w-full max-w-[1600px] h-auto max-h-[900px] object-contain transition-transform duration-300 transform hover:scale-105"
                            src={`${STATIC_URL}Banners/${image.URL}`}
                            alt={image.NAME}
                        />
                    </div>
                ))}
            </Slider>
            <div className="relative overflow-hidden text-black sm:px-16 px-2 sm:py-6 bg-tertiary">
                <div className="relative z-10 max-w-screen-xl px-4  pb-20 pt-10 sm:py-24 mx-auto sm:px-6 lg:px-8">
                    <div className="max-w-xl sm:mt-1 mt-80 space-y-8 text-center sm:text-right sm:ml-auto">
                        <h2 className="text-4xl font-bold sm:text-5xl">
                            Download
                            <span className="hidden sm:block text-4xl">Our App</span>
                        </h2>
                        <Link
                            className="inline-flex text-white items-center px-6 py-3 font-medium bg-secondary rounded-lg hover:opacity-75"
                            to="/"
                        >
                            <svg
                                fill="white"
                                width="24"
                                height="24"
                                xmlns="http://www.w3.org/2000/svg"
                                fillRule="evenodd"
                                clipRule="evenodd"
                            >
                                <path d="M1.571 23.664l10.531-10.501 3.712 3.701-12.519 6.941c-.476.264-1.059.26-1.532-.011l-.192-.13zm9.469-11.56l-10.04 10.011v-20.022l10.04 10.011zm6.274-4.137l4.905 2.719c.482.268.781.77.781 1.314s-.299 1.046-.781 1.314l-5.039 2.793-4.015-4.003 4.149-4.137zm-15.854-7.534c.09-.087.191-.163.303-.227.473-.271 1.056-.275 1.532-.011l12.653 7.015-3.846 3.835-10.642-10.612z" />
                            </svg>
                            &nbsp; Download now
                        </Link>
                    </div>
                </div>
                <div className="absolute inset-0 w-full sm:my-20 sm:pt-1 pt-12 h-full " data-aos="zoom-in-left" data-aos-duration="1000">
                    <img className="w-96" src="https://i.ibb.co/5BCcDYB/Remote2.png" alt="image1" />
                </div>
            </div>
            <div className="container mx-auto px-6 py-6 bg-white rounded-lg " data-aos="zoom-in-right" data-aos-duration="1000">
                <div className="mb-6 flex justify-center items-center">
                    <h3 className="text-3xl text-center text-primary font-poppins font-semibold relative heading_section inline-block max-w-full" data-aos="zoom-in-right" data-aos-duration="1000">
                        Who We Are
                    </h3>
                </div>
                <div className="mb-10 flex justify-center items-center">
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl p-2 sm:p-3 md:p-4 lg:p-5 rounded-lg text-center text-white font-poppins font-semibold relative inline-block max-w-full bg-primary">
                        पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ.
                    </p>
                </div>
                <div className="md:flex md:space-x-6 lg:space-x-12 items-center">
                    <div className="md:w-1/3 md:mx-auto mb-6 flex justify-center items-center">
                        <img
                            src="./vetpetso.jpg"
                            alt="logo"
                            className="rounded-lg mx-auto max-w-xs"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <p className="text-lg leading-relaxed mb-4 text-gray-700">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum omnis voluptatem accusantium nemo perspiciatis delectus atque autem! Voluptatum tenetur beatae unde aperiam, repellat expedita consequatur! Officiis id consequatur atque doloremque!
                        </p>
                        <p className="text-lg leading-relaxed text-gray-700">
                            Nobis minus voluptatibus pariatur dignissimos libero quaerat iure expedita at? Asperiores nemo possimus nesciunt dicta veniam aspernatur quam mollitia.
                        </p>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-6 py-10 bg-quaternary rounded-2xl ">
                <div className="mb-6 flex justify-center items-center">
                    <h3 className="text-3xl text-center text-primary font-poppins font-semibold relative heading_section inline-block max-w-full" data-aos="zoom-in-right" data-aos-duration="1000">
                        Our Statistics
                    </h3>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: './workgroup.png', label: 'Members', count: counts?.MEMBERS?.toString().padStart(3, '0'), color: 'text-blue-500' },
                        { icon: './clipboard.png', label: 'Cases', count: counts?.CASES?.toString().padStart(3, '0'), color: 'text-blue-500' },
                        { icon: './insemination1.png', label: 'Inseminations', count: counts?.AI?.toString().padStart(3, '0'), color: 'text-pink-500' },
                        { icon: './vaccine.png', label: 'Vaccinations', count: counts?.VACCINATIONS?.toString().padStart(3, '0'), color: 'text-pink-500' }
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center rounded-lg shadow-lg p-6 space-x-4 transform hover:scale-105 transition-transform duration-300 bg-white"
                            data-aos="zoom-in-right"
                            data-aos-duration="1000"
                        >
                            <img src={item.icon} alt={`${item.label} Icon`} className="w-16 h-16" />
                            <div className="text-center">
                                <span className={`block font-bold text-3xl ${item.color}`}>{item.count}</span>
                                <span className="block text-lg">{item.label}</span>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
            <div className="flex justify-center items-center py-4">
                <img src='./floral.png' className="h-16" />
            </div>
            <div className="bg-primary h-96">
                <div className="py-6 flex justify-center items-center">
                    <h3 className="text-3xl text-center text-white font-poppins font-semibold relative heading_section inline-block max-w-full" data-aos="zoom-in-up" data-aos-duration="1000">
                        Hear from our Commite
                    </h3>
                </div>
                <Slider {...carouselSettings} className="overflow-hidden mt-2 bg-white">
                    {images.map((image) => (
                        <div key={image.ID} className="relative rounded-lg overflow-hidden">
                            <img
                                className="w-64"
                                src={`${STATIC_URL}Banners/${image.URL}`}
                                alt={image.NAME}
                            />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default Home
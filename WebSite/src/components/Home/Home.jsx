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
    const [commitees, setCommitees] = useState([]);
    const [counts, setCounts] = useState({
        MEMBERS: 0,
        AI: 0,
        VACCINATIONS: 0,
        CASES: 0
    });

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
            const resCount = await apiPost("summary/getDashboardCount", {});
            const resCommitee = await apiPost("commitee/get", {});

            res.code === 200 ? setImages(res.data) : setImages([]);
            resCount.code === 200 ? setCounts(resCount.data) : setCounts({});
            resCommitee.code === 200 ? setCommitees(resCommitee.data) : setCommitees([]);

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
        autoplaySpeed: 3000,
    };

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
            <div className="flex flex-col justify-center items-center py-12 px-6 bg-white">
                <div className="max-w-4xl text-center">
                    <h1 className="text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
                        Welcome to <span className="text-primary" data-aos="zoom-in-right" data-aos-duration="1000">पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ.</span>
                    </h1>
                    <p className="text-2xl text-secondary mb-6 font-semibold" data-aos="zoom-in-left" data-aos-duration="2000">
                        Caring for Animals, Supporting Communities
                    </p>
                    <p className="text-lg text-black leading-relaxed">
                        We are a dedicated group of veterinary professionals committed to improving the lives of animals and the communities they live in. Our mission is to provide compassionate care, essential medical services, and educational resources to ensure the well-being of animals everywhere.
                    </p>
                </div>
            </div>
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
            <div className="container mx-auto px-6 py-6 bg-white" data-aos="zoom-in-right" data-aos-duration="1000">
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
                            className="mx-auto max-w-xs "
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
                <div className="mx-10 my-6 flex-row justify-center items-center" data-aos="slide-up" data-aos-duration="1000">
                    <div className="mb-6 flex justify-center items-center">
                        <h3 className="text-3xl text-center text-secondary font-poppins font-semibold relative history_right inline-block max-w-full" data-aos="zoom-in-left" data-aos-duration="1000">
                            Our Mission
                        </h3>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-start space-x-4">
                            <span className="text-secondary text-xl font-bold">•</span>
                            <div>
                                <h3 className="text-lg font-semibold text-quinary">Provide High-Quality Veterinary Care :</h3>
                                <p className="text-gray-700">From routine check-ups to emergency treatments, our team is here to ensure every animal receives the best care possible.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <span className="text-secondary text-xl font-bold">•</span>
                            <div>
                                <h3 className="text-lg font-semibold text-quinary">Promote Animal Welfare :</h3>
                                <p className="text-gray-700">We advocate for humane treatment and the rights of all animals, working tirelessly to prevent cruelty and neglect.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <span className="text-secondary text-xl font-bold">•</span>
                            <div>
                                <h3 className="text-lg font-semibold text-quinary">Educate and Support :</h3>
                                <p className="text-gray-700">We offer educational programs and resources to pet owners and communities to promote responsible pet ownership and animal welfare.</p>
                            </div>
                        </div>
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
            <div className="bg-primary flex-row justify-center items-center pb-8">
                <div className="py-6 flex justify-center items-center">
                    <h3 className="text-3xl text-center text-white font-poppins font-semibold relative heading_section inline-block max-w-full" data-aos="zoom-in-up" data-aos-duration="1000">
                        Hear from our Commite
                    </h3>
                </div>
                <Slider {...carouselSettings} className="overflow-hidden">
                    {commitees.map((commitee) => (
                        <div
                            key={commitee.ID}
                            className="justify-center"
                        >
                            <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16">
                                <div className="w-40 h-40 flex justify-center items-center">
                                    <img
                                        className="w-40 h-40 object-cover rounded-full shadow-lg"
                                        src={`${STATIC_URL}Commitee/${commitee.URL}`}
                                        alt={commitee.NAME}
                                    />
                                </div>
                                <div className="text-center md:text-left md:w-1/2">
                                    <p className="text-m leading-relaxed mb-4 text-white">
                                        {commitee.MESSAGE}
                                    </p>
                                    <h2 className="text-secondary font-poppins font-semibold text-xl mb-1">
                                        {commitee.NAME}
                                    </h2>
                                    <p className="text-senary font-poppins text-md">{commitee.POSITION}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
            <div className="flex justify-center items-center py-4">
                <img src='./floral.png' className="h-16" />
            </div>
        </div>
    );
}

export default Home


// `
// Privacy Policy

// Last Updated: 25-07-2024

// पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ. is committed to protecting and respecting your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you visit our website www.vetpetso.com, interact with us, or use our services.

// 1. Information We Collect
// - Personal Information: We may collect personal information such as your name, email address, and message content when you fill out our contact form.
// - Non-Personal Information: We may collect non-personal information about your visit to our website, including your IP address, browser type, operating system, and browsing behavior.
// - Cookies: We use cookies to enhance your browsing experience and collect non-personal information about how you use our website. You can manage your cookie preferences through your browser settings.

// 2. How We Use Your Information
// - To Respond to Inquiries: We use your personal information to respond to your inquiries submitted through our contact form.
// - To Improve Our Website: We analyze non-personal information to improve our website's functionality and user experience.
// - Marketing: With your consent, we may send you promotional emails about our programs, events, and fundraising activities.

// 3. Sharing Your Information
// - Third-Party Service Providers: We may share your information with third-party service providers who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.
// - Legal Requirements: We may disclose your information when required by law or to protect our rights, property, or safety.

// 4. Security
// We implement a variety of security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.

// 5. Your Rights
// - Access: You have the right to access the personal information we hold about you.
// - Correction: You have the right to request the correction of inaccurate personal information.
// - Deletion: You have the right to request the deletion of your personal information, subject to legal and contractual restrictions.
// - Opt-Out: You can opt-out of receiving our marketing communications at any time by following the unsubscribe link in our emails.

// 6. Changes to This Privacy Policy
// We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.

// 7. Contact Us
// If you have any questions about this Privacy Policy or our data practices, please contact us at sumitghatage4@gmail.com or 8618749880.



// Terms of Use

// Last Updated: 25-07-2024

// Welcome to the पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ. website (www.vetpetso.com). By accessing or using our website, you agree to comply with and be bound by these Terms of Use. Please read these terms carefully.

// 1. Acceptance of Terms
// By accessing or using our website, you agree to these Terms of Use and our Privacy Policy. If you do not agree, please do not use our website.

// 2. Use of Website
// - Eligibility: You must be at least 18 years old to use our website.
// - Permitted Use: You may use our website for lawful purposes and in accordance with these Terms of Use. You agree not to use our website for any unlawful or prohibited activity.

// 3. Intellectual Property
// All content on our website, including text, graphics, logos, images, and software, is the property of पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ. and is protected by copyright and other intellectual property laws. You may not use, reproduce, distribute, or create derivative works from our content without our prior written permission.

// 4. User Contributions
// You may have the opportunity to submit content, such as comments or posts, to our website. By submitting content, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, and distribute your content.

// 5. Disclaimers
// - No Warranties: Our website is provided on an "as is" and "as available" basis. We make no warranties or representations about the accuracy or completeness of the content on our website.
// - Limitation of Liability: We are not liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use of our website.

// 6. Indemnification
// You agree to indemnify and hold harmless पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ., its officers, directors, employees, and agents from any claims, damages, liabilities, and expenses arising out of your use of our website or violation of these Terms of Use.

// 7. Governing Law
// These Terms of Use are governed by and construed in accordance with the laws of India/Maharashtra, without regard to its conflict of law principles.

// 8. Changes to These Terms
// We may update these Terms of Use from time to time. Any changes will be posted on this page with an updated revision date. Your continued use of our website after any changes constitute your acceptance of the new terms.

// 9. Contact Us
// If you have any questions about these Terms of Use, please contact us at sumitghatage4@gmail.com or 8618749880.

// `
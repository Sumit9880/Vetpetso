import React, { useEffect } from 'react'
import aos from "aos";
import "aos/dist/aos.css";

function About() {

    useEffect(() => {
        aos.init();
    }, []);

    return (
        <div className="my-10 px-4 justify-center">
            <div>
                <div className="mb-6 text-center" data-aos="zoom-in-right" data-aos-duration="1000">
                    <h3 className="text-3xl text-primary font-poppins font-semibold relative heading_section inline-block">
                        About Us
                    </h3>
                </div>
                <div className="container mx-auto px-6 text-gray-700 md:px-12 xl:px-6">
                    <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
                        <div className="md:w-5/12 lg:w-5/12">
                            <img
                                src="https://tailus.io/sources/blocks/left-image/preview/images/startup.png"
                                alt="Veterinary Services"
                                className="w-full "
                            />
                        </div>
                        <div className="md:w-7/12 lg:w-6/12">
                            <h2 className="text-2xl text-secondary font-bold md:text-4xl">
                                पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ.
                            </h2>
                            <p className="mt-6 text-gray-700">
                                is a pioneering organization in the field of veterinary care and animal husbandry, operating under the esteemed Veterinary Animal Husbandry and Dairy Farm Management Services Organisation (Regd.). Founded with the goal of enhancing the quality of veterinary services, we are committed to providing comprehensive care and support to animals and their caretakers.
                            </p>
                            <p className="mt-4 text-gray-700">
                                Our organization is governed by the Indian Veterinary Council Act of 1984 and operates in accordance with various government notifications and circulars. This legal framework ensures that our veterinary professionals are well-trained, certified, and authorized to deliver essential services such as minor veterinary treatments, artificial insemination, and pregnancy diagnosis.
                            </p>
                        </div>
                    </div>
                    <div className="my-12 mx-auto max-w-7xl px-6 md:px-12">
                        <h3 className="text-2xl font-semibold text-primary mb-6 md:mb-8 lg:text-3xl lg:mb-10">
                            Key Milestones and Certifications
                        </h3>
                        <ul className="list-disc list-inside text-gray-700 mb-6 pl-4 md:pl-6 lg:pl-8">
                            <li className="mb-2">Certified under sections 30(b) and 57 of the Indian Veterinary Council Act, 1984.</li>
                            <li className="mb-2">Authorized by the Maharashtra Government Notification No. I.V.C.-1006/C.R.-532/ADF 4 dated 27th August 2009.</li>
                            <li>Compliance with the Standard Operating Procedures for Artificial Insemination as per the Government of India Ministry of Agriculture Department of Animal Husbandry, Dairying, and Fisheries.</li>
                        </ul>
                        <p className="text-gray-700 mb-6 pl-4 md:pl-6 lg:pl-8">
                            Our team at VetPet is passionate about animal health and dedicated to advancing veterinary science. We believe in a holistic approach to animal care, combining traditional practices with modern technology to provide the best possible outcomes for our animal patients.
                        </p>
                        <p className="text-gray-700 pl-4 md:pl-6 lg:pl-8">
                            Whether you're a pet owner, a livestock farmer, or a fellow veterinary professional, VetPet is here to support you with a range of services designed to meet your needs. Together, we can ensure a healthier and happier life for all animals.
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 p-4 sm:p-4 md:p-10 rounded-lg shadow-lg m-2 md:mx-8 lg:mx-16 font-marathi">
                <div className="mb-6 text-center" data-aos="zoom-in-right" data-aos-duration="1000">
                    <h3 className="text-3xl text-primary font-poppins font-semibold relative heading_section inline-block">
                        Founder's Bio
                    </h3>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center mb-8 p-4 md:p-8">
                    <div className="flex-shrink-0 mb-8 md:mb-0 md:mr-8">
                        <img
                            src="./JoshiSir.jpg"
                            alt="Dr. Narayanrao Vitthalrao Joshi"
                            className="rounded-full w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 object-cover shadow-lg transition-transform transform hover:scale-105"
                        />
                    </div>
                    <div className="flex flex-col items-center md:items-start text-center md:text-left md:ml-6">
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            <span className="font-bold">डॉ. नारायणराव विठ्ठलराव जोशी</span>
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            <span className="font-bold">जन्मदिनांक :</span> २६ जुलै १९३७
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed font-marathi">
                            डॉ. नारायणराव विठ्ठलराव जोशी यांचे नाव पशुवैद्यक आणि पशुसंवर्धन क्षेत्रात एक महत्त्वाचे स्थान आहे. त्यांच्या अपूर्व प्रवासाने केवळ महाराष्ट्र राज्यात नव्हे तर संपूर्ण भारतात पशुवैद्यकीय आणि पशुसंवर्धन क्षेत्रात महत्त्वपूर्ण योगदान दिले आहे. त्यांच्या असामान्य कार्य आणि निष्ठेमुळे त्यांना एक महान नेता आणि मार्गदर्शक म्हणून ओळखले जाते.
                        </p>
                    </div>
                </div>
                <div>
                    <h4 className="text-xl text-primary font-semibold mt-6 mb-2">संस्थापक :</h4>
                    <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 pl-5 md:pl-6">
                        <li className="text-gray-900">
                            <span className="font-semibold">पशुवैद्यक तथा पशुसंवर्धन तांत्रिक वृंद सह.पतसंस्था महाराष्ट्र राज्य :</span> या संस्थेमार्फत डॉ. जोशी यांनी पशुवैद्यकीय आणि पशुसंवर्धन क्षेत्रातील तांत्रिक विकासाला प्रोत्साहन दिले.
                        </li>
                        <li className="text-gray-900">
                            <span className="font-semibold">पशुचिकित्सा व्यवसायी संघटना महाराष्ट्र राज्य :</span> त्यांनी पशुवैद्यकांच्या हक्क आणि त्यांच्या व्यवसायाच्या विकासासाठी या संघटनेची स्थापना केली.
                        </li>
                        <li className="text-gray-900">
                            <span className="font-semibold">भारतीय पशुचिकित्सा महासंघ (VSFI) :</span> हा महासंघ पशुवैद्यकांच्या हितसंबंधांचे रक्षण आणि त्यांच्या व्यवसायाच्या उन्नतीसाठी कार्यरत आहे.
                        </li>
                        <li className="text-gray-900">
                            <span className="font-semibold">पशुवैद्यकीय, पशुसंवर्धन व दुग्ध व्यवस्थापन सेवा संघ महाराष्ट्र राज्य :</span> या संघाने महाराष्ट्र राज्यात पशुवैद्यक, पशुसंवर्धन आणि दुग्ध व्यवस्थापन क्षेत्रात सेवा दिली आहे.
                        </li>
                    </ul>
                    <h4 className="text-xl text-primary font-semibold mt-6 mb-2">कानूनी योगदान :</h4>
                    <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 pl-5 md:pl-6">
                        <li className="text-gray-900">
                            <span className="font-semibold">महाराष्ट्र पशुचिकित्सा कायदा (Maharashtra Veterinary Practice Act) १९७१ व अधिनियम १९८१ :</span> डॉ. जोशी यांनी या कायद्याची रचना केली, जो महाराष्ट्रात पशुवैद्यकांच्या अभ्यासास विनियमित करतो.
                        </li>
                        <li className="text-gray-900">
                            <span className="font-semibold">राज्य पातळीवर दुय्यम पशुवैद्यकीय परिषद (Maharashtra State Subordinate Veterinary Council) :</span> त्यांनी या परिषदेच्या मसुद्याची रचना केली, जो राज्यात पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध फार्मच्या सहाय्यक कर्मचाऱ्यांच्या नोंदणीस विनियमित करतो.
                        </li>
                    </ul>
                    <h4 className="text-xl text-primary font-semibold mt-6 mb-2">इतर प्रमुख योगदान :</h4>
                    <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 pl-5 md:pl-6">
                        <li className="text-gray-900">डॉ. जोशी विविध शासकीय अभ्यास गटांमध्ये सक्रियपणे सहभागी राहिले आणि भारतीय पशुवैद्यक कायद्यांचा अभ्यास करण्यात विशेष रुची घेतली.</li>
                        <li className="text-gray-900">ते जागतिक पशुवैद्यकीय कायद्यांचे तज्ञ मानले जातात.</li>
                        <li className="text-gray-900">त्यांनी अखिल भारतीय सरकारी आणि खाजगी पदविकाधारक पशुवैद्यकांसाठी आधारस्तंभ म्हणून कार्य केले.</li>
                    </ul>
                    <h4 className="text-xl text-primary font-semibold mt-6 mb-2">व्यक्तिगत जीवन आणि मार्गदर्शन :</h4>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        डॉ. जोशी यांचे जीवन प्रेरणा आणि मार्गदर्शनाचे प्रतीक आहे. त्यांनी आपल्या संवर्ग बांधवांच्या न्याय आणि हक्कांच्या रक्षणासाठी आपले जीवन आहुतीत समर्पित केले. ते एक गुरु तुल्य मार्गदर्शक, आधारवड आणि कर्मयोगी आहेत. त्यांचे जीवन कानूनी विद्वत्तेचे आदर्श उदाहरण आहे.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        डॉ. नारायणराव विठ्ठलराव जोशी यांचे जीवन आणि त्यांचे योगदान सदैव आमच्यासोबत राहतील आणि आम्हाला प्रेरित करीत राहतील.
                    </p>
                </div>
            </div>
        </div>
    );
}
export default About
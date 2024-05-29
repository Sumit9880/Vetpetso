import React, { useState } from 'react';
import { IoCloseCircleOutline, IoEyeOutline } from 'react-icons/io5';
import ConfirmationDialog from './ConfirmationDialog'
import MemberPdf from './MemberPdf';
import ImagePreview from './ImagePreview';
import { STATIC_URL } from '../utils/api';
// import html2pdf from 'html2pdf.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MemberPreview = ({ isOpen, onClose, data }) => {
    const [showDilog, setShowDilog] = useState(false)
    const [pdf, setPdf] = useState(false)
    const [preview, setPreview] = useState(false)
    const [url, setUrl] = useState('')

    const handlePreview = (url) => {
        setUrl(url)
        setPreview(true)
        console.log(url, preview);
    }

    const handleOpenDilog = (key) => {
        // setAction(key);
        if (key === "A") {
            data.STATUS = "A"
        } else {
            data.STATUS = "R"
        }
        setShowDilog(true);
    };

    const handleCloseDilog = () => {
        setShowDilog(false);
    };
    const handlePdf = () => {
        setPdf(true)
    }

    // const generatePDF = () => {
    //     const element = document.getElementById('pdf');
    //     var opt = {
    //         margin: 1,
    //         filename: 'myfile.pdf',
    //         image: { type: 'jpeg', quality: 0.98 },
    //         html2canvas: { scale: 2 },
    //         jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    //     }
    //     html2pdf().from(element).set(opt).save();
    // }

    return (
        <>
            <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'block' : 'hidden'}`}>
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="w-8/12  rounded-md overflow-y-auto bg-white p-4 mx-auto max-h-screen ">
                        <ToastContainer />
                        <div className='flex justify-end'>
                            <button className="items-right text-right mr-4 mt-4" onClick={onClose}>
                                <IoCloseCircleOutline className="h-7 w-7 hover:text-red-500 text-gray-500" />
                            </button>
                        </div>
                        <div id="pdf" className="items-center m-16 mt-10">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold mb-4">संघटना सभासदाचा अर्ज - क्रमांक : {data.APPLICATION_NO}</h1>
                            </div>
                            <br />
                            <div>
                                <div className='flex justify-between '>
                                    <div className="text-base font-bold leading-6">प्रेषक,
                                        <p className="text-base font-semibold leading-6">नांव : डॉ./श्री. <span >{data.NAME}</span></p>
                                        <p className="text-base font-semibold leading-6">पत्ता : <span >{data.ADDRESS}</span></p>
                                        <p className="text-base font-semibold leading-6">तालुका : <span >{data.TALUKA_NAME}</span>, जिल्हा : <span >{data.DISTRICT_NAME}</span></p>
                                        <p className="text-base font-semibold leading-6">दूरध्वनी क्रमांक : <span >{data.MOBILE_NUMBER}</span></p>
                                        <p className="text-base font-semibold leading-6">पिन कोड : <span >{data.PIN_CODE}</span></p>
                                    </div>
                                    <img src={STATIC_URL + "ProfilePhoto/" + data.PROFILE_PHOTO} alt="Member Profile" className="w-36 h-36 rounded-full " />
                                </div>
                                <br />
                                <p className="text-base font-medium text-justify leading-7">
                                    <span className="font-semibold">
                                        प्रति,<br />
                                        मा. अध्यक्ष/कार्यवाह<br />
                                        पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध-व्यवस्थापन सेवा संघ,<br />
                                        द्वारा : सदनिका क्रमांक डी-८०४, काकडे सिटी, कर्वे नगर, पुणे ४११०५२<br />
                                        द्वारा : सेंट्रल बिल्डींग आवार, पुणे ४११००१ <br />
                                        <br />
                                        &emsp;&emsp;विषय :-
                                    </span>
                                    &nbsp;संघाच्या सभासदत्वासाठी अर्ज <br />
                                    महोदय,<br />
                                    &emsp;&emsp;महाराष्ट्र राज्यातील खाजगी क्षेत्रात कार्यरत असलेल्या पशु वैद्यकीय पशु संवर्धन व दुग्ध व्यवस्थापन पदवि -
                                    पदविका प्रमाणपत्रधारक च्या आर्थिक, शैक्षणिक, व्यावसायिक आणि सामाजिक प्रश्यांच्या सोडवणूकीसाठी त्यांच्या
                                    विविध हक्कांचे हिताचे संवर्धन व संरक्षण करण्याच्या प्रधान ने पशु वैद्यकीय पशु संवर्धन दुग्ध व्यवस्थापन सेवा संघ
                                    सोसायटी नोंदणी कायदा १८६० व मुंबई सावर्जनिक न्यास स्थापन कायदा १९५० मधील तरतुदीनुसार नोंदणी क्रमांक
                                    अनुक्रमे महा/८४७ पुणे २०११ ता. ७.५.२०११ व एफ ३११९९ ता. १८.९.२०११ अन्वये नोंदला गेला आहे असे
                                    समजल्यावरुन मी सदर अर्ज सादर करीत आहे.<br />
                                    &emsp;&emsp;प्रथमतःच मी प्रतिज्ञापूर्वक नमुद करीत आहे. की संघाच्या नियम अटी धोरणे माझ्यावर बंधनकारक राहतील व
                                    स्वखुषीने माझ्या व आमच्या संवर्गाच्या शैक्षणिक विकासार्थ, सर्वागीण कल्याणार्थ, आर्थिक विकासार्थ आणि व्यवसायिक
                                    हक्काच्या संरक्षणार्थ संघाची वर्गणी वेळोवेळी निश्चित केलेला संघटीत - सर्वंकष - सक्षम कायदेशीर प्रयत्नासाठी
                                    इतर निधी मी वेळोवेळी न चुकता संघास देत राहीन.<br />
                                    &emsp;&emsp;या अर्जासोबत संघाची प्रवेश शुल्क वार्षिक वर्गणी व नियतकालीक व इतर निधी पोटी एकूण रुपये <span className="font-semibold">{1888}/-</span>
                                    फक्त अँप द्वारे पाठवीत आहे.<br />
                                    &emsp;&emsp;माझी वैयक्तिक माहिती खालीलप्रमाणे सादर करीत आहे.
                                </p>
                                <br />
                                <p className="text-base leading-7 font-medium">(१) अर्जदाराचे संपूर्ण नांव : <span className="font-medium">{data.NAME}</span></p>
                                <p className="text-base leading-7 font-medium">(अ) संपूर्ण पत्ता : <span className="font-medium">{data.ADDRESS}</span></p>
                                <p className="text-base leading-7 font-medium">(ब) दूरध्वनी (एसटीडी कोडसह) : <span className="font-medium">{data.MOBILE_NUMBER}</span></p>
                                <p className="text-base leading-7 font-medium">(क) ई-मेल आयडी : <span className="font-medium">{data.EMAIL}</span></p>
                                <p className="text-base leading-7 font-medium">(ड) जन्मतारीख : <span className="font-medium">{new Date(data.DATE_OF_BIRTH).toLocaleDateString('en-IN')}</span></p>
                                <p className="text-base leading-7 font-medium">(ई) पीनकोड : <span className="font-medium">{data.PIN_CODE}</span></p>
                                <p className="text-base leading-7 font-medium">(२) अर्जदाराच्या वडीलांचे संपूर्ण नांव : <span className="font-medium">{data.FATHER_NAME}</span></p>
                                <p className="text-base leading-7 font-medium">(३) संपूर्ण पत्ता गांव : <span className="font-medium">{data.ADDRESS + ',' + data.VILLAGE}</span></p>
                                <p className="text-base leading-7 font-medium">(४) आरक्षित वर्गासाठी : जात : <span className="font-medium">{data.CAST_NAME}</span></p>
                                <p className="text-base leading-7 font-medium">(५) उपरोक्त ठिकाणी वास्तव्याचा कालावधी : <span className="font-medium">{data.DURATION_OF_CURRENT_ADDRESS}</span></p>
                                <p className="text-base leading-7 font-medium">(६) शैक्षणिक अर्हता : <span className="font-medium">{data.EDUCATIONAL_QUALIFICATION}</span></p>
                                <p className="text-base leading-7 font-medium">(७) व्यावसायिक शैक्षणिक अर्हता : <span className="font-medium">{data.PROF_EDUCATION_QUALIFICATION}</span></p>
                                <p className="text-base leading-7 font-medium">(अ) व्हेटर्नरी स्टॉकमैन ट्रेनिंग कोर्स <br />&emsp;&emsp;&emsp;- <span className="font-medium">{data.VET_STOCKMAN_TRANING_COURSE_NAME}</span></p>
                                <p className="text-base leading-7 font-medium">(ब) पशुधन पर्यवेशक अभ्यासक्रम <br />&emsp;&emsp;&emsp;- <span className="font-medium">{data.LIVESTOCK_SUPERVISOR_COURSE_NAME}</span></p>
                                <p className="text-base leading-7 font-medium">(क) व्यवस्थापन व पशुसंवर्धन पदविका <br />&emsp;&emsp;&emsp;- <span className="font-medium">{data.DAIRY_BUSSINES_MANAGEMENT_NAME}</span></p>
                                <p className="text-base leading-7 font-medium">(ड) सेवांतर्गत पशुवैद्यकीय व पशुसंवर्धन पदविका अभ्यासक्रम <br />&emsp;&emsp;&emsp;- <span className="font-medium">{data.DIPLOMA_IN_VETERINARY_MEDICINE_NAME}</span></p>
                                <p className="text-base leading-7 font-medium">(८) व्यावसाय करीत असलेले ठिकाण - मौजे {data.WORKING_CITY} तालुका : {data.WORKING_TALUKA_NAME} जिल्हा : {data.WORKING_DISTRICT_NAME} पिनकोड : {data.WORKING_CITY_PINCODE}</p>
                                <p className="text-base leading-7 font-medium">(९) दूरध्वनी / मोबाई क्रमांक : {data.WORK_MOBILE_NUMBER}</p>
                                <p className="text-base leading-7 font-medium">(१०) ई-मेल आयडी : <span className="font-medium">{data.WORK_EMAIL_ID}</span></p>
                                <p className="text-base leading-7 font-medium">(११) व्यवसायाचा कालावधी : <span className="font-medium">{data.WORK_DURATION}</span></p>
                                <p className="text-base leading-7 font-medium">(१२) घटनात्मक कामात विशेष गोडी असलेले क्षेत्र - <span className="font-medium">{data.INTERESTED_PLACES_TO_WORK}</span></p>
                                <br />
                                <p className="text-base leading-7 font-medium">कळावे,</p>
                                <p className="text-base leading-7 font-medium text-right">आपला विश्वासु,
                                    <br />
                                    <span className="font-medium">( डॉ./श्री/श्रीमती {data.NAME})</span>
                                </p>
                                <p className="text-base leading-7 font-medium text-justify ">
                                    स्थळ : {data.ADDRESS} तारीख : {new Date(data.APPLICATION_DATE_TIME).toLocaleDateString('en-IN')} <br />
                                    सभासदत्य प्रवेश अर्ज स्विकारणेस सहमतीचे नाव : {data.CONCENTERS_NAME} <br />
                                    पत्ता / दूरध्वनी क्रमांक : {data.CONCENTERS_ADDRESS} {data.CONCENTERS_PHONE_NUMBER}  <br />
                                </p>
                                <div className='flex justify-end items-right text-right'>
                                    <img src={STATIC_URL + "MemberSign/" + data.MEMBER_SIGN} alt="Member Profile" style={{ width: "100px", height: "60px" }} />
                                </div>
                                <p className='text-base leading-7 font-medium text-right mr-10'>सही</p>
                                <br />
                                <p className="text-base leading-7 font-medium text-justify flex-row">
                                    संघटना सदस्यत्वासाठी सादर केलेली सत्यप्रती मधील कागदपत्रे -
                                </p>
                                <div className=" items-center leading-6 pt-5">
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                        <p className="font-medium inline-block">(१) शाळा / कॉलेज सोडल्याचा दाखला </p>
                                        <IoEyeOutline className="text-blue-500 hover:text-blue-700 h-5 w-5 ml-2" onClick={() => handlePreview("LeavingCretificate/" + data.LEAVING_CERTIFICATE)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                        <p className="font-medium inline-block">(२) शैक्षणिक अर्हता दाखला </p>
                                        <IoEyeOutline className="text-blue-500 hover:text-blue-700 h-5 w-5 ml-2" onClick={() => handlePreview("EducationalCretificate/" + data.EDUCATIONAL_CERTIFICATE)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                        <p className="font-medium inline-block">(३) व्यावसायिक शिक्षण दाखला </p>
                                        <IoEyeOutline className="text-blue-500 hover:text-blue-700 h-5 w-5 ml-2" onClick={() => handlePreview("ExperienceLetter/" + data.EXPERIENCE_LETTER)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                        <p className="font-medium inline-block">(४) पासपोर्ट साईज फोटो </p>
                                        <IoEyeOutline className="text-blue-500 hover:text-blue-700 h-5 w-5 ml-2" onClick={() => handlePreview("ProfilePhoto/" + data.PROFILE_PHOTO)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                        <p className="font-medium inline-block">(५) आधार कार्ड </p>
                                        <IoEyeOutline className="text-blue-500 hover:text-blue-700 h-5 w-5 ml-2" onClick={() => handlePreview("AdharCard/" + data.ADHAR_CARD)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                        <p className="font-medium inline-block">(६) पॅन कार्ड </p>
                                        <IoEyeOutline className="text-blue-500 hover:text-blue-700 h-5 w-5 ml-2" onClick={() => handlePreview("PanCard/" + data.PAN_CARD)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                        <p className="font-medium inline-block">(७) कार्यानुभवाचा दाखला </p>
                                        <IoEyeOutline className="text-blue-500 hover:text-blue-700 h-5 w-5 ml-2" onClick={() => handlePreview("ExperienceLetter/" + data.EXPERIENCE_LETTER)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            data.STATUS === "A" ? < div className="flex justify-end m-6 space-x-4">
                                <button
                                    onClick={() => handlePdf()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-normal py-1.5 px-4 rounded"
                                >
                                    Print
                                </button>
                            </div> :
                                < div className="flex justify-end m-6 space-x-4">
                                    <button
                                        onClick={() => handleOpenDilog('A')}
                                        className="bg-green-600 hover:bg-green-700 text-white font-normal py-1.5 px-4 rounded"
                                    >
                                        Approve
                                    </button>
                                    {
                                        data.STATUS === "A" ?
                                            <button
                                                onClick={() => handleOpenDilog('R')}
                                                className="bg-red-600 hover:bg-red-700 text-white font-normal py-1.5 px-4 rounded"
                                            >
                                                Reject
                                            </button> : null
                                    }
                                </div>
                        }
                        <ConfirmationDialog open={showDilog} setOpen={handleCloseDilog} fetchData={data} />
                        <MemberPdf open={pdf} setOpen={() => setPdf(false)} data={data} />
                        <ImagePreview open={preview} setOpen={() => setPreview(false)} url={url} />
                    </div>
                </div>
            </div >
        </>
    );
};

export default MemberPreview;

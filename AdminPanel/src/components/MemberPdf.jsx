import React from 'react';
import { PDFViewer, Document, Page, Text, View, Image, Font } from '@react-pdf/renderer';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { STATIC_URL } from '../utils/api';

import marathiFont from '../assets/AnnapurnaSIL-Regular.ttf';

Font.register({ family: 'Marathi', src: marathiFont });

function MemberPdf({ open, setOpen, data }) {
    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center ${open ? '' : 'hidden'}`}>
            <div className='w-9/12 h-screen'>
                <PDFViewer width="100%" height="100%">
                    <Document>
                        <Page size="A4">
                            <View style={{ fontFamily: 'Marathi' }}>
                                <View style={{ margin: 40, pageBreak: 'always', }}>
                                    <View style={{ marginBottom: 10 }}>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'Marathi' }}>संघटना सभासदाचा अर्ज - क्रमांक : {data.ID}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', fontFamily: 'Marathi' }}>
                                        <View>
                                            <Text style={{ fontSize: 12, fontWeight: 'black' }}>प्रेषक :</Text>
                                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>नांव : डॉ./श्री. {data.NAME}</Text>
                                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>पत्ता : {data.ADDRESS}</Text>
                                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>तालुका : {data.TALUKA_NAME} जिल्हा : {data.DISTRICT_NAME}</Text>
                                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>दूरध्वनी क्रमांक : {data.MOBILE_NUMBER}</Text>
                                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>पिन कोड : {data.PIN_CODE}</Text>
                                        </View>
                                        <Image src={""} style={{ width: 100, height: 100, borderRadius: 50 }} />
                                    </View>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginTop: 20 }}>प्रति, </Text>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>मा. अध्यक्ष/कार्यवाह</Text>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध-व्यवस्थापन सेवा संघ,</Text>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>द्वारा : सदनिका क्रमांक डी-८०४, काकडे सिटी, कर्वे नगर, पुणे ४११०५२</Text>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>द्वारा : सेंट्रल बिल्डींग आवार, पुणे ४११००१</Text>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginTop: 20 }}>&emsp;&emsp;विषय :- संघाच्या सभासदत्वासाठी अर्ज </Text>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}></Text>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>महोदय,</Text>
                                    <Text style={{ fontSize: 12 }}>&emsp;&emsp;महाराष्ट्र राज्यातील खाजगी क्षेत्रात कार्यरत असलेल्या पशु वैद्यकीय पशु संवर्धन व दुग्ध व्यवस्थापन पदवि -
                                        पदविका प्रमाणपत्रधारक च्या आर्थिक, शैक्षणिक, व्यावसायिक आणि सामाजिक प्रश्यांच्या सोडवणूकीसाठी त्यांच्या
                                        विविध हक्कांचे हिताचे संवर्धन व संरक्षण करण्याच्या प्रधान ने पशु वैद्यकीय पशु संवर्धन दुग्ध व्यवस्थापन सेवा संघ
                                        सोसायटी नोंदणी कायदा १८६० व मुंबई सावर्जनिक न्यास स्थापन कायदा १९५० मधील तरतुदीनुसार नोंदणी क्रमांक
                                        अनुक्रमे महा/८४७ पुणे २०११ ता. ७.५.२०११ व एफ ३११९९ ता. १८.९.२०११ अन्वये नोंदला गेला आहे असे
                                        समजल्यावरुन मी सदर अर्ज सादर करीत आहे.
                                    </Text>
                                    <Text style={{ fontSize: 12 }}>&emsp;&emsp;प्रथमतःच मी प्रतिज्ञापूर्वक नमुद करीत आहे. की संघाच्या नियम अटी धोरणे माझ्यावर बंधनकारक राहतील व
                                        स्वखुषीने माझ्या व आमच्या संवर्गाच्या शैक्षणिक विकासार्थ, सर्वागीण कल्याणार्थ, आर्थिक विकासार्थ आणि व्यवसायिक
                                        हक्काच्या संरक्षणार्थ संघाची वर्गणी वेळोवेळी निश्चित केलेला संघटीत - सर्वंकष - सक्षम कायदेशीर प्रयत्नासाठी
                                        इतर निधी मी वेळोवेळी न चुकता संघास देत राहीन.</Text>
                                    <Text style={{ fontSize: 12 }}>&emsp;&emsp;या अर्जासोबत संघाची प्रवेश शुल्क वार्षिक वर्गणी व नियतकालीक व इतर निधी पोटी एकूण रुपये {1888}/-
                                        फक्त अँप द्वारे पाठवीत आहे.</Text>
                                    <Text style={{ fontSize: 12 }}>&emsp;&emsp;माझी वैयक्तिक माहिती खालीलप्रमाणे सादर करीत आहे.
                                    </Text>
                                    <Text style={{ fontSize: 12 }}>(१) अर्जदाराचे संपूर्ण नांव :{data.NAME}</Text>
                                    <Text style={{ fontSize: 12 }}>(अ) संपूर्ण पत्ता : {data.ADDRESS}</Text>
                                    <Text style={{ fontSize: 12 }}>(ब) दूरध्वनी (एसटीडी कोडसह) : {data.MOBILE_NUMBER}</Text>
                                    <Text style={{ fontSize: 12 }}>(क) ई-मेल आयडी : {data.EMAIL}</Text>
                                    <Text style={{ fontSize: 12 }}>(ड) जन्मतारीख : {new Date(data.DATE_OF_BIRTH).toLocaleDateString()}</Text>
                                    <Text style={{ fontSize: 12 }}>(ई) पीनकोड : {data.PIN_CODE}</Text>
                                    <Text style={{ fontSize: 12 }}>(२) अर्जदाराच्या वडीलांचे संपूर्ण नांव : {data.FATHER_NAME}</Text>
                                    <Text style={{ fontSize: 12 }}>(३) संपूर्ण पत्ता गांव : {data.ADDRESS + ',' + data.VILLAGE}</Text>
                                    <Text style={{ fontSize: 12 }}>(४) आरक्षित वर्गासाठी : जात : {data.CAST_NAME}</Text>
                                    <Text style={{ fontSize: 12 }}>(५) उपरोक्त ठिकाणी वास्तव्याचा कालावधी : {data.DURATION_OF_CURRENT_ADDRESS}</Text>
                                    <Text style={{ fontSize: 12 }}>(६) शैक्षणिक अर्हता : {data.EDUCATIONAL_QUALIFICATION}</Text>
                                    <Text style={{ fontSize: 12 }}>(७) व्यावसायिक शैक्षणिक अर्हता : {data.PROF_EDUCATION_QUALIFICATION}</Text>
                                </View>
                                <View style={{ margin: 40, pageBreak: 'always', }}>
                                    <Text style={{ fontSize: 12 }}>(अ) व्हेटर्नरी स्टॉकमैन ट्रेनिंग कोर्स </Text>
                                    <Text style={{ fontSize: 12 }}>&emsp;&emsp;&emsp;- {data.VET_STOCKMAN_TRANING_COURSE_NAME}</Text>
                                    <Text style={{ fontSize: 12 }}>(ब) पशुधन पर्यवेशक अभ्यासक्रम </Text>
                                    <Text style={{ fontSize: 12 }}>&emsp;&emsp;&emsp;- {data.LIVESTOCK_SUPERVISOR_COURSE_NAME}</Text>
                                    <Text style={{ fontSize: 12 }}>(क) व्यवस्थापन व पशुसंवर्धन पदविका</Text>
                                    <Text style={{ fontSize: 12 }}>&emsp;&emsp;&emsp;- {data.DAIRY_BUSSINES_MANAGEMENT_NAME}</Text>
                                    <Text style={{ fontSize: 12 }}>(ड) सेवांतर्गत पशुवैद्यकीय व पशुसंवर्धन पदविका अभ्यासक्रम </Text>
                                    <Text style={{ fontSize: 12 }}>&emsp;&emsp;&emsp;- {data.DIPLOMA_IN_VETERINARY_MEDICINE_NAME}</Text>
                                    <Text style={{ fontSize: 12 }}>(८) व्यावसाय करीत असलेले ठिकाण - मौजे {data.WORKING_CITY} तालुका : {data.WORKING_TALUKA_NAME} जिल्हा : {data.WORKING_DISTRICT_NAME} पिनकोड : {data.WORKING_CITY_PINCODE}</Text>
                                    <Text style={{ fontSize: 12 }}>(९) दूरध्वनी / मोबाई क्रमांक : {data.WORK_MOBILE_NUMBER}</Text>
                                    <Text style={{ fontSize: 12 }}>(१०) ई-मेल आयडी : {data.WORK_EMAIL_ID}</Text>
                                    <Text style={{ fontSize: 12 }}>(११) व्यवसायाचा कालावधी : {data.WORK_DURATION}</Text>
                                    <Text style={{ fontSize: 12 }}>(१२) घटनात्मक कामात विशेष गोडी असलेले क्षेत्र - {data.INTERESTED_PLACES_TO_WORK}</Text>
                                    <Text style={{ fontSize: 12, marginTop: 20 }}>कळावे,</Text>
                                    <View style={{}}>
                                        <Text style={{ fontSize: 12, textAlign: 'right' }}>आपला विश्वासु,</Text>
                                        <Text style={{ fontSize: 12, textAlign: 'right' }}>( डॉ./श्री/श्रीमती {data.NAME})</Text>
                                    </View>
                                    <Text style={{ fontSize: 12 }}>स्थळ : {data.ADDRESS} तारीख : {data.DATEOFBIRTH} </Text>
                                    <Text style={{ fontSize: 12 }}>सभासदत्य प्रवेश अर्ज स्विकारणेस सहमतीचे नाव : {data.CONCENTERS_NAME} </Text>
                                    <Text style={{ fontSize: 12 }}>पत्ता / दूरध्वनी क्रमांक : {data.CONCENTERS_ADDRESS} {data.CONCENTERS_PHONE_NUMBER} </Text>
                                    <View style={{ justifyContent: 'flex-end' }}>
                                        <Image src={"./sign.jpg"} style={{ width: 100, height: 100, borderRadius: 50 }} />
                                        <Text style={{ fontSize: 12, textAlign: 'right' }}>सही</Text>
                                    </View>
                                </View>
                            </View>
                        </Page>
                    </Document>
                </PDFViewer>
            </div >
            <div className=' w-2 h-full flex justify-end'>
                <button className="h-9 ml-24 m-14 w-9 items-right text-right " onClick={setOpen}>
                    <IoCloseCircleOutline className=" h-8 w-8 hover:text-red-500 text-red-500" />
                </button>
            </div>
        </div >
    );
}

export default MemberPdf;

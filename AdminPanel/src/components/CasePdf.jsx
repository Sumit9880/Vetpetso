// import { PDFViewer, Document, Page, Text, View, Image, Font } from '@react-pdf/renderer';
// import { IoCloseCircleOutline } from 'react-icons/io5';
// import { STATIC_URL } from '../utils/api';

// import marathiFont from '../assets/Sarala-Bold.ttf';

// Font.register({ family: 'Marathi', src: marathiFont });

// function CasePdf({ open, setOpen, item }) {
//     return (
//         <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${open ? 'block' : 'hidden'}`}>
//             <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
//                 <div className='w-9/12 h-screen'>
//                     <PDFViewer width="100%" height="100%">
//                         <Document>
//                             <Page size="A4">
//                                 <View style={{ fontFamily: 'Marathi' }}>
//                                     <View style={{ margin: 35, pageBreak: 'always', }}>
//                                         <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '10px' }}>
//                                             <Text style={{ textAlign: 'right', fontSize: 16, fontWeight: '600' }}>
//                                                 Case No. : {item?.CASE_NO ? item?.CASE_NO : ''}
//                                             </Text>
//                                         </View>
//                                         <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
//                                             <Image src={`/vetpetso.png`} style={{ width: 80, height: 80 }} />
//                                         </View>
//                                         <Text style={{ textAlign: 'center', color: '#000', fontSize: 16, fontWeight: '400', marginVertical: '16px' }}>पशु-पक्षांची आरोग्य वृद्धी, भारताची आर्थिक समृद्धी</Text>
//                                         <Text style={{ color: '#000', fontSize: 12 }}>डॉ. (सौजन्य दर्शकशिर्षक) : {item?.DOCTOR_NAME ? item?.DOCTOR_NAME : ''}</Text>
//                                         <Text style={{ fontSize: 13, marginTop: '10px' }}>पशुधन पर्यवेक्षक पदविका अभ्यासक्रम</Text>
//                                         <Text style={{ color: '#000', fontSize: 12 }}>शासन अधिसूचना कृषी पशुसंवर्धन दुग्ध व्यवसाय विकास व मत्स्य विभाग क्रमांक पविआ - २०११ / प्र. क्र. ३९ प्रदुम - ३ ता . २९/१०/२०१४ च्या परिच्छेद ६ मधील तरतुदीनुसार</Text>
//                                         <Text style={{ fontSize: 13, marginTop: '10px' }}>पशुवैद्यकीय व्यक्ती</Text>
//                                         <Text style={{ color: '#000', fontSize: 12 }}>सदस्य, पशुवैद्यकीय, पशुसंवर्धन व दुग्ध व्यवस्थापन सेवा संघ, संस्था नोंदणी अधिनियम १८६० नुसार रजि. नं. महा. ८४७ / २०११ (पुणे) दि. ७/५/२०११ मुंबई सार्वजनिक न्यास व्यवस्थापन अधिनियम १९५० अन्वये नोंदणी क्र. एएफ/ ३११९९/पुणे, दि. १८-०९-२०११/पुणे.</Text>
//                                         <Text style={{ fontSize: 13, marginTop: '10px' }}>सदस्य नोंदणी क्रमांक : {item?.MEMBER_REGISTRATION_NO ? item?.MEMBER_REGISTRATION_NO : ''}</Text>
//                                         <Text style={{ color: '#000', fontSize: 12 }}>१) कृत्रिम रेतन तथा लघु पशुवैद्यकीय सेवा संस्था (खाजगी क्षेत्र)</Text>
//                                         <Text style={{ color: '#000', fontSize: 12 }}>मु.पो. : {item?.AT_POST ? item?.AT_POST : ''} तालुका : {item?.TALUKA_NAME ? item?.TALUKA_NAME : ''} जिल्हा : {item?.DISTRICT_NAME ? item?.DISTRICT_NAME : ''}</Text>
//                                         <Text style={{ color: '#000', fontSize: 12 }}>२) {item?.CASE_TYPE === 1 ? 'रुग्ण प्रकरण' : item?.CASE_TYPE === 2 ? 'कृत्रीम रेतन' : item?.CASE_TYPE === 3 ? 'लसीकरण' : ''} दिनांक : {item?.REGISTRATION_DATE ? new Date(item?.REGISTRATION_DATE).toDateString() : ''}</Text>
//                                         <Text style={{ color: '#000', fontSize: 12 }}>३) रुग्ण पशु/पक्षी जात : {item?.BREED_NAME ? item?.BREED_NAME : ''} वय : {item?.ANIMAL_AGE ? item?.ANIMAL_AGE : ''}</Text>
//                                         <Text style={{ color: '#000', fontSize: 12 }}>४) मालकाचे नांव : {item?.OWNER_NAME ? item?.OWNER_NAME : ''}</Text>
//                                         <Text style={{ color: '#000', fontSize: 12 }}>५) पत्ता (भ्रमणध्वनीसह) : {item?.ADDRESS ? item?.ADDRESS : ''} ({item?.MOBILE_NUMBER ? item?.MOBILE_NUMBER : ''})</Text>
//                                         <Text style={{ fontSize: 13 }}>६) लघुपशुवैद्यकीय औषधोपचार लघुशल्यक्रियासाठी / कृत्रीम रेतन-गर्भधारणा तपासणीसाठी संमती पत्र.</Text>
//                                         <Text style={{ color: '#000', fontSize: 12 }}>अ) माझ्या मालकीचे रुग्ण {item?.ANIMAL_TYPE_NAME ? item?.ANIMAL_TYPE_NAME : ''}, याच्यावर आवश्यक ते लघु पशुवैद्यकीय औषधोपचार, रोग प्रतिबंधक उपाय योजना तसेच, लघुशल्य क्रिया व कृत्रीम रेतन- गर्भनिदान करण्यास मी या संमती पत्राद्वारे स्वखुशीने संमती देत आहे.</Text>
//                                         <Text style={{ color: '#000', fontSize: 12 }}>ब) मुंबई राज्य शासनाच्या नागरी पशुवैद्यकीय सेवा संचालनालय परिपत्रक क्रमांक ३६, दिनांक १८ डिसेंबर १९१४ (संदर्भ पान क्र. ५४३, मॅन्युअल ऑफ ऑफिस प्रोसिजर पशुसंवर्धन खाते १९६७) मधील तरतुदीनुसार रुग्णावर योग्य ती काळजी घेऊनसुद्धा रुग्णास इजा, अपाय किंवा रुग्ण दगावल्यास झालेल्या नुकसानीबद्दल संबंधीत लघु पशुवैद्यकीय व्यावसायीक किंवा त्यांचा कर्मचारी यास जबाबदार धरले जाणार नाही याची जाणीव मला स्पष्टपणे करून देण्यात आली आहे.</Text>
//                                         <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                                             <Text style={{ color: '#000', fontSize: 12 }}>दिनांक: {item?.REGISTRATION_DATE ? new Date(item?.REGISTRATION_DATE).toDateString() : ''}</Text>
//                                             <View style={{ alignItems: 'center' }}>
//                                                 <Image src={`${STATIC_URL}OwnerSign/${item?.OWNER_SIGN}`} style={{ width: 100, height: 60 }} />
//                                                 <Text style={{ color: '#000', fontSize: 12 }}>रुग्ण पशुपक्षी मालकाची सही</Text>
//                                             </View>
//                                         </View>
//                                     </View>
//                                 </View>
//                             </Page>
//                         </Document>
//                     </PDFViewer>
//                 </div>
//                 <div className=' w-2 h-full flex justify-end'>
//                     <button className="h-9 ml-24 m-14 w-9 items-right text-right " onClick={setOpen}>
//                         <IoCloseCircleOutline className=" h-8 w-8 hover:text-red-500 text-red-500" />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default CasePdf;

// <Page size="A4" style={{ fontFamily: 'Marathi', margin: 0, padding: 0 }}>
//     <View style={{ margin: '16px', padding: '16px', borderWidth: 1, borderColor: '#000', borderRadius: 4, pageBreakBefore: 'always' }}>
//         <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '16px' }}>
//             <Text style={{ textAlign: 'right', fontSize: 16, fontWeight: '700' }}>
//                 Case No. : {item?.CASE_NO ? item?.CASE_NO : ''}
//             </Text>
//         </View>
//         <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: '16px' }}>
//             <Image src={`/vetpetso.png`} style={{ width: 80, height: 80 }} />
//         </View>
//         <Text style={{ textAlign: 'center', color: '#000', fontSize: 16, fontWeight: '900', marginVertical: '16px' }}>पशु-पक्षांची आरोग्य वृद्धी, भारताची आर्थिक समृद्धी</Text>
//         <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>डॉ. (सौजन्य दर्शकशिर्षक) : {item?.DOCTOR_NAME ? item?.DOCTOR_NAME : ''}</Text>
//         <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: '5px' }}>पशुधन पर्यवेक्षक पदविका अभ्यासक्रम</Text>
//         <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>शासन अधिसूचना कृषी पशुसंवर्धन दुग्ध व्यवसाय विकास व मत्स्य विभाग क्रमांक पविआ - २०११ / प्र. क्र. ३९ प्रदुम - ३ ता . २९/१०/२०१४ च्या परिच्छेद ६ मधील तरतुदीनुसार</Text>
//         <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: '5px' }}>पशुवैद्यकीय व्यक्ती</Text>
//         <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>सदस्य, पशुवैद्यकीय, पशुसंवर्धन व दुग्ध व्यवस्थापन सेवा संघ, संस्था नोंदणी अधिनियम १८६० नुसार रजि. नं. महा. ८४७ / २०११ (पुणे) दि. ७/५/२०११ मुंबई सार्वजनिक न्यास व्यवस्थापन अधिनियम १९५० अन्वये नोंदणी क्र. एएफ/ ३११९९/पुणे, दि. १८-०९-२०११/पुणे.</Text>
//         <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: '5px' }}>सदस्य नोंदणी क्रमांक : {item?.MEMBER_REGISTRATION_NO ? item?.MEMBER_REGISTRATION_NO : ''}</Text>
//         <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>१) कृत्रिम रेतन तथा लघु पशुवैद्यकीय सेवा संस्था (खाजगी क्षेत्र)</Text>
//         <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>मु.पो. : {item?.AT_POST ? item?.AT_POST : ''} तालुका : {item?.TALUKA_NAME ? item?.TALUKA_NAME : ''} जिल्हा : {item?.DISTRICT_NAME ? item?.DISTRICT_NAME : ''}</Text>
//         <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>२) {item?.CASE_TYPE === 1 ? 'रुग्ण प्रकरण' : item?.CASE_TYPE === 2 ? 'कृत्रीम रेतन' : item?.CASE_TYPE === 3 ? 'लसीकरण' : ''} दिनांक : {item?.REGISTRATION_DATE ? new Date(item?.REGISTRATION_DATE).toDateString() : ''}</Text>
//         <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>३) रुग्ण पशु/पक्षी जात : {item?.BREED_NAME ? item?.BREED_NAME : ''} वय : {item?.ANIMAL_AGE ? item?.ANIMAL_AGE : ''}</Text>
//         <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>४) मालकाचे नांव : {item?.OWNER_NAME ? item?.OWNER_NAME : ''}</Text>
//         <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>५) पत्ता (भ्रमणध्वनीसह) : {item?.ADDRESS ? item?.ADDRESS : ''} ({item?.MOBILE_NUMBER ? item?.MOBILE_NUMBER : ''})</Text>
//         <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: '5px' }}>६) लघुपशुवैद्यकीय औषधोपचार लघुशल्यक्रियासाठी / कृत्रीम रेतन-गर्भधारणा तपासणीसाठी संमती पत्र.</Text>
//         <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>अ) माझ्या मालकीचे रुग्ण {item?.ANIMAL_TYPE_NAME ? item?.ANIMAL_TYPE_NAME : ''}, याच्यावर आवश्यक ते लघु पशुवैद्यकीय औषधोपचार, रोग प्रतिबंधक उपाय योजना तसेच, लघुशल्य क्रिया व कृत्रीम रेतन- गर्भनिदान करण्यास मी या संमती पत्राद्वारे स्वखुशीने संमती देत आहे.</Text>
//         <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>ब) मुंबई राज्य शासनाच्या नागरी पशुवैद्यकीय सेवा संचालनालय परिपत्रक क्रमांक ३६, दिनांक १८ डिसेंबर १९१४ (संदर्भ पान क्र. ५४३, मॅन्युअल ऑफ ऑफिस प्रोसिजर पशुसंवर्धन खाते १९६७) मधील तरतुदीनुसार रुग्णावर योग्य ती काळजी घेऊनसुद्धा रुग्णास इजा, अपाय किंवा रुग्ण दगावल्यास झालेल्या नुकसानीबद्दल संबंधीत लघु पशुवैद्यकीय व्यावसायीक किंवा त्यांचा कर्मचारी यास जबाबदार धरले जाणार नाही याची जाणीव मला स्पष्टपणे करून देण्यात आली आहे.</Text>
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//             <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>दिनांक: {item?.REGISTRATION_DATE ? new Date(item?.REGISTRATION_DATE).toDateString() : ''}</Text>
//             <View style={{ alignItems: 'center' }}>
//                 <Image src={`${STATIC_URL}OwnerSign/${item?.OWNER_SIGN}`} style={{ width: 100, height: 60 }} />
//                 <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>रुग्ण पशुपक्षी मालकाची सही</Text>
//             </View>
//         </View>
//     </View>

//     {/* Second Page */}
//     <Page size="A4" style={{ fontFamily: 'Marathi', margin: 0, padding: 0 }}>
//         <View style={{ margin: '16px', padding: '16px', borderWidth: 1, borderColor: '#000', borderRadius: 4 }}>
//             <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: '5px' }}>७) रुग्णाचा पूर्व इतिहास :</Text>
//             <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>१) तापमान : {item?.TEMPERATURE ? item?.TEMPERATURE : ''}</Text>
//             <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>२) नाडीचे ठोके : {item?.PULSE ? item?.PULSE : ''}</Text>
//             <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>३) पोटाच्या पहिल्या (रुमेन) भागाची हालचाल : {item?.ABDOMINAL_MOVEMENT ? item?.ABDOMINAL_MOVEMENT : ''}</Text>
//             <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>४) जननेंद्रियांची अवस्था : {item?.GENITAL_CONDITION ? item?.GENITAL_CONDITION : ''}</Text>
//             <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>५) श्वसन संस्थेची अवस्था : {item?.RESPIRATORY_CONDITION ? item?.RESPIRATORY_CONDITION : ''}</Text>
//             <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>६) नाकपुडी, चामडी, डोळे, निरिक्षण : {item?.OBSERVATION_OF_EYE_SKIN_NOSTRIL ? item?.OBSERVATION_OF_EYE_SKIN_NOSTRIL : ''}</Text>
//             <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>७) पाणी पिण्याचे प्रमाण : {item?.WATER_INTAKE ? item?.WATER_INTAKE : ''}</Text>
//             <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>८) जंतुनाशक औषधांचा वापर केला होता की काय? असल्यास कोणती औषधे वापरली ?: {item?.DID_TAKE_ANTISEPTIC ? item?.DID_TAKE_ANTISEPTIC : ''}</Text>
//             <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>९) इतर माहिती: {item?.OTHER_INFO ? item?.OTHER_INFO : ''}</Text>
//             <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: '5px' }}>८) शारीरिक तपासणीः</Text>

//             <View style={{ flexDirection: 'row', marginBottom: '16px' }}>
//                 <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>सामान्य स्थिति: {item?.GENERAL_STATUS ? item?.GENERAL_STATUS : ''}</Text>
//                 <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>वेटरिनरी अहवाल: {item?.VETERINARY_REPORT ? item?.VETERINARY_REPORT : ''}</Text>
//             </View>
//             <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: '5px' }}>उपचाराचे प्रमाण:</Text>
//             <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>१) {item?.TREATMENT_DETAILS ? item?.TREATMENT_DETAILS : ''}</Text>
//             <Text style={{ color: '#000', fontSize: 12, marginBottom: '5px' }}>२) {item?.ADDITIONAL_TREATMENT_DETAILS ? item?.ADDITIONAL_TREATMENT_DETAILS : ''}</Text>
//         </View>
//     </Page>
// </Page>
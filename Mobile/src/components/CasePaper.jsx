import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, PermissionsAndroid, ToastAndroid } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import Pdf from 'react-native-pdf';
import Share from 'react-native-share';
import { STATIC_URL } from '../utils/api';
import Loader from './Loader';

const CasePaper = ({ visible, setVisible, item }) => {

    const [isGenerated, setIsGenerated] = useState(false)
    const [pdf, setPDF] = useState(null)
    const [loader, setLoader] = useState(false)
    let CHECKUP_DETAILS = JSON.parse(item.CHECKUP_DETAILS || "[]")

    const generatePDF = async () => {
        setLoader(true);
        let rows = ''
        let rows1 = ''
        if (CHECKUP_DETAILS.length > 0) {
            rows = CHECKUP_DETAILS.map((item, index) => {
                return `<tr>
                            <td style="border: 1px solid black; padding: 8px; text-align: center;">${item.OBSERVATION_DATE ? new Date(item.OBSERVATION_DATE).toLocaleDateString() : ''}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">${item.OBSERVATION_AND_FINDINGS ? item.OBSERVATION_AND_FINDINGS : ''}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">${item.TREATMENT_AND_SUGGESTION ? item.TREATMENT_AND_SUGGESTION : ''}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">${item.REMARKS ? item.REMARKS : ''}</td>
                        </tr>`
            }).join('')
            rows1 = CHECKUP_DETAILS.map((item, index) => {
                return `<tr>
                            <td style="padding: 8px; text-align: center;">${item.OBSERVATION_DATE ? new Date(item.OBSERVATION_DATE).toLocaleDateString() : ''}</td>
                            <td style="padding: 8px; text-align: left;">${item.PRESCRIPTION ? item.PRESCRIPTION : ''}</td>
                        </tr>`
                // return `${item.OBSERVATION_DATE ? new Date(item.OBSERVATION_DATE).toLocaleDateString() : ''} &nbsp;&nbsp;&nbsp;&nbsp;${item.PRESCRIPTION ? item.PRESCRIPTION : ''}<br/>`
            }).join('')
        } else {
            rows = `<tr>
                        <td style="border: 1px solid black; padding: 8px; text-align: center;"> </br></br></br></td>
                        <td style="border: 1px solid black; padding: 8px; text-align: left;"> </br></br></br></td>
                        <td style="border: 1px solid black; padding: 8px; text-align: left;"> </br></br></br></td>
                        <td style="border: 1px solid black; padding: 8px; text-align: left;"> </br></br></br></td>
                    </tr>`
        }
        // border: 1px solid #000;
        // border - radius: 4px;
        const options = {
            html: `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maharashtra Model Case Paper</title>
    <style>
        body {
            font-family: sans-serif;
            margin: 0;
            padding: 0;
        }

        @media print {
            .main {
                page-break-before: always;
            }

            .main:first-of-type {
                page-break-before: auto;
            }
        }

        .page-break {
            page-break-before: always;
        }

        .main {
            margin: 1rem;
            height: 100%;
            padding: 1.5rem;
            page-break-before: always;
        }

        body {
            font-family: sans-serif;
            margin: 0;
            padding: 0;
        }

        h2 {
            text-align: center;
            color: #4B1AFF;
        }

        h3 {
            text-align: center;
            color: #000;
        }

        .prescription-details {
            margin: 1rem;
            /* width: 90%; */
            height: 100%;
            padding: 1rem;
            border: 1px solid #000;
            border-radius: 4px;
        }

        .details-row {
            margin-bottom: 1rem;
            display: flex;
        }

        .details-label {
            display: inline-block;
            text-align: left;
            width: 170px;
            font-weight: 500;
        }

        .details-content {
            display: inline-block;
        }

        .lable {
            align-items: center;
            display: flex;
        }
    </style>
</head>

<body>
    <div class="main">
        <div style="display: flex; align-items: center;justify-content: flex-end; padding-right: 1rem;">
            <span style="text-align: right; font-size: 18px; font-weight: 600;color: 'res';">Case No. :
                ${item.CASE_NO ? item.CASE_NO : ''}</span>
        </div>
        <div style="display: flex; align-items: center;justify-content: center;">
            <img src="${STATIC_URL ? STATIC_URL : ''}/Others/vetpetso.png" style="width: 100px; height: 100px;"
                alt="Logo" />
        </div>
        <h3 style="text-align: center; font-weight: 600;">पशु-पक्षांची आरोग्य वृद्धी, भारताची आर्थिक समृद्धी</h3>
        <p>डॉ. (सौजन्य दर्शकशिर्षक) : ${item.DOCTOR_NAME ? item.DOCTOR_NAME : ''}</p>
        <P><span style="font-size: 17px; font-weight: 600;">पशुधन पर्यवेक्षक पदविका अभ्यासक्रम </span></br>
            (शासन अधिसूचना कृषी पशुसंवर्धन दुग्ध व्यवसाय विकास व मत्स्य विभाग क्रमांक पविआ - २०११ / प्र. क्र. ३९ प्रदुम
            - ३ ता . २९/१०/२०१४ च्या परिच्छेद ६ मधील तरतुदीनुसार) </P>
        <p style="font-weight: semibold;"><span style="font-size: 17px; font-weight: 600;">पशुवैद्यकीय
                व्यक्ती</span></br>
            (भारतीय पशुवैद्यकीय परिषद कायदा १९८४ मधील कलम ३० (ब) व ५७ मधील तरतूदीनुसार)</p>
        <P> <span style="font-weight: 600;">सदस्य,</span> पशुवैद्यकीय, पशुसंवर्धन व दुग्ध व्यवस्थापन
            सेवा संघ,संस्था नोंदणी अधिनियम १८६० नुसार रजि. नं. महा.
            ८४७ / २०११ (पुणे) दि. ७/५/२०११ मुंबई सार्वजनिक न्यास व्यवस्थापन अधिनियम १९५० अन्वये नोंदणी क्र. एएफ/
            ३११९९/पुणे, दि. १८-०९-२०११/पुणे.</P>
        <p style="font-weight: 600;">सदस्य नोंदणी क्रमांक : ${item.MEMBER_REGISTRATION_NO ? item.MEMBER_REGISTRATION_NO
                    : ''}</p>
        <p><span style="font-weight: 600;">१) कृत्रिम रेतन तथा लघु पशुवैद्यकीय सेवा संस्था (खाजगी
                क्षेत्र) </span></br>
            &nbsp;&nbsp;&nbsp;&nbsp;मु.पो. : ${item.AT_POST ? item.AT_POST : ''}&nbsp;&nbsp;&nbsp;&nbsp;तालुका :
            ${item.TALUKA_NAME ? item.TALUKA_NAME : ''} &nbsp;&nbsp;&nbsp;&nbsp;जिल्हा : ${item.DISTRICT_NAME ?
                    item.DISTRICT_NAME : ''}</p>
        <p><span>२) ${item.CASE_TYPE == 1 ? 'रुग्ण प्रकरण' : item.CASE_TYPE == 2 ? 'कृत्रीम रेतन' : item.CASE_TYPE == 3 ? 'लसीकरण' : ''}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; दिनांक : ${item.REGISTRATION_DATE ? new
                    Date(item.REGISTRATION_DATE).toDateString() : ''}</p>
        <p>३) रुग्ण पशु/पक्षी जात : ${item.BREED_NAME ? item.BREED_NAME :
                    ''}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;वय : ${item.ANIMAL_AGE ? item.ANIMAL_AGE : ''}</p>
        <p>४) मालकाचे नांव : ${item.OWNER_NAME ? item.OWNER_NAME : ''}</p>
        <p>५) पत्ता (भ्रमणध्वनीसह) : ${item.ADDRESS ? item.ADDRESS : ''} (${item.MOBILE_NUMBER ? item.MOBILE_NUMBER :
                    ''})</p>
        <p>
            <span style="font-weight: 600;">६) लघुपशुवैद्यकीय औषधोपचार लघुशल्यक्रियासाठी / कृत्रीम रेतन-गर्भधारणा
                तपासणीसाठी संमती पत्र.
            </span></br>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;अ) माझ्या मालकीचे रुग्ण ${item.ANIMAL_TYPE_NAME ? item.ANIMAL_TYPE_NAME : ''},
                याच्यावर आवश्यक ते लघु पशुवैद्यकीय औषधोपचार, रोग प्रतिबंधक उपाय योजना तसेच, लघुशल्य क्रिया व
                कृत्रीम रेतन- गर्भनिदान करण्यास मी या संमती पत्राद्वारे स्वखुशीने संमती देत आहे.</span></br>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;ब) मुंबई राज्य शासनाच्या नागरी पशुवैद्यकीय सेवा संचालनालय परिपत्रक क्रमांक ३६,
                दिनांक १८ डिसेंबर १९१४
                (संदर्भ पान क्र. ५४३, मॅन्युअल ऑफ ऑफिस प्रोसिजर पशुसंवर्धन खाते १९६७) मधील तरतुदीनुसार रुग्णावर योग्य ती
                काळजी घेऊनसुद्धा रुग्णास इजा, अपाय किंवा रुग्ण दगावल्यास झालेल्या नुकसानीबद्दल संबंधीत लघु पशुवैद्यकीय
                व्यावसायीक किंवा त्यांचा कर्मचारी यास जबाबदार धरले जाणार नाही याची जाणीव मला स्पष्टपणे करून देण्यात आली
                आहे.</span>
        </p>
        <div style="display: flex; justify-content: space-between;">
            <p>दिनांक: ${item.REGISTRATION_DATE ? new Date(item.REGISTRATION_DATE).toDateString() : ''}</p>
            <div style="align-items: center; justify-content: center;">
                <img src="${STATIC_URL}OwnerSign/${item.OWNER_SIGN}" style="width: 100px; height: 60px;" alt="Logo" />
                <p style="margin-right: 50px;">रुग्ण पशुपक्षी मालकाची सही</p>
            </div>
        </div>
    </div>
    <div class="main" style="page-break-before: always !important;">
        <p>
            <span style="font-weight: 600;">७) रुग्णाचा पूर्व इतिहास :-</span></br>
            १) तापमान : ${item.TEMPERATURE ? item.TEMPERATURE : ''} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;२)
            नाडीचे ठोके : ${item.PULSE ? item.PULSE : ''}</br>
            ३) पोटाच्या पहिल्या (रुमेन) भागाची हालचाल : ${item.ABDOMINAL_MOVEMENT ? item.ABDOMINAL_MOVEMENT : ''}</br>
            ४) जननेंद्रियांची अवस्था : ${item.GENITAL_CONDITION ? item.GENITAL_CONDITION : ''}</br>
            ५) श्वसन संस्थेची अवस्था : ${item.RESPIRATORY_CONDITION ? item.RESPIRATORY_CONDITION : ''}</br>
            ६) नाकपुडी, चामडी, डोळे, निरिक्षण : ${item.OBSERVATION_OF_EYE_SKIN_NOSTRIL ?
                    item.OBSERVATION_OF_EYE_SKIN_NOSTRIL : ''}</br>
            ७) पाणी पिण्याचे प्रमाण : ${item.WATER_INTAKE ? item.WATER_INTAKE : ''}</br>
            ९) जंतुनाशक औषधांचा वापर केला होता की काय? असल्यास कोणती औषधे वापरली ?: ${item.DID_TAKE_ANTISEPTIC_DRUGS ?
                    item.DID_TAKE_ANTISEPTIC_DRUGS : ''} </br>
            १०) घरगुती उपचार केले असल्यास तपशील. : ${item.DID_MAKE_HOME_REMEDIES ? item.DID_MAKE_HOME_REMEDIES :
                    ''}</br>
            ११) इतर महत्वाची माहिती : ${item.OTHER_INFORMATION ? item.OTHER_INFORMATION : ''}</br>
            १२) लसीकरणाची माहिती : ${(item.CASE_TYPE == 3 ? `Vaccine Type : ${item.TYPE ? item.TYPE : ''} &nbsp;&nbsp;Vaccine Name :
            ${item.NAME ? item.NAME : ''} &nbsp;&nbsp;Side Effects : ${item.SIDE_EFFECTS ? item.SIDE_EFFECTS : ''}` : '')} </br>
            १३) कृत्रीम रेतनाची माहिती : ${(item.CASE_TYPE == 2 ? `Is Pregnant : ${item.IS_PREGNANT ? "Yes" : "No"}
            &nbsp;&nbsp;Delivery Date : ${item.DELIVERY_DATE ? new Date(item.DELIVERY_DATE).toLocaleDateString() : ''} &nbsp;&nbsp;Milk
            Production : ${item.MILK_PRODUCTION ? item.MILK_PRODUCTION : ''}` : '')} </br>
        </p>
        <p style="font-weight: 600;">८) रोगाचे प्राथमिक निदान : ${item.FIRST_AID ? item.FIRST_AID : ''}</p>
        <p><span style="font-weight: 600;">९) रोग निदान निश्चितीसाठी प्रयोगशाळा तपासणी करता रुग्णाचे घेतलेले खालील नमुने
                -</span></br>
            १) मल
            २) मूत्र
            ३) रक्त
            ४) रक्त जल
            ५) इतर
        </p>
        <p style="font-weight: 600;">१०) रोग निदान प्रयोगशाळेकडून आलेले निष्कर्ष : ${item.DIAGNOSTIC_LABORATORY_REMARK ?
                    item.DIAGNOSTIC_LABORATORY_REMARK : ''}</p>
        <p style="font-weight: 600;">११) रुग्णाची देखभाल व काळजी घेण्यासंबंधी मालकास दिलेला सल्ला / सूचना :
            ${item.INSTRUCTIONS_TO_OWNER ? item.INSTRUCTIONS_TO_OWNER : ''}</p>
    </div>
    <div class="main" style="page-break-before: always !important;">
        <p>१२) </p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="border: 1px solid black; padding: 8px; text-align: center; background-color: #f2f2f2;">दिनांक
                    </br>Date</th>
                <th style="border: 1px solid black; padding: 8px; text-align: center; background-color: #f2f2f2;">
                    निरीक्षण </br>(Observations & Findings)</th>
                <th style="border: 1px solid black; padding: 8px; text-align: center; background-color: #f2f2f2;">
                    औषधोपचार आणि मालकास सूचना </br>(Treatment & Suggestion to Owner)</th>
                <th style="border: 1px solid black; padding: 8px; text-align: center; background-color: #f2f2f2;">शेरा
                    </br>Remarks</th>
            </tr>
            ${rows}
        </table>
        <p>
            १३) रुग्ण पत्रिका बंद दिनांक : ${item.DISCHARGE_DATE ? new Date(item.DISCHARGE_DATE).toDateString() :
                    ''}</br>
            ${item.DISCHARGE_REMARK ? item.DISCHARGE_REMARK : ''}
        </p>

        <p>( ${item.DOCTOR_NAME ? item.DOCTOR_NAME : ''} )</br>
            १४) VETERINARY - PERSON.</p>

        <p style="font-weight: 600;">१५) [This case paper has been designed and issued by the Veterinary Animal Hus-
            bandry and Dairy Farm
            Management
            Services Organisation (Regd.) with reference to the provisions under section 30(b) and section 57 of the I.
            V.
            C. Act 1984. Provi- sion under State Govt. Notification No. I. V. C. 1006/C.R./532/ADF 4 Dt. 27th August
            2009.
            The State Govt. Clearification under circular No. I. V. C. 1006/C.R.532 (Part II) ADF-4, Dt. 8th March 2011
            regarding supervision & Direction required under section 30 (b) of said Act. 1984. The (S. O. P.) Standered
            Operating Procedure for A. I. pre- scribed by the Govt. of India Ministery of Agri. Department of Animal
            Husbandry Dairy- ing and Fisheries vide their letter No. F. No.3.3./2013-A.H.T. (NPLBB) Dt. 10-06-2013.]</p>
        <div style="margin-top:50px;">
            <p style="font-weight: 600;">ISSUED IN THE PUBLIC INTEREST</p>
            <div>
                <img src="${STATIC_URL}OwnerSign/${item.OWNER_SIGN}" style="width: 100px; height: 60px;" alt="Logo" />
            </div>
            <p>Secretary </br>Veterinary Animal Husbandry and Dairy Management Services Organisation(Regd.)</p>
        </div>

    </div>
    <div class="main" style="page-break-before: always !important;">
        <div style="display: flex; align-items: center; padding: 10px 40px">
            <img src="${STATIC_URL}/Others/vetpetso.png" style="width: 100px; height: 100px;" alt="Logo" />
            <div style="align-items: center; width : 100%;">
                <h2>MAHARASHTRA MODEL</h2>
                <h3>PRESCRIPTION</h3>
            </div>
            <img src="${STATIC_URL}Others/rx.png" style="width: 80px; height: 80px;" alt="Logo" />
        </div>
        <p style=" font-weight: 500;">&emsp;&emsp;&emsp;[Prescribed by the veterinary, Animal husbandry and Dairy farm
            management
            services organisation on
            the line of format issued by the Food and Drugs Administration Maharashtra state survey no. 341,
            Bandra- Kurla Complex, Bandra (East), Mumbai-400 051.]
        </p>
        <div class="details-row">
            <div class="lable">
                <span>1)&nbsp;</span>
                <span class="details-label">Prescriber Full Name</span>
            </div>
            <div class="lable">
                <span> : ${item.DOCTOR_NAME ? item.DOCTOR_NAME : ''}</span>
            </div>
        </div>
        <div class="details-row">
            <div class="lable">
                <span>2)&nbsp;</span>
                <span class="details-label">Qualification</span>
            </div>
            <div class="lable">
                <span> : ${item.PROF_EDUCATION_QUALIFICATION ? item.PROF_EDUCATION_QUALIFICATION : ''}</span>
            </div>
        </div>
        <div class="details-row">
            <div class="lable">
                <span>3)&nbsp;</span>
                <span class="details-label">Authority</span>
            </div>
            <div class="lable">
                <span> : - Govt. Notification Agriculture, Animal Husbandry Dairy Development &
                    Fisheries
                    Department
                    No. I. V. C. 1006
                    C. R. 532/ADF.4 DI. 27.8.2000 issued under section 30(b) 57 of the Indian
                    Veterinary
                    Council Act. 1984 by the Govt. of Maharashtra. The supreme court judgement in
                    civil
                    appeal no. 52 of 1994 decided on 14.2.2003.</span>
            </div>
        </div>
        <div class="details-row">
            <div class="lable">
                <span>4)&nbsp;</span>
                <span class="details-label">Prescription Serial No.</span>
            </div>
            <div class="lable">
                <span> : ${item.CASE_NO ? item.CASE_NO : ''}</span>
            </div>
        </div>
        <div class="details-row">
            <div class="lable">
                <span>5)&nbsp;</span>
                <span class="details-label">Patient's Owner Name and Address with Telephone/Mobile No.</span>
            </div>
            <div class="lable">
                <span> : ${item.OWNER_NAME ? item.OWNER_NAME : ''}, ${item.MOBILE_NUMBER ? item.MOBILE_NUMBER : ''},
                    ${item.ADDRESS ? item.ADDRESS : ''}</span>
            </div>
        </div>
        <div class="details-row">
            <div class="lable">
                <span>6)&nbsp;</span>
                <span class="details-label">Case paper No.</span>
            </div>
            <div class="lable">
                <span> : ${item.CASE_NO ? item.CASE_NO : ''}</span>
            </div>
        </div>
        <div class="details-row">
            <div class="lable">
                <span>7)&nbsp;</span>
                <span class="details-label">Patient's particulars</span>
            </div>
            <div class="lable">
                <span> : ${item.ANIMAL_TYPE_NAME ? item.ANIMAL_TYPE_NAME : ''}</span>
            </div>
        </div>
        <div class="details-row">
            <span style="font-weight: 500;margin-left: 20px;">Name of Medicine for minor veterinary Services : </span>
        </div>
        <div>
            <table style="width: 100%; border-collapse: collapse;">
                ${rows1}
            </table>
        </div>
        <div style="display: flex; justify-content: center;margin-top: 100px;">
            <div class="lable" style="width: 50%; margin-right:20px; justify-content: center;">
                <span class="details-label" style="text-align: center;">Veterinary Person under I. V. C. Act 1984</span>
            </div>
            <div class="label" style="width: 50%; margin-left:20px; display: flex; flex-direction: column; align-items: center;">
                <img src="${STATIC_URL}MemberSign/${item.MEMBER_SIGN}" style="width: 100px; height: 60px;" alt="Sign" />
                <span style="margin-top: 2px;">Sign of Prescriber</span>
            </div>
        </div>
    </div>
    <div class="main" style="page-break-before: always !important; justify-content: space-between;">
        <div>
            <h4 style="text-align: center;">General guidelines for Doctors / Prescriber</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th style="border: 1px solid black; padding: 8px; text-align: center; background-color: #f2f2f2;">
                        No.
                    </th>
                    <th style="border: 1px solid black; padding: 8px; text-align: center; background-color: #f2f2f2;">
                        Suggestions</th>
                </tr>
                <tr>
                    <td style="border: 1px solid black; padding: 8px; text-align: center;">01.</td>
                    <td style="border: 1px solid black; padding: 8px; text-align: left;">Changes in prescription:</br>If
                        any changes are warranted in prescription please issue fresh prescription</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; padding: 8px; text-align: center;">02.</td>
                    <td style="border: 1px solid black; padding: 8px; text-align: left;">Do not use prescription pad
                        with
                        the name of medical store.</br>
                        Doctors should not use prescription pads, with pre-printed messages, like "Available at XYZ
                        Medical
                        Stores.</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; padding: 8px; text-align: center;">03.</td>
                    <td style="border: 1px solid black; padding: 8px; text-align: left;">Do not print names of more than
                        one doctor on the prescription. </br>
                        One should avoid having names of two or more doctors on the same prescription pad (even if it is
                        a
                        husband and wife team.)</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; padding: 8px; text-align: center;">04.</td>
                    <td style="border: 1px solid black; padding: 8px; text-align: left;">Do not use prescription pad of
                        another doctor.</br>
                        A doctor should not use another doctor's prescription on a computer, she/he must ensure that
                        he/she
                        issue it with her/his full, recognizable dated signature in ink. She/ he must sign as close as
                        possible to the last drug listed in the prescription.</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; padding: 8px; text-align: center;">05.</td>
                    <td style="border: 1px solid black; padding: 8px; text-align: left;">Prescription of certain
                        medicines
                        by specialist.</br>
                        Certain medicines can be supplied on the prescription by specific specialist only. Sildenafil
                        For
                        example,
                        Sildenafil Citrate can be prescribed only by an Urologist, Psychiatrist, Endocrinologist,
                        Dermatologist or
                        Venerologist, Letrozole can be prescribed by a Cancer specialist
                        only.</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; padding: 8px; text-align: center;">06.</td>
                    <td style="border: 1px solid black; padding: 8px; text-align: left;">Recognize the services of
                        Pharmacist.</br>
                        As per internationally recognized practise, espacially followed in the developed world, doctors
                        should recognize
                        importance of services of pharmacist as they are required to supervise sale of medicines under
                        the
                        law and also
                        responsible for counseling the patients. The pharmacist is trained to recognize therapeutic
                        incompatibility,
                        absorption incompatibility, etc of medicines in addition to various facets of pharmacological
                        effects of
                        medicine,In view of the above, the doctors should consider her/his as a resource person and
                        his/her
                        view should be
                        considered with due regard to her/his knowledge.</td>
                </tr>
            </table>
        </div>
        <div style="justify-content: center; align-items: center; display: flex;margin-top:150px;">
            <p> <span style=" font-size: 18px; font-weight: 600;"> Food & Drug Administration, Maharashtra
                    State,</span></br>
                Survey No. 341, Bandra Kurta complex, Bandra (East), Mumbai-400 051. </br>
                Tel.: 022 - 2659 2361, 62, 63, 64, 65. Email - comm.fda - mah@nic.in </br>
                <span style="font-weight: 600;">Website:</span> fda.maharashtra.gov.in
            </p>
        </div>
    </div>
</body>

</html>`,
            fileName: "prescription",
            directory: 'Documents'
        }
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission Required',
                    message: 'App needs access to your storage to share PDF files.',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                const pdf = await RNHTMLtoPDF.convert(options);
                const downloadDirectory = RNFS.DownloadDirectoryPath;
                await RNFS.moveFile(pdf.filePath, `${downloadDirectory}/${item.CASE_NO}.pdf`);
                setPDF(`${downloadDirectory}/${item.CASE_NO}.pdf`);
                setIsGenerated(true);
                ToastAndroid.show('PDF created successfully', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show("Permission Denied", ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error('Error moving file:', error);
            ToastAndroid.show('Error creating PDF', ToastAndroid.SHORT);
        } finally {
            setLoader(false);
        }
    }

    const sharePdfToWhatsApp = async () => {
        try {
            const pdfUrl = 'file://' + pdf;

            const fileExists = await RNFS.exists(pdf);
            if (!fileExists) {
                console.error('PDF file not found');
                return;
            }
            const shareOptions = {
                url: pdfUrl,
                social: Share.Social.WHATSAPP,
                type: 'application/pdf',
            };

            await Share.shareSingle(shareOptions);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}
        >
            <Text onPress={() => setVisible(false)} style={{ backgroundColor: 'rgba(0,0,0,.7)', zIndex: -1, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}></Text>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'white', borderRadius: 10, width: '95%', padding: 10 }}>
                    <Loader isLoading={loader} />
                    {
                        isGenerated ? (
                            <Pdf
                                source={{ uri: pdf, cache: true }}
                                trustAllCerts={false}
                                style={styles.pdf} />
                        ) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center', height: 500 }}>
                                <TouchableOpacity onPress={generatePDF}>
                                    <View style={styles.buttonContainer} >
                                        <Text style={[styles.button, { backgroundColor: '#fff', color: "#4B1AFF", borderColor: '#4B1AFF', borderWidth: 1 }]} >Generate</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <TouchableOpacity onPress={setVisible} >
                            <View style={styles.buttonContainer}>
                                <Text style={[styles.button, { backgroundColor: '#fff', color: "#4B1AFF", borderColor: '#4B1AFF', borderWidth: 1 }]} >Cancel</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={sharePdfToWhatsApp} >
                            <View style={styles.buttonContainer}>
                                <Text style={[styles.button, { backgroundColor: '#4B1AFF', color: "#fff", borderColor: '#4B1AFF', borderWidth: 1 }]} >Share</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    pdf: {
        width: '100%',
        height: 500,
    },
    buttonContainer: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        height: 40,
        fontSize: 16,
        width: 120,
        backgroundColor: '#4B1AFF',
        color: '#fff',
        borderRadius: 20,
        textAlign: 'center',
        paddingTop: 9,
        fontFamily: 'Poppins-Medium',
    },
    container: {
        margin: 5,
        flexDirection: 'col',
        alignItems: 'center',
        justifyContent: "center",
    },
    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4B1AFF',
    },
    subText: {
        marginTop: 5,
        fontSize: 12,
        fontWeight: '500',
        color: '#000',
    },
});

export default CasePaper;
import React, { useState, useEffect, useCallback } from 'react';
import { STATIC_URL, apiPost } from "../utils/api";
import Pagination from '../components/Pagination';
import { ToastContainer } from 'react-toastify';
import { FiFilter } from "react-icons/fi";
import Loader from '../components/Loader';
import DatePickerComponent from '../components/DatePickerComponent';
import MultiSelectComponent from '../components/MultiSelectComponent';
import { BsPrinter } from "react-icons/bs";
import { TbFileExport } from "react-icons/tb";
import Exel from '../components/Exel';
import html2pdf from 'html2pdf.js';

function CasePapers() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState({
        pages: 1,
        current: 1,
    });
    const [loader, setLoader] = useState(false);

    let defaulFilter = {
        isDrawerOpen: false,
        startDate: null,
        endDate: null,
        taluka: null,
        districts: null
    }
    const [filters, setFilters] = useState(defaulFilter);
    const [filterOptions, setFilterOptions] = useState({
        taluka: [],
        districts: [],
        doctor: [],
        status: []
    });

    const [exel, setExel] = useState(false);

    const getDropDownData = async () => {

        try {
            const resDistrict = await apiPost("api/district/get", { filter: ` AND STATUS = 1` });
            const resTaluka = await apiPost("api/taluka/get", { filter: ` AND STATUS = 1` });
            const resDoctor = await apiPost("api/member/get", {});
            setFilterOptions({
                status: [{ label: 'Yes', value: '1' }, { label: 'No', value: '0' }],
                taluka: resTaluka?.data?.map(item => ({
                    label: item.NAME,
                    value: item.ID
                })),
                districts: resDistrict?.data?.map(item => ({
                    label: item.NAME,
                    value: item.ID
                })),
                doctor: resDoctor?.data?.map(item => ({
                    label: item.NAME,
                    value: item.ID
                }))
            });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getData();
        getDropDownData()
    }, [searchTerm, pageIndex.current, pageSize, filters]);

    const getData = useCallback(async () => {
        setLoader(true);
        try {
            let filterConditions = ` `;

            if (filters.districts?.length) {
                filterConditions += ` AND DISTRICT IN (${filters.districts})`;
            }
            if (filters.taluka?.length) {
                filterConditions += ` AND TALUKA IN (${filters.taluka})`;
            }
            if (filters.startDate && filters.endDate) {
                filterConditions += ` AND REGISTRATION_DATE BETWEEN '${new Date(filters.startDate).toISOString().slice(0, 10)}' AND '${new Date(filters.endDate).toISOString().slice(0, 10)}'`
            }
            if (filters.doctor?.length) {
                filterConditions += ` AND MEMBER_ID IN (${filters.doctor})`;
            }
            if (filters.status?.length) {
                filterConditions += ` AND IS_CLOSED = ${filters.status}`;
            }
            if (searchTerm) {
                filterConditions += ` AND (DOCTOR_NAME LIKE '%${searchTerm}%' OR MOBILE_NUMBER LIKE '%${searchTerm}%')`;
            }

            const res = await apiPost("api/detailed/caseReport", {
                filter: filterConditions,
                pageSize,
                pageIndex: pageIndex.current,
                sortKey: "LASTUPDATED",
                sortValue: "DESC",
            });

            if (res.code === 200) {
                setData(res.data);
                const totalPages = Math.ceil(res.count / pageSize) || 1;
                setPageIndex(prev => ({ ...prev, pages: totalPages }));
            } else {
                console.error("Failed to fetch CasePapers:", res.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoader(false);
        }
    }, [searchTerm, pageIndex.current, pageSize, filters]);


    const handleSearch = useCallback(async (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
        setPageIndex({ pages: 1, current: 1 });
    }, []);

    const handleApply = () => {
        setFilters({ ...filters, isDrawerOpen: false });
        setPageIndex({ pages: 1, current: 1 });
        getData();
    };

    const handleClear = () => {
        setFilters(defaulFilter);
        setPageIndex({ pages: 1, current: 1 });
    };

    const generatePDF = async (pdfData) => {
        setLoader(true);

        let rows = ''
        let rows1 = ''
        let CHECKUP_DETAILS = JSON.parse(pdfData.CHECKUP_DETAILS || "[]")
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
                // return `${pdfData.OBSERVATION_DATE ? new Date(pdfData.OBSERVATION_DATE).toLocaleDateString() : ''} &nbsp;&nbsp;&nbsp;&nbsp;${pdfData.PRESCRIPTION ? pdfData.PRESCRIPTION : ''}<br/>`
            }).join('')
        } else {
            rows = `<tr>
                        <td style="border: 1px solid black; padding: 8px; text-align: center;"> </br></br></br></td>
                        <td style="border: 1px solid black; padding: 8px; text-align: left;"> </br></br></br></td>
                        <td style="border: 1px solid black; padding: 8px; text-align: left;"> </br></br></br></td>
                        <td style="border: 1px solid black; padding: 8px; text-align: left;"> </br></br></br></td>
                    </tr>`
        }


        let htmlContent = `<!DOCTYPE html>
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
                    font-size : 15px
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
                    font-size: 17px;
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
                        ${pdfData.CASE_NO ? pdfData.CASE_NO : ''}</span>
                </div>
                <div style="display: flex; align-items: center;justify-content: center;">
                    <img src="vetpetso.png" style="width: 100px; height: 100px;"
                        alt="Logo" />
                </div>
                <h3 style="text-align: center; font-weight: 600;">पशु-पक्षांची आरोग्य वृद्धी, भारताची आर्थिक समृद्धी</h3></br>
                <p>डॉ. (सौजन्य दर्शकशिर्षक) : ${pdfData.DOCTOR_NAME ? pdfData.DOCTOR_NAME : ''}</p></br>
                <P><span style="; font-weight: 600;">पशुधन पर्यवेक्षक पदविका अभ्यासक्रम </span></br>
                    (शासन अधिसूचना कृषी पशुसंवर्धन दुग्ध व्यवसाय विकास व मत्स्य विभाग क्रमांक पविआ - २०११ / प्र. क्र. ३९ प्रदुम
                    - ३ ता . २९/१०/२०१४ च्या परिच्छेद ६ मधील तरतुदीनुसार) </P></br>
                <p style="font-weight: semibold;"><span style="; font-weight: 600;">पशुवैद्यकीय
                        व्यक्ती</span></br>
                    (भारतीय पशुवैद्यकीय परिषद कायदा १९८४ मधील कलम ३० (ब) व ५७ मधील तरतूदीनुसार)</p></br>
                <P> <span style="font-weight: 600;">सदस्य,</span> पशुवैद्यकीय, पशुसंवर्धन व दुग्ध व्यवस्थापन
                    सेवा संघ,संस्था नोंदणी अधिनियम १८६० नुसार रजि. नं. महा.
                    ८४७ / २०११ (पुणे) दि. ७/५/२०११ मुंबई सार्वजनिक न्यास व्यवस्थापन अधिनियम १९५० अन्वये नोंदणी क्र. एएफ/
                    ३११९९/पुणे, दि. १८-०९-२०११/पुणे.</P></br>
                <p style="font-weight: 600;">सदस्य नोंदणी क्रमांक : ${pdfData.MEMBER_REGISTRATION_NO ? pdfData.MEMBER_REGISTRATION_NO
                : ''}</p></br>
                <p><span style="font-weight: 600;">१) कृत्रिम रेतन तथा लघु पशुवैद्यकीय सेवा संस्था (खाजगी
                        क्षेत्र) </span></br>
                    &nbsp;&nbsp;&nbsp;&nbsp;मु.पो. : ${pdfData.AT_POST ? pdfData.AT_POST : ''}&nbsp;&nbsp;&nbsp;&nbsp;तालुका :
                    ${pdfData.TALUKA_NAME ? pdfData.TALUKA_NAME : ''} &nbsp;&nbsp;&nbsp;&nbsp;जिल्हा : ${pdfData.DISTRICT_NAME ?
                pdfData.DISTRICT_NAME : ''}</p></br>
                <p><span>२) ${pdfData.CASE_TYPE == 1 ? 'रुग्ण प्रकरण' : pdfData.CASE_TYPE == 2 ? 'कृत्रीम रेतन' : pdfData.CASE_TYPE == 3 ? 'लसीकरण' : ''}</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; दिनांक : ${pdfData.REGISTRATION_DATE ? new
                Date(pdfData.REGISTRATION_DATE).toDateString() : ''}</p></br>
                <p>३) रुग्ण पशु/पक्षी जात : ${pdfData.BREED_NAME ? pdfData.BREED_NAME :
                ''}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;वय : ${pdfData.ANIMAL_AGE ? pdfData.ANIMAL_AGE : ''}</p></br>
                <p>४) मालकाचे नांव : ${pdfData.OWNER_NAME ? pdfData.OWNER_NAME : ''}</p></br>
                <p>५) पत्ता (भ्रमणध्वनीसह) : ${pdfData.ADDRESS ? pdfData.ADDRESS : ''} (${pdfData.MOBILE_NUMBER ? pdfData.MOBILE_NUMBER :
                ''})</p></br>
                <p>
                    <span style="font-weight: 600;">६) लघुपशुवैद्यकीय औषधोपचार लघुशल्यक्रियासाठी / कृत्रीम रेतन-गर्भधारणा
                        तपासणीसाठी संमती पत्र.
                    </span></br>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;अ) माझ्या मालकीचे रुग्ण ${pdfData.ANIMAL_TYPE_NAME ? pdfData.ANIMAL_TYPE_NAME : ''},
                        याच्यावर आवश्यक ते लघु पशुवैद्यकीय औषधोपचार, रोग प्रतिबंधक उपाय योजना तसेच, लघुशल्य क्रिया व
                        कृत्रीम रेतन- गर्भनिदान करण्यास मी या संमती पत्राद्वारे स्वखुशीने संमती देत आहे.</span></br>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;ब) मुंबई राज्य शासनाच्या नागरी पशुवैद्यकीय सेवा संचालनालय परिपत्रक क्रमांक ३६,
                        दिनांक १८ डिसेंबर १९१४
                        (संदर्भ पान क्र. ५४३, मॅन्युअल ऑफ ऑफिस प्रोसिजर पशुसंवर्धन खाते १९६७) मधील तरतुदीनुसार रुग्णावर योग्य ती
                        काळजी घेऊनसुद्धा रुग्णास इजा, अपाय किंवा रुग्ण दगावल्यास झालेल्या नुकसानीबद्दल संबंधीत लघु पशुवैद्यकीय
                        व्यावसायीक किंवा त्यांचा कर्मचारी यास जबाबदार धरले जाणार नाही याची जाणीव मला स्पष्टपणे करून देण्यात आली
                        आहे.</span>
                </p>
                </br>
                <div style="display: flex; justify-content: space-between;">
                    <p>दिनांक: ${pdfData.REGISTRATION_DATE ? new Date(pdfData.REGISTRATION_DATE).toDateString() : ''}</p>
                    <div style="align-items: center; justify-content: center;">
                        <img src="${STATIC_URL}OwnerSign/${pdfData.OWNER_SIGN}" style="width: 100px; height: 60px;" alt="Logo" />
                        <p style="margin-right: 50px;">रुग्ण पशुपक्षी मालकाची सही</p>
                    </div>
                </div>
            </div>
            <div class="main" style="page-break-before: always !important;">
                <p>
                    <span style="font-weight: 600;">७) रुग्णाचा पूर्व इतिहास :-</span></br>
                    &nbsp;&nbsp;&nbsp;&nbsp;१) तापमान : ${pdfData.TEMPERATURE ? pdfData.TEMPERATURE : ''} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;२)
                    नाडीचे ठोके : ${pdfData.PULSE ? pdfData.PULSE : ''}</br>
                    &nbsp;&nbsp;&nbsp;&nbsp;३) पोटाच्या पहिल्या (रुमेन) भागाची हालचाल : ${pdfData.ABDOMINAL_MOVEMENT ? pdfData.ABDOMINAL_MOVEMENT : ''}</br>
                    &nbsp;&nbsp;&nbsp;&nbsp;४) जननेंद्रियांची अवस्था : ${pdfData.GENITAL_CONDITION ? pdfData.GENITAL_CONDITION : ''}</br>
                    &nbsp;&nbsp;&nbsp;&nbsp;५) श्वसन संस्थेची अवस्था : ${pdfData.RESPIRATORY_CONDITION ? pdfData.RESPIRATORY_CONDITION : ''}</br>
                    &nbsp;&nbsp;&nbsp;&nbsp;६) नाकपुडी, चामडी, डोळे, निरिक्षण : ${pdfData.OBSERVATION_OF_EYE_SKIN_NOSTRIL ?
                pdfData.OBSERVATION_OF_EYE_SKIN_NOSTRIL : ''}</br>
                    &nbsp;&nbsp;&nbsp;&nbsp;७) पाणी पिण्याचे प्रमाण : ${pdfData.WATER_INTAKE ? pdfData.WATER_INTAKE : ''}</br>
                    &nbsp;&nbsp;&nbsp;&nbsp;९) जंतुनाशक औषधांचा वापर केला होता की काय? असल्यास कोणती औषधे वापरली ?: ${pdfData.DID_TAKE_ANTISEPTIC_DRUGS ?
                pdfData.DID_TAKE_ANTISEPTIC_DRUGS : ''} </br>
                    &nbsp;&nbsp;&nbsp;&nbsp;१०) घरगुती उपचार केले असल्यास तपशील. : ${pdfData.DID_MAKE_HOME_REMEDIES ? pdfData.DID_MAKE_HOME_REMEDIES :
                ''}</br>
                    &nbsp;&nbsp;&nbsp;&nbsp;११) इतर महत्वाची माहिती : ${pdfData.OTHER_INFORMATION ? pdfData.OTHER_INFORMATION : ''}</br>
                    &nbsp;&nbsp;&nbsp;&nbsp;१२) लसीकरणाची माहिती : ${(pdfData.CASE_TYPE == 3 ? `Vaccine Type : ${pdfData.TYPE ? pdfData.TYPE : ''} &nbsp;&nbsp;Vaccine Name :
                    ${pdfData.NAME ? pdfData.NAME : ''} &nbsp;&nbsp;Side Effects : ${pdfData.SIDE_EFFECTS ? pdfData.SIDE_EFFECTS : ''}` : '')} </br>
                    &nbsp;&nbsp;&nbsp;&nbsp;१३) कृत्रीम रेतनाची माहिती : ${(pdfData.CASE_TYPE == 2 ? `Is Pregnant : ${pdfData.IS_PREGNANT ? "Yes" : "No"}
                    &nbsp;&nbsp;Delivery Date : ${pdfData.DELIVERY_DATE ? new Date(pdfData.DELIVERY_DATE).toLocaleDateString() : ''} &nbsp;&nbsp;Milk
                    Production : ${pdfData.MILK_PRODUCTION ? pdfData.MILK_PRODUCTION : ''}` : '')} </br>
                </p>
                </br>
                <p style="font-weight: 600;">८) रोगाचे प्राथमिक निदान : ${pdfData.FIRST_AID ? pdfData.FIRST_AID : ''}</p>
                </br>
                <p><span style="font-weight: 600;">९) रोग निदान निश्चितीसाठी प्रयोगशाळा तपासणी करता रुग्णाचे घेतलेले खालील नमुने
                        -</span></br>
                    &nbsp;&nbsp;&nbsp;&nbsp; १) मल
                    २) मूत्र
                    ३) रक्त
                    ४) रक्त जल
                    ५) इतर
                </p>
                </br>
                <p style="font-weight: 600;">१०) रोग निदान प्रयोगशाळेकडून आलेले निष्कर्ष : ${pdfData.DIAGNOSTIC_LABORATORY_REMARK ?
                pdfData.DIAGNOSTIC_LABORATORY_REMARK : ''}</p>
                </br>
                <p style="font-weight: 600;">११) रुग्णाची देखभाल व काळजी घेण्यासंबंधी मालकास दिलेला सल्ला / सूचना :
                    ${pdfData.INSTRUCTIONS_TO_OWNER ? pdfData.INSTRUCTIONS_TO_OWNER : ''}</p>
            </div>
            <div class="main" style="page-break-before: always !important;">
                <p>१२) </p>
                </br>
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
                </table></br>
                <p>
                    १३) रुग्ण पत्रिका बंद दिनांक : ${pdfData.DISCHARGE_DATE ? new Date(pdfData.DISCHARGE_DATE).toDateString() :
                ''}</br>
                    ${pdfData.DISCHARGE_REMARK ? pdfData.DISCHARGE_REMARK : ''}
                </p></br>
        
                <p>( ${pdfData.DOCTOR_NAME ? pdfData.DOCTOR_NAME : ''} )</br>
                    १४) VETERINARY - PERSON.</p></br>
        
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
                        <img src="${STATIC_URL}OwnerSign/${pdfData.OWNER_SIGN}" style="width: 100px; height: 60px;" alt="Logo" />
                    </div>
                    <p>Secretary </br>Veterinary Animal Husbandry and Dairy Management Services Organisation(Regd.)</p>
                </div>
        
            </div>
            <div class="main" style="page-break-before: always !important;">
                <div style="display: flex; align-items: center; padding: 10px 40px">
                    <img src="/vetpetso.png" style="width: 100px; height: 100px;" alt="Logo" />
                    <div style="align-items: center; width : 100%;">
                        <h2  style="text-align: center; font-size: 18px; font-weight: 600;" >MAHARASHTRA MODEL</h2>
                        <h3 >PRESCRIPTION</h3>
                    </div>
                    <img src="/rx.png" style="width: 80px; height: 80px;" alt="Logo" />
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
                        <span> : ${pdfData.DOCTOR_NAME ? pdfData.DOCTOR_NAME : ''}</span>
                    </div>
                </div>
                <div class="details-row">
                    <div class="lable">
                        <span>2)&nbsp;</span>
                        <span class="details-label">Qualification</span>
                    </div>
                    <div class="lable">
                        <span> : ${pdfData.PROF_EDUCATION_QUALIFICATION ? pdfData.PROF_EDUCATION_QUALIFICATION : ''}</span>
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
                        <span> : ${pdfData.CASE_NO ? pdfData.CASE_NO : ''}</span>
                    </div>
                </div>
                <div class="details-row">
                    <div class="lable">
                        <span>5)&nbsp;</span>
                        <span class="details-label">Patient's Owner Name and Address with Telephone/Mobile No.</span>
                    </div>
                    <div class="lable">
                        <span> : ${pdfData.OWNER_NAME ? pdfData.OWNER_NAME : ''}, ${pdfData.MOBILE_NUMBER ? pdfData.MOBILE_NUMBER : ''},
                            ${pdfData.ADDRESS ? pdfData.ADDRESS : ''}</span>
                    </div>
                </div>
                <div class="details-row">
                    <div class="lable">
                        <span>6)&nbsp;</span>
                        <span class="details-label">Case paper No.</span>
                    </div>
                    <div class="lable">
                        <span> : ${pdfData.CASE_NO ? pdfData.CASE_NO : ''}</span>
                    </div>
                </div>
                <div class="details-row">
                    <div class="lable">
                        <span>7)&nbsp;</span>
                        <span class="details-label">Patient's particulars</span>
                    </div>
                    <div class="lable">
                        <span> : ${pdfData.ANIMAL_TYPE_NAME ? pdfData.ANIMAL_TYPE_NAME : ''}</span>
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
                        <img src="${STATIC_URL}MemberSign/${pdfData.MEMBER_SIGN}" style="width: 100px; height: 60px;" alt="Sign" />
                        <span style="margin-top: 2px;">Sign of Prescriber</span>
                    </div>
                </div>
            </div>
            <div class="main" style="page-break-before: always !important; justify-content: space-between;">
                <div>
                    <h4 style="text-align: center; font-size: 18px; font-weight: 600;">General guidelines for Doctors / Prescriber</h4></br>
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
        
        </html>`
        try {
            const options = {
                filename: `${pdfData.CASE_NO}.pdf`,
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            };

            await html2pdf().from(htmlContent).set(options).save();
            alert('PDF created successfully');
        } catch (error) {
            console.error('Error creating PDF:', error);
            alert('Error creating PDF');
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="container mx-auto p-3 bg-gray-50 rounded h-full">
            <ToastContainer />
            <div className='flex justify-between my-2 items-center'>
                <h1 className="text-2xl font-bold mb-2 text-start">Case Papers Report</h1>
                <div className="flex justify-end mb-2">
                    <div className='cursor-pointer flex items-center justify-center w-9 h-9 mr-2 border border-gray-300 bg-white p-1 rounded-lg' onClick={() => setExel(true)}>
                        <TbFileExport size={20} className='text-gray-600 hover:text-gray-800' />
                    </div>
                    <div className='cursor-pointer flex items-center justify-center w-9 h-9 mr-2 border border-gray-300 bg-white p-1 rounded-lg' onClick={() => setFilters({ ...filters, isDrawerOpen: !filters.isDrawerOpen })}>
                        <FiFilter size={20} className='text-gray-600 hover:text-gray-800' />
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        id="CasePapersSearch"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-64 h-9 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-1"
                    />
                </div>
            </div>
            <Exel open={exel} setOpen={setExel} credentials={{ url: 'api/detailed/caseExport', name: 'Case Papers' }} />
            <div className="overflow-x-auto overflow-y-auto" style={{ height: 'calc(100vh - 214px)', width: 'calc(200vh - 100px)' }}>
                <div className={`text-center bg-gray-200 rounded-lg mb-2 ${filters.isDrawerOpen ? '' : 'hidden'} p-2`}>
                    <div className='flex justify-end items-end'>
                        <button
                            className="flex items-center justify-center h-9 mr-2 px-2 border text-blue-600 rounded-lg hover:text-blue-700"
                            onClick={handleClear}
                        >
                            Clear Filters
                        </button>
                    </div>
                    <div className='flex items-center'>
                        <div className="">
                            <h1 className="block pl-1 font-medium text-gray-700 text-left">Registration Date:</h1>
                            <div className="flex items-center space-x-2">
                                <DatePickerComponent
                                    label=""
                                    selectedDate={filters.startDate}
                                    onChangeDate={(date) => setFilters({ ...filters, startDate: date })}
                                    placeholder="From Date"
                                />
                                <h1 className="text-center text-gray-500 font-medium">to</h1>
                                <DatePickerComponent
                                    label=""
                                    selectedDate={filters.endDate}
                                    onChangeDate={(date) => setFilters({ ...filters, endDate: date })}
                                    placeholder="To Date"
                                />
                            </div>
                        </div>
                        <div className='pl-2'>
                            <MultiSelectComponent
                                label="District:"
                                options={filterOptions.districts}
                                selectedOptions={filters.districts}
                                onChangeOptions={(selectedOptions) => setFilters({ ...filters, districts: selectedOptions })}
                                placeholder="Select District"
                                isMulti={true}
                            />
                        </div>
                        <div className='pl-2'>
                            <MultiSelectComponent
                                label="Taluka:"
                                options={filterOptions.taluka}
                                selectedOptions={filters.taluka}
                                onChangeOptions={(selectedOptions) => setFilters({ ...filters, taluka: selectedOptions })}
                                placeholder="Select Taluka"
                                isMulti={true}
                            />
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <div >
                            <MultiSelectComponent
                                label="Doctor Name:"
                                options={filterOptions.doctor}
                                selectedOptions={filters.doctor}
                                onChangeOptions={(selectedOptions) => setFilters({ ...filters, doctor: selectedOptions })}
                                placeholder="Select Doctor Name"
                                isMulti={true}
                            />
                        </div>
                        <div className='pl-2'>
                            <MultiSelectComponent
                                label="Status:"
                                options={filterOptions.status}
                                selectedOptions={filters.status}
                                onChangeOptions={(selectedOptions) => setFilters({ ...filters, status: selectedOptions })}
                                placeholder="Select Status"
                                isMulti={false}
                            />
                        </div>
                    </div>
                </div>
                <table className="table-fixed w-full border-collapse rounded-lg">
                    <thead className={`bg-gray-200 ${filters.isDrawerOpen ? '' : 'sticky top-0 z-10'} `}>
                        <tr>
                            <th className="px-2 py-2 border border-gray-300 w-20">Print</th>
                            <th className="px-2 py-2 border border-gray-300 w-28">Case No.</th>
                            <th className="px-2 py-2 border border-gray-300 w-48">Registration Date</th>
                            <th className="px-2 py-2 border border-gray-300 w-48">Discharge Date</th>
                            <th className="px-2 py-2 border border-gray-300 w-64">Doctor Name</th>
                            <th className="px-2 py-2 border border-gray-300 w-64">Doctor Qualification</th>
                            <th className="px-2 py-2 border border-gray-300 w-36">Member Reg.No</th>
                            <th className="px-2 py-2 border border-gray-300 w-28">Is Closed</th>
                            <th className="px-2 py-2 border border-gray-300 w-64">Discharge Remark</th>
                            <th className="px-2 py-2 border border-gray-300 w-64">Owner Name</th>
                            <th className="px-2 py-2 border border-gray-300 w-32">Owner Mobile</th>
                            <th className="px-2 py-2 border border-gray-300 w-36">Owner Adhar No</th>
                            <th className="px-2 py-2 border border-gray-300 w-64">Owner Address</th>
                            <th className="px-2 py-2 border border-gray-300 w-32">At Post</th>
                            <th className="px-2 py-2 border border-gray-300 w-32">Taluka</th>
                            <th className="px-2 py-2 border border-gray-300 w-32">District</th>
                            <th className="px-2 py-2 border border-gray-300 w-40">Animal Identity</th>
                            <th className="px-2 py-2 border border-gray-300 w-40">Animal Type</th>
                            <th className="px-2 py-2 border border-gray-300 w-40">Breed</th>
                            <th className="px-2 py-2 border border-gray-300 w-28">Animal Age</th>
                            <th className="px-2 py-2 border border-gray-300 w-28">Tempreture</th>
                            <th className="px-2 py-2 border border-gray-300 w-64">Abdominal Movement</th>
                            <th className="px-2 py-2 border border-gray-300 w-28">Pulse</th>
                            <th className="px-2 py-2 border border-gray-300 w-64">Genital Condition</th>
                            <th className="px-2 py-2 border border-gray-300 w-64">Respiratory Condition</th>
                            <th className="px-2 py-2 border border-gray-300 w-72">Observation of Eye, Skin & Nostril </th>
                            <th className="px-2 py-2 border border-gray-300 w-64">Water intake</th>
                            <th className="px-2 py-2 border border-gray-300 w-64">Other Details</th>
                            <th className="px-2 py-2 border border-gray-300 w-64">FirstAid Details</th>
                            <th className="px-2 py-2 border border-gray-300 w-64">Laboratory Remark</th>
                            <th className="px-2 py-2 border border-gray-300 w-64">Instruction to Owner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map(item => (
                            <tr key={item.ID} className="bg-white">
                                <td className="px-2 border border-gray-200 text-center">
                                    <button className="py-2 text-center" ><BsPrinter className="text-blue-500 hover:text-blue-700 h-5 w-5" onClick={() => generatePDF(item)} /></button>
                                </td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.CASE_NO}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{new Date(item.REGISTRATION_DATE).toLocaleString('en-IN')}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{new Date(item.DISCHARGE_DATE).toLocaleString('en-IN')}</td>
                                <td className="px-2 py-1.5 border border-gray-200">{item.DOCTOR_NAME}</td>
                                <td className="px-2 py-1.5 border border-gray-200">{item.PROF_EDUCATION_QUALIFICATION}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.MEMBER_REGISTRATION_NO}</td>
                                <td className={`px-2 py-1.5 border border-gray-200 text-center ${item.IS_CLOSED == 1 ? 'text-green-500' : 'text-red-500'}`}>{item.IS_CLOSED == 1 ? 'YES' : 'NO'}</td>
                                <td className="px-2 py-1.5 border border-gray-200">{item.DISCHARGE_REMARK}</td>
                                <td className="px-2 py-1.5 border border-gray-200">{item.OWNER_NAME}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.MOBILE_NUMBER}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.ADHAR_NO}</td>
                                <td className="px-2 py-1.5 border border-gray-200">{item.ADDRESS}</td>
                                <td className="px-2 py-1.5 border border-gray-200">{item.AT_POST}</td>
                                <td className="px-2 py-1.5 border border-gray-200">{item.TALUKA_NAME}</td>
                                <td className="px-2 py-1.5 border border-gray-200">{item.DISTRICT_NAME}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.ANIMAL_IDENTITY_NO}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.ANIMAL_TYPE_NAME}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.BREED_NAME}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.ANIMAL_AGE}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.TEMPERATURE}</td>
                                <td className="px-2 py-1.5 border border-gray-200 ">{item.ABDOMINAL_MOVEMENT}</td>
                                <td className="px-2 py-1.5 border border-gray-200 text-center">{item.PULSE}</td>
                                <td className="px-2 py-1.5 border border-gray-200 ">{item.GENITAL_CONDITION}</td>
                                <td className="px-2 py-1.5 border border-gray-200 ">{item.RESPIRATORY_CONDITION}</td>
                                <td className="px-2 py-1.5 border border-gray-200 ">{item.OBSERVATION_OF_EYE_SKIN_NOSTRIL}</td>
                                <td className="px-2 py-1.5 border border-gray-200 ">{item.WATER_INTAKE}</td>
                                <td className="px-2 py-1.5 border border-gray-200 ">{item.OTHER_INFORMATION}</td>
                                <td className="px-2 py-1.5 border border-gray-200 ">{item.FIRST_AID}</td>
                                <td className="px-2 py-1.5 border border-gray-200 ">{item.DIAGNOSTIC_LABORATORY_REMARK}</td>
                                <td className="px-2 py-1.5 border border-gray-200 ">{item.INSTRUCTIONS_TO_OWNER}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.length > 0 || loader ? null :
                    <div className='item-center w-full mt-10'>
                        <img
                            id="noData"
                            src="./empty.png"
                            className="h-28 rounded-lg mx-auto"
                            alt="No Data"
                        />
                        <h1 className='text-center text-xl font-semibold text-gray-400'>No Data</h1>
                    </div>}
                {
                    loader && <Loader />
                }
                {/* </div> */}
                <Pagination
                    pages={pageIndex.pages}
                    current={pageIndex.current}
                    onPageChange={(page) => setPageIndex({ ...pageIndex, current: page })}
                />
            </div>
        </div >
    );
}

export default CasePapers;

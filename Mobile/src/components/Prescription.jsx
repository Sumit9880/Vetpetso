import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, PermissionsAndroid, ToastAndroid } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import Pdf from 'react-native-pdf';
import Share from 'react-native-share';
import { STATIC_URL } from '../utils/api';
import Loader from './Loader';

const Prescription = ({ item, showModal, setModal }) => {

    const [isGenerated, setIsGenerated] = useState(false)
    const [pdf, setPDF] = useState(null)
    const [loader, setLoader] = useState(false)
    const generatePDF = async () => {
        setLoader(true);
        const options = {
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Maharashtra Model Prescription</title>
                    <style>
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
                                    color: green;
                            }
            
                            .prescription-details {
                                    margin: 1rem;
                                    /* width: 90%; */
                                    height:100%;
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
                                    font-weight:500;
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
                    <div class="prescription-details">
                    <div style="display: flex; align-items: center; padding: 10px 40px">
                    <img src="${STATIC_URL}/Others/vetpetso.png" style="width: 100px; height: 100px;" alt="Logo"/>
                    <div style="align-items: center; width : 100%;">
                    <h2>MAHARASHTRA MODEL</h2>
                    <h3>PRESCRIPTION</h3>
                    </div>
                    <img src="${STATIC_URL}Others/rx.png" style="width: 80px; height: 80px;" alt="Logo"/>
                    </div>
                            <p style=" font-weight: 500;">&emsp;&emsp;&emsp;[Prescribed by the veterinary, Animal husbandry and Dairy farm management
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
                                            <span> : ${item.caseData?.DOCTOR_NAME}</span>
                                    </div>
                            </div>
                            <div class="details-row">
                                    <div class="lable">
                                            <span>2)&nbsp;</span>
                                            <span class="details-label">Qualification</span>
                                    </div>
                                    <div class="lable">
                                            <span> : ${item.caseData?.PROF_EDUCATION_QUALIFICATION}</span>
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
                                            <span> : ${item.caseData?.CASE_NO}</span>
                                    </div>
                            </div>
                            <div class="details-row">
                                    <div class="lable">
                                            <span>5)&nbsp;</span>
                                            <span class="details-label">Patient's Owner Name and Address with Telephone/Mobile No.</span>
                                    </div>
                                    <div class="lable">
                                            <span> : ${item.caseData?.OWNER_NAME}, ${item.caseData?.MOBILE_NUMBER}, ${item.caseData?.ADDRESS}</span>
                                    </div>
                            </div>
                            <div class="details-row">
                                    <div class="lable">
                                            <span>6)&nbsp;</span>
                                            <span class="details-label">Case paper No.</span>
                                    </div>
                                    <div class="lable">
                                            <span> : ${item.caseData?.CASE_NO}</span>
                                    </div>
                            </div>
                            <div class="details-row">
                                    <div class="lable">
                                            <span>7)&nbsp;</span>
                                            <span class="details-label">Patient's particulars</span>
                                    </div>
                                    <div class="lable">
                                            <span> : ${item.caseData?.ANIMAL_TYPE_NAME}</span>
                                    </div>
                            </div>
                            <div class="details-row">
                                    <span style="font-weight: 500;margin-left: 20px;">Name of Medicine for minor veterinary Services : </span>
                            </div>
                            <div >
                                    <p style="width: 70%;margin-left: 100px;">${item.PRESCRIPTION}</p>
                            </div>
                            <div style="display: flex; justify-content: center;margin-top: 80px; padding: 20px 0;">
                                    <div class="lable" style="width: 50%; justify-content: center;">
                                        <span class="details-label" style="text-align: center;">Veterinary Person under I. V. C. Act 1984</span>
                                    </div>
                                    <div class="label" style="width: 50%; display: flex; flex-direction: column; align-items: center;">
                                        <img src="${STATIC_URL}MemberSign/${item.MEMBER_SIGN}" style="width: 130px; height: 80px;" alt="Sign"/>
                                        <span style="margin-top: 5px;">Sign of Prescriber</span>
                                    </div>
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
                await RNFS.moveFile(pdf.filePath, `${downloadDirectory}/${item.caseData.CASE_NO}.pdf`);
                setPDF(`${downloadDirectory}/${item.caseData.CASE_NO}.pdf`);
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
            visible={showModal}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
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
                        <TouchableOpacity onPress={setModal} >
                            <View style={styles.buttonContainer}>
                                <Text style={[styles.button, { backgroundColor: '#fff', color: "#4B1AFF", borderColor: '#4B1AFF', borderWidth: 1 }]} >Cancel</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={!isGenerated} onPress={sharePdfToWhatsApp} >
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

export default Prescription;
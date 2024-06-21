import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, PermissionsAndroid, ToastAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import Share from 'react-native-share';
import Loader from './Loader';

const ExportReport = ({ item, showModal, setModal }) => {

    const [isGenerated, setIsGenerated] = useState(false)
    const [pdf, setPDF] = useState(null)
    const [loader, setLoader] = useState(false)
    // Example JSON data
    const jsonData = [
        { id: 1, name: 'John Doe', age: 30 },
        { id: 2, name: 'Jane Smith', age: 25 },
        // Add more objects as needed
    ];


    const createExcelFile = async (data, fileName) => {
        try {
            // Convert data to worksheet
            const ws = XLSX.utils.json_to_sheet(data);
            // Create a workbook with one sheet
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            // Generate XLSX file buffer
            const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

            // Prepare path to write the file
            const pathToWrite = `${RNFS.DownloadDirectoryPath}/${fileName}.xlsx`;

            // Check if the directory exists, create it if not
            const downloadDirExists = await RNFS.exists(RNFS.DownloadDirectoryPath);
            if (!downloadDirExists) {
                await RNFS.mkdir(RNFS.DownloadDirectoryPath);
            }
            // Write the file to storage
            await RNFS.writeFile(pathToWrite, wbout, 'base64');
            console.log(`Excel file saved to ${pathToWrite}`);

            // Handle further operations (e.g., sharing the file)
        } catch (error) {
            console.error(`Error saving Excel file: ${error}`);
        }
    };



    // const sharePdfToWhatsApp = async () => {
    //     try {
    //         const pdfUrl = 'file://' + pdf;

    //         const fileExists = await RNFS.exists(pdf);
    //         if (!fileExists) {
    //             console.error('PDF file not found');
    //             return;
    //         }
    //         const shareOptions = {
    //             url: pdfUrl,
    //             social: Share.Social.WHATSAPP,
    //             type: 'application/pdf',
    //         };

    //         await Share.shareSingle(shareOptions);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

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
                            // <Pdf
                            //     source={{ uri: pdf, cache: true }}
                            //     trustAllCerts={false}
                            //     style={styles.pdf} />
                            <></>
                        ) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center', height: 500 }}>
                                <TouchableOpacity onPress={() => createExcelFile(jsonData, 'example_data')}>
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
                        {/* <TouchableOpacity onPress={sharePdfToWhatsApp} >
                            <View style={styles.buttonContainer}>
                                <Text style={[styles.button, { backgroundColor: '#4B1AFF', color: "#fff", borderColor: '#4B1AFF', borderWidth: 1 }]} >Share</Text>
                            </View>
                        </TouchableOpacity> */}
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

export default ExportReport;
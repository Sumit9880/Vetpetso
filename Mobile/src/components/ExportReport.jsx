import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, PermissionsAndroid, ToastAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import Share from 'react-native-share';
import Loader from './Loader';
import { apiPost } from '../utils/api';
import { useSelector } from 'react-redux';
import DatePick from './DatePick';

const ExportReport = ({ item, showModal, setModal }) => {
    const user = useSelector(state => state.user.userInfo);
    const [isGenerated, setIsGenerated] = useState(false)
    const [xls, setXls] = useState(null)
    const [loader, setLoader] = useState(false)
    const [dates, setDates] = useState({
        FROM_DATE: '',
        TO_DATE: ''
    })

    const createExcelFile = async () => {
        setLoader(true);
        try {
            const res = await apiPost(item.api, {
                filter: " AND MEMBER_ID = " + user.ID + (dates.FROM_DATE && dates.TO_DATE ? ` AND DATE(REGISTRATION_DATE) BETWEEN '${dates.FROM_DATE.replace(/\//g, '-')}' AND '${dates.TO_DATE.replace(/\//g, '-')}'` : '')
            });
            if (res && res.code === 200) {
                if (res.data.length <= 0) {
                    ToastAndroid.show('No data found', ToastAndroid.SHORT);
                } else {
                    const ws = XLSX.utils.json_to_sheet(res.data);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
                    const pathToWrite = `${RNFS.DownloadDirectoryPath}/${item.name + "_" + dates.FROM_DATE.replace(/\//g, '-') + "_to_" + dates.TO_DATE.replace(/\//g, '-')}.xlsx`;
                    const downloadDirExists = await RNFS.exists(RNFS.DownloadDirectoryPath);
                    if (!downloadDirExists) {
                        await RNFS.mkdir(RNFS.DownloadDirectoryPath);
                    }
                    await RNFS.writeFile(pathToWrite, wbout, 'base64');
                    setXls(pathToWrite)
                    setIsGenerated(true)
                }
            } else {
                ToastAndroid.show(res.message, ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error(`Error saving Excel file: ${error}`);
        } finally {
            setLoader(false);
        }
    };

    const sharePdfToWhatsApp = async () => {
        try {
            const pdfUrl = 'file://' + xls;
            const fileExists = await RNFS.exists(xls);
            if (!fileExists) {
                console.error('file not found');
                return;
            }
            const shareOptions = {
                url: pdfUrl,
                social: Share.Social.WHATSAPP,
                type: 'application/xlsx',
            };
            await Share.shareSingle(shareOptions);
        } catch (error) {
            console.error(error);
        }
    };
    const close = () => {
        setIsGenerated(false)
        setXls(null)
        setDates({
            FROM_DATE: '',
            TO_DATE: ''
        })
        setModal()
    }
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => { setModal(false) }}
        >
            <Text onPress={() => setModal(false)} style={{ backgroundColor: 'rgba(0,0,0,.7)', zIndex: -1, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}></Text>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'white', borderRadius: 10, width: '95%', padding: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 0.5 }}>
                        <Text style={{ color: "#000", fontSize: 22, fontWeight: '600' }}>Export Excel Sheet</Text>
                    </View>
                    <Loader isLoading={loader} />
                    {
                        isGenerated ? (
                            <View style={{ justifyContent: 'center', alignItems: 'center', height: 350 }}>
                                <Text style={{ color: "#4B1AFF", fontSize: 18, fontWeight: '500' }}>Downloaded Successfully</Text>
                                <Text style={{ color: "#5a5a5a", fontSize: 14, fontWeight: '500' }}>Check your Download folder</Text>
                                <Text style={{ color: "green", fontSize: 14, fontWeight: '500', marginTop: 20 }}>Also share it using whatsapp</Text>
                            </View>
                        ) : (
                            <View style={{ justifyContent: 'center', gap: 40, alignItems: 'center', height: 350 }}>
                                <View style={{ backgroundColor: '#E6F4FE', borderRadius: 10, padding: 10 }}>
                                    <Text style={{ color: "#000", fontSize: 14, textAlign: 'left', fontWeight: '600' }}>Select Date Range</Text>
                                    <View style={styles.splitContainer}>
                                        <DatePick
                                            label={{ visible: dates.FROM_DATE ? true : false, text: 'From Date' }}
                                            value={dates.FROM_DATE}
                                            setDate={e => setDates({ ...dates, FROM_DATE: e })}
                                            options={{ width: '46.2%' }}
                                        />
                                        <DatePick
                                            label={{ visible: dates.TO_DATE ? true : false, text: 'To Date' }}
                                            value={dates.TO_DATE}
                                            setDate={e => setDates({ ...dates, TO_DATE: e })}
                                            options={{ width: '46.2%' }}
                                        />
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => createExcelFile()}>
                                    <View style={styles.buttonContainer} >
                                        <Text style={[styles.button, { backgroundColor: '#4B1AFF', color: "#fff", borderColor: '#4B1AFF', borderWidth: 1 }]} >Generate</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <TouchableOpacity onPress={() => close()} >
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
    splitContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 22,
        flexDirection: 'row',
    },
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
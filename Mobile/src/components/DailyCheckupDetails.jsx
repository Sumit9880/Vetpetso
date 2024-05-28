import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ToastAndroid, ScrollView } from 'react-native';
import InputBox from './InputBox';
import * as Yup from 'yup';
import { apiPut, apiPost } from '../utils/api';
import Loader from './Loader';

const DailyCheckupDetails = ({ item, showModal, setModal, getData }) => {

    const [dailyData, setDailyData] = useState({})
    useEffect(() => {
        setDailyData(item)
    }, [item])
    const [validation, setValidation] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        OBSERVATION_AND_FINDINGS: Yup.string().required('Observation and findings is required'),
        REMARKS: Yup.string().required('Remarks is required'),
    });

    const validate = async () => {
        try {
            await validationSchema.validate(dailyData, { abortEarly: false });
            return false;
        } catch (error) {
            const validationErrors = {};
            if (error instanceof Yup.ValidationError) {
                error.inner.forEach((e) => {
                    validationErrors[e.path] = e.message;
                });
            }
            setValidation(validationErrors);
            return true;
        }
    }

    const handleUpdate = async () => {
        let errors = await validate()
        if (!errors) {
            setIsLoading(true)
            try {
                dailyData.PRESCRIPTION = dailyData.PRESCRIPTION.replace(/\./g, "<br>");
                const res = await apiPut("api/patientDailyCheckup/update", dailyData);
                if (res && res.code === 200) {
                    ToastAndroid.show(res.message, ToastAndroid.SHORT);
                    setModal()
                } else {
                    ToastAndroid.show(res.message, ToastAndroid.SHORT);
                }
            } catch (error) {
                console.error(error);
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
            } finally {
                setIsLoading(false)
            }
        } else {
            ToastAndroid.show('Please fill all required fields', ToastAndroid.SHORT);
        }
    }

    const handleSave = async () => {
        let errors = await validate()
        if (!errors) {
            setIsLoading(true)
            try {
                dailyData.PRESCRIPTION = dailyData.PRESCRIPTION.replace(/\./g, "<br>");
                if (dailyData.PATIENT_ID !== undefined && dailyData.PATIENT_ID !== 0 && dailyData.PATIENT_ID !== null) {
                    const res = await apiPost("api/patientDailyCheckup/create", dailyData);
                    if (res && res.code === 200) {
                        ToastAndroid.show(res.message, ToastAndroid.SHORT);
                        setModal()
                        getData(dailyData)
                    } else {
                        ToastAndroid.show(res.message, ToastAndroid.SHORT);
                    }
                } else {
                    setModal()
                    getData(dailyData)
                }
            } catch (error) {
                console.error(error);
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
            } finally {
                setIsLoading(false)
            }
        } else {
            ToastAndroid.show('Please fill all required fields', ToastAndroid.SHORT);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 10, width: '94%' }}>
                    <View style={{ paddingBottom: 10, alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center', color: '#303c51' }}>Daily Checkup Details</Text>
                    </View>
                    <Text style={{ fontWeight: 'bold', color: '#4B1AFF', textAlign: 'right', fontSize: 16 }}>Date : {dailyData.OBSERVATION_DATE ? new Date(dailyData.OBSERVATION_DATE).toLocaleDateString() : new Date().toLocaleDateString()}</Text>
                    <ScrollView style={{ height: '45%' }} showsVerticalScrollIndicator={false}>
                        <View style={styles.container}>
                            <InputBox
                                label={{ visible: dailyData.OBSERVATION_AND_FINDINGS ? true : false, text: 'Observation & Findings' }}
                                value={dailyData.OBSERVATION_AND_FINDINGS}
                                validation={validation.OBSERVATION_AND_FINDINGS}
                                onChangeText={e => setDailyData({ ...dailyData, OBSERVATION_AND_FINDINGS: e })}
                                options={{ multiline: true }}
                            />
                            <InputBox
                                label={{ visible: dailyData.TREATMENT_AND_SUGGESTION ? true : false, text: 'Treatment & Suggestion' }}
                                value={dailyData.TREATMENT_AND_SUGGESTION}
                                validation={validation.TREATMENT_AND_SUGGESTION}
                                onChangeText={e => setDailyData({ ...dailyData, TREATMENT_AND_SUGGESTION: e })}
                                options={{ multiline: true }}
                            />
                            <InputBox
                                label={{ visible: dailyData.PRESCRIPTION ? true : false, text: 'Prescription' }}
                                value={dailyData?.PRESCRIPTION?.replace(/<br>/g, ".")}
                                validation={validation.PRESCRIPTION}
                                onChangeText={e => setDailyData({ ...dailyData, PRESCRIPTION: e })}
                                options={{ multiline: true }}
                            />
                            <InputBox
                                label={{ visible: dailyData.REMARKS ? true : false, text: 'Remarks' }}
                                value={dailyData.REMARKS}
                                validation={validation.REMARKS}
                                onChangeText={e => setDailyData({ ...dailyData, REMARKS: e })}
                                options={{ multiline: true }}
                            />
                        </View>
                    </ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={setModal} >
                            <View style={styles.buttonContainer}>
                                <Text style={[styles.button, { backgroundColor: '#fff', color: "#4B1AFF", borderColor: '#4B1AFF', borderWidth: 1 }]} >Cancel</Text>
                            </View>
                        </TouchableOpacity>
                        {
                            dailyData.ID ? (
                                <TouchableOpacity onPress={handleUpdate}>
                                    <View style={styles.buttonContainer}>
                                        <Text style={styles.button} >Update</Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={handleSave}>
                                    <View style={styles.buttonContainer}>
                                        <Text style={styles.button} >Save</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
            </View>
            <Loader isLoading={isLoading} />
        </Modal>
    )
}
const styles = StyleSheet.create({
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
        marginTop: 0,
        marginBottom: 20,
        flexDirection: 'col',
        alignItems: 'center',
        justifyContent: "center",
    }
});

export default DailyCheckupDetails;
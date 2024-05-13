import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Modal, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUser } from '../reduxStore/userSlice';
import VectorIcon from '../utils/VectorIcon';
import Header from '../components/Header';
import DocumentPicker from 'react-native-document-picker';
import { STATIC_URL, apiUpload, apiPut, apiPost } from '../utils/api';
import InputBox from './InputBox';
import DropdownComponent from './DropdownComponent';
import * as Yup from 'yup';

const EducationalInfoModal = ({ showModal, setModal }) => {

    const user = useSelector(state => state.user.userInfo)
    const [userData, setUserData] = useState({ ...user })
    const [preview, setPreview] = useState({
        isVisible: false,
        uri: '',
        api: '',
        key: ''
    })
    const dispatch = useDispatch();
    const [course, setCourse] = useState([]);

    const [validation, setValidation] = useState({});
    const validationSchema = Yup.object().shape({
        NAME: Yup.string().required('Name is required'),
        DISTRICT: Yup.string().required('District is required'),
        TALUKA: Yup.string().required('Taluka is required'),
        ADDRESS: Yup.string().required('Address is required'),
        EMAIL: Yup.string().email('Invalid email address').required('Email is required'),
        MOBILE_NUMBER: Yup.string().required('Phone is required'),
        DATE_OF_BIRTH: Yup.string().required('Date of birth is required'),
    });

    const validate = async () => {
        try {
            await validationSchema.validate(userData, { abortEarly: false });
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

    const getDropDownData = async () => {
        try {
            const resCourse = await apiPost("api/university/get", {});
            setCourse(resCourse.data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getDropDownData();
    }, []);

    const handleUpdate = async () => {
        let errors = await validate()
        if (!errors) {
            apiPut('api/member/update', userData).then((response) => {
                if (response.code === 200) {
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                    dispatch(setUser(userData))
                    setModal()
                } else {
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                }
            })
        } else {
            ToastAndroid.show('Please fill all required fields', ToastAndroid.SHORT);
        }
    }

    const handleModelOpen = (file, api, key) => {
        let uri = STATIC_URL + file
        setPreview({
            isVisible: true,
            uri: uri,
            api: api,
            key: key
        })
    }

    const pickFile = async () => {
        try {
            const file = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            const response = await apiUpload(preview.api, file[0], userData.ID);
            if (response.code === 200) {
                ToastAndroid.show(response.message, ToastAndroid.SHORT);
                const updatedUserData = { ...userData, [preview.key]: response.name };
                setUserData(updatedUserData);
                dispatch(setUser(updatedUserData))
                setPreview({ ...preview, isVisible: false, uri: '', api: '', key: '' })
            } else {
                ToastAndroid.show(response.message, ToastAndroid.SHORT);
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled the file picker');
            } else {
                console.error('Error picking file:', err);
            }
        }
    };

    return (

        <Modal style={styles.container} visible={showModal}>
            <Header name="Educational Information" />
            <View style={styles.mainContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <InputBox
                            label={{ visible: userData.EDUCATIONAL_QUALIFICATION ? true : false, text: 'Educational Qualification' }}
                            value={userData.EDUCATIONAL_QUALIFICATION}
                            validation={validation.EDUCATIONAL_QUALIFICATION}
                            onChangeText={e => setUserData({ ...userData, EDUCATIONAL_QUALIFICATION: e })}
                            options={{}}
                        />
                        <InputBox
                            label={{ visible: userData.PROF_EDUCATION_QUALIFICATION ? true : false, text: 'Professional Qualification' }}
                            value={userData.PROF_EDUCATION_QUALIFICATION}
                            validation={validation.PROF_EDUCATION_QUALIFICATION}
                            onChangeText={e => setUserData({ ...userData, PROF_EDUCATION_QUALIFICATION: e })}
                            options={{}}
                        />
                        <DropdownComponent
                            label={{ visible: userData.VET_STOCKMAN_TRANING_COURSE ? true : false, text: 'Vet Stockman Training Course' }}
                            value={userData.VET_STOCKMAN_TRANING_COURSE}
                            onChangeText={e => setUserData({ ...userData, VET_STOCKMAN_TRANING_COURSE: e.ID })}
                            validation={validation.VET_STOCKMAN_TRANING_COURSE}
                            options={{}}
                            data={course.filter(item => item.TYPE === 'A')}
                        />
                        <DropdownComponent
                            label={{ visible: userData.LIVESTOCK_SUPERVISOR_COURSE ? true : false, text: 'Livestok Supervisior Course' }}
                            value={userData.LIVESTOCK_SUPERVISOR_COURSE}
                            onChangeText={e => setUserData({ ...userData, LIVESTOCK_SUPERVISOR_COURSE: e.ID })}
                            validation={validation.LIVESTOCK_SUPERVISOR_COURSE}
                            options={{}}
                            data={course.filter(item => item.TYPE === 'B')}
                        />
                        <DropdownComponent
                            label={{ visible: userData.DAIRY_BUSSINES_MANAGEMENT ? true : false, text: 'Dairy Business Management' }}
                            value={userData.DAIRY_BUSSINES_MANAGEMENT}
                            onChangeText={e => setUserData({ ...userData, DAIRY_BUSSINES_MANAGEMENT: e.ID })}
                            validation={validation.DAIRY_BUSSINES_MANAGEMENT}
                            options={{}}
                            data={course.filter(item => item.TYPE === 'C')}
                        />
                        <DropdownComponent
                            label={{ visible: userData.DIPLOMA_IN_VETERINARY_MEDICINE ? true : false, text: 'Diploma in Veternary Medicine' }}
                            value={userData.DIPLOMA_IN_VETERINARY_MEDICINE}
                            onChangeText={e => setUserData({ ...userData, DIPLOMA_IN_VETERINARY_MEDICINE: e.ID })}
                            validation={validation.DIPLOMA_IN_VETERINARY_MEDICINE}
                            options={{}}
                            data={course.filter(item => item.TYPE === 'D')}
                        />
                        <View style={styles.upload}>
                            <Text style={styles.uploadText}>Expricience Letter Image : </Text>
                            <View style={{ paddingRight: 20 }}>
                                <VectorIcon
                                    name="eye"
                                    type="Feather"
                                    size={24}
                                    color={'#1E90FF'}
                                    onPress={() => { handleModelOpen('experienceLetter/' + userData.EXPERIENCE_LETTER, 'upload/experienceLetter', 'EXPERIENCE_LETTER') }}
                                />
                            </View>
                        </View>
                        <View style={styles.upload}>
                            <Text style={styles.uploadText}>Leaving Certificate Image : </Text>
                            <View style={{ paddingRight: 20 }}>
                                <VectorIcon
                                    name="eye"
                                    type="Feather"
                                    size={24}
                                    color={'#1E90FF'}
                                    onPress={() => { handleModelOpen('leavingCretificate/' + userData.LEAVING_CERTIFICATE, 'upload/leavingCretificate', 'LEAVING_CERTIFICATE') }}
                                />
                            </View>
                        </View>
                        <View style={styles.upload}>
                            <Text style={styles.uploadText}>Educational Cretificate Image : </Text>
                            <View style={{ paddingRight: 20 }}>
                                <VectorIcon
                                    name="eye"
                                    type="Feather"
                                    size={24}
                                    color={'#1E90FF'}
                                    onPress={() => { handleModelOpen('educationalCretificate/' + userData.EDUCATIONAL_CERTIFICATE, 'upload/educationalCretificate', 'EDUCATIONAL_CERTIFICATE') }}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={setModal}>
                        <View style={styles.buttonContainer}>
                            <Text style={[styles.button, { backgroundColor: '#fff', color: "#4B1AFF", borderColor: '#4B1AFF', borderWidth: 1 }]} >Cancel</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleUpdate}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.button} >Update</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={preview.isVisible}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'left' }}>
                            <Text style={[styles.heading, { textAlign: 'center', fontWeight: 'semibold', fontSize: 28, fontFamily: "Poppins-Regular", }]}>Image Preview</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: preview.uri }} style={{ width: '100%', flex: 1, height: undefined, marginVertical: 10, borderRadius: 10 }} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'left', gap: 50 }}>
                            <TouchableOpacity onPress={() => { setPreview({ isVisible: false }) }}>
                                <View style={styles.buttonContainer}>
                                    <Text style={[styles.button, { backgroundColor: '#fff', color: "#5a5a5a", borderColor: '#5a5a5a', borderWidth: 1, height: 45, paddingTop: 10.5, width: 120 }]} >Cancel</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pickFile}>
                                <View style={styles.buttonContainer}>
                                    <Text style={[styles.button, { backgroundColor: '#ff0c6c', height: 45, paddingTop: 10.5, width: 120 }]} >ReUpload</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </Modal>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: '100%',
        aspectRatio: 0.9,
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
    },
    upload: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 16,
        marginTop: 15,
        width: '99%',
        // backgroundColor: '#E6F4FE',
        backgroundColor: '#fbfbfb',
        fontFamily: "Poppins-Regular",
        maxHeight: 100,
        minHeight: 50,
        color: "#000",
        paddingHorizontal: 15,
        borderRadius: 10,
        shadowColor: "#4B1AFF",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 4,
    }
    ,
    uploadText: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: "#5a5a5a",
    },
    heading: {
        fontSize: 22,
        fontFamily: "Poppins-Bold",
        fontWeight: "bold",
        color: "black",
        letterSpacing: 1
    },
    mainContainer: {
        width: "100%",
        height: "95%",
        backgroundColor: "#fff",
        padding: 15,
        paddingTop: 0
        // justifyContent: "center",
        // alignItems: "center"
    },
    container: {
        // padding: 5,
        margin: 5,
        marginBottom: 20,
        flexDirection: 'col',
        alignItems: 'center',
        justifyContent: "center",
    },
    buttonContainer: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        height: 50,
        fontSize: 18,
        width: 120,
        backgroundColor: '#4B1AFF',
        color: '#fff',
        borderRadius: 20,
        textAlign: 'center',
        paddingTop: 12,
        fontFamily: 'Poppins-Medium',
    },
});

export default EducationalInfoModal;

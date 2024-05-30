import React, { useEffect, useState, useRef } from 'react';
import { AppState, View, Text, StyleSheet, Image, TouchableOpacity, ToastAndroid, ScrollView, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setLogin, setSplashscreen } from '../reduxStore/userSlice';
import { apiPost } from '../utils/api';
import DocumentPicker from 'react-native-document-picker';
import { apiUpload, STATIC_URL } from '../utils/api';
import VectorIcon from '../utils/VectorIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputBox from '../components/InputBox';
import DatePick from '../components/DatePick';
import DropdownComponent from '../components/DropdownComponent';
import * as Yup from 'yup';
import Loader from '../components/Loader';
import Signature from "react-native-signature-canvas";

const RegistrationScreen = () => {

    const data = useSelector(state => state.user.loginInfo)
    let signatureRef = useRef(null);
    const [userData, setUserData] = useState({});
    const [showModal, setShowModal] = useState({ isVisible: false, uri: '', api: '', key: '' });
    const dispatch = useDispatch();
    const [district, setDistrict] = useState([]);
    const [course, setCourse] = useState([]);
    const [taluka, setTaluka] = useState([]);
    const [cast, setCast] = useState([]);
    const [validation, setValidation] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [agreed, setAgreed] = useState(false)

    const validationSchema = Yup.object().shape({
        NAME: Yup.string().required('Name is required'),
        DISTRICT: Yup.string().required('District is required'),
        TALUKA: Yup.string().required('Taluka is required'),
        ADDRESS: Yup.string().required('Address is required'),
        EMAIL: Yup.string().email('Invalid email address').required('Email is required'),
        MOBILE_NUMBER: Yup.string().required('Phone is required'),
        DATE_OF_BIRTH: Yup.string().required('Date of birth is required'),
        PASSWORD: Yup.string().required('Password is required'),
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

    let workTluka = taluka
    if (userData.WORKING_DISTRICT !== null && userData.WORKING_DISTRICT !== 0 && userData.WORKING_DISTRICT !== undefined) {
        workTluka = taluka.filter(item => item.DISTRICT_ID == userData.WORKING_DISTRICT)
    }
    let talukaData = taluka
    if (userData.DISTRICT !== null && userData.DISTRICT !== 0 && userData.DISTRICT !== undefined) {
        talukaData = taluka.filter(item => item.DISTRICT_ID == userData.DISTRICT)
    }

    useEffect(() => {
        if (userData.STEP_NO === 4) {
            const filter = `AND MOBILE_NUMBER = ${userData.MOBILE_NUMBER}`;
            const getData = async () => {
                try {
                    const res = await apiPost("api/member/get", { filter });
                    setUserData({ ...userData, ...res.data[0] });
                } catch (error) {
                    ToastAndroid.show(error.message, ToastAndroid.SHORT);
                }
            };
            getData();
        }
    }, [userData.STEP_NO]);

    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                await AsyncStorage.setItem("LOGININFO", JSON.stringify(userData));
            }
        };
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            subscription.remove();
        };
    }, [userData]);

    useEffect(() => {
        setUserData(data)
        getDropDownData()
    }, [data])


    const getDropDownData = async () => {
        try {
            const resDistrict = await apiPost("api/district/get", { filter: ` AND STATUS = 1` });
            const resCourse = await apiPost("api/university/get", { filter: ` AND IS_ACTIVE = 1` });
            const resTaluka = await apiPost("api/taluka/get", { filter: ` AND STATUS = 1` });
            const resCast = await apiPost("api/cast/get", { filter: ` AND STATUS = 1` });
            setTaluka(resTaluka.data)
            setDistrict(resDistrict.data)
            setCourse(resCourse.data)
            setCast(resCast.data)
        } catch (error) {
            console.error(error);
        }
    }

    const handleModelOpen = (file, api, key) => {
        let uri = STATIC_URL + file
        setShowModal({
            isVisible: true,
            uri: uri,
            api: api,
            key: key
        })
    }

    const handleNext = async () => {
        const updatedUserData = { ...userData, STEP_NO: userData?.STEP_NO + 1 };
        setUserData(updatedUserData);
    }

    const handlePrev = async () => {
        const updatedUserData = { ...userData, STEP_NO: userData?.STEP_NO - 1 };
        setUserData(updatedUserData);
    }

    const login = async () => {
        setUserData({});
        await AsyncStorage.setItem("LOGININFO", '');
        dispatch(setSplashscreen(true))
    }

    const pickFile = async (api, key) => {
        try {
            setIsLoading(true)
            const file = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            const response = await apiUpload(api, file[0]);
            if (response.code === 200) {
                ToastAndroid.show(response.message, ToastAndroid.SHORT);
                const updatedUserData = { ...userData, [key]: response.name };
                setUserData(updatedUserData);
                dispatch(setLogin(updatedUserData));
            } else {
                ToastAndroid.show(response.message, ToastAndroid.SHORT);
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled the file picker');
            } else {
                console.error('Error picking file:', err);
            }
        } finally {
            setIsLoading(false)
        }
    };

    const handleSubmit = async () => {
        let errors = await validate()
        if (!errors) {
            setIsLoading(true);
            try {
                const res = await apiPost("api/member/register", userData);
                if (res && res.code === 200) {
                    ToastAndroid.show(res.message, ToastAndroid.SHORT);
                    const updatedUserData = { ...userData, STEP_NO: 4 };
                    await AsyncStorage.setItem("LOGININFO", JSON.stringify(updatedUserData));
                    setUserData(updatedUserData);
                    setModalVisible(false)
                } else {
                    ToastAndroid.show(res && res.message || res.message, ToastAndroid.SHORT);
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

    const handleSave = async () => {
        let errors = await validate()
        if (!errors) {
            setModalVisible(true)
        } else {
            ToastAndroid.show('Please fill all required fields', ToastAndroid.SHORT);
        }
    }
    const handleSignatureSaved = async (signature) => {
        setIsLoading(true);
        try {
            if (signature !== null) {
                let data = {
                    uri: signature,
                    type: 'image/png',
                    name: 'signature.jpg'
                }
                const apiResponse = await apiUpload('upload/memberSign', data, 0);
                if (apiResponse.code === 200) {
                    const updatedUserData = { ...userData, "MEMBER_SIGN": apiResponse.name };
                    setUserData(updatedUserData);
                    dispatch(setLogin(updatedUserData));
                    ToastAndroid.show(apiResponse.message, ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show(apiResponse.message, ToastAndroid.SHORT);
                }
            } else {
                ToastAndroid.show('Please select signature', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.log("error", error);
            ToastAndroid.show('Error uploading image', ToastAndroid.SHORT);
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <View style={styles.mainContainer} >
            {
                userData?.STEP_NO === 1 ? (
                    <>
                        <Text style={styles.heading}>Personal Information</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.container}>
                                <InputBox
                                    label={{ visible: userData.NAME ? true : false, text: 'Name' }}
                                    value={userData.NAME}
                                    validation={validation.NAME}
                                    onChangeText={e => setUserData({ ...userData, NAME: e })}
                                    options={{}}
                                />
                                <InputBox
                                    label={{ visible: userData.MOBILE_NUMBER ? true : false, text: 'Mobile Number' }}
                                    value={userData.MOBILE_NUMBER}
                                    validation={validation.MOBILE_NUMBER}
                                    onChangeText={e => setUserData({ ...userData, MOBILE_NUMBER: e })}
                                    options={{ isDisable: false }}
                                />
                                <InputBox
                                    label={{ visible: userData.EMAIL ? true : false, text: 'Email' }}
                                    value={userData.EMAIL}
                                    validation={validation.EMAIL}
                                    onChangeText={e => setUserData({ ...userData, EMAIL: e })}
                                    options={{}}
                                />
                                <InputBox
                                    label={{ visible: userData.FATHER_NAME ? true : false, text: 'Father Name' }}
                                    value={userData.FATHER_NAME}
                                    validation={validation.FATHER_NAME}
                                    onChangeText={e => setUserData({ ...userData, FATHER_NAME: e })}
                                    options={{}}
                                />
                                <View style={styles.splitContainer}>
                                    <DatePick
                                        label={{ visible: userData.DATE_OF_BIRTH ? true : false, text: 'Date Of Birth' }}
                                        validation={validation.DATE_OF_BIRTH}
                                        value={userData.DATE_OF_BIRTH}
                                        setDate={e => setUserData({ ...userData, DATE_OF_BIRTH: e })}
                                        options={{ width: '46.2%' }}
                                    />
                                    <DropdownComponent
                                        label={{ visible: userData.CAST ? true : false, text: 'Cast' }}
                                        value={userData.CAST}
                                        onChangeText={e => setUserData({ ...userData, CAST: e.ID })}
                                        validation={validation.CAST}
                                        options={{ width: '46.2%' }}
                                        data={cast}
                                    />
                                </View>
                                <InputBox
                                    label={{ visible: userData.ADDRESS ? true : false, text: 'Address' }}
                                    value={userData.ADDRESS}
                                    validation={validation.ADDRESS}
                                    onChangeText={e => setUserData({ ...userData, ADDRESS: e })}
                                    options={{ multiline: true, lines: 3 }}
                                />
                                <View style={styles.splitContainer}>
                                    <InputBox
                                        label={{ visible: userData.VILLAGE ? true : false, text: 'Village' }}
                                        value={userData.VILLAGE}
                                        validation={validation.VILLAGE}
                                        onChangeText={e => setUserData({ ...userData, VILLAGE: e })}
                                        options={{ width: '46.2%' }}
                                    />
                                    <InputBox
                                        label={{ visible: userData.PIN_CODE ? true : false, text: 'Pin Code' }}
                                        value={userData.PIN_CODE}
                                        validation={validation.PIN_CODE}
                                        onChangeText={e => setUserData({ ...userData, PIN_CODE: e })}
                                        options={{ width: '46.2%', inputType: 'numeric' }}
                                    />
                                </View>
                                <View style={styles.splitContainer}>
                                    <DropdownComponent
                                        label={{ visible: userData.DISTRICT ? true : false, text: 'District' }}
                                        value={userData.DISTRICT}
                                        onChangeText={e => setUserData({ ...userData, DISTRICT: e.ID })}
                                        validation={validation.DISTRICT}
                                        options={{ width: '46.2%' }}
                                        data={district}
                                    />
                                    <DropdownComponent
                                        label={{ visible: userData.TALUKA ? true : false, text: 'Taluka' }}
                                        value={userData.TALUKA}
                                        onChangeText={e => setUserData({ ...userData, TALUKA: e.ID })}
                                        validation={validation.TALUKA}
                                        options={{ width: '46.2%' }}
                                        data={talukaData}
                                    />
                                </View>
                                <InputBox
                                    label={{ visible: userData.DURATION_OF_CURRENT_ADDRESS ? true : false, text: 'Duration of living years' }}
                                    value={userData.DURATION_OF_CURRENT_ADDRESS}
                                    validation={validation.DURATION_OF_CURRENT_ADDRESS}
                                    onChangeText={e => setUserData({ ...userData, DURATION_OF_CURRENT_ADDRESS: e })}
                                    options={{}}
                                />
                                <View style={styles.upload}>
                                    <Text style={styles.uploadText}>Profile Image : </Text>
                                    <View style={{ paddingRight: 20 }}>
                                        {userData?.PROFILE_PHOTO == null ? <VectorIcon
                                            name="upload"
                                            type="Feather"
                                            size={24}
                                            color={'#1E90FF'}
                                            onPress={() => { pickFile('upload/profilePhoto', 'PROFILE_PHOTO') }}
                                        /> :
                                            <VectorIcon
                                                name="eye"
                                                type="Feather"
                                                size={24}
                                                color={'#1E90FF'}
                                                onPress={() => { handleModelOpen('ProfilePhoto/' + userData.PROFILE_PHOTO, 'upload/profilePhoto', 'PROFILE_PHOTO') }}
                                            />
                                        }
                                    </View>
                                </View>
                                <View style={styles.upload}>
                                    <Text style={styles.uploadText}>Adhar Card Image : </Text>
                                    <View style={{ paddingRight: 20 }}>
                                        {userData?.ADHAR_CARD == null ? <VectorIcon
                                            name="upload"
                                            type="Feather"
                                            size={24}
                                            color={'#1E90FF'}
                                            onPress={() => { pickFile('upload/adharCard', 'ADHAR_CARD') }}
                                        /> :
                                            <VectorIcon
                                                name="eye"
                                                type="Feather"
                                                size={24}
                                                color={'#1E90FF'}
                                                onPress={() => { handleModelOpen('AdharCard/' + userData.ADHAR_CARD, 'upload/adharCard', 'ADHAR_CARD') }}
                                            />
                                        }
                                    </View>
                                </View>
                                <View style={styles.upload}>
                                    <Text style={styles.uploadText}>Pan Card Image : </Text>
                                    <View style={{ paddingRight: 20 }}>
                                        {userData?.PAN_CARD == null ? <VectorIcon
                                            name="upload"
                                            type="Feather"
                                            size={24}
                                            color={'#1E90FF'}
                                            onPress={() => { pickFile('upload/panCard', 'PAN_CARD') }}
                                        /> :
                                            <VectorIcon
                                                name="eye"
                                                type="Feather"
                                                size={24}
                                                color={'#1E90FF'}
                                                onPress={() => { handleModelOpen('PanCard/' + userData.PAN_CARD, 'upload/panCard', 'PAN_CARD') }}
                                            />
                                        }
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </>
                ) : userData?.STEP_NO === 2 ? (
                    <>
                        <Text style={styles.heading}>Educational Information</Text>
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
                                        {userData?.EXPERIENCE_LETTER == null ? <VectorIcon
                                            name="upload"
                                            type="Feather"
                                            size={24}
                                            color={'#1E90FF'}
                                            onPress={() => { pickFile('upload/experienceLetter', 'EXPERIENCE_LETTER') }}
                                        /> :
                                            <VectorIcon
                                                name="eye"
                                                type="Feather"
                                                size={24}
                                                color={'#1E90FF'}
                                                onPress={() => { handleModelOpen('ExperienceLetter/' + userData.EXPERIENCE_LETTER, 'upload/experienceLetter', 'EXPERIENCE_LETTER') }}
                                            />
                                        }
                                    </View>
                                </View>
                                <View style={styles.upload}>
                                    <Text style={styles.uploadText}>Leaving Certificate Image : </Text>
                                    <View style={{ paddingRight: 20 }}>
                                        {userData?.LEAVING_CERTIFICATE == null ? <VectorIcon
                                            name="upload"
                                            type="Feather"
                                            size={24}
                                            color={'#1E90FF'}
                                            onPress={() => { pickFile('upload/leavingCretificate', 'LEAVING_CERTIFICATE') }}
                                        /> :
                                            <VectorIcon
                                                name="eye"
                                                type="Feather"
                                                size={24}
                                                color={'#1E90FF'}
                                                onPress={() => { handleModelOpen('LeavingCretificate/' + userData.LEAVING_CERTIFICATE, 'upload/leavingCretificate', 'LEAVING_CERTIFICATE') }}
                                            />
                                        }
                                    </View>
                                </View>
                                <View style={styles.upload}>
                                    <Text style={styles.uploadText}>Educational Cretificate Image : </Text>
                                    <View style={{ paddingRight: 20 }}>
                                        {userData?.EDUCATIONAL_CERTIFICATE == null ? <VectorIcon
                                            name="upload"
                                            type="Feather"
                                            size={24}
                                            color={'#1E90FF'}
                                            onPress={() => { pickFile('upload/educationalCretificate', 'EDUCATIONAL_CERTIFICATE') }}
                                        /> :
                                            <VectorIcon
                                                name="eye"
                                                type="Feather"
                                                size={24}
                                                color={'#1E90FF'}
                                                onPress={() => { handleModelOpen('EducationalCretificate/' + userData.EDUCATIONAL_CERTIFICATE, 'upload/educationalCretificate', 'EDUCATIONAL_CERTIFICATE') }}
                                            />
                                        }
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </>
                ) : userData?.STEP_NO === 3 ? (
                    <>
                        <Text style={styles.heading}>Profestional Information </Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.container}>
                                <InputBox
                                    label={{ visible: userData.WORK_MOBILE_NUMBER ? true : false, text: 'Work Mobile No' }}
                                    value={userData.WORK_MOBILE_NUMBER}
                                    validation={validation.WORK_MOBILE_NUMBER}
                                    onChangeText={e => setUserData({ ...userData, WORK_MOBILE_NUMBER: e })}
                                    options={{ maxLength: 10, inputType: 'numeric', maxlength: 10 }}
                                />
                                <InputBox
                                    label={{ visible: userData.WORK_EMAIL_ID ? true : false, text: 'Work Email Id' }}
                                    value={userData.WORK_EMAIL_ID}
                                    validation={validation.WORK_EMAIL_ID}
                                    onChangeText={e => setUserData({ ...userData, WORK_EMAIL_ID: e })}
                                    options={{}}
                                />
                                <View style={styles.splitContainer}>
                                    <InputBox
                                        label={{ visible: userData.WORK_DURATION ? true : false, text: 'Work Duration' }}
                                        value={userData.WORK_DURATION}
                                        validation={validation.WORK_DURATION}
                                        onChangeText={e => setUserData({ ...userData, WORK_DURATION: e })}
                                        options={{ width: '46.2%' }}
                                    />
                                    <InputBox
                                        label={{ visible: userData.INTERESTED_PLACES_TO_WORK ? true : false, text: 'Intereted Place to Work' }}
                                        value={userData.INTERESTED_PLACES_TO_WORK}
                                        validation={validation.INTERESTED_PLACES_TO_WORK}
                                        onChangeText={e => setUserData({ ...userData, INTERESTED_PLACES_TO_WORK: e })}
                                        options={{ width: '46.2%' }}
                                    />
                                </View>
                                <View style={styles.splitContainer}>
                                    <InputBox
                                        label={{ visible: userData.WORKING_CITY ? true : false, text: 'Working City' }}
                                        value={userData.WORKING_CITY}
                                        validation={validation.WORKING_CITY}
                                        onChangeText={e => setUserData({ ...userData, WORKING_CITY: e })}
                                        options={{ width: '46.2%' }}
                                    />
                                    <InputBox
                                        label={{ visible: userData.WORKING_CITY_PINCODE ? true : false, text: 'Working Pin Code' }}
                                        value={userData.WORKING_CITY_PINCODE}
                                        validation={validation.WORKING_CITY_PINCODE}
                                        onChangeText={e => setUserData({ ...userData, WORKING_CITY_PINCODE: e })}
                                        options={{ width: '46.2%', inputType: 'numeric' }}
                                    />
                                </View>
                                <View style={styles.splitContainer}>
                                    <DropdownComponent
                                        label={{ visible: userData.WORKING_DISTRICT ? true : false, text: 'Working District' }}
                                        value={userData.WORKING_DISTRICT}
                                        onChangeText={e => setUserData({ ...userData, WORKING_DISTRICT: e.ID })}
                                        validation={validation.WORKING_DISTRICT}
                                        options={{ width: '46.2%' }}
                                        data={district}
                                    />
                                    <DropdownComponent
                                        label={{ visible: userData.WORKING_TALUKA ? true : false, text: 'Working Taluka' }}
                                        value={userData.WORKING_TALUKA}
                                        onChangeText={e => setUserData({ ...userData, WORKING_TALUKA: e.ID })}
                                        validation={validation.WORKING_TALUKA}
                                        options={{ width: '46.2%' }}
                                        data={workTluka}
                                    />
                                </View>
                                <InputBox
                                    label={{ visible: userData.APPLICATION_PLACE ? true : false, text: 'Application Place' }}
                                    value={userData.APPLICATION_PLACE}
                                    validation={validation.APPLICATION_PLACE}
                                    onChangeText={e => setUserData({ ...userData, APPLICATION_PLACE: e })}
                                    options={{}}
                                />
                                <InputBox
                                    label={{ visible: userData.CONCENTERS_NAME ? true : false, text: 'Concenters Name' }}
                                    value={userData.CONCENTERS_NAME}
                                    validation={validation.CONCENTERS_NAME}
                                    onChangeText={e => setUserData({ ...userData, CONCENTERS_NAME: e })}
                                    options={{}}
                                />
                                <InputBox
                                    label={{ visible: userData.CONCENTERS_ADDRESS ? true : false, text: 'Concenters Address' }}
                                    value={userData.CONCENTERS_ADDRESS}
                                    validation={validation.CONCENTERS_ADDRESS}
                                    onChangeText={e => setUserData({ ...userData, CONCENTERS_ADDRESS: e })}
                                    options={{ multiline: true, lines: 3 }}
                                />
                                <InputBox
                                    label={{ visible: userData.CONCENTERS_MOBILE_NUMBER ? true : false, text: 'Concenters Mobile No' }}
                                    value={userData.CONCENTERS_MOBILE_NUMBER}
                                    validation={validation.CONCENTERS_MOBILE_NUMBER}
                                    onChangeText={e => setUserData({ ...userData, CONCENTERS_MOBILE_NUMBER: e })}
                                    options={{ maxlength: 10, inputType: 'numeric' }}
                                />
                                {/* <View style={styles.upload}>
                                    <Text style={styles.uploadText}>Upload Sign : </Text>
                                    <View style={{ paddingRight: 20 }}>
                                        {userData?.MEMBER_SIGN == null ? <VectorIcon
                                            name="upload"
                                            type="Feather"
                                            size={24}
                                            color={'#1E90FF'}
                                            onPress={() => { pickFile('upload/memberSign', 'MEMBER_SIGN') }}
                                        /> :
                                            <VectorIcon
                                                name="eye"
                                                type="Feather"
                                                size={24}
                                                color={'#1E90FF'}
                                                onPress={() => { handleModelOpen('MemberSign/' + userData.MEMBER_SIGN, '/upload/memberSign', 'MEMBER_SIGN') }}
                                            />}
                                    </View>
                                </View> */}
                                <InputBox
                                    label={{ visible: userData.PASSWORD ? true : false, text: 'Password' }}
                                    value={userData.PASSWORD}
                                    validation={validation.PASSWORD}
                                    onChangeText={e => setUserData({ ...userData, PASSWORD: e })}
                                    options={{ isPassword: true }}
                                />
                            </View>
                        </ScrollView>
                    </>
                ) : userData?.STEP_NO === 4 ? (
                    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', marginTop: '30%' }]}>
                        <Image
                            style={styles.Logo}
                            source={require('../assets/vetpetso.png')}
                        />

                        {
                            userData?.STATUS == "A" ?
                                <View>
                                    <Text style={{ textAlign: 'center', fontSize: 18, fontFamily: "Poppins", color: "#6B1AFF", letterSpacing: 1, marginTop: 20 }} >Congratulations!</Text>
                                    <Text style={{ textAlign: 'center', fontSize: 18, fontFamily: "Poppins", color: "#6B1AFF", letterSpacing: 1 }} >Your registration has been approved. You can now login using your username and password.</Text>
                                    <TouchableOpacity onPress={login}>
                                        <View style={styles.container}>
                                            <Text style={[styles.button, { width: 100, margin: 20 }]} >Login</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View> :
                                userData?.STATUS == "R" ?
                                    <View>
                                        <Text style={{ textAlign: 'center', fontSize: 18, fontFamily: "Poppins", color: "#6B1AFF", letterSpacing: 1, marginTop: 20 }} >Your registration has been rejected. </Text>
                                        <Text style={{ textAlign: 'center', fontSize: 18, fontFamily: "Poppins", color: "#6B1AFF", letterSpacing: 1 }} >Remark : {userData?.REJECT_REMARK}</Text>
                                        <Text style={{ textAlign: 'center', fontSize: 18, fontFamily: "Poppins", color: "#6B1AFF", letterSpacing: 1 }} >{userData?.REJECT_REMARK}If you have any questions, please contact us.</Text>
                                        <TouchableOpacity onPress={handlePrev}>
                                            <View style={styles.container}>
                                                <Text style={[styles.button, { width: 100, margin: 20, backgroundColor: '#ff0c6c' }]} >ReApply</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View> :
                                    <>
                                        <Text style={styles.heading}>Application</Text>
                                        <Text style={styles.heading}>Submitted Successfully</Text>
                                        <View style={styles.container}>
                                            <Text style={{ textAlign: 'center', fontSize: 18, fontFamily: "Poppins", color: "#6B1AFF", letterSpacing: 1, marginTop: 20 }} >Dear {userData?.NAME},</Text>
                                            <Text style={{ textAlign: 'center', fontSize: 18, fontFamily: "Poppins", color: "#6B1AFF", letterSpacing: 1 }} >Your application has been sent for verification. Once it is approved, you will be notified here. Stay connected. Thank you.</Text>
                                        </View>
                                    </>
                        }
                    </View>
                ) : null
            }
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {
                    userData?.STEP_NO > 1 && userData?.STEP_NO < 4 ?
                        <TouchableOpacity onPress={handlePrev}>
                            <View style={styles.buttonContainer}>
                                <Text style={[styles.button, { backgroundColor: '#fff', color: "#4B1AFF", borderColor: '#4B1AFF', borderWidth: 1 }]} >Previous</Text>
                            </View>
                        </TouchableOpacity>
                        : userData?.STEP_NO === 1 ?
                            <TouchableOpacity onPress={login}>
                                <View style={styles.buttonContainer}>
                                    <Text style={[styles.button, { backgroundColor: '#fff', color: "#4B1AFF", borderColor: '#4B1AFF', borderWidth: 1 }]} >Cancel</Text>
                                </View>
                            </TouchableOpacity> : null
                }
                {
                    userData?.STEP_NO === 3 ?
                        <TouchableOpacity onPress={handleSave}  >
                            <View style={styles.buttonContainer}>
                                <Text style={[styles.button, { backgroundColor: '#ff0c6c' }]} >Save</Text>
                            </View>
                        </TouchableOpacity> :
                        userData?.STEP_NO < 3 ?
                            <TouchableOpacity onPress={handleNext}>
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.button} >Next</Text>
                                </View>
                            </TouchableOpacity> : null
                }
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal.isVisible}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'left' }}>
                            <Text style={[styles.heading, { textAlign: 'center', fontWeight: 'semibold', fontSize: 28, fontFamily: "Poppins-Regular", }]}>Image Preview</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: showModal.uri }} style={{ width: '100%', flex: 1, height: undefined, marginVertical: 10, borderRadius: 10 }} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'left', gap: 50 }}>
                            <TouchableOpacity onPress={() => { setShowModal({ isVisible: false }) }}>
                                <View style={styles.buttonContainer}>
                                    <Text style={[styles.button, { backgroundColor: '#fff', color: "#5a5a5a", borderColor: '#5a5a5a', borderWidth: 1, height: 45, paddingTop: 10.5, width: 120 }]} >Cancel</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { pickFile(showModal.api, showModal.key) }}>
                                <View style={styles.buttonContainer}>
                                    <Text style={[styles.button, { backgroundColor: '#ff0c6c', height: 45, paddingTop: 10.5, width: 120 }]} >ReUpload</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ flex: 1, backgroundColor: 'white', padding: 10, borderRadius: 10, margin: 8, marginVertical: 20 }}>
                        <Text style={[styles.heading, { fontWeight: 'bold', fontSize: 24, fontFamily: "Poppins-Regular", color: '#4B1AFF' }]}>Terms and Conditions</Text>
                        <View style={{ margin: 10, marginVertical: 5 }}>
                            <Text style={{ color: "#003", fontSize: 13, fontWeight: '600' }}>    महाराष्ट्र राज्यातील खाजगी क्षेत्रात कार्यरत असलेल्या पशु वैद्यकीय पशु संवर्धन व दुग्ध व्यवस्थापन पदवि -
                                पदविका प्रमाणपत्रधारक च्या आर्थिक, शैक्षणिक, व्यावसायिक आणि सामाजिक प्रश्यांच्या सोडवणूकीसाठी त्यांच्या
                                विविध हक्कांचे हिताचे संवर्धन व संरक्षण करण्याच्या प्रधान ने पशु वैद्यकीय पशु संवर्धन दुग्ध व्यवस्थापन सेवा संघ
                                सोसायटी नोंदणी कायदा १८६० व मुंबई सावर्जनिक न्यास स्थापन कायदा १९५० मधील तरतुदीनुसार नोंदणी क्रमांक
                                अनुक्रमे महा/८४७ पुणे २०११ ता. ७.५.२०११ व एफ ३११९९ ता. १८.९.२०११ अन्वये नोंदला गेला आहे असे
                                समजल्यावरुन मी सदर अर्ज सादर करीत आहे.
                            </Text>
                            <Text style={{ color: "#003", marginTop: 10, fontSize: 13, fontWeight: '600' }}>    प्रथमतःच मी प्रतिज्ञापूर्वक नमुद करीत आहे. की संघाच्या नियम अटी धोरणे माझ्यावर बंधनकारक राहतील व
                                स्वखुषीने माझ्या व आमच्या संवर्गाच्या शैक्षणिक विकासार्थ, सर्वागीण कल्याणार्थ, आर्थिक विकासार्थ आणि व्यवसायिक
                                हक्काच्या संरक्षणार्थ संघाची वर्गणी वेळोवेळी निश्चित केलेला संघटीत - सर्वंकष - सक्षम कायदेशीर प्रयत्नासाठी
                                इतर निधी मी वेळोवेळी न चुकता संघास देत राहीन
                            </Text>
                        </View>
                        <View style={{ alignItems: 'center', flex: 1, marginTop: 10 }}>
                            {
                                userData.MEMBER_SIGN ?
                                    <Image
                                        source={{ uri: STATIC_URL + '/MemberSign/' + userData.MEMBER_SIGN }}
                                        style={{ height: 100, width: 100 }}
                                    />
                                    : <Signature
                                        ref={signatureRef}
                                        onOK={handleSignatureSaved}
                                        descriptionText=""
                                        clearText="Clear"
                                        confirmText="Save"
                                        color="#4B1AFF"
                                        webStyle={`
                                            .m-signature-pad { 
                                                height: 80%;
                                                width: 100%;
                                            }
                                            .m-signature-pad--footer
                                            .clear {
                                                background-color: #fff;
                                                border-color: #20daff;
                                                color: #8a8a8f;
                                                width: 100px;
                                                height: 35px;
                                                font-size: 16px;
                                                font-weight: 500;
                                                border-radius: 50px;
                                                border-width: 2px;
                                            }
                                            .m-signature-pad--footer
                                            .save {
                                                background-color: #20daff;
                                                color: #8a8a8f;
                                                width: 100px;
                                                height: 35px;
                                                font-size: 16px;
                                                font-weight: 500;
                                                border-radius: 50px;
                                            }
                                            .m-signature-pad--footer{
                                                padding: 5px;
                                                display: flex;
                                                justify-content: space-between;
                                                align-items: center;
                                            }
                                            
                                            `}
                                    />
                            }
                        </View>
                        <View style={{ justifyContent: 'center', gap: 10, alignItems: 'center', flexDirection: 'row', margin: 10 }}>
                            {
                                agreed ?
                                    <VectorIcon
                                        name="check-square"
                                        type="Feather"
                                        onPress={() => setAgreed(!agreed)}
                                        size={22}
                                        color={'#4B1AFF'}
                                    /> :
                                    <VectorIcon
                                        name="square"
                                        type="Feather"
                                        size={22}
                                        onPress={() => setAgreed(!agreed)}
                                        color={'#4B1AFF'}
                                    />
                            }
                            <Text style={{ fontSize: 14, color: "#000", fontFamily: "Poppins-Regular" }}>I agree with the terms and conditions</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'left', gap: 50, marginBottom: 10 }}>
                            <TouchableOpacity
                                style={{ height: 40, backgroundColor: "#fff", borderRadius: 20, alignItems: "center", justifyContent: "center", borderColor: "#4B1AFF", borderWidth: 1, width: 120 }}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={{ fontSize: 16, color: "#000", fontFamily: "Poppins-Medium", }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ height: 40, backgroundColor: "#4B1AFF", borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: agreed ? "#4B1AFF" : "#8f8f8f", width: 120 }}
                                disabled={!agreed}
                                onPress={handleSubmit}
                            >
                                <Text style={{ fontSize: 16, color: "#fff", fontFamily: "Poppins-Medium", }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal >
            <Loader isLoading={isLoading} />
        </View >
    );
};

const styles = StyleSheet.create({
    splitContainer: {
        // flex: 1,
        // marginTop: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingHorizontal: 20,
        gap: 22,
        flexDirection: 'row',
    },
    Logo: {
        width: 200,
        height: 200,
        margin: 10,
        shadowColor: "black",
        backgroundColor: 'transparent',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        // mixBlendMode: "multiply",
    },
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
        height: "100%",
        backgroundColor: "#E6F4FE",
        padding: 15,
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

export default RegistrationScreen;

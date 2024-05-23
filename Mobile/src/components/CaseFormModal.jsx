import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Modal, ToastAndroid, PermissionsAndroid, FlatList, Alert } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import VectorIcon from '../utils/VectorIcon';
import Header from './Header';
import { STATIC_URL, apiUpload, apiPut, apiPost } from '../utils/api';
import { launchCamera } from 'react-native-image-picker';
import Signature from "react-native-signature-canvas";
import { useNavigation, useRoute } from '@react-navigation/native';
import InputBox from './InputBox';
import DropdownComponent from './DropdownComponent';
import MultiSelectComponent from './MultiSelectComponent';
import DailyCheckupDetails from './DailyCheckupDetails';
import * as Yup from 'yup';
import Prescription from './Prescription';
import Loader from './Loader';

const CaseFormModal = () => {
    const route = useRoute();
    const { item } = route.params
    let signatureRef = useRef(null);
    const user = useSelector(state => state.user.userInfo)
    const [caseData, setCaseData] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const [validation, setValidation] = useState({});
    const [stepNo, setStepNo] = useState(1)
    const [checkupDetails, setCheckupDetails] = useState([])
    const [showModal, setShowModal] = useState({
        isVisible: false,
        data: {}
    });
    const [prescription, setPrescription] = useState({
        isVisible: false,
        data: {}
    });

    useEffect(() => {
        setIsLoading(true)
        setCaseData({ ...item });
        getDropDownData();
        if (item.ID) { setStepNo(3) }
        setTimeout(() => {
            setIsLoading(false)
        }, 500);
    }, [item]);

    const navigation = useNavigation();
    const [signPad, setSignPad] = useState(false)
    const [district, setDistrict] = useState([]);
    const [taluka, setTaluka] = useState([]);
    const [animalType, setAnimalType] = useState([])
    const [animalBreed, setAnimalBreed] = useState([])
    const [samples, setSamples] = useState([])

    let talukaData = taluka
    if (caseData.DISTRICT !== null && caseData.DISTRICT !== 0 && caseData.DISTRICT !== undefined) {
        talukaData = taluka.filter(item => item.DISTRICT_ID == caseData.DISTRICT)
    }

    let breed = animalBreed
    if (caseData.ANIMAL_TYPE !== null && caseData.ANIMAL_TYPE !== 0 && caseData.ANIMAL_TYPE !== undefined) {
        breed = animalBreed.filter(item => item.ANIMAL_TYPE_ID == caseData.ANIMAL_TYPE)
    }
    const getDropDownData = async () => {
        try {
            const resDistrict = await apiPost("api/district/get", {});
            const resTaluka = await apiPost("api/taluka/get", {});
            const resBreed = await apiPost("api/animalBreed/get", {});
            const resAnimalType = await apiPost("api/animalType/get", {});
            const resAnimalSample = await apiPost("api/animalSample/get", {});
            const resCheckupDetails = await apiPost("api/patientDailyCheckup/get", { filter: ` AND PATIENT_ID = ${item.PATIENT_ID || 0}` });
            setTaluka(resTaluka.data || [])
            setDistrict(resDistrict.data || [])
            setAnimalBreed(resBreed.data || [])
            setAnimalType(resAnimalType.data || [])
            setCheckupDetails(resCheckupDetails.data || [])
            setSamples(resAnimalSample.data || [])
        } catch (error) {
            console.error(error);
        }
    }

    // useEffect(() => {
    //     getDropDownData();
    // }, []);

    const validationSchema = Yup.object().shape({
        MOBILE_NUMBER: Yup.number().required('Mobile is required'),
        OWNER_NAME: Yup.string().required('Owner Name is required'),
        DISTRICT: Yup.number().required('District is required'),
        ANIMAL_IDENTITY_NO: Yup.string().required('Animal Identity is required'),
    });

    const validate = async () => {
        try {
            await validationSchema.validate(caseData, { abortEarly: false });
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

    const handleSave = async () => {
        let errors = await validate()
        if (!errors) {
            setIsLoading(true)
            try {
                caseData.MEMBER_ID = user.ID
                caseData.CASE_TYPE = 1
                const res = await apiPost("api/patient/add", { ...caseData, checkupDetails: checkupDetails });
                if (res && res.code === 200) {
                    ToastAndroid.show(res.message, ToastAndroid.SHORT);
                    navigation.goBack()
                } else {
                    ToastAndroid.show('Failed to create Registration', ToastAndroid.SHORT);
                }
            } catch (error) {
                console.error(error);
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
            }finally{
                setIsLoading(false)
            }
        } else {
            ToastAndroid.show('Please fill all required fields', ToastAndroid.SHORT);
        }
    };

    const handleUpdate = async () => {
        let errors = await validate()
        if (!errors) {
            setIsLoading(true)
            try {
                const res = await apiPut("api/patientHistory/update", caseData);
                if (res && res.code === 200) {
                    ToastAndroid.show(res.message, ToastAndroid.SHORT);
                    navigation.goBack()
                } else {
                    ToastAndroid.show('Failed to update Registration', ToastAndroid.SHORT);
                }
            } catch (error) {
                console.error(error);
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
            }finally{
                setIsLoading(false)
            }
        } else {
            ToastAndroid.show('Please fill all required fields', ToastAndroid.SHORT);
        }
    };

    const openCamera = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Cool Photo App Camera Permission",
                    message: "Cool Photo App needs access to your camera so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                const options = {
                    storageOptions: {
                        skipBackup: true,
                        path: 'images'
                    }
                };
                launchCamera(options, async (response) => {
                    if (response.didCancel) {
                        console.log('User cancelled image picker');
                        return;
                    }
                    if (response.error) {
                        console.log('ImagePicker Error: ', response.error);
                        return;
                    }
                    if (response.customButton) {
                        console.log('User tapped custom button: ', response.customButton);
                        return;
                    }
                    try {
                        setIsLoading(true)
                        const apiResponse = await apiUpload('upload/patientImage', response.assets[0], caseData.ID);
                        if (apiResponse.code === 200) {
                            ToastAndroid.show(apiResponse.message, ToastAndroid.SHORT);
                            const updatedUserData = { ...caseData, PATIENT_IMAGE: apiResponse.name };
                            setCaseData(updatedUserData);
                        } else {
                            ToastAndroid.show(apiResponse.message, ToastAndroid.SHORT);
                        }
                    } catch (error) {
                        console.error('Error uploading image:', error);
                        ToastAndroid.show('Error uploading image', ToastAndroid.SHORT);
                    }finally{
                        setIsLoading(false)
                    }
                });
            } else {
                ToastAndroid.show("Permission Denied", ToastAndroid.SHORT);
            }
        } catch (err) {
            console.error('Error requesting camera permission:', err);
            ToastAndroid.show('Error requesting camera permission', ToastAndroid.SHORT);
        }
    };

    const handleSignatureSaved = async (signature) => {
        setIsLoading(true);
        try {
            if (signature !== null) {
                let data = {
                    uri: signature,
                    type: 'image/png',
                    name: 'signature.jpg'
                }
                const apiResponse = await apiUpload('upload/ownerSign', data, 0);
                if (apiResponse.code === 200) {
                    setCaseData({ ...caseData, OWNER_SIGN: apiResponse.name });
                    setSignPad(false);
                    ToastAndroid.show(apiResponse.message, ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show(apiResponse.message, ToastAndroid.SHORT);
                }
            } else {
                ToastAndroid.show('Please select signature', ToastAndroid.SHORT);
            }
        } catch (error) {
            ToastAndroid.show('Error uploading image', ToastAndroid.SHORT);
        }finally{
            setIsLoading(false)
        }
    };

    const openForm = (item) => {
        setShowModal({ isVisible: true, data: item })
    }

    const remove = (index) => {
        Alert.alert(
            "Confirm",
            "Are you sure you want to delete this item?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        checkupDetails.splice(index, 1)
                        setCheckupDetails([...checkupDetails])
                    }
                }
            ]
        );
    }

    const ObservationItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={caseData.PATIENT_ID !== undefined ? () => openForm(item) : () => remove(checkupDetails.indexOf(item))}>
                <View style={styles.observationItem}>
                    <View style={{ flex: 1, gap: 2, marginRight: 5 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#4B1AFF', fontWeight: 'bold', width: 52 }}>Date</Text>
                            <Text style={{ fontWeight: 'bold', color: '#4B1AFF' }}>: {item.OBSERVATION_DATE ? new Date(item.OBSERVATION_DATE).toLocaleString() : new Date().toLocaleString()}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#000', fontWeight: 'bold', width: 52 }}>Remark</Text>
                            <Text numberOfLines={2} style={{ fontWeight: '400', color: '#4B4B4B', flexShrink: 1 }}>: {item.REMARKS}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => setPrescription({ isVisible: true, data: { ...item, caseData } })}>
                        <View style={styles.image}>
                            <Image source={require('../assets/print1.png')} style={{ width: 40, height: 40 }} />
                        </View>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <Header name="Case Paper" />
            <View style={styles.mainContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: '500', fontSize: 17, color: 'black' }}>Case No: </Text>
                        <Text style={{ fontWeight: '500', fontSize: 17, color: 'red' }}>{caseData.CASE_NO}</Text>
                    </View>
                    <Text style={{ fontWeight: '500', fontSize: 17, color: 'black' }}>Date: {caseData.REGISTRATION_DATE ? new Date(caseData.REGISTRATION_DATE).toLocaleDateString() : new Date().toLocaleDateString()}</Text>
                </View>
                {
                    stepNo === 1 ? (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: '100%', paddingLeft: 10 }}>
                                <Text style={{ fontWeight: '500', fontSize: 17, color: 'black' }}>Identity Information : </Text>
                            </View>
                            <View style={styles.container}>
                                <InputBox
                                    label={{ visible: caseData.ANIMAL_IDENTITY_NO ? true : false, text: 'Animal Identity No' }}
                                    value={caseData.ANIMAL_IDENTITY_NO}
                                    validation={validation.ANIMAL_IDENTITY_NO}
                                    onChangeText={e => setCaseData({ ...caseData, ANIMAL_IDENTITY_NO: e })}
                                    options={{ isDisable: caseData.ID ? false : true }}
                                />
                                <InputBox
                                    label={{ visible: caseData.OWNER_NAME ? true : false, text: 'Owner Name' }}
                                    value={caseData.OWNER_NAME}
                                    validation={validation.OWNER_NAME}
                                    onChangeText={e => setCaseData({ ...caseData, OWNER_NAME: e })}
                                    options={{ isDisable: caseData.ID ? false : true }}
                                />
                                <InputBox
                                    label={{ visible: caseData.ADHAR_NO ? true : false, text: 'Owner Adhar No' }}
                                    value={caseData.ADHAR_NO}
                                    validation={validation.ADHAR_NO}
                                    onChangeText={e => setCaseData({ ...caseData, ADHAR_NO: e })}
                                    options={{ isDisable: caseData.ID ? false : true, inputType: 'numeric', maxlength: 12 }}
                                />
                                <InputBox
                                    label={{ visible: caseData.MOBILE_NUMBER ? true : false, text: 'Owner Mobile No' }}
                                    value={caseData.MOBILE_NUMBER}
                                    validation={validation.MOBILE_NUMBER}
                                    onChangeText={e => setCaseData({ ...caseData, MOBILE_NUMBER: e })}
                                    options={{ isDisable: caseData.ID ? false : true, inputType: 'numeric', maxlength: 10 }}
                                />
                                <InputBox
                                    label={{ visible: caseData.ANIMAL_AGE ? true : false, text: 'Animal Age in Years' }}
                                    value={caseData.ANIMAL_AGE?.toString()}
                                    validation={validation.ANIMAL_AGE}
                                    onChangeText={e => setCaseData({ ...caseData, ANIMAL_AGE: e })}
                                    options={{ isDisable: caseData.ID ? false : true, inputType: 'numeric', maxlength: 4 }}
                                />
                                <View style={styles.splitContainer}>
                                    <DropdownComponent
                                        label={{ visible: caseData.ANIMAL_TYPE ? true : false, text: 'Animal Type' }}
                                        value={caseData.ANIMAL_TYPE}
                                        onChangeText={e => setCaseData({ ...caseData, ANIMAL_TYPE: e.ID })}
                                        validation={validation.ANIMAL_TYPE}
                                        options={{ width: '46.2%', isDisable: caseData.ID ? true : false }}
                                        data={animalType}
                                    />
                                    <DropdownComponent
                                        label={{ visible: caseData.BREED ? true : false, text: 'Breed' }}
                                        value={caseData.BREED}
                                        onChangeText={e => setCaseData({ ...caseData, BREED: e.ID })}
                                        validation={validation.BREED}
                                        options={{ width: '46.2%', isDisable: caseData.ID ? true : false }}
                                        data={breed}
                                    />
                                </View>
                                <InputBox
                                    label={{ visible: caseData.ADDRESS ? true : false, text: 'Address' }}
                                    value={caseData.ADDRESS}
                                    validation={validation.ADDRESS}
                                    onChangeText={e => setCaseData({ ...caseData, ADDRESS: e })}
                                    options={{ isDisable: caseData.ID ? false : true }}
                                />
                                <InputBox
                                    label={{ visible: caseData.AT_POST ? true : false, text: 'Village' }}
                                    value={caseData.AT_POST}
                                    validation={validation.AT_POST}
                                    onChangeText={e => setCaseData({ ...caseData, AT_POST: e })}
                                    options={{ isDisable: caseData.ID ? false : true }}
                                />
                                <View style={styles.splitContainer}>
                                    <DropdownComponent
                                        label={{ visible: caseData.DISTRICT ? true : false, text: 'District' }}
                                        value={caseData.DISTRICT}
                                        onChangeText={e => setCaseData({ ...caseData, DISTRICT: e.ID })}
                                        validation={validation.DISTRICT}
                                        options={{ width: '46.2%', isDisable: caseData.ID ? true : false }}
                                        data={district}
                                    />
                                    <DropdownComponent
                                        label={{ visible: caseData.TALUKA ? true : false, text: 'Taluka' }}
                                        value={caseData.TALUKA}
                                        onChangeText={e => setCaseData({ ...caseData, TALUKA: e.ID })}
                                        validation={validation.TALUKA}
                                        options={{ width: '46.2%', isDisable: caseData.ID ? true : false }}
                                        data={talukaData}
                                    />
                                </View>
                                <View style={[styles.splitContainer, { marginTop: 15 }]}>
                                    <View style={[styles.dropdown, { height: 165, justifyContent: 'center', alignItems: 'center', padding: 10, paddingBottom: 0 }]}>
                                        <TouchableOpacity disabled={caseData.ID ? true : false} onPress={openCamera}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                                {caseData.PATIENT_IMAGE ?
                                                    <Image source={{ uri: `${STATIC_URL}PatientImage/${caseData.PATIENT_IMAGE}` }} style={{ width: 120, height: 120 }} /> :
                                                    <Image source={require('../assets/camera.png')} style={{ width: 60, height: 60 }} />
                                                }
                                            </View>
                                            <Text style={[styles.uploadText, { width: 135, marginVertical: 10 }]}>Upload Photo : </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[styles.dropdown, {}]}>
                                        <TouchableOpacity disabled={caseData.ID ? true : false} onPress={() => setSignPad(true)}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                                {caseData.OWNER_SIGN ?
                                                    <Image source={{ uri: `${STATIC_URL}OwnerSign/${caseData.OWNER_SIGN}` }} style={{ width: 120, height: 120 }} /> :
                                                    <Image source={require('../assets/signature1.png')} style={{ width: 60, height: 60 }} />
                                                }
                                            </View>
                                            <Text style={[styles.uploadText, { width: 135, marginVertical: 10 }]}>Upload Sign : </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    ) : stepNo === 2 ? (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: '100%', paddingLeft: 10 }}>
                                <Text style={{ fontWeight: '500', fontSize: 17, color: 'black' }}>Histry Details : </Text>
                            </View>
                            <View style={styles.container}>
                                <InputBox
                                    label={{ visible: caseData.TEMPRATURE ? true : false, text: 'Temprature' }}
                                    value={caseData.TEMPRATURE}
                                    validation={validation.TEMPRATURE}
                                    onChangeText={e => setCaseData({ ...caseData, TEMPRATURE: e })}
                                    options={{}}
                                />
                                <InputBox
                                    label={{ visible: caseData.ABDOMINAL_MOVEMENT ? true : false, text: 'Abdominal Movement' }}
                                    value={caseData.ABDOMINAL_MOVEMENT}
                                    validation={validation.ABDOMINAL_MOVEMENT}
                                    onChangeText={e => setCaseData({ ...caseData, ABDOMINAL_MOVEMENT: e })}
                                    options={{}}
                                />
                                <InputBox
                                    label={{ visible: caseData.PULSE ? true : false, text: 'Pulse Rate' }}
                                    value={caseData.PULSE}
                                    validation={validation.PULSE}
                                    onChangeText={e => setCaseData({ ...caseData, PULSE: e })}
                                    options={{}}
                                />
                                <InputBox
                                    label={{ visible: caseData.GENITAL_CONDITION ? true : false, text: 'Genital Condition' }}
                                    value={caseData.GENITAL_CONDITION}
                                    validation={validation.GENITAL_CONDITION}
                                    onChangeText={e => setCaseData({ ...caseData, GENITAL_CONDITION: e })}
                                    options={{}}
                                />
                                <InputBox
                                    label={{ visible: caseData.RESPIRATORY_CONDITION ? true : false, text: 'Respiratory Condition' }}
                                    value={caseData.RESPIRATORY_CONDITION}
                                    validation={validation.RESPIRATORY_CONDITION}
                                    onChangeText={e => setCaseData({ ...caseData, RESPIRATORY_CONDITION: e })}
                                    options={{}}
                                />
                                <InputBox
                                    label={{ visible: caseData.OBSERVATION_OF_EYE_SKIN_NOSTRIL ? true : false, text: 'Observation Of Eye Skin Nostrol' }}
                                    value={caseData.OBSERVATION_OF_EYE_SKIN_NOSTRIL}
                                    validation={validation.OBSERVATION_OF_EYE_SKIN_NOSTRIL}
                                    onChangeText={e => setCaseData({ ...caseData, OBSERVATION_OF_EYE_SKIN_NOSTRIL: e })}
                                    options={{}}
                                />
                                <InputBox
                                    label={{ visible: caseData.WATER_INTAKE ? true : false, text: 'Water Intake' }}
                                    value={caseData.WATER_INTAKE}
                                    validation={validation.WATER_INTAKE}
                                    onChangeText={e => setCaseData({ ...caseData, WATER_INTAKE: e })}
                                    options={{}}
                                />
                                <InputBox
                                    label={{ visible: caseData.DID_TAKE_ANTICEPTIC_DRUGS ? true : false, text: 'Did Take Anticeptic Drugs' }}
                                    value={caseData.DID_TAKE_ANTICEPTIC_DRUGS}
                                    validation={validation.DID_TAKE_ANTICEPTIC_DRUGS}
                                    onChangeText={e => setCaseData({ ...caseData, DID_TAKE_ANTICEPTIC_DRUGS: e })}
                                    options={{}}
                                />
                                <InputBox
                                    label={{ visible: caseData.DID_MAKE_HOME_REMEDIES ? true : false, text: 'Did Make Home Remedies' }}
                                    value={caseData.DID_MAKE_HOME_REMEDIES}
                                    validation={validation.DID_MAKE_HOME_REMEDIES}
                                    onChangeText={e => setCaseData({ ...caseData, DID_MAKE_HOME_REMEDIES: e })}
                                    options={{}}
                                />
                                <InputBox
                                    label={{ visible: caseData.OTHER_INFORMATION ? true : false, text: 'Other Information' }}
                                    value={caseData.OTHER_INFORMATION}
                                    validation={validation.OTHER_INFORMATION}
                                    onChangeText={e => setCaseData({ ...caseData, OTHER_INFORMATION: e })}
                                    options={{}}
                                />
                                <InputBox
                                    label={{ visible: caseData.IMMUNIZATION_INFORMATION ? true : false, text: 'Immunization Information' }}
                                    value={caseData.IMMUNIZATION_INFORMATION}
                                    validation={validation.IMMUNIZATION_INFORMATION}
                                    onChangeText={e => setCaseData({ ...caseData, IMMUNIZATION_INFORMATION: e })}
                                    options={{}}
                                />
                                <InputBox
                                    label={{ visible: caseData.FIRST_AID ? true : false, text: 'First Aid' }}
                                    value={caseData.FIRST_AID}
                                    validation={validation.FIRST_AID}
                                    onChangeText={e => setCaseData({ ...caseData, FIRST_AID: e })}
                                    options={{}}
                                />
                                <MultiSelectComponent
                                    label={{ visible: caseData.PATIENT_SAMPLES ? true : false, text: 'Patient Samples' }}
                                    value={JSON.parse(caseData.PATIENT_SAMPLES || '[]')}
                                    onChangeText={e => setCaseData({ ...caseData, PATIENT_SAMPLES: JSON.stringify(e) })}
                                    validation={validation.PATIENT_SAMPLES}
                                    options={{}}
                                    data={samples}
                                />
                                <InputBox
                                    label={{ visible: caseData.DIAGNOSTIC_LABORATORY_REMARK ? true : false, text: 'Diagnostic Laboratory Remark' }}
                                    value={caseData.DIAGNOSTIC_LABORATORY_REMARK}
                                    validation={validation.DIAGNOSTIC_LABORATORY_REMARK}
                                    onChangeText={e => setCaseData({ ...caseData, DIAGNOSTIC_LABORATORY_REMARK: e })}
                                    options={{}}
                                />
                                <InputBox
                                    label={{ visible: caseData.INSTRUCTIONS_TO_OWNER ? true : false, text: 'Instructions To Owner' }}
                                    value={caseData.INSTRUCTIONS_TO_OWNER}
                                    validation={validation.INSTRUCTIONS_TO_OWNER}
                                    onChangeText={e => setCaseData({ ...caseData, INSTRUCTIONS_TO_OWNER: e })}
                                    options={{}}
                                />
                            </View>
                        </ScrollView>
                    ) : stepNo === 3 ? (
                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: '100%', padding: 10, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E4E9F1', borderRadius: 10 }}>
                                <Text style={{ fontWeight: '500', fontSize: 17, color: 'black' }}>Daily Observations : </Text>
                                <TouchableOpacity disabled={caseData.PATIENT_ID === undefined && checkupDetails.length > 0} onPress={() => openForm({ PATIENT_ID: caseData.PATIENT_ID })} style={styles.addButton}>
                                    {/* <VectorIcon type="Feather" name="plus" size={30} color="#fff" /> */}
                                    <Image source={require('../assets/add1.png')} style={{ width: 40, height: 40 }} />
                                </TouchableOpacity>
                            </View>
                            {
                                checkupDetails.length > 0 ?
                                    <FlatList
                                        data={checkupDetails}
                                        renderItem={({ item }) => <ObservationItem item={item} />}
                                        keyExtractor={item => item.ID}
                                        contentContainerStyle={{ paddingVertical: 5 }}
                                        initialNumToRender={8}
                                        showsVerticalScrollIndicator={false}
                                    />
                                    :
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={require('../assets/empty.png')} style={{ width: 150, height: 150, opacity: 0.5 }} />
                                    </View>
                            }
                        </>
                    ) : null
                }
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {
                        stepNo > 1 ? (
                            <TouchableOpacity onPress={() => setStepNo(prev => prev - 1)}>
                                <View style={styles.buttonContainer}>
                                    <Text style={[styles.button, { backgroundColor: '#fff', color: "#4B1AFF", borderColor: '#4B1AFF', borderWidth: 1 }]} >Previous</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <View style={styles.buttonContainer}>
                                    <Text style={[styles.button, { backgroundColor: '#fff', color: "#4B1AFF", borderColor: '#4B1AFF', borderWidth: 1 }]} >Cancel</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                    {
                        stepNo === 3 ? (
                            caseData.ID ? (
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
                            )) : (
                            <TouchableOpacity onPress={() => setStepNo(prev => prev + 1)}>
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.button} >Next</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>
            <DailyCheckupDetails item={showModal.data} showModal={showModal.isVisible} setModal={() => setShowModal({ isVisible: false, data: {} })} getData={(data) => { setCheckupDetails([...checkupDetails, data]) }} />
            <Prescription item={prescription.data} showModal={prescription.isVisible} setModal={() => setPrescription({ isVisible: false, data: {} })} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={signPad}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ height: '84%', width: '95%', backgroundColor: 'white', padding: 10, borderRadius: 10, paddingVertical: 15 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: '100%', paddingBottom: 10, paddingRight: 10 }}>
                            <VectorIcon
                                name="closecircleo"
                                type="AntDesign"
                                size={35}
                                color={'red'}
                                onPress={() => setSignPad(false)}
                            />
                        </View>
                        <View style={{ width: '100%', marginBottom: 15 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black', fontFamily: "Poppins-Regular", letterSpacing: 1 }}>लघुपशुवैद्यकीय औषधोपचार-लघुशल्यक्रियासाठी / कृत्रीम रेतन-गर्भधारणा तपासणीसाठी संमती पत्र.</Text>
                            <Text style={{ fontSize: 13, color: 'black', fontFamily: "Poppins-Regular", margin: 5 }}>
                                अ)  माझ्या मालकीचे रुग्ण गाय / बैल / रेडा / म्हैस / वासरू / कोंबडी / शेळी / मेंढी / कुत्रे / मांजर / पक्षी इत्यादीं, यांच्यावर आवश्यक ते लघु पशुवैद्यकीय औषधोपचार, रोग प्रतिबंधक उपाय योजना; तसेच, लघुशल्य क्रिया व कृत्रीम रेतन- गर्भनिदान करण्यास मी या संमती पत्राद्वारे स्वखुषीने संमती देत आहे.
                            </Text>
                            <Text style={{ fontSize: 13, color: 'black', fontFamily: "Poppins-Regular", margin: 5 }}>
                                ब)  मुंबई राज्य शासनाच्या नागरी पशुवैद्यकीय सेवा संचालनालय परिपत्रक क्रमांक ३६, दिनांक १८ डिसेंबर १९१४
                                (संदर्भ पान क्र. ५४३, मॅन्युअल ऑफ ऑफिस प्रोसिजर पशुसंवर्धन खाते १९६७) मधील तरतुदीनुसार रुग्णावर योग्य ती काळजी घेऊनसुद्धा रुग्णास इजा, अपाय किंवा रुग्ण दगावल्यास झालेल्या नुकसानीबद्दल संबंधीत लघु पशुवैद्यकीय व्यावसायीक किंवा त्यांचा कर्मचारी यास जबाबदार धरले जाणार नाही याची जाणीव मला स्पष्टपणे करून देण्यात आली आहे.
                            </Text>
                        </View>
                        {isLoading && <ActivityIndicator size="large" color="#4B1AFF" />}
                        <Signature
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
                                .button {
                                    background-color: #20daff;
                                    color: #8a8a8f;
                                    width: 100px;
                                    height: 35px;
                                    font-size: 16px;
                                    font-weight: 500;
                                    border-radius: 50px;
                                }
                            `}
                        />
                    </View>
                </View>
            </Modal>
            <Loader isLoading={isLoading} />
        </>
    );
};

const styles = StyleSheet.create({
    image: {
        backgroundColor: 'white',
        height: 50,
        width: 50,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#4B1AFF",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 4,
    },
    addButton: {
        // backgroundColor: '#5d30ff',
        width: 40,
        height: 40,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    observationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderWidth: 0.6,
        borderColor: '#4B1AFF',
        marginTop: 10,
        backgroundColor: '#fbfbfb',
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
    },
    uploadText: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: "#5a5a5a",
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontWeight: '500',
        fontSize: 17,
        color: 'black'
    },
    mainContainer: {
        width: "100%",
        height: "95%",
        backgroundColor: "#fff",
        padding: 15,
        paddingTop: 0
    },
    container: {
        margin: 5,
        marginTop: 0,
        marginBottom: 20,
        flexDirection: 'col',
        alignItems: 'center',
        justifyContent: "center",
    },
    dropdown: {
        fontSize: 16,
        width: '46.2%',
        height: 165,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        paddingBottom: 0,
        backgroundColor: '#fbfbfb',
        color: "#000",
        borderRadius: 10,
        shadowColor: "#4B1AFF",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 4,

    },
    splitContainer: {
        // flex: 1,
        // marginTop: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingHorizontal: 20,
        gap: 22,
        flexDirection: 'row',
    },
    deliver: {
        fontSize: 16,
        // paddingLeft: 25,
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

export default CaseFormModal;

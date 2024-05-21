import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Modal, ToastAndroid, PermissionsAndroid } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import VectorIcon from '../utils/VectorIcon';
import Header from './Header';
import { Picker } from '@react-native-picker/picker';
import { STATIC_URL, apiUpload, apiPut, apiPost } from '../utils/api';
import { launchCamera } from 'react-native-image-picker';
import Signature from "react-native-signature-canvas";
import DatePicker from 'react-native-modern-datepicker';
import { RadioButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import Loader from './Loader';

const AIFormModal = () => {
    const route = useRoute();
    const { item } = route.params
    let signatureRef = useRef(null);
    const user = useSelector(state => state.user.userInfo)
    const [aiData, setAiData] = useState({});
    const [selecteDate, setSelecteDate] = useState({ date: null, show: false });
    const [isLoading, setIsLoading] = useState(false)
    const [signLoading, setSignLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        setAiData({ ...item });
        getDropDownData();
        setTimeout(() => {
            setIsLoading(false)
        }, 1000);
    }, [item]);

    const navigation = useNavigation();
    const [signPad, setSignPad] = useState(false)
    const [district, setDistrict] = useState([]);
    const [taluka, setTaluka] = useState([]);
    const [animalType, setAnimalType] = useState([])
    const [animalBreed, setAnimalBreed] = useState([])

    let talukaData = taluka
    if (aiData.DISTRICT !== null && aiData.DISTRICT !== 0 && aiData.DISTRICT !== undefined) {
        talukaData = taluka.filter(item => item.DISTRICT_ID == aiData.DISTRICT)
    }
    let breed = animalBreed
    if (aiData.ANIMAL_TYPE !== null && aiData.ANIMAL_TYPE !== 0 && aiData.ANIMAL_TYPE !== undefined) {
        breed = animalBreed.filter(item => item.ANIMAL_TYPE_ID == aiData.ANIMAL_TYPE)
    }
    const getDropDownData = async () => {
        try {
            const resDistrict = await apiPost("api/district/get", {});
            const resTaluka = await apiPost("api/taluka/get", {});
            const resBreed = await apiPost("api/animalBreed/get", {});
            const resAnimalType = await apiPost("api/animalType/get", {});
            setTaluka(resTaluka.data)
            setDistrict(resDistrict.data)
            setAnimalBreed(resBreed.data)
            setAnimalType(resAnimalType.data)
        } catch (error) {
            console.error(error);
        }
    }

    // useEffect(() => {
    //     getDropDownData();
    // }, []);

    const handleSave = async () => {
        try {
            aiData.MEMBER_ID = user.ID
            aiData.CASE_TYPE = 2
            const res = await apiPost("api/patient/addAi", aiData);
            if (res && res.code === 200) {
                ToastAndroid.show(res.message, ToastAndroid.SHORT);
                navigation.goBack()
            } else {
                ToastAndroid.show('Failed to create Registration', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error(error);
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await apiPut("api/aiDetails/update", aiData);
            if (res && res.code === 200) {
                ToastAndroid.show(res.message, ToastAndroid.SHORT);
                navigation.goBack()
            } else {
                ToastAndroid.show('Failed to update Registration', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error(error);
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
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
                        const apiResponse = await apiUpload('upload/patientImage', response.assets[0], aiData.ID);
                        if (apiResponse.code === 200) {
                            ToastAndroid.show(apiResponse.message, ToastAndroid.SHORT);
                            const updatedUserData = { ...aiData, PATIENT_IMAGE: apiResponse.name };
                            setAiData(updatedUserData);
                        } else {
                            ToastAndroid.show(apiResponse.message, ToastAndroid.SHORT);
                        }
                    } catch (error) {
                        console.error('Error uploading image:', error);
                        ToastAndroid.show('Error uploading image', ToastAndroid.SHORT);
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
        try {
            setSignLoading(true);
            console.log('signature');
            setTimeout(async () => {
                console.log('signature1');
                if (signature !== null) {
                    let data = {
                        uri: signature,
                        type: 'image/png',
                        name: 'signature.jpg'
                    }
                    const apiResponse = await apiUpload('upload/ownerSign', data, 0);
                    if (apiResponse.code === 200) {
                        ToastAndroid.show(apiResponse.message, ToastAndroid.SHORT);
                        setAiData({ ...aiData, OWNER_SIGN: apiResponse.name });
                        setSignPad(false);
                        setSignLoading(false);
                    } else {
                        ToastAndroid.show(apiResponse.message, ToastAndroid.SHORT);
                        setSignLoading(false);
                    }
                } else {
                    ToastAndroid.show('Please select signature', ToastAndroid.SHORT);
                    setSignLoading(false);
                }
            }, 100);
        } catch (error) {
            console.error('Error uploading image:', error);
            ToastAndroid.show('Error uploading image', ToastAndroid.SHORT);
            setSignLoading(false);
        }
    };

    const pickDate = () => {
        setAiData({ ...aiData, DELIVERY_DATE: selecteDate.date })
        setSelecteDate({ ...selecteDate, show: false })
    }
    return (
        <>
            <Header name="Artificial Insemination" />
            {/* {isLoading ?
                <ActivityIndicator size="large" color="#4B1AFF" style={{ flex: 1 }} /> :
                <> */}
            <View style={styles.mainContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: '500', fontSize: 17, color: 'black' }}>Case No: </Text>
                        <Text style={{ fontWeight: '500', fontSize: 17, color: 'red' }}>{aiData.CASE_NO}</Text>
                    </View>
                    <Text style={{ fontWeight: '500', fontSize: 17, color: 'black' }}>Date: {aiData.REGISTRATION_DATE ? new Date(aiData.REGISTRATION_DATE).toLocaleDateString() : new Date().toLocaleDateString()}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: '100%', paddingLeft: 10 }}>
                        <Text style={{ fontWeight: '500', fontSize: 17, color: 'black' }}>Animal Identity : </Text>
                    </View>
                    <View style={styles.container}>
                        <TextInput
                            activeOutlineColor='#4B1AFF'
                            outlineStyle={{ borderRadius: 10, borderColor: 'transparent', shadowColor: "#4B1AFF", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 5 }}
                            mode='outlined'
                            style={styles.deliver}
                            label='Animal Identity No'
                            placeholderTextColor={"#5a5a5a"}
                            onChangeText={e => setAiData({ ...aiData, ANIMAL_IDENTITY_NO: e })}
                            value={aiData.ANIMAL_IDENTITY_NO}
                        />
                        <TextInput
                            activeOutlineColor='#4B1AFF'
                            outlineStyle={{ borderRadius: 10, borderColor: 'transparent', shadowColor: "#4B1AFF", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 5 }}
                            mode='outlined'
                            style={styles.deliver}
                            label='Owner Name'
                            placeholderTextColor={"#5a5a5a"}
                            onChangeText={e => setAiData({ ...aiData, OWNER_NAME: e })}
                            value={aiData.OWNER_NAME}
                        />
                        <TextInput
                            activeOutlineColor='#4B1AFF'
                            outlineStyle={{ borderRadius: 10, borderColor: 'transparent', shadowColor: "#4B1AFF", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 5 }}
                            mode='outlined'
                            style={styles.deliver}
                            label='Owner Adhar No'
                            placeholderTextColor={"#5a5a5a"}
                            maxLength={10}
                            keyboardType='numeric'
                            onChangeText={e => setAiData({ ...aiData, ADHAR_NO: e })}
                            value={aiData.ADHAR_NO}
                        />
                        <TextInput
                            activeOutlineColor='#4B1AFF'
                            outlineStyle={{ borderRadius: 10, borderColor: 'transparent', shadowColor: "#4B1AFF", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 5 }}
                            mode='outlined'
                            style={styles.deliver}
                            label='Owner Mobile No'
                            placeholderTextColor={"#5a5a5a"}
                            maxLength={10}
                            keyboardType='numeric'
                            onChangeText={e => setAiData({ ...aiData, MOBILE_NUMBER: e })}
                            value={aiData.MOBILE_NUMBER}
                        />
                        <TextInput
                            activeOutlineColor='#4B1AFF'
                            outlineStyle={{ borderRadius: 10, borderColor: 'transparent', shadowColor: "#4B1AFF", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 5 }}
                            mode='outlined'
                            style={styles.deliver}
                            label='Animal Age in Years'
                            placeholderTextColor={"#5a5a5a"}
                            maxLength={10}
                            keyboardType='numeric'
                            onChangeText={e => setAiData({ ...aiData, ANIMAL_AGE: e })}
                            value={aiData.ANIMAL_AGE?.toString()}
                        />
                        <View style={styles.dropdownContainer}>
                            <View style={styles.dropdown}>
                                <Picker
                                    selectedValue={aiData.ANIMAL_TYPE}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setAiData({ ...aiData, ANIMAL_TYPE: itemValue })
                                    }
                                >
                                    <Picker.Item style={{ color: '#5a5a5a' }} label="Animal Type" value="" />
                                    {animalType?.map((item, index) => (
                                        <Picker.Item
                                            key={index}
                                            style={{ color: '#5a5a5a' }}
                                            label={item.NAME}
                                            value={item.ID}
                                        />
                                    ))}
                                </Picker>
                            </View>
                            <View style={styles.dropdown}>
                                <Picker
                                    selectedValue={aiData.BREED}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setAiData({ ...aiData, BREED: itemValue })
                                    }
                                >
                                    <Picker.Item style={{ color: '#5a5a5a' }} label="Breed" value="" />
                                    {breed?.map((item, index) => (
                                        <Picker.Item
                                            key={index}
                                            style={{ color: '#5a5a5a' }}
                                            label={item.NAME}
                                            value={item.ID}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                        <TextInput
                            activeOutlineColor='#4B1AFF'
                            outlineStyle={{ borderRadius: 10, borderColor: 'transparent', shadowColor: "#4B1AFF", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 5 }}
                            mode='outlined'
                            style={styles.deliver}
                            label='Address'
                            placeholderTextColor={"#5a5a5a"}
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={e => setAiData({ ...aiData, ADDRESS: e })}
                            value={aiData.ADDRESS}
                        />
                        <TextInput
                            activeOutlineColor='#4B1AFF'
                            outlineStyle={{ borderRadius: 10, borderColor: 'transparent', shadowColor: "#4B1AFF", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 5 }}
                            mode='outlined'
                            style={styles.deliver}
                            label='Village'
                            placeholderTextColor={"#5a5a5a"}
                            onChangeText={e => setAiData({ ...aiData, AT_POST: e })}
                            value={aiData.AT_POST}
                        />
                        <View style={styles.dropdownContainer}>
                            <View style={styles.dropdown}>
                                <Picker
                                    selectedValue={aiData.DISTRICT}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setAiData({ ...aiData, DISTRICT: itemValue })
                                    }
                                >
                                    <Picker.Item style={{ color: '#5a5a5a' }} label="District" value="" />
                                    {district?.map((item, index) => (
                                        <Picker.Item
                                            key={index}
                                            style={{ color: '#5a5a5a' }}
                                            label={item.NAME}
                                            value={item.ID}
                                        />
                                    ))}
                                </Picker>
                            </View>
                            <View style={styles.dropdown}>
                                <Picker
                                    selectedValue={aiData.TALUKA}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setAiData({ ...aiData, TALUKA: itemValue })
                                    }
                                >
                                    <Picker.Item style={{ color: '#5a5a5a' }} label="Taluka" value="" />
                                    {talukaData?.map((item, index) => (
                                        <Picker.Item
                                            key={index}
                                            style={{ color: '#5a5a5a' }}
                                            label={item.NAME}
                                            value={item.ID}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.dropdownContainer}>
                            <View style={[styles.dropdown, { height: 165, justifyContent: 'center', alignItems: 'center', padding: 10, paddingBottom: 0 }]}>
                                <TouchableOpacity onPress={openCamera}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                        {aiData.PATIENT_IMAGE ?
                                            <Image source={{ uri: `${STATIC_URL}PatientImage/${aiData.PATIENT_IMAGE}` }} style={{ width: 120, height: 120 }} /> :
                                            <Image source={require('../assets/camera.png')} style={{ width: 60, height: 60 }} />
                                        }
                                    </View>
                                    <Text style={[styles.uploadText, { width: 135, marginVertical: 10 }]}>Upload Photo : </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.dropdown, { height: 165, justifyContent: 'center', alignItems: 'center', padding: 10, paddingBottom: 0 }]}>
                                <TouchableOpacity onPress={() => setSignPad(true)}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                        {aiData.OWNER_SIGN ?
                                            <Image source={{ uri: `${STATIC_URL}OwnerSign/${aiData.OWNER_SIGN}` }} style={{ width: 120, height: 120 }} /> :
                                            <Image source={require('../assets/signature1.png')} style={{ width: 60, height: 60 }} />
                                        }
                                    </View>
                                    <Text style={[styles.uploadText, { width: 135, marginVertical: 10 }]}>Upload Sign : </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {
                            aiData.ID ? (
                                <>
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: '100%', paddingTop: 20, paddingLeft: 10 }}>
                                        <Text style={{ fontWeight: '500', fontSize: 17, color: 'black' }}>AI Details : </Text>
                                    </View>
                                    <View style={[styles.deliver, { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 10, gap: 60 }]}>
                                        <Text style={styles.uploadText}>Is Pregnant : </Text>
                                        <RadioButton.Group onValueChange={newValue => setAiData({ ...aiData, IS_PREGNANT: newValue })} value={aiData.IS_PREGNANT?.toString()}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={styles.uploadText}>YES</Text>
                                                <RadioButton value="1" color="#1E90FF" />
                                                <Text style={styles.uploadText}>NO</Text>
                                                <RadioButton value="0" color="#1E90FF" />
                                            </View>
                                        </RadioButton.Group>
                                    </View>
                                    <View style={styles.dropdownContainer}>
                                        <View style={[styles.upload, { width: '46.2%', marginTop: 0, }]}>
                                            <Text style={styles.uploadText}>{aiData.DELIVERY_DATE ? aiData.DELIVERY_DATE : 'Delivery Date'} </Text>
                                            {/* <View style={{ paddingHorizontal: 15 }}> */}
                                            <VectorIcon
                                                name="date"
                                                type="Fontisto"
                                                size={24}
                                                color={'#1E90FF'}
                                                onPress={() => setSelecteDate({ ...selecteDate, show: true })}
                                            />
                                            {/* </View> */}
                                        </View>
                                        <TextInput
                                            activeOutlineColor='#4B1AFF'
                                            outlineStyle={{ borderRadius: 10, borderColor: 'transparent', shadowColor: "#4B1AFF", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 5 }}
                                            mode='outlined'
                                            style={[styles.dropdown, { paddingHorizontal: 15, shadowColor: 'transparent' }]}
                                            label='Milk Production'
                                            placeholderTextColor={"#5a5a5a"}
                                            onChangeText={e => setAiData({ ...aiData, MILK_PRODUCTION: e })}
                                            value={aiData.MILK_PRODUCTION}
                                        />
                                    </View>
                                </>
                            ) : (null
                            )
                        }
                    </View>
                </ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View style={styles.buttonContainer}>
                            <Text style={[styles.button, { backgroundColor: '#fff', color: "#4B1AFF", borderColor: '#4B1AFF', borderWidth: 1 }]} >Cancel</Text>
                        </View>
                    </TouchableOpacity>
                    {
                        aiData.ID ? (
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={signPad}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ height: '85%', width: '95%', backgroundColor: 'white', padding: 10, borderRadius: 10, paddingVertical: 15 }}>
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
                        {
                            signLoading ?
                                <ActivityIndicator size="large" color="#4B1AFF" /> :
                                <Signature
                                    ref={signatureRef}
                                    onOK={handleSignatureSaved}
                                    descriptionText=""
                                    clearText="Clear"
                                    confirmText="Save"
                                    color="#4B1AFF"
                                    webStyle={`
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
                        }
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <TouchableOpacity onPress={() => setSignPad(false)}>
                                <View style={[styles.buttonContainer, { marginVertical: 0 }]}>
                                    <Text style={[styles.button, { backgroundColor: '#fff', borderColor: '#8a8a8f', borderWidth: 1, height: 35, paddingTop: 5.2, width: 90, color: '#8a8a8f' }]} >Cancel</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => signatureRef.current.clearSignature()}>
                                <View style={[styles.buttonContainer, { marginVertical: 0 }]}>
                                    <Text style={[styles.button, { backgroundColor: '#fff', borderColor: '#20daff', borderWidth: 1, height: 35, paddingTop: 5.2, width: 90, color: '#8a8a8f' }]} >Clear</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSignatureSaved}>
                                <View style={[styles.buttonContainer, { marginVertical: 0 }]}>
                                    <Text style={[styles.button, { backgroundColor: '#20daff', height: 35, paddingTop: 5.2, width: 90, color: '#8a8a8f' }]} >Save</Text>
                                </View>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </View>
            </Modal>
            <Modal
                transparent={true}
                visible={selecteDate.show}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 10, width: '90%', padding: 10 }}>
                        <DatePicker
                            onDateChange={date => setSelecteDate({ ...selecteDate, date: date })}
                            options={{ width: 300, height: 400, borderColor: "#20daff" }}
                            mode="calendar"
                            selected={aiData.DELIVERY_DATE}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => { setSelecteDate({ show: false }) }}>
                                <View style={[styles.buttonContainer, { marginTop: 0 }]}>
                                    <Text style={[styles.button, { backgroundColor: '#8a8a8f', height: 35, paddingTop: 5.2, width: 80 }]} >Cancel</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pickDate}>
                                <View style={[styles.buttonContainer, { marginTop: 0 }]}>
                                    <Text style={[styles.button, { backgroundColor: '#20daff', height: 35, paddingTop: 5.2, width: 80, color: "#5a5a5a", fontWeight: 500 }]} >Ok</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Loader isLoading={isLoading} />
            {/* </>
            } */}
        </>
    );
};

const styles = StyleSheet.create({
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
        marginTop: 0,
        marginBottom: 20,
        flexDirection: 'col',
        alignItems: 'center',
        justifyContent: "center",
    },
    dropdown: {
        fontSize: 16,
        width: '46.2%',
        // backgroundColor: '#E6F4FE',
        backgroundColor: '#fbfbfb',
        fontFamily: "Poppins-Regular",
        height: 50,
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
    dropdownContainer: {
        // flex: 1,
        marginTop: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingHorizontal: 20,
        gap: 22,
        flexDirection: 'row',
    },
    deliver: {
        // fontSize: 16,
        // paddingLeft: 25,
        marginTop: 15,
        width: '99%',
        // backgroundColor: '#E6F4FE',
        backgroundColor: '#fbfbfb',
        // fontFamily: "Poppins-Regular",
        maxHeight: 100,
        minHeight: 50,
        // color: "#000",
        // paddingHorizontal: 15,
        // borderRadius: 10,
        // shadowColor: "#4B1AFF",
        // shadowOffset: {
        //     width: 0,
        //     height: 1
        // },
        // shadowOpacity: 0.5,
        // shadowRadius: 6,
        // elevation: 4,
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

export default AIFormModal;

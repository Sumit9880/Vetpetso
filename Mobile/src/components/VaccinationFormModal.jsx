import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Modal, ToastAndroid, PermissionsAndroid } from 'react-native';
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
import * as Yup from 'yup';
import Loader from './Loader';

const VaccinationFormModal = () => {
    const route = useRoute();
    const { item } = route.params
    let signatureRef = useRef(null);
    const user = useSelector(state => state.user.userInfo)
    const [vaccinationData, setVaccinationData] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const [validation, setValidation] = useState({})

    useEffect(() => {
        setIsLoading(true)
        setVaccinationData({ ...item });
        getDropDownData();
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

    let talukaData = taluka
    if (vaccinationData.DISTRICT !== null && vaccinationData.DISTRICT !== 0 && vaccinationData.DISTRICT !== undefined) {
        talukaData = taluka.filter(item => item.DISTRICT_ID == vaccinationData.DISTRICT)
    }

    let breed = animalBreed
    if (vaccinationData.ANIMAL_TYPE !== null && vaccinationData.ANIMAL_TYPE !== 0 && vaccinationData.ANIMAL_TYPE !== undefined) {
        breed = animalBreed.filter(item => item.ANIMAL_TYPE_ID == vaccinationData.ANIMAL_TYPE)
    }

    const getDropDownData = async () => {
        try {
            const resDistrict = await apiPost("api/district/get", { filter: ` AND STATUS = 1` });
            const resTaluka = await apiPost("api/taluka/get", { filter: ` AND STATUS = 1` });
            const resBreed = await apiPost("api/animalBreed/get", { filter: ` AND IS_ACTIVE = 1` });
            const resAnimalType = await apiPost("api/animalType/get", { filter: ` AND IS_ACTIVE = 1` });
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

    const validationSchema = Yup.object().shape({
        MOBILE_NUMBER: Yup.number().required('Mobile is required'),
        OWNER_NAME: Yup.string().required('Owner Name is required'),
        DISTRICT: Yup.number().required('District is required'),
        ANIMAL_IDENTITY_NO: Yup.string().required('Animal Identity is required'),
    });

    const validate = async () => {
        try {
            await validationSchema.validate(vaccinationData, { abortEarly: false });
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
                vaccinationData.MEMBER_ID = user.ID
                vaccinationData.CASE_TYPE = 3
                const res = await apiPost("api/patient/addVaccination", vaccinationData);
                if (res && res.code === 200) {
                    ToastAndroid.show(res.message, ToastAndroid.SHORT);
                    navigation.goBack()
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
    };

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            const res = await apiPut("api/vaccinationDetails/update", vaccinationData);
            if (res && res.code === 200) {
                ToastAndroid.show(res.message, ToastAndroid.SHORT);
                navigation.goBack()
            } else {
                ToastAndroid.show(res.message, ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error(error);
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        } finally {
            setIsLoading(false)
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
                        setIsLoading(true);
                        const apiResponse = await apiUpload('upload/patientImage', response.assets[0], vaccinationData.ID);
                        if (apiResponse.code === 200) {
                            ToastAndroid.show(apiResponse.message, ToastAndroid.SHORT);
                            const updatedUserData = { ...vaccinationData, PATIENT_IMAGE: apiResponse.name };
                            setVaccinationData(updatedUserData);
                        } else {
                            ToastAndroid.show(apiResponse.message, ToastAndroid.SHORT);
                        }
                    } catch (error) {
                        console.error('Error uploading image:', error);
                        ToastAndroid.show('Error uploading image', ToastAndroid.SHORT);
                    } finally {
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
                    ToastAndroid.show(apiResponse.message, ToastAndroid.SHORT);
                    setVaccinationData({ ...vaccinationData, OWNER_SIGN: apiResponse.name });
                    setSignPad(false);
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
        <>
            <Header name="Vaccination" />
            <View style={styles.mainContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: '500', fontSize: 17, color: 'black' }}>Case No: </Text>
                        <Text style={{ fontWeight: '500', fontSize: 17, color: 'red' }}>{vaccinationData.CASE_NO}</Text>
                    </View>
                    <Text style={{ fontWeight: '500', fontSize: 17, color: 'black' }}>Date: {vaccinationData.REGISTRATION_DATE ? new Date(vaccinationData.REGISTRATION_DATE).toLocaleDateString() : new Date().toLocaleDateString()}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: '100%', paddingLeft: 10 }}>
                        <Text style={styles.heading}>Animal Identity : </Text>
                    </View>
                    <View style={styles.container}>
                        <InputBox
                            label={{ visible: vaccinationData.ANIMAL_IDENTITY_NO ? true : false, text: 'Animal Identity No' }}
                            value={vaccinationData.ANIMAL_IDENTITY_NO}
                            validation={validation.ANIMAL_IDENTITY_NO}
                            onChangeText={e => setVaccinationData({ ...vaccinationData, ANIMAL_IDENTITY_NO: e })}
                            options={{ isDisable: vaccinationData.ID ? false : true }}
                        />
                        <InputBox
                            label={{ visible: vaccinationData.OWNER_NAME ? true : false, text: 'Owner Name' }}
                            value={vaccinationData.OWNER_NAME}
                            validation={validation.OWNER_NAME}
                            onChangeText={e => setVaccinationData({ ...vaccinationData, OWNER_NAME: e })}
                            options={{ isDisable: vaccinationData.ID ? false : true }}
                        />
                        <InputBox
                            label={{ visible: vaccinationData.ADHAR_NO ? true : false, text: 'Owner Adhar No' }}
                            value={vaccinationData.ADHAR_NO}
                            validation={validation.ADHAR_NO}
                            onChangeText={e => setVaccinationData({ ...vaccinationData, ADHAR_NO: e })}
                            options={{ isDisable: vaccinationData.ID ? false : true, inputType: 'numeric', maxlength: 12 }}
                        />
                        <InputBox
                            label={{ visible: vaccinationData.MOBILE_NUMBER ? true : false, text: 'Owner Mobile No' }}
                            value={vaccinationData.MOBILE_NUMBER}
                            validation={validation.MOBILE_NUMBER}
                            onChangeText={e => setVaccinationData({ ...vaccinationData, MOBILE_NUMBER: e })}
                            options={{ isDisable: vaccinationData.ID ? false : true, inputType: 'numeric', maxlength: 10 }}
                        />
                        <InputBox
                            label={{ visible: vaccinationData.ANIMAL_AGE ? true : false, text: 'Animal Age in Years' }}
                            value={vaccinationData.ANIMAL_AGE?.toString()}
                            validation={validation.ANIMAL_AGE}
                            onChangeText={e => setVaccinationData({ ...vaccinationData, ANIMAL_AGE: e })}
                            options={{ isDisable: vaccinationData.ID ? false : true, inputType: 'numeric', maxlength: 4 }}
                        />
                        <View style={styles.splitContainer}>
                            <DropdownComponent
                                label={{ visible: vaccinationData.ANIMAL_TYPE ? true : false, text: 'Animal Type' }}
                                value={vaccinationData.ANIMAL_TYPE}
                                onChangeText={e => setVaccinationData({ ...vaccinationData, ANIMAL_TYPE: e.ID })}
                                validation={validation.ANIMAL_TYPE}
                                options={{ width: '46.2%', isDisable: vaccinationData.ID ? true : false }}
                                data={animalType}
                            />
                            <DropdownComponent
                                label={{ visible: vaccinationData.BREED ? true : false, text: 'Breed' }}
                                value={vaccinationData.BREED}
                                onChangeText={e => setVaccinationData({ ...vaccinationData, BREED: e.ID })}
                                validation={validation.BREED}
                                options={{ width: '46.2%', isDisable: vaccinationData.ID ? true : false }}
                                data={breed}
                            />
                        </View>
                        <InputBox
                            label={{ visible: vaccinationData.ADDRESS ? true : false, text: 'Address' }}
                            value={vaccinationData.ADDRESS}
                            validation={validation.ADDRESS}
                            onChangeText={e => setVaccinationData({ ...vaccinationData, ADDRESS: e })}
                            options={{ isDisable: vaccinationData.ID ? false : true }}
                        />
                        <InputBox
                            label={{ visible: vaccinationData.AT_POST ? true : false, text: 'Village' }}
                            value={vaccinationData.AT_POST}
                            validation={validation.AT_POST}
                            onChangeText={e => setVaccinationData({ ...vaccinationData, AT_POST: e })}
                            options={{ isDisable: vaccinationData.ID ? false : true }}
                        />
                        <View style={styles.splitContainer}>
                            <DropdownComponent
                                label={{ visible: vaccinationData.DISTRICT ? true : false, text: 'District' }}
                                value={vaccinationData.DISTRICT}
                                onChangeText={e => setVaccinationData({ ...vaccinationData, DISTRICT: e.ID })}
                                validation={validation.DISTRICT}
                                options={{ width: '46.2%', isDisable: vaccinationData.ID ? true : false }}
                                data={district}
                            />
                            <DropdownComponent
                                label={{ visible: vaccinationData.TALUKA ? true : false, text: 'Taluka' }}
                                value={vaccinationData.TALUKA}
                                onChangeText={e => setVaccinationData({ ...vaccinationData, TALUKA: e.ID })}
                                validation={validation.TALUKA}
                                options={{ width: '46.2%', isDisable: vaccinationData.ID ? true : false }}
                                data={talukaData}
                            />
                        </View>
                        <View style={[styles.splitContainer, { marginTop: 15 }]}>
                            <View style={[styles.dropdown, { height: 165, justifyContent: 'center', alignItems: 'center', padding: 10, paddingBottom: 0 }]}>
                                <TouchableOpacity disabled={vaccinationData.ID ? true : false} onPress={openCamera}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                        {vaccinationData.PATIENT_IMAGE ?
                                            <Image source={{ uri: `${STATIC_URL}PatientImage/${vaccinationData.PATIENT_IMAGE}` }} style={{ width: 120, height: 120 }} /> :
                                            <Image source={require('../assets/camera.png')} style={{ width: 60, height: 60 }} />
                                        }
                                    </View>
                                    <Text style={[styles.uploadText, { width: 135, marginVertical: 10 }]}>Upload Photo : </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.dropdown, {}]}>
                                <TouchableOpacity disabled={vaccinationData.ID ? true : false} onPress={() => setSignPad(true)}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                        {vaccinationData.OWNER_SIGN ?
                                            <Image source={{ uri: `${STATIC_URL}OwnerSign/${vaccinationData.OWNER_SIGN}` }} style={{ width: 120, height: 120 }} /> :
                                            <Image source={require('../assets/signature1.png')} style={{ width: 60, height: 60 }} />
                                        }
                                    </View>
                                    <Text style={[styles.uploadText, { width: 135, marginVertical: 10 }]}>Upload Sign : </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: '100%', paddingTop: 20, paddingLeft: 10 }}>
                            <Text style={styles.heading}>Vaccination Details : </Text>
                        </View>
                        <InputBox
                            label={{ visible: vaccinationData.TYPE ? true : false, text: 'Vaccination Type' }}
                            value={vaccinationData.TYPE}
                            onChangeText={e => setVaccinationData({ ...vaccinationData, TYPE: e })}
                            validation={validation.TYPE}
                            options={{ isDisable: vaccinationData.ID ? false : true }}
                        />
                        <InputBox
                            label={{ visible: vaccinationData.NAME ? true : false, text: 'Vaccination Name' }}
                            value={vaccinationData.NAME}
                            onChangeText={e => setVaccinationData({ ...vaccinationData, NAME: e })}
                            validation={validation.NAME}
                            options={{ isDisable: vaccinationData.ID ? false : true }}
                        />
                        {
                            vaccinationData.ID ? (
                                <InputBox
                                    label={{ visible: vaccinationData.SIDE_EFFECTS ? true : false, text: 'Side Effects' }}
                                    value={vaccinationData.SIDE_EFFECTS}
                                    onChangeText={e => setVaccinationData({ ...vaccinationData, SIDE_EFFECTS: e })}
                                    validation={validation.SIDE_EFFECTS}
                                    options={{}}
                                />
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
                        vaccinationData.ID ? (
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
                    <View style={{ height: '90%', width: '95%', backgroundColor: 'white', padding: 10, borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: '100%', paddingBottom: 10, paddingRight: 10 }}>
                            <VectorIcon
                                name="closecircleo"
                                type="AntDesign"
                                size={30}
                                color={'red'}
                                onPress={() => setSignPad(false)}
                            />
                        </View>
                        <View style={{ width: '100%', marginBottom: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black', fontFamily: "Poppins-Regular", letterSpacing: 1 }}>लघुपशुवैद्यकीय औषधोपचार-लघुशल्यक्रियासाठी / कृत्रीम रेतन-गर्भधारणा तपासणीसाठी संमती पत्र.</Text>
                            <Text style={{ fontSize: 13, color: 'black', fontFamily: "Poppins-Regular", margin: 5 }}>
                                अ)  माझ्या मालकीचे रुग्ण गाय / बैल / रेडा / म्हैस / वासरू / कोंबडी / शेळी / मेंढी / कुत्रे / मांजर / पक्षी इत्यादीं, यांच्यावर आवश्यक ते लघु पशुवैद्यकीय औषधोपचार, रोग प्रतिबंधक उपाय योजना; तसेच, लघुशल्य क्रिया व कृत्रीम रेतन- गर्भनिदान करण्यास मी या संमती पत्राद्वारे स्वखुषीने संमती देत आहे.
                            </Text>
                            <Text style={{ fontSize: 13, color: 'black', fontFamily: "Poppins-Regular", margin: 5 }}>
                                ब)  मुंबई राज्य शासनाच्या नागरी पशुवैद्यकीय सेवा संचालनालय परिपत्रक क्रमांक ३६, दिनांक १८ डिसेंबर १९१४
                                (संदर्भ पान क्र. ५४३, मॅन्युअल ऑफ ऑफिस प्रोसिजर पशुसंवर्धन खाते १९६७) मधील तरतुदीनुसार रुग्णावर योग्य ती काळजी घेऊनसुद्धा रुग्णास इजा, अपाय किंवा रुग्ण दगावल्यास झालेल्या नुकसानीबद्दल संबंधीत लघु पशुवैद्यकीय व्यावसायीक किंवा त्यांचा कर्मचारी यास जबाबदार धरले जाणार नाही याची जाणीव मला स्पष्टपणे करून देण्यात आली आहे.
                            </Text>
                        </View>
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
                {/* </TouchableOpacity> */}
            </Modal>
            <Loader isLoading={isLoading} />
        </>
    );
};

const styles = StyleSheet.create({
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
})

export default VaccinationFormModal;

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

const ProfestionalInfoModal = ({ showModal, setModal }) => {

    const user = useSelector(state => state.user.userInfo)
    const [userData, setUserData] = useState({ ...user })
    const [preview, setPreview] = useState({
        isVisible: false,
        uri: '',
        api: '',
        key: ''
    })
    const dispatch = useDispatch();

    const [district, setDistrict] = useState([]);
    const [taluka, setTaluka] = useState([]);

    let workTluka = taluka
    if (userData.WORKING_DISTRICT !== null && userData.WORKING_DISTRICT !== 0 && userData.WORKING_DISTRICT !== undefined) {
        workTluka = taluka.filter(item => item.DISTRICT_ID == userData.WORKING_DISTRICT)
    }
    const [validation, setValidation] = useState({});
    const validationSchema = Yup.object().shape({
        WORK_MOBILE_NUMBER: Yup.string().required('Phone is required'),
        WORKING_DISTRICT: Yup.number().required('District is required'),
        WORKING_TALUKA: Yup.number().required('Taluka is required'), 
        WORKING_CITY_PINCODE: Yup.number().required('Pincode is required'),   
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
            const resDistrict = await apiPost("api/district/get", {});
            const resTaluka = await apiPost("api/taluka/get", {});
            setTaluka(resTaluka.data)
            setDistrict(resDistrict.data)
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
                    setValidation({})
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
            <Header name="Professional Information" />
            <View style={styles.mainContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <InputBox
                            label={{ visible: userData.WORK_MOBILE_NUMBER ? true : false, text: 'Work Mobile No' }}
                            value={userData.WORK_MOBILE_NUMBER}
                            validation={validation.WORK_MOBILE_NUMBER}
                            onChangeText={e => setUserData({ ...userData, WORK_MOBILE_NUMBER: e })}
                            options={{ maxLength: 10, keyboardType: 'numeric' }}
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
                        <View style={styles.upload}>
                            <Text style={styles.uploadText}>Upload Sign : </Text>
                            <View style={{ paddingRight: 20 }}>
                                <VectorIcon
                                    name="eye"
                                    type="Feather"
                                    size={24}
                                    color={'#1E90FF'}
                                    onPress={() => { handleModelOpen('MemberSign/' + userData.MEMBER_SIGN, 'upload/memberSign', 'MEMBER_SIGN') }}
                                />
                            </View>
                        </View>
                        {/* <InputBox
                            label={{ visible: userData.PASSWORD ? true : false, text: 'Password' }}
                            value={userData.PASSWORD}
                            validation={{ visible: false, text: 'Please Enter Password' }}
                            onChangeText={e => setUserData({ ...userData, PASSWORD: e })}
                            options={{}}
                        /> */}
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
    },
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
        paddingBottom: 20,
        flexDirection: 'col',
        alignItems: 'center',
        justifyContent: "center",
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


export default ProfestionalInfoModal;

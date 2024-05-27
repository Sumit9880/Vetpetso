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
import DatePick from './DatePick';
import * as Yup from 'yup';
import Loader from './Loader';

const PersonalInfoModal = ({ showModal, setModal }) => {

    const user = useSelector(state => state.user.userInfo)
    const [userData, setUserData] = useState({})
    const [preview, setPreview] = useState({
        isVisible: false,
        uri: '',
        api: '',
        key: ''
    })
    const [validation, setValidation] = useState({});
    const [isLoading, setIsLoading] = useState(false);
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

    const dispatch = useDispatch();

    const [district, setDistrict] = useState([]);
    const [taluka, setTaluka] = useState([]);
    const [cast, setCast] = useState([]);

    let talukaData = taluka
    if (userData.DISTRICT !== null && userData.DISTRICT !== 0 && userData.DISTRICT !== undefined) {
        talukaData = taluka.filter(item => item.DISTRICT_ID == userData.DISTRICT)
    }

    const getDropDownData = async () => {
        try {
            const resDistrict = await apiPost("api/district/get", { filter: ` AND STATUS = 1` });
            const resTaluka = await apiPost("api/taluka/get", { filter: ` AND STATUS = 1` });
            const resCast = await apiPost("api/cast/get", { filter: ` AND STATUS = 1` });
            setTaluka(resTaluka.data)
            setDistrict(resDistrict.data)
            setCast(resCast.data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getDropDownData();
        setUserData({ ...user })
    }, []);

    const handleUpdate = async () => {
        let errors = await validate();
        if (!errors) {
            setIsLoading(true);
            try {
                const response = await apiPut('api/member/update', userData);
                if (response.code === 200) {
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                    dispatch(setUser(userData));
                    setModal();
                    setValidation({});
                } else {
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                }
            } catch (error) {
                console.error(error);
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
            } finally {
                setIsLoading(false);
            }
        } else {
            ToastAndroid.show('Please fill all required fields', ToastAndroid.SHORT);
        }
    };

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
            setIsLoading(true)
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
        } finally {
            setIsLoading(false)
        }
    };

    return (

        <Modal style={styles.container} visible={showModal}>
            <Header name="Personal Information" />
            <View style={styles.mainContainer}>
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
                            options={{ isDisable: false }}
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
                            options={{}}
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
                                <VectorIcon
                                    name="eye"
                                    type="Feather"
                                    size={24}
                                    color={'#1E90FF'}
                                    onPress={() => { handleModelOpen('ProfilePhoto/' + userData.PROFILE_PHOTO, 'upload/profilePhoto', 'PROFILE_PHOTO') }}
                                />
                            </View>
                        </View>
                        <View style={styles.upload}>
                            <Text style={styles.uploadText}>Adhar Card Image : </Text>
                            <View style={{ paddingRight: 20 }}>
                                <VectorIcon
                                    name="eye"
                                    type="Feather"
                                    size={24}
                                    color={'#1E90FF'}
                                    onPress={() => { handleModelOpen('AdharCard/' + userData.ADHAR_CARD, 'upload/adharCard', 'ADHAR_CARD') }}
                                />
                            </View>
                        </View>
                        <View style={styles.upload}>
                            <Text style={styles.uploadText}>Pan Card Image : </Text>
                            <View style={{ paddingRight: 20 }}>
                                <VectorIcon
                                    name="eye"
                                    type="Feather"
                                    size={24}
                                    color={'#1E90FF'}
                                    onPress={() => { handleModelOpen('PanCard/' + userData.PAN_CARD, 'upload/panCard', 'PAN_CARD') }}
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
            <Loader isLoading={isLoading} />
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

export default PersonalInfoModal;

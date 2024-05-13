import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setLogin } from '../reduxStore/userSlice';
import { apiPost } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OtpVerification = () => {

    const [mobliNo, setMobliNo] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState('');

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const sendOtp = async () => {
        try {

            if (!mobliNo) {
                ToastAndroid.show('Please enter mobile number', ToastAndroid.SHORT);
            } else {
                if (mobliNo.length < 10) {
                    ToastAndroid.show('Please enter Correct mobile number', ToastAndroid.SHORT);
                } else {
                    const res = await apiPost("member/sendRegistrationOtp", {
                        MOBILE_NUMBER: mobliNo,
                    });
                    if (res.code === 200) {
                        setIsOtpSent(true);
                        ToastAndroid.show(res.message, ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show(res.message, ToastAndroid.SHORT);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const Verify = async () => {
        try {
            if (!otp) {
                ToastAndroid.show('Please enter otp', ToastAndroid.SHORT);
            }
            const res = await apiPost("member/verifyRegistrationOtp", {
                MOBILE_NUMBER: mobliNo,
                OTP: otp,
            });
            if (res.code === 200) {
                ToastAndroid.show(res.message, ToastAndroid.SHORT);
                dispatch(setLogin({ MOBILE_NUMBER: mobliNo, STEP_NO: 1, IS_REGISTER: true }));
                await AsyncStorage.setItem("LOGININFO", `{"MOBILE_NUMBER":"${mobliNo}","STEP_NO":1,"IS_REGISTER":true}`);
                navigation.navigate('RegistrationScreen');
            } else {
                ToastAndroid.show(res.message, ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error(error);
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        }
    };

    return (
        <View style={styles.mainContainer}>
            {
                !isOtpSent ? (
                    <>
                        <View style={styles.container}>
                            <TextInput
                                style={styles.deliver}
                                placeholder='Mobile No'
                                placeholderTextColor={"#5a5a5a"}
                                keyboardType='numeric'
                                maxLength={10}
                                onChangeText={setMobliNo}
                                value={mobliNo}
                            />
                        </View>
                        <TouchableOpacity onPress={() => sendOtp()}>
                            <View style={styles.container}>
                                <Text style={styles.login} >Send OTP</Text>
                            </View>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <View style={styles.container}>
                            <TextInput
                                style={styles.deliver}
                                placeholder='OTP'
                                keyboardType='numeric'
                                maxLength={6}
                                placeholderTextColor={"#5a5a5a"}
                                onChangeText={setOtp}
                                value={otp}
                            />
                        </View>
                        <TouchableOpacity onPress={() => Verify()}>
                            <View style={styles.container}>
                                <Text style={styles.login} >Verify OTP</Text>
                            </View>
                        </TouchableOpacity>
                    </>
                )
            }
            <View style={styles.regcontainer} >
                <Text style={{ color: "#5a5a5a", }} >Already have an account ? </Text>
                <Text style={styles.register} onPress={() => navigation.navigate('Login')}>LogIn</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        height: "100%",
        backgroundColor: "#E6F4FE",
        justifyContent: "center",
        alignItems: "center"
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
    name: {
        fontSize: 30,
        fontFamily: "Poppins-Bold",
        // color: "#0EC2DB",
        color: "#6F00B2",
        marginBottom: 20,
        letterSpacing: 1.5
    },
    subname: {
        fontSize: 22,
        fontFamily: "Poppins-Regular",
        color: "#0EC2DB",
        letterSpacing: 1.9,
        marginBottom: 20
    },
    container: {
        padding: 1,
        margin: 5,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",

    },
    deliver: {
        fontSize: 17,
        paddingLeft: 25,
        width: '85%',
        backgroundColor: '#fbfbfb',
        // backgroundColor: '#E6F4FE',
        // backgroundColor: '#D6DBDF',
        fontFamily: "Poppins-Regular",
        height: 50,
        color: "#000",
        paddingHorizontal: 6,
        borderRadius: 10,
        shadowColor: "#4B1AFF",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },

    login: {
        fontSize: 18,
        paddingLeft: 5,
        marginTop: 8,
        paddingTop: 12,
        width: '62%',
        // backgroundColor: '#62A4FB',
        // backgroundColor: '#ff0c6c',
        backgroundColor: '#4B1AFF',
        fontFamily: "Poppins-Medium",
        height: 50,
        color: "#fff",
        paddingHorizontal: 6,
        borderRadius: 20,
        textAlign: "center",
        alignContent: "center",
    },
    register: {
        alignItems: 'flex-end',
        textAlign: 'right',
        color: '#62A4FB',
        // fontStyle: 'italic',
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        // textDecorationLine: 'underline',
    },
    regcontainer: {
        marginTop: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    }
});

export default OtpVerification;

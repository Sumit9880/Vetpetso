import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiPost } from '../utils/api';
import VectorIcon from '../utils/VectorIcon';

const ForgotPass = () => {

    const [mobliNo, setMobliNo] = useState('');
    const [userData, setUserData] = useState({});
    const [stepNo, setStepNo] = useState(1);
    const [otp, setOtp] = useState('');
    const [matched, setMatched] = useState(false);
    console.log("userData", userData);

    const navigation = useNavigation();

    const sendOtp = async () => {
        try {

            if (!mobliNo) {
                ToastAndroid.show('Please enter mobile number', ToastAndroid.SHORT);
            } else {
                if (mobliNo.length < 10) {
                    ToastAndroid.show('Please enter Correct mobile number', ToastAndroid.SHORT);
                } else {
                    const res = await apiPost("member/sendForgotOtp", {
                        MOBILE_NUMBER: mobliNo,
                    });
                    if (res.code === 200) {
                        setStepNo(2);
                        setUserData({ ...userData, ID: res.ID });
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
            } else {
                const res = await apiPost("member/verifyForgotOtp", {
                    MOBILE_NUMBER: mobliNo,
                    OTP: otp,
                });
                if (res.code === 200) {
                    setStepNo(3);
                    ToastAndroid.show(res.message, ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show(res.message, ToastAndroid.SHORT);
                }
            }
        } catch (error) {
            console.error(error);
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        }
    };

    const submit = async () => {
        try {
            if (userData.NEW_PASSWORD != userData.PASSWORD) {
                setMatched(true);
                ToastAndroid.show('Password not matched', ToastAndroid.SHORT);
            } else {
                const res = await apiPost("member/changePassword", userData);
                if (res.code === 200) {
                    setStepNo(4);
                    ToastAndroid.show(res.message, ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show(res.message, ToastAndroid.SHORT);
                }
            }
        } catch (error) {
            console.error(error);
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        }
    };

    const back = () => {
        if (stepNo > 1) {
            setStepNo(prev => prev - 1);
        }
    };

    return (
        <>
            {
                stepNo != 4 ? (
                    <View style={styles.header}>
                        <VectorIcon
                            name="arrow-back"
                            type="Ionicons"
                            size={24}
                            color={'#5a5a5a'}
                            onPress={back}
                        />

                        <Text style={styles.headerText}>Forgot Password</Text>
                    </View>
                ) : null
            }
            <View style={styles.mainContainer}>
                {/* {
                    stepNo != 3 ? (
                        <Image
                            style={styles.Logo}
                            source={require('../assets/vetpetso.png')}
                        />
                    ) :
                        <Text style={{ fontFamily: 'Poppins', color: '#4B1AFF', fontSize: 22, marginBottom: 25 }} >Change Password</Text>
                } */}
                {
                    stepNo == 1 ? (
                        <>
                            <View style={styles.container}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', textAlign: 'left', color: '#5a5a5a', fontWeight: 'bold', fontSize: 17, marginBottom: 15, width: '80%' }} >Enter Mobile Number</Text>
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
                                <View style={styles.button}>
                                    <Text style={styles.login} >Send OTP</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    ) : stepNo == 2 ? (
                        <>
                            <View style={styles.container}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', textAlign: 'left', color: '#5a5a5a', fontWeight: 'bold', fontSize: 17, marginBottom: 15, width: '80%' }} >Enter OTP</Text>
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
                                <View style={styles.button}>
                                    <Text style={styles.login} >Verify OTP</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    ) : stepNo == 3 ? (
                        <>
                            <View style={styles.container}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', textAlign: 'left', color: '#5a5a5a', fontWeight: 'bold', fontSize: 17, marginBottom: 15, width: '80%' }} >Enter New Password</Text>
                                <TextInput
                                    style={styles.deliver}
                                    placeholder='New Password'
                                    placeholderTextColor={"#5a5a5a"}
                                    onChangeText={e => setUserData({ ...userData, NEW_PASSWORD: e })}
                                    value={userData?.NEW_PASSWORD}
                                    secureTextEntry
                                />
                                <Text style={{ fontFamily: 'Poppins-SemiBold', textAlign: 'left', color: '#5a5a5a', fontWeight: 'bold', fontSize: 17, marginVertical: 15, width: '80%' }} >Confirm Password</Text>
                                <TextInput
                                    style={styles.deliver}
                                    placeholder='Confirm Password'
                                    placeholderTextColor={"#5a5a5a"}
                                    onChangeText={e => setUserData({ ...userData, PASSWORD: e })}
                                    value={userData?.PASSWORD}
                                    secureTextEntry
                                />
                                {matched && <Text style={styles.validation}>Password does not match</Text>}
                            </View>
                            <TouchableOpacity onPress={() => submit()}>
                                <View style={styles.button}>
                                    <Text style={styles.login} >Submit</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={{ textAlign: 'center', color: '#5a5a5a', fontSize: 18, fontWeight: 'bold', marginVertical: 40 }}>Password Reset Successfully</Text>
                        </>
                    )
                }
                {
                    stepNo != 4 ? (
                        <View style={styles.regcontainer} >
                            <Text style={{ color: "#5a5a5a", }} >Back to  </Text>
                            <Text style={styles.register} onPress={() => navigation.navigate('Login')}>LogIn</Text>
                        </View>
                    ) :
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <View style={styles.button}>
                                <Text style={styles.login} >Login</Text>
                            </View>
                        </TouchableOpacity>
                }
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    validation: {
        marginTop: 5,
        color: 'red',
        fontSize: 14
    },
    Logo: {
        width: 200,
        height: 200,
        // margin: 10,
        // marginBottom: 30,
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
    button: {
        padding: 1,
        margin: 5,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 50,
        paddingHorizontal: 20,
        gap: 10,
        backgroundColor: "#E6F4FE",
        justifyContent: "flex-start",
    },
    headerText: {
        color: "#5a5a5a",
        fontSize: 20,
        width: "80%",
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Poppins-Bold"
    },
    mainContainer: {
        flex: 1,
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
        alignItems: 'center',
        justifyContent: "center",
        width: '100%',
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
        fontWeight: '600',
        fontSize: 15,
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

export default ForgotPass;

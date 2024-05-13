import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setSplashscreen } from '../reduxStore/userSlice';
import { apiPost } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const [userCredentials, setUserCredentials] = useState({});
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const Login = async () => {
        try {
            if (!userCredentials.username || !userCredentials.password) {
                ToastAndroid.show('Please enter username and password', ToastAndroid.SHORT);
            } else {
                const res = await apiPost("member/login", userCredentials);
                if (res.code === 200) {
                    await AsyncStorage.setItem("LOGININFO", JSON.stringify(res.data[0]))
                    dispatch(setSplashscreen(true))
                } else {
                    ToastAndroid.show('Invalid Username or Password', ToastAndroid.SHORT);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    const Register = () => {
        navigation.navigate('OtpVerification');
    };

    const forgotPassword = () => {
        navigation.navigate('ForgotPass');
    };

    return (
        <View style={styles.mainContainer}>
            <Image
                style={styles.Logo}
                source={require('../assets/vetpetso.png')}
            />
            {/* <Text style={styles.name}>VetPetSo</Text> */}
            {/* <Text style={styles.subname}>A Digital Ngo</Text> */}

            <View style={styles.container}>
                <TextInput
                    style={styles.deliver}
                    placeholder='Email ID or Mobile No'
                    placeholderTextColor={"#5a5a5a"}
                    onChangeText={e => setUserCredentials({ ...userCredentials, username: e })}
                    value={userCredentials.username}
                />
            </View>
            <View style={styles.container}>
                <TextInput
                    style={styles.deliver}
                    placeholder='Password'
                    placeholderTextColor={"#5a5a5a"}
                    onChangeText={e => setUserCredentials({ ...userCredentials, password: e })}
                    value={userCredentials.password}
                    secureTextEntry
                />
            </View>
            <View style={{ alignItems: 'flex-end', marginRight: 30, width: '85%' }} onPress={Register}>
                <Text style={styles.register} onPress={forgotPassword} >Forgot Password ?</Text>
            </View>
            <TouchableOpacity onPress={() => Login()}>
                <View style={styles.container}>
                    <Text style={styles.login} >Login</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.regcontainer} >
                <Text style={{ color: "#5a5a5a", }} >Don't have an account ? </Text>
                <Text style={styles.register} onPress={Register}>Register Here</Text>
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
        marginTop: "20%",
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
        fontWeight: '600',
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

export default LoginScreen;

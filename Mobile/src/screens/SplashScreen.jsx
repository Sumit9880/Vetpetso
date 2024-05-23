import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setLogin, setSplashscreen, setUser } from '../reduxStore/userSlice';
import { apiPost } from '../utils/api';

const SplashScreen = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        CheckUser()
    }, [])

    const CheckUser = async () => {
        const user = await AsyncStorage.getItem('LOGININFO');
        const loginInfo = JSON.parse(user)

        dispatch(setLogin(loginInfo))

        if (loginInfo?.isLoggedIn === true && loginInfo.UserId > 0) {
            const res = await apiPost("api/member/get", {
                filter: `AND ID = ${loginInfo.UserId}`
            });
            if (res.code === 200) {
                dispatch(setUser(res.data[0]))
            } else {
                dispatch(setLogin({}))
            }
        }

        dispatch(setSplashscreen(false))
    }
    
    return (<>
        <View style={styles.mainContainer}>
            <Image
                style={styles.Logo}
                source={require('../assets/vetpetso.png')}
            />
            <ActivityIndicator size="small" color="#62A4FB" style={styles.name} />
            <Text style={styles.name1}>© Sumit Ghatage</Text>
        </View>
    </>
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
        marginBottom: 25,
        width: 200,
        height: 200,
        margin: 10,
    },
    name: {
        fontSize: 5,
        fontFamily: "Poppins-Bold",
        color: "#0EC2DB",
        top: 230,
        letterSpacing: 1
    },
    name1: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "#62A4FB",
        top: 240,
        letterSpacing: 1
    },

});

export default SplashScreen;

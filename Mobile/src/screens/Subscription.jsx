import { StyleSheet, Text, BackHandler, View, Image, FlatList, TouchableOpacity, Modal, ScrollView, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setStatusBar, setUser } from '../reduxStore/userSlice';
import VectorIcon from '../utils/VectorIcon';
import { apiPost, STATIC_URL } from '../utils/api';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../components/Loader';
import PhonePePaymentSDK from 'react-native-phonepe-pg'
import Base64 from 'react-native-base64';
import sha256 from 'sha256';

const Subscription = () => {

    const user = useSelector(state => state.user.userInfo)
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [plans, setPlans] = useState([])
    const [selectedPlan, setSelectedPlan] = useState({})
    let description = selectedPlan?.DESCRIPTION?.split(';') || [];
    const [agreed, setAgreed] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        setIsLoading(true);
        try {
            const resPlanes = await apiPost("api/plan/get", { filter: " AND IS_ACTIVE = 1 " });
            setPlans(resPlanes.data);
            if (user.PLAN_DETAILS?.PLAN_ID) {
                let plane = resPlanes.data.find(x => x.ID == user.PLAN_DETAILS.PLAN_ID)
                if (plane) {
                    setSelectedPlan(plane);
                }
            } else {
                setSelectedPlan(resPlanes.data[0]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleBackButtonPress;
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPress);
        };
    }, []);

    const handleBackButtonPress = () => {
        navigation.goBack();
        dispatch(setStatusBar({ backgroundColor: "#4B1AFF", barStyle: "light-content" }))
        return true;
    };


    const submit = async () => {
        const parameters = {
            environment: "SANDBOX",
            merchantId: "PGTESTPAYUAT86",
            appId: null,
            enableLogging: true,
        }
        try {
            PhonePePaymentSDK.init(parameters.environment, parameters.merchantId, parameters.appId, parameters.enableLogging).then(resp => {
                const saltKey = "96434309-7796-489d-8924-ab56988a6076";
                const saltIndex = 1;

                const request = {
                    merchantId: parameters.merchantId,
                    merchantTransactionId: "T" + Date.now(),
                    merchantUserId: "MUID123",
                    amount: 100,
                    callbackUrl: "",
                    mobileNumber: user.MOBILE_NUMBER,
                    paymentInstrument: {
                        type: "PAY_PAGE"
                    }
                };

                const payload = Base64.encode(JSON.stringify(request));
                const checksum = sha256(payload + "/pg/v1/pay" + saltKey) + "###" + saltIndex;

                PhonePePaymentSDK.startTransaction(
                    payload,
                    checksum,
                    null,
                    null
                ).then(res => {
                    console.log("res", res);
                }).catch(error => {
                    console.log(error);
                });

            }).catch(error => {
                console.log(error);
            });
        } catch (error) {
            console.error(error);
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        }
    };

    // const submit = async () => {
    //     setIsLoading(true);
    //     try {
    //         const response = await apiPost('api/memberPlanMapping/mapPlan', { PLAN_ID: selectedPlan.ID, MEMBER_ID: user.ID, TYPE: selectedPlan.TYPE });
    //         if (response.code === 200) {
    //             ToastAndroid.show(response.message, ToastAndroid.SHORT);
    //             const userData = { ...user, PLAN_DETAILS: response.data };
    //             dispatch(setUser(userData));
    //             setModalVisible(false)
    //         } else {
    //             ToastAndroid.show(response.message, ToastAndroid.SHORT);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         ToastAndroid.show(error.message, ToastAndroid.SHORT);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const Plan = ({ item }) => {
        return (
            <TouchableOpacity style={{ margin: 5 }} onPress={() => setSelectedPlan(item)}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: `${user.PLAN_DETAILS?.PLAN_ID === item.ID ? '#4B1AFF' : '#E6F4FE'}` }}>Current Plan</Text>
                <View style={{ borderColor: `${selectedPlan.ID === item.ID ? '#6b71ff' : '#E6F4FE'}`, borderWidth: 2, borderRadius: 10 }}>
                    <LinearGradient
                        colors={[`${item.COLOR_1}`, `${item.COLOR_2}`, `${item.COLOR_3}`]}
                        start={{ x: 0.1, y: 0.7 }}
                        end={{ x: 0.3, y: 0 }}
                        style={[styles.card, { shadowColor: `${selectedPlan.ID === item.ID ? '#4B1AFF' : item.COLOR_3}` }]}
                    >
                        <View style={{ width: 80, height: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 40, marginBottom: 5 }}>
                            <Image source={{ uri: STATIC_URL + 'PlanImage/' + item.IMAGE }} style={{ width: 60, height: 60 }} />
                        </View>
                        <Text style={{ fontSize: 20, color: "#000", fontFamily: "Poppins-Bold", fontWeight: "bold" }}>{item.NAME}</Text>
                        <Text style={{ fontSize: 16, color: "#000", fontFamily: "Poppins-Regular" }}>Duration : {item.TYPE == "Y" ? "Yearly" : item.TYPE == "M" ? "Monthly" : item.TYPE == "LT" ? "Lifetime" : "Weekly"}</Text>
                        <Text style={{ fontSize: 16, color: "#000", fontFamily: "Poppins-Regular" }}>₹ {item.AMOUNT.toFixed(2)}</Text>
                    </LinearGradient>
                </View>
            </TouchableOpacity>
        );
    };

    const DescriptionItem = ({ text }) => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginVertical: 5 }}>
                <VectorIcon name="checkcircleo" type="AntDesign" size={15} color="#000" style={{ marginHorizontal: 5 }} />
                <Text style={{ fontSize: 12, color: '#000', fontWeight: '500' }}>{text}</Text>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#E6F4FE" }}>
            <View style={styles.header}>
                <VectorIcon
                    name="arrow-back"
                    type="Ionicons"
                    size={24}
                    color={'#5a5a5a'}
                    onPress={handleBackButtonPress}
                />
                <Text style={styles.headerText}>Subscription Plans</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1 }}>
                    <LinearGradient
                        colors={[`${selectedPlan?.COLOR_1 || '#fff'}`, `${selectedPlan?.COLOR_2 || '#fff'}`, `${selectedPlan?.COLOR_3 || '#fff'}`]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 0.5, y: 0 }}
                        style={[styles.details, { shadowColor: `${selectedPlan?.COLOR_3 || '#fff'}` }]}
                    >
                        <Text style={{ fontSize: 20, color: "#000", fontFamily: "Poppins-Bold", fontWeight: "bold" }}>Plan Details </Text>
                        <View style={{ justifyContent: 'flex-start', margin: 15, }}>
                            {description.map((item, index) => (
                                <DescriptionItem key={index} text={item} />
                            ))}
                        </View>
                    </LinearGradient>
                    <View style={{ marginHorizontal: 10 }}>
                        <FlatList
                            data={plans}
                            renderItem={({ item }) => <Plan item={item} />}
                            keyExtractor={item => item.ID}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 40 }}>
                        <View style={{ justifyContent: 'center', gap: 15, alignItems: 'center', flexDirection: 'row', margin: 10 }}>
                            {
                                agreed ?
                                    <VectorIcon
                                        name="check-square"
                                        type="Feather"
                                        onPress={() => setAgreed(!agreed)}
                                        size={24}
                                        color={'#4B1AFF'}
                                    /> :
                                    <VectorIcon
                                        name="square"
                                        type="Feather"
                                        size={24}
                                        onPress={() => setAgreed(!agreed)}
                                        color={'#4B1AFF'}
                                    />
                            }
                            <Text style={{ fontSize: 16, color: "#000", fontFamily: "Poppins-Regular" }}>I agree with the terms and conditions</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: agreed ? "#4B1AFF" : "#8f8f8f" }]}
                            disabled={!agreed}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={styles.buttonText}>Continue </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 10, width: '94%' }}>
                        <View style={{ alignItems: 'left', padding: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontSize: 20, color: "#000", fontFamily: "Poppins-Bold", fontWeight: "bold" }}>Review Your Plan</Text>
                                <VectorIcon
                                    name="closecircleo"
                                    type="AntDesign"
                                    size={26}
                                    onPress={() => setModalVisible(false)}
                                    color={'red'}
                                />
                            </View>
                            <View style={{ justifyContent: 'flex-start', margin: 15, width: '80%' }}>
                                {description.map((item, index) => (
                                    <DescriptionItem key={index} text={item} />
                                ))}
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 1 }}>
                                <Text style={{ fontSize: 13, fontWeight: 'bold', color: "#3400a8", fontFamily: "Poppins" }}>Starting</Text>
                                <Text style={{ fontSize: 13, fontWeight: 'bold', color: "#3400a8", fontFamily: "Poppins" }}>{new Date().toLocaleDateString()}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 1, borderBottomWidth: 1, borderBottomColor: "#8a8a8a", paddingBottom: 5 }}>
                                <Text style={{ fontSize: 13, fontWeight: 'bold', color: "#3400a8", fontFamily: "Poppins" }}>Vlidity</Text>
                                <Text style={{ fontSize: 13, fontWeight: 'bold', color: "#3400a8", fontFamily: "Poppins" }}>{selectedPlan.TYPE == "Y" ? "Yearly" : selectedPlan.TYPE == "M" ? "Monthly" : selectedPlan.TYPE == "LT" ? "Lifetime" : "Weekly"}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 1 }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: "#000", fontFamily: "Poppins" }}>Total Amount</Text>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: "#03B11D", fontFamily: "Poppins" }}>₹ {selectedPlan.AMOUNT?.toFixed(2)}</Text>
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={submit}
                            >
                                <Text style={styles.button1} >Pay Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Loader isLoading={isLoading} />
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: "#fff",
        fontFamily: "Poppins-Medium",
    },
    button1: {
        height: 45,
        width: 150,
        fontSize: 16,
        backgroundColor: '#4B1AFF',
        borderColor: '#4B1AFF',
        borderWidth: 1,
        color: '#fff',
        borderRadius: 20,
        paddingTop: 11,
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
    },
    button: {
        height: 50,
        backgroundColor: "#4B1AFF",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        width: '90%',
    },
    card: {
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        margin: 5,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        height: 200,
        width: 165,
    },
    details: {
        padding: 20,
        margin: 20,
        height: 300,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
        fontSize: 20,
        color: "#5a5a5a",
        fontFamily: "Poppins-Bold",
        fontWeight: "bold",
        marginLeft: 10,
    },
})

export default Subscription;

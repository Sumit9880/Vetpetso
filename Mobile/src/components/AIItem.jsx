import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, ToastAndroid } from 'react-native';
import { STATIC_URL, apiPut } from '../utils/api';
import { useNavigation } from '@react-navigation/native';
import VectorIcon from '../utils/VectorIcon';
import Loader from './Loader';

const AIItem = ({ item }) => {
    const navigation = useNavigation();
    const handlePress = (item) => {
        navigation.navigate('AIFormModal', { item });
    };

    const [remark, setRemark] = useState('')
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const closeCase = async () => {
        setIsLoading(true);
        try {
            const res = await apiPut("api/patient/update", { ...item, DISCHARGE_REMARK: remark });
            if (res && res.code === 200) {
                ToastAndroid.show(res.message, ToastAndroid.SHORT);
                setVisible(false);
                // navigation.goBack();
            } else {
                ToastAndroid.show('Failed to create Registration', ToastAndroid.SHORT);
                setVisible(false);
            }
        } catch (error) {
            console.error(error);
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handlePress(item)}>
                <View style={styles.itemCard}>
                    <View style={styles.image}>
                        <Image source={{ uri: `${STATIC_URL}AnimalType/${item.ANIMAL_TYPE_IMAGE}` }} style={{ width: 40, height: 40 }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', width: '55%' }} >
                                <Text style={{ color: '#4B1AFF', fontWeight: 'bold', width: 60 }}>Case No</Text>
                                <Text style={{ color: '#4B1AFF', fontWeight: 'bold' }}>: {item.CASE_NO}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', width: '45%' }}>
                                {/* <VectorIcon type="AntDesign" name="calendar" size={20} color="#4B1AFF" /> */}
                                <Text style={{ color: '#000', fontWeight: 'bold', width: 30 }}>Date</Text>
                                <Text style={{ color: '#000', fontWeight: 'bold' }}> : {new Date(item.REGISTRATION_DATE).toLocaleDateString()}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ gap: 2, width: '80%' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: '#000', fontWeight: '400', width: 60 }}>Owner</Text>
                                    <Text numberOfLines={1} style={{ color: '#e90089', fontWeight: '400', flexShrink: 1 }}>: {item.OWNER_NAME}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: '#000', fontWeight: '400', width: 60 }}>Mob No</Text>
                                    <Text style={{ color: '#000', fontWeight: '400' }}>: {item.MOBILE_NUMBER}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: '#000', fontWeight: '400', width: 60 }}>Tag No</Text>
                                    <Text style={{ color: '#000', fontWeight: '400' }}>: {item.ANIMAL_IDENTITY_NO}</Text>
                                </View>
                            </View>
                            <View style={{ width: '18%' }}>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => setVisible(true)}>
                                    <View style={styles.closeButton}>
                                        <Image source={require('../assets/document.png')} style={{ width: 35, height: 35 }} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity >
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
            >
                {/* <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => setVisible(false)}> */}
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 10, width: '94%' }}>
                            <View style={{ alignItems: 'left', paddingVertical: 10 }}>
                                <Text style={{ fontSize: 20, color: '#4B1AFF', fontWeight: '500' }}>Do you want to close this case ?</Text>
                            </View>
                            <View style={{ marginVertical: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 16, color: 'red', fontWeight: '500' }}>*</Text>
                                    <Text style={{ fontSize: 16, color: '#000', fontWeight: '500' }}> Closing Remark :</Text>
                                </View>
                                <TextInput
                                    style={styles.deliver}
                                    // placeholder='Type Remark Here'
                                    // placeholderTextColor={"gray"}
                                    multiline={true}
                                    numberOfLines={6}
                                    onChangeText={e => setRemark(e)}
                                    value={remark}
                                />
                            </View>
                            <View style={{ width: '100%', padding: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderColor: '#5a5a5a', borderWidth: 0.4, borderRadius: 10, marginTop: 5 }}>
                                <VectorIcon type="Ionicons" name="warning-outline" size={30} color="#ffc823" />
                                <Text style={{ fontSize: 12, color: '#5b5b5b', fontWeight: '500', width: '50%', textAlign: 'center' }}>Once you close this case, you cannot reopen it or edit it.</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <TouchableOpacity onPress={() => setVisible(false)}>
                                    <View style={styles.buttonContainer}>
                                        <Text style={[styles.button, { backgroundColor: '#fefefe', color: '#000' }]} >Cancel</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => closeCase()}>
                                    <View style={styles.buttonContainer}>
                                        <Text style={styles.button} >Submit</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                {/* </TouchableOpacity> */}
            </Modal>
            <Loader isLoading={isLoading} />
        </>
    )
}
const styles = StyleSheet.create({
    deliver: {
        borderWidth: 0.6,
        borderColor: '#4B1AFF',
        fontSize: 16,
        marginTop: 8,
        backgroundColor: '#fbfbfb',
        fontFamily: "Poppins-Regular",
        maxHeight: 150,
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
        height: 35,
        fontSize: 16,
        width: 90,
        // backgroundColor: '#ff0c6c',
        // borderColor: '#ff0c6c',
        backgroundColor: '#4B1AFF',
        borderColor: '#4B1AFF',
        borderWidth: 1,
        color: '#fff',
        borderRadius: 20,
        paddingTop: 6.5,
        // paddingBottom: 5,
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
    },
    closeButton: {
        height: 45,
        width: 45,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#4B1AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.70,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        backgroundColor: '#ffdbeb',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        // gap: 10,
        shadowColor: '#4B1AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: 10
    },
});

export default memo(AIItem);
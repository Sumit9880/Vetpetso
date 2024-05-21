import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import VectorIcon from '../utils/VectorIcon';
import { STATIC_URL } from '../utils/api';
import Pdf from 'react-native-pdf';

const NoticeCard = ({ data }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
    const [visible, setVisible] = React.useState(false);
    return (
        <>
            <TouchableOpacity activeOpacity={0.7} onPress={() => setVisible(true)}>
                <View style={styles.container}>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{data.TITLE}</Text>
                        <LinearGradient
                            colors={['#7c97f9', '#4B1AFF']}
                            // colors={['#FF0C6C', '#FF5E9F']}
                            start={{ x: 1, y: 1 }}
                            end={{ x: 0, y: 0 }}
                            style={styles.dateContainer}
                        >
                            <VectorIcon
                                name="calendar-outline"
                                type="Ionicons"
                                size={15}
                                color="white"
                            />
                            <Text style={styles.date}>{formatDate(data.DATE)}</Text>
                        </LinearGradient>
                        <Text style={styles.summary}>{data.SUMMARY}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 10, width: '95%', padding: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#4B1AFF' }}>{data.TITLE}</Text>
                            <VectorIcon
                                name="closecircleo"
                                type="AntDesign"
                                size={26}
                                color="black"
                                onPress={() => setVisible(false)}
                                style={{ alignSelf: 'flex-end' }}
                            />
                        </View>
                        <Pdf
                            source={{ uri: `${STATIC_URL}Notice/${data.URL}`, cache: true }}
                            trustAllCerts={false}
                            // onLoadComplete={(numberOfPages, filePath) => {
                            //     console.log(`Number of pages: ${numberOfPages}`);
                            // }}
                            // onPageChanged={(page, numberOfPages) => {
                            //     console.log(`Current page: ${page}`);
                            // }}
                            // onError={(error) => {
                            //     console.log(error);
                            // }}
                            // onPressLink={(uri) => {
                            //     console.log(`Link pressed: ${uri}`);
                            // }}
                            style={styles.pdf} />
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    pdf: {
        width: '100%',
        height: 500,
    },
    container: {
        width: 320,
        height: 200,
        backgroundColor: '#fff',
        margin: 8,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'grey',
    },
    dateContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        backgroundColor: '#E6F4FE',
        borderRadius: 999,
        paddingVertical: 6,
        paddingHorizontal: 16,
        marginTop: 8,
        marginHorizontal: 8,
    },
    textContainer: {
        flex: 1,
        padding: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
        color: '#5a5a5a',
    },
    summary: {
        color: '#5a5a5a',
        marginTop: 8,
        fontSize: 14,
    },
    date: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default NoticeCard;

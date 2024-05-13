import { View, StyleSheet, Alert } from 'react-native';

const InternetConCheck = () => {

    return (
        <View style={styles.mainContainer}>
            {
                Alert.alert("No Internet Connection", "Please Check Internet Connection")
            }
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#E6F4FE",
        justifyContent: "center",
        alignItems: "center"
    },
});

export default InternetConCheck;

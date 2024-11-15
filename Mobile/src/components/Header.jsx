import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import VectorIcon from '../utils/VectorIcon';
import { Colors } from '../theme/Colors';
import { useNavigation } from '@react-navigation/native';

const Header = ({ name }) => {
    const navigation = useNavigation();

    return (
        <View style={[styles.container, { backgroundColor: '#4B1AFF' }]}>
            <View style={styles.innerContainer}>
                {name == 'VetPetSo' ? (
                    null
                ) : (
                    <VectorIcon
                        name="arrow-back"
                        type="Ionicons"
                        size={24}
                        color={Colors.white}
                        onPress={() => navigation.goBack()}
                    />
                )
                }
                <Text style={styles.username}>{name}</Text>
            </View>
            {name == 'VetPetSo' ? (
                <VectorIcon
                    name="notifications"
                    type="Ionicons"
                    size={24}
                    color={Colors.white}
                    style={styles.iconStyle}
                />
            ) : (
                null
            )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#4B1AFF',
        padding: 15,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    username: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        marginLeft: 10,
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconStyle: {
        marginHorizontal: 25,
    },
});

export default Header;

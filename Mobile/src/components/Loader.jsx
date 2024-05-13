import { View, Modal, ActivityIndicator } from 'react-native'
import React from 'react'

const Loader = ({ isLoading }) => {
    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={isLoading}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 1, 0.2)' }}>
                <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 10, }}>
                    <ActivityIndicator size="large" color="#4B1AFF" />
                </View >
            </View>
        </Modal>
    )
}

export default Loader
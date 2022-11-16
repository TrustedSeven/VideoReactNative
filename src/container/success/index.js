import * as React from 'react'
import { View, Text } from 'react-native'
import styles from './styles';


const LogInScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.successContent}>Success Screen</Text>
        </View>
    )
}

export default LogInScreen;
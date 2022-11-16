import * as React from 'react'
import { Button, Text, TouchableOpacity, View } from 'react-native'
import styles from './styles';

const LogInScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Signup Screen</Text>
            <Button 
             title='Signup'
             onPress={()=> navigation.navigate('LogIn')}
              />
        </View>
    )
}

export default LogInScreen;
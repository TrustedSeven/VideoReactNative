import * as React from 'react'
import { Button, Text, TextInput, View } from 'react-native'
import { AuthContext } from '../../AuthProvider'
import styles from './styles'

const LogInScreen = ({ navigation }) => {
    const {login} = React.useContext(AuthContext);

    const [userName, setUserName] = React.useState('');
    const [pass, setPass] = React.useState('');

    return (
        <View style={styles.container}>
            <Text >Login Screen</Text>
            <View style={styles.authInput}>
                <Text style={styles.authLabel}>username:</Text>
                <TextInput
                    style={styles.textInput}
                    value={userName}
                    placeholder='username'
                    onChangeText={(v) => { setUserName(v) }}
                />
            </View>
            <View style={styles.authInput}>
                <Text style={styles.authLabel}>password:</Text>
                <TextInput
                    style={styles.textInput}
                    value={pass}
                    secureTextEntry={true}
                    placeholder='password'
                    onChangeText={(v) => { setPass(v) }}
                />
            </View>
            <Button
                title='Login'
                onPress={() => {
                    login(userName, pass);
                }}
            />
            <Button
                color={'red'}
                title='Signup'
                onPress={() => navigation.navigate('SignUp')}
            />
        </View>
    )
}

export default LogInScreen;
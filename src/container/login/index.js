import React, {useState, useContext} from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import DeviceInfo from 'react-native-device-info';
import base64 from 'react-native-base64'


import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import BackButton from '../../components/BackButton';
import {theme} from '../../core/theme';
import {emailValidator} from '../../helpers/emailValidator';
import {passwordValidator} from '../../helpers/passwordValidator';
import {AuthContext} from '../../AuthProvider';

export default function LogInScreen({navigation}) {
  const {login} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idcelular, setIdcelular] = useState('xxxxxx');
  const [idcel, setIdcel] = useState('');

  function decrypt(texto, clave) {
    var result = '';
    var string = base64.decode(texto);
    for (var i = 0; i < string.length; i++) {
      var char = string.substring(i, i + 1);
      var keychar = clave.substring(i % clave.length, i + 1);
      char = String.fromCharCode(char.charCodeAt(0) - keychar.charCodeAt(0));
      result += char;
    }
    return result;
  }

  const getdeviceId = () => {
    var uniqueId = DeviceInfo.getUniqueId();
    setIdcel(uniqueId);
    setIdcelular(idcel._z);
  };
  const onLoginPressed = () => {
    const emailError = emailValidator(email);
    const passwordError = passwordValidator(password);
    console.log(idcelular);
    if (email != '' && password != '') {
      login(email, password, idcelular);
      Toast.show({
        type: 'success',
        text1: 'Loading',
        text2: 'Por favor espere el servidor......',
      });
    }
    else{
      Toast.show({
        type: 'error',
        text1: 'Sorry',
        text2: 'Por favor inserte correo electrónico y contraseña',
      });
    }

    // if (emailError || passwordError) {
    //   setEmail({ ...email, error: emailError })
    //   setPassword({ ...password, error: passwordError })
    //   return
    // }
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Dashboard' }],
    // })
    //navigation.navigate('Success');
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome back.</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email}
        onChangeText={text => {
          setEmail(text);
          getdeviceId();
        }}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password}
        onChangeText={text => setPassword(text)}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}>
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.push('SignUp')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

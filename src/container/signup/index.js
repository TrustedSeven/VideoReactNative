import React, {useState, useContext, useRef} from 'react';
import {TouchableOpacity, StyleSheet, View, ScrollView} from 'react-native';
import {Text} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import PhoneInput from "react-native-phone-number-input";
import DeviceInfo from 'react-native-device-info';

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
  const {signup} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');
  const [id_celular, setId_celular] = useState('xxxxxxxx');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [pais, setPais] = useState('PE');
  const [celular, setCeluar] = useState('');
  const [idcel, setIdcel] = useState('');
  // const [countrycode, setCountrycode] = useState('+51');
  // const [formattedValue, setFormattedValue] = useState("");

  // const phoneInput = useRef<PhoneInput>(null);

  const getdeviceId = () => {
    var uniqueId = DeviceInfo.getUniqueId();
    setIdcel(uniqueId);
    setId_celular(idcel._z);
  };

  const onSignUpPressed = () => {
    const emailError = emailValidator(email);
    const passwordError = passwordValidator(password);
    const confirmpasswordError = passwordValidator(confirmpassword);
    

    if (password === confirmpassword && password != '') {
      signup(email, password, id_celular, nombre, apellido, pais, celular);
      console.log(id_celular);
      console.log('password match');
      Toast.show({
        type: 'success',
        text1: 'Loading',
        text2: "Por favor espere el servidor......",
      });
    } else {
      console.log('password does not match');
      Toast.show({
        type: 'error',
        text1: 'Sorry',
        text2: "Las contraseñas no coinciden",
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
    // navigation.navigate('LogIn');
  };

  return (
    <ScrollView>
      <Background>
        <BackButton goBack={navigation.goBack} />
        <Logo />
        <Header>Create Account</Header>
        <TextInput
          label="Email"
          returnKeyType="next"
          value={email}
          onChangeText={text => {setEmail(text);
            getdeviceId();
          }}
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
        <TextInput
          label="Confirm Password"
          returnKeyType="done"
          value={confirmpassword}
          onChangeText={text => setconfirmPassword(text)}
          error={!!confirmpassword.error}
          errorText={confirmpassword.error}
          secureTextEntry
        />
        <TextInput
          label="Nombre"
          returnKeyType="next"
          value={nombre}
          onChangeText={text => setNombre(text)}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />
        <TextInput
          label="Apellido"
          returnKeyType="next"
          value={apellido}
          onChangeText={text => setApellido(text)}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />
        <PhoneInput
            // ref={phoneInput}
            defaultValue={""}
            defaultCode="PE"
            layout="first"
            onChangeText={(text) => {
              // setCeluar(countrycode+text);
            }}
            onChangeCountry={(country)=>{
              setPais(country.cca2);
              // setCountrycode('+'+country.callingCode);
            }}
            onChangeFormattedText={(text) => {
              setCeluar(text);
            }}
            withDarkTheme
            withShadow
          />
        {/* <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View> */}
        <Button mode="contained" onPress={onSignUpPressed}>
          Sign Up
        </Button>
        <View style={styles.row}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace('LogIn')}>
            <Text style={styles.link}>Log In</Text>
          </TouchableOpacity>
        </View>
      </Background>
    </ScrollView>
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

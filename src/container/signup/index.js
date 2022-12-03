import React, {useState, useContext} from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Toast from 'react-native-toast-message';
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
  const [nombre, setNombre] = useState('name');
  const [apellido, setApellido] = useState('last name');
  const [pais, setPais] = useState('PE');
  const [celular, setCeluar] = useState('+19379645934');


  const onSignUpPressed = () => {
    const emailError = emailValidator(email);
    const passwordError = passwordValidator(password);
    const confirmpasswordError = passwordValidator(confirmpassword);

    if(password === confirmpassword){
      signup(email, password, id_celular, nombre, apellido, pais, celular);
      console.log('password match')
    }
    else{
      console.log('password does not match')
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
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Create Account</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail(text)}
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
        value={password.value}
        onChangeText={text => setPassword(text)}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <TextInput
        label="Confirm Password"
        returnKeyType="done"
        value={confirmpassword.value}
        onChangeText={text => setconfirmPassword(text)}
        error={!!confirmpassword.error}
        errorText={confirmpassword.error}
        secureTextEntry
      />
      {/* <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View> */}
      <Button
        mode="contained"
        onPress={onSignUpPressed}>
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LogIn')}>
          <Text style={styles.link}>Log In</Text>
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

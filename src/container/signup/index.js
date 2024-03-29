import React, {useState, useContext, useRef, useEffect} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import {Text} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import PhoneInput from 'react-native-phone-number-input';
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
  const {signup, setNav} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');
  const [id_celular, setId_celular] = useState('xxxxxxxx');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [pais, setPais] = useState('PE');
  const [celular, setCeluar] = useState('');
  const [idcel, setIdcel] = useState('');
  const [status, setStatus] = useState(false);

  useEffect(() => {
    setNav(navigation);
  }, []);

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

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
    } else {
      console.log('password does not match');
      setModalVisible(true);
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
      <Background state={status}>
        <Modal isVisible={isModalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Las contraseñas no coinciden</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={toggleModal}>
                <Text style={styles.textStyle}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <BackButton goBack={navigation.goBack} />
        <Logo />
        <Header>Create Account</Header>
        <TextInput
          label="Email"
          returnKeyType="next"
          value={email}
          onChangeText={text => {
            setEmail(text);
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
          defaultValue={''}
          defaultCode="PE"
          layout="first"
          onChangeText={text => {}}
          onChangeCountry={country => {
            setPais(country.cca2);
          }}
          onChangeFormattedText={text => {
            setCeluar(text);
          }}
          withDarkTheme
          withShadow
        />
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
    marginBottom: 40,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

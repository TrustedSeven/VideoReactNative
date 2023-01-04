import React, {useEffect, useState, useContext} from 'react';
import {Alert, StyleSheet, Pressable, View,TouchableOpacity} from 'react-native';
import Modal from "react-native-modal";
import {shadow, Text} from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const {loginToken} = useContext(AuthContext);
  const {start} = useContext(AuthContext);

  const {token} = useContext(AuthContext);
  
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  //const [idcelular, setIdcelular] = useState('xxxxxx');
  //const [idcel, setIdcel] = useState('');
  const [session, setSession] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);

  
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  /*const getdeviceId = () => {
    var uniqueId = DeviceInfo.getUniqueId();
    setIdcel(uniqueId);
    setIdcelular(idcel._z);
  };*/
  
  const onLoginPressed = async () => {
    const emailError = emailValidator(email);
    const passwordError = passwordValidator(password);
    if (email != '' && password != '') {
      let idcelular = await AsyncStorage.getItem('id_celular');
      login(email, password, idcelular);
    }else{
      setModalVisible(true)
    }
  };
  
  const onLoginTokenPressed = async () => {
    try{
      let var_id_user = await AsyncStorage.getItem('id_user');
      let var_id_celular = await AsyncStorage.getItem('id_celular');
      let var_token = await AsyncStorage.getItem('token');
      console.log(var_id_user);
      console.log(var_id_celular);
      console.log(var_token);
      loginToken(var_id_user, var_token, var_id_celular);
    }catch (err) {
      console.log(err);
    }
  };

  const borrarVariables = () => {
    try{
      AsyncStorage.multiRemove(['id_user', 'finToken', 'token', 'nombre', 'evento']);
      setSession(false);
    }catch (err) {
      console.log(err);
    }
  };

  const onStartPressed = () =>{
    start();
  }

  useEffect(() => {
    leer();
  }, []);

  const leer = async () => {
    try{
      let uniqueId = await DeviceInfo.getUniqueId();
      AsyncStorage.setItem('id_celular', uniqueId);
      //console.log(uniqueId);
      let var_finToken = await AsyncStorage.getItem('finToken');
      if(var_finToken !== null){
        console.log('variable guardada: ' + var_finToken);
        let fecha_token = new Date(var_finToken);
        let fecha_ahora = new Date();
        if(fecha_ahora.getTime() < fecha_token.getTime()){
          console.log('La token aun no caduca');
          let nombreSession = await AsyncStorage.getItem('nombre');
          setNombre(nombreSession);
          setSession(true);
        }else{
          console.log('Token caducada');
          setSession(false);
        }
      }else{
        console.log('No se encontró nada');
        setSession(false);
      }
    }catch (err) {
      console.log(err);
    }
  }

  return (
    <Background state={status}>
      <BackButton goBack={navigation.goBack} />
      <Modal isVisible={isModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Por favor inserte correo electrónico y contraseña</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={toggleModal}>
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Logo />
      {!session&&<Header>Social360</Header>}
      {session&&<Header>Bienvenido(a) {nombre}</Header>}
      {!session&&<TextInput
        label="Email"
        returnKeyType="next"
        value={email}
        onChangeText={text => {
          setEmail(text);
          //getdeviceId();
        }}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />}
      {!session&&<TextInput
        label="Password"
        returnKeyType="done"
        value={password}
        onChangeText={text => setPassword(text)}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />}
      {/* <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}>
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View> */}
      {/*!session&&<Button mode="contained" onPress={()=>setSession(true)}>
        login
      </Button>*/}
      {!session&&<Button mode="contained" onPress={onLoginPressed}>
        Iniciar Session
      </Button>}
      {session&&<Button mode="contained" onPress={onLoginTokenPressed}>
        Continuar Session
      </Button>}
      {session&&<Button mode="contained" onPress={onStartPressed}>
        Continuar sin Internet
      </Button>}
      {session&&<Button mode="contained" onPress={borrarVariables}>
        Cerrar Session
      </Button>}
      {!session&&<View style={styles.row}>
        <Text>¿No tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.push('SignUp')}>
          <Text style={styles.link}>Registrate</Text>
        </TouchableOpacity>
      </View>}
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
});

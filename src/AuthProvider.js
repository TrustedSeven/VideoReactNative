import React, {createContext, useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";

import API from './services/API';
import {useMutation} from 'react-query';
export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const [id_user, setId_user] = useState();
  const [token, setToken] = useState();
  const [modalcontent, setModalcontent] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  // useEffect(() => {
  //   setModalVisible(true);
  // }, [modalcontent]);


  useEffect(() => {
    if (token !== undefined && id_user !== undefined) {
      register({id_user, token});
    }
  }, [token]);
 

  const {mutate: login} = useMutation(API.login, {
    onSuccess: data => {
      if (data.error == false) {
        // Toast.show({
        //   type: 'success',
        //   text1: 'Welcome',
        //   text2: 'Successfully login' + '👋',
        // });
        setUserProfile(data);
        setId_user(data.user_profile.id_user);
        setToken(data.user_profile.token);
        setLoading(false);
      } else {
        // Toast.show({
        //   type: 'error',
        //   text1: 'Sorry--------',
        //   text2: data.msg,
        // });
        setModalcontent(data.msg);
        setModalVisible(true);
      }
    },
    onError: data => {
      Toast.show({
        type: 'error',
        text1: 'Sorry',
        text2: data.msg,
      });
      setLoading(false);
    },
  });

  const {mutate: register} = useMutation(API.register, {
    onSuccess: data => {
      if (data.error == false) {
        Toast.show({
          type: 'success',
          text1: 'Welcome',
          text2: 'Successfully loaded config' + '👋',
        });
        setConfig(data);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Sorry',
          text2: '-------------------' + data.msg,
        });
      }
    },
    onError: data => {
      Toast.show({
        type: 'error',
        text1: 'Sorry',
        text2: data.msg,
      });
      setLoading(false);
    },
  });

  const {mutate: signup} = useMutation(API.signup, {
    onSuccess: data => {
      if (data.error == false) {
        // Toast.show({
        //   type: 'success',
        //   text1: 'Success',
        //   text2: data.msg,
        // });
        // setLoading(false);
        setModalcontent('Los datos se registraron correctamente, ya puede iniciar session.')
        setModalVisible(true);
      } else {
        // Toast.show({
        //   type: 'error',
        //   text1: 'Sorry',
        //   text2: 'por favor inserte todos los campos correctamente',
        //   // text2: data.error_msg.email+data.error_msg.password+data.error_msg.celular,
        // });
        if(data.error_msg.email && data.error_msg.celular){
          setModalcontent(data.error_msg.email+" "+data.error_msg.celular);
        }
        else{
          if(data.error_msg.email){
            setModalcontent(data.error_msg.email);
          }
          else{
            setModalcontent(data.error_msg.celular);
          }
        }
        setModalVisible(true);
      }
    },
    onError: data => {
      Toast.show({
        type: 'error',
        text1: 'Sorry',
        text2: data.message,
      });
      setLoading(false);
    },
  });

  return (
    <AuthContext.Provider
      value={{
        userProfile,
        config,
        login: async (email, password, idcelular) => {
          if (email !== '' && password !== '') {
            setLoading(true);
            const userCred = {
              email,
              password,
              idcelular,
            };
            await login(userCred);
          } else {
            Toast.show({
              type: 'error',
              text1: 'Sorry',
              text2: 'Please enter user email and password.',
            });
          }
        },
        // register: async (id_user, token) => {
        //     const userCred = {
        //       id_user,
        //       token,
        //     };
        //     await register(userCred);

        // },
        signup: async (
          email,
          password,
          id_celular,
          nombre,
          apellido,
          pais,
          celular,
        ) => {
          if (email.value !== '' && password.value !== '') {
            setLoading(true);
            const userCred = {
              email,
              password,
              id_celular,
              nombre,
              apellido,
              pais,
              celular,
            };
            await signup(userCred);
          } else {
            // Toast.show({
            //   type: 'error',
            //   text1: 'Sorry',
            //   text2: 'Please enter user email and password.',
            // });
          }
        },
        logout: async () => {
          try {
            await setUserProfile(null);
          } catch (e) {
            console.error(e);
          }
        },
      }}>
      {children}
      <Toast />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalcontent}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </AuthContext.Provider>
  );
};
const styles = StyleSheet.create({
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
  }
});


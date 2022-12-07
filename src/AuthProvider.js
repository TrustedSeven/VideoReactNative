import React, {createContext, useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';
import base64 from 'react-native-base64';

import API from './services/API';
import {useMutation} from 'react-query';
export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const [id_user, setId_user] = useState();
  const [token, setToken] = useState();


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

  useEffect(() => {
    if (token !== undefined && id_user !== undefined) {
      register({id_user, token});
    }
  }, [token]);

  // useEffect(() => {
  //   // console.log(decrypt(config.v_token, userProfile.user_profile.id_user));
  //   console.log(config.v_token);
  // }, [config]);



  

  const {mutate: login} = useMutation(API.login, {
    onSuccess: data => {
      if (data.error == false) {
        Toast.show({
          type: 'success',
          text1: 'Welcome',
          text2: 'Successfully login' + '👋',
        });
        setUserProfile(data);
        setId_user(data.user_profile.id_user);
        setToken(data.user_profile.token);
        setLoading(false);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Sorry',
          text2: data.msg,
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
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: data.msg,
        });
        setLoading(false);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Sorry',
          text2: 'por favor inserte todos los campos correctamente',
          // text2: data.error_msg.email+data.error_msg.password+data.error_msg.celular,
        });
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
            Toast.show({
              type: 'error',
              text1: 'Sorry',
              text2: 'Please enter user email and password.',
            });
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
    </AuthContext.Provider>
  );
};

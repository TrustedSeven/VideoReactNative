import React, {createContext, useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';
import API from './services/API';
import {useMutation} from 'react-query';
export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const {mutate: login} = useMutation(API.login, {
    onSuccess: data => {
      Toast.show({
        type: 'success',
        text1: 'Welcome',
        text2: "Successfully login" + '👋',
      });
      setUserProfile(data);
      setLoading(false);
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

  const {mutate: signup} = useMutation(API.signup, {
    onSuccess: data => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: data.message,
      });
      setLoading(false);
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
        signup: async (email, password, id_celular,nombre, apellido, pais, celular) => {
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

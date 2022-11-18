import React, {useEffect} from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import { Platform, PermissionsAndroid } from 'react-native';

import {AuthProvider} from './src/AuthProvider';
import MainNavigator from './src/navigator/MainNavigator';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const getPermissions = async () => {
      if (Platform.OS === 'android') {

        let granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ]);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          ]);
        }
      }
    };
    getPermissions();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

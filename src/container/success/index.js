import styles from './styles';
import React, {Component, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  PermissionsAndroid,
  Platform,
  SwipeableListView,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Button from '../../components/Button';
import {TouchableOpacity} from 'react-native';
import { Video } from 'react-native-video';
import Background from '../../components/Background';
import CameraButton from '../../components/CameraButton';



const SuccessScreen = ({navigation}) => {
  return (
    <Background>
      <View style={styles.container}>
      {/* <Video
        source = {{}}
        style={{ width: 300, height: 300 }}
        controls={true}
        ref={(ref) => {
        this.player = ref
        }}
      /> */}
      
      <CameraButton
        onPress={() => {
          navigation.push('Camera')
      }}>
      </CameraButton>
      <Button>AAA</Button>
      
    </View>
    </Background>
  );
};

export default SuccessScreen;

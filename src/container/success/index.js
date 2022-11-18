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


const SuccessScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.successContent}>Success</Text>
      <Button
        onPress={() => {
            navigation.push('Camera')
        }}>
        Take Video
      </Button>
    </View>
  );
};

export default SuccessScreen;

import React, {Component, useState, useRef, useEffect} from 'react';
import {RNCamera} from 'react-native-camera';
import {
  Text,
  TouchableOpacity,
  View,
  ToastAndroid
} from 'react-native';

// import CameraRoll from '@react-native-community/cameraroll';
import { CameraRoll } from '@react-native-camera-roll/camera-roll'

import CameraButton from '../../components/CameraButton';

export default function CameraScreen({navigation}) {

  const camera = useRef(null);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [maxDuration, setMaxDuration] = useState(1000);
  const [recordname, setRecordname] = useState(null);

  useEffect(() => {
    // navigation.push('Success', {message: recordname});
    console.log(recordname)
  }, [recordname]);


  useEffect(() => {
    const interval = setInterval(() => {
      if(recording){
        setSeconds(seconds => seconds + 1);
      }
      else{
        setSeconds(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [recording]);

  const recordVideo = async () => {
    if (camera) {
      if (!recording) startRecording();
      else stopRecording();      
    }
  };

  const stopRecording = () => {
    camera.current.stopRecording();
    console.log('stop')
    setSeconds(0);
  };

  const startRecording = async () => {
    setRecording(true);
    console.log('+++++++++++ Before record');

    const cameraConfig = {maxDuration: maxDuration};
    const data = await camera.current.recordAsync(cameraConfig);
    console.log('+++++++++++ Recorded Result', data);
    setRecording(false);
    try {
      CameraRoll.save(data.uri, 'video')
        .then(onfulfilled => {
          console.log('+++++++++++ Saved Successfully!!!', onfulfilled);
          console.log(data.uri);
          var ret = data.uri.replace('file:///data/user/0/com.videoapp/cache/Camera/','');
          // console.log(ret);
          setRecordname(ret);
          navigation.navigate('Success');
          ToastAndroid.show(
            `VidApp Videos: ${onfulfilled}`,
            ToastAndroid.SHORT,
          );
        })
        .catch(error => {
          console.log('+++++++++++ Failed Successfully!!!', error);

          ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT);
        });
    } catch (error) {
      console.log('+++++++++++ ERROR!!!', error);
    }

  };

  
    return (
      
        <RNCamera
          type={RNCamera.Constants.Type.back}
          ref={camera}
          captureAudio={true}
          style={{height: '100%'}}>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            
            <Text>{seconds}</Text>
            <CameraButton onPress={recordVideo}></CameraButton>
          </View>
        </RNCamera>
      
    );
}

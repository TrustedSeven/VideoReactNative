import React, {Component} from 'react';
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

export default class CameraScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      seconds: 0,
      maxDuration: 1000,
    };
  }

  recordVideo = async () => {
    if (this.camera) {
      if (!this.state.recording) this.startRecording();
      else this.stopRecording();
    }
  };

  stopRecording = () => {
    this.camera.stopRecording();
    clearInterval(this.countRecordTime);
    this.setState({seconds: 0});
  };

  startRecording = async () => {
    this.setState({recording: true});
    this.countRecordTime = setInterval(
      () => this.setState({seconds: this.state.seconds + 1}),
      1000,
    );
    console.log('+++++++++++ Before record');

    const cameraConfig = {maxDuration: this.state.maxDuration};
    const data = await this.camera.recordAsync(cameraConfig);
    console.log('+++++++++++ Recorded Result', data);
    this.setState({recording: false});
    try {
      CameraRoll.save(data.uri, 'video')
        .then(onfulfilled => {
          console.log('+++++++++++ Saved Successfully!!!', onfulfilled);
          console.log(data.uri);
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

  render() {
    return (
      <View>
        {this.props.header}
        <RNCamera
          type={RNCamera.Constants.Type.back}
          ref={camera => {
            this.camera = camera;
          }}
          captureAudio={true}
          style={{height: '100%'}}>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            
            <Text>{this.state.seconds}</Text>
            <CameraButton onPress={this.recordVideo}></CameraButton>
          </View>
        </RNCamera>
      </View>
    );
  }
}

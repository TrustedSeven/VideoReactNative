import React, {Component} from 'react';
import {RNCamera} from 'react-native-camera';
// import RNFetchBlob from 'react-native-fetch-blob';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      seconds: 0,
      maxDuration:1000
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
    const cameraConfig = {maxDuration: this.state.maxDuration};
    const data = await this.camera.recordAsync(cameraConfig);
    this.setState({recording: false});
    CameraRoll.save(data.uri,'video')
      .then(onfulfilled => {
        ToastAndroid.show(`VidApp Videos: ${onfulfilled}`, ToastAndroid.SHORT);
      })
      .catch(error =>
        ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT),
      );
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
          //   style={styles.preview}
          captureAudio={true}
        //   ratio="16:9"
        style={{height:'100%'}}
         >
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <TouchableOpacity onPress={this.recordVideo}>
              <Text style={{backgroundColor: 'white'}}>Record</Text>
            </TouchableOpacity>
            <Text>
                {this.state.seconds}
            </Text>
          </View>
        </RNCamera>
      </View>
    );
  }
}

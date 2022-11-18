import React, { Component } from 'react'
import { StyleSheet, View,  Alert, Text } from 'react-native'
import { RNCamera } from 'react-native-camera'




class CameraScreen extends Component {
    render() {
      return (
        <View style={styles.container}>
          <RNCamera
            style={{ flex: 1, alignItems: 'center' }}
            ref={ref => {
              this.camera = ref
            }}
            // androidCameraPermissionOptions={{
            //     title: 'Permission to use camera',
            //     message: 'We need your permission to use your camera',
            //     buttonPositive: 'Ok',
            //     buttonNegative: 'Cancel',
            //   }}
            // androidRecordAudioPermissionOptions={{
            //     title: 'Permission to use audio recording',
            //     message: 'We need your permission to use your audio',
            //     buttonPositive: 'Ok',
            //     buttonNegative: 'Cancel',
            //   }}
            
            //captureAudio={false}

          />
        </View>
        // <View>
        //     <Text>sss</Text>
        // </View>
      )
    }
  }

  
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black'
    }
  })
  
  export default CameraScreen
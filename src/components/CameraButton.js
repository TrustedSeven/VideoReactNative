import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export default function CameraButton({ mode, style, ...props }) {
  return (
    <TouchableOpacity labelStyle={styles.text}
    mode={mode}
    {...props} style={styles.container}>
      <Image
        style={styles.image}
        source={require('../assets/camera-icon-36.png')}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    bottom: -650 + getStatusBarHeight(),
    //alignItems:'left'
  },
  image: {
    width:72,
    height: 72,
  },
})

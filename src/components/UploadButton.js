import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export default function UploadButton({ mode, style, ...props }) {
  return (
    <TouchableOpacity labelStyle={styles.text}
        mode={mode}
        {...props} style={styles.container}>
      <Image
        style={styles.image}
        source={require('../assets/upload-button.png')}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 200 + getStatusBarHeight(),
    right:-180,
    // alignItems:'left'
  },
  image: {
    width:200,
    height: 30,
  },
})

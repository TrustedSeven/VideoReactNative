import React from 'react'
import { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { theme } from '../core/theme'



export default function Background({ children, state}) {
  console.log(state);
  const [status, setStatus] = useState(false);
  useEffect(() => {
    setStatus(state);
  }, [state]);
  return (
    <ImageBackground
      source={require('../assets/background_dot.png')}
      resizeMode="repeat"
      style={ !status?styles.background : styles.opacitybackground}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  opacitybackground:{
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
    opacity : 0.4,
    }
  ,
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

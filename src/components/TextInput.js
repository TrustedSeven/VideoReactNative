import React from 'react'
import { View, StyleSheet, Text} from 'react-native'
// import { TextInput as Input } from 'react-native-paper'
import { TextInput as Input } from 'react-native'
import { theme } from '../core/theme'

export default function TextInput({ errorText, description, ...props }) {
  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        selectionColor={theme.colors.primary}
        underlineColor="transparent"
        mode=""
        {...props}
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
    borderRadius:100,
    borderBottomEndRadius:100,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius:25,
    borderWidth:1
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
})

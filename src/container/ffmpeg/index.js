import React, {Component, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  Input,
  PermissionsAndroid,
  Platform,
  SwipeableListView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import VideoPlayer from 'react-native-video-player';

import Background from '../../components/Background';
import Button from '../../components/Button';

const VideoPlay = () => {
  return (
    <Background style={{width: '100%', height: '100%'}}>
      <View style={{width: '100%', height: '80%'}}>
        <VideoPlayer
          video={{
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }}
        />
      </View>
      <Button
            mode="contained"
            onPress={() => {
              console.log('upload file')
            }}>
            Upload Video
          </Button>
    </Background>
  );
};

export default VideoPlay;

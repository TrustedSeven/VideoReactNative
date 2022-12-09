import React, {Component, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import VideoPlayer from 'react-native-video-player';
import RNFetchBlob from 'rn-fetch-blob';

import Background from '../../components/Background';
import Button from '../../components/Button';

const VideoPlay = () => {
  const route = useRoute();
  console.log(route.params.message);

  const Upload = url => {
    var data = new FormData();
    // data.append('file_upload', url);

    data.append('file_upload', {
      name: 'name',
      uri: url,
      type: 'video/mp4',
    });

    fetch(
      'https://social360.app/edit/api/subirVideo',
      {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // header: {'Content-Type': 'application/octet-stream'},
        // Change BASE64 encoded data to a file path with prefix `RNFetchBlob-file://`.
        // Or simply wrap the file path with RNFetchBlob.wrap().
      },
      // RNFetchBlob.wrap(url),
    )
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        // error handling ..
        console.error(err);
      });
  };

  return (
    <Background style={{width: '100%', height: '100%'}}>
      <View style={{width: '100%', height: '80%'}}>
        <VideoPlayer
          style={{width: '100%', height: '100%'}}
          video={{
            uri: route.params.message,
          }}
        />
      </View>
      <Button
        mode="contained"
        onPress={() => {
          console.log('upload file');
          Upload(route.params.message);
        }}>
        Upload Video
      </Button>
    </Background>
  );
};

export default VideoPlay;

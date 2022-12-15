import React, {Component, useEffect, useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import VideoPlayer from 'react-native-video-player';
import RNFetchBlob from 'rn-fetch-blob';
import Spinner from 'react-native-loading-spinner-overlay';

import Background from '../../components/Background';
import Button from '../../components/Button';

const VideoPlay = (image_URL) => {
  const route = useRoute();
  console.log(route.params.message);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const DownloadQR = (image_URL) => {
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        //Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/QRimage_' +
          '.png',
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        //Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('Image Downloaded Successfully.');
      });
  };

  const Upload = url => {
    var data = new FormData();
    // data.append('file_upload', url);
    setLoading(true);
    data.append('file_upload', {
      name: 'name',
      uri: url,
      type: 'video/mp4',
    });
    fetch('https://social360.app/edit/api/subirVideo', {
      method: 'POST',
      body: data,
      header: {'Content-Type': 'multipart/form-data'},
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((response) => {
        //Success
        console.log(response);
        DownloadQR(response.qr);
        setModalVisible(true);
        setLoading(false);
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        console.error(error);
        // setModalVisible(true);
        setLoading(false);
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
        <Spinner
          visible={loading}
          textContent={'Uploading...'}
          textStyle={styles.spinnerTextStyle}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Upload Success</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Button
        mode="contained"
        onPress={() => {
          console.log('upload file');
          Upload(route.params.message);
        }}>
        Upload
      </Button>
    </Background>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});
export default VideoPlay;

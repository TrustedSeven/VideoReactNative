import React, {Component, useEffect, useState} from 'react';
import {
  Alert,
  TouchableOpacity,
  StyleSheet,
  Text,
  Pressable,
  Dimensions,
  View,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import {useRoute} from '@react-navigation/native';
import VideoPlayer from 'react-native-video-player';
import RNFetchBlob from 'rn-fetch-blob';
import Spinner from 'react-native-loading-spinner-overlay';

import Background from '../../components/Background';
import Button from '../../components/Button';
import Fav from '../../assets/star.png';
import Back from '../../assets/back.png';
import Up from '../../assets/up.png'


const VideoPlay = ({navigation}) => {
  const route = useRoute();
  console.log(route.params.message);
  const [loading, setLoading] = useState(false);
  const [urlQr, setUrlQr] = useState(null);

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    if (urlQr !== null) {
      console.log('====urlQR====' + urlQr);
      setLoading(false);
      setModalVisible(true);
    }
  }, [urlQr]);

  // const DownloadQR = image_URL => {
  //   const {config, fs} = RNFetchBlob;
  //   let PictureDir = fs.dirs.PictureDir;
  //   let options = {
  //     fileCache: true,
  //     addAndroidDownloads: {
  //       //Related to the Android only
  //       useDownloadManager: true,
  //       notification: true,
  //       path: PictureDir + '/QRimage_' + '.png',
  //       description: 'Image',
  //     },
  //   };
  //   config(options)
  //     .fetch('GET', image_URL)
  //     .then(res => {
  //       //Showing alert after successful downloading
  //       console.log('res -> ', JSON.stringify(res));
  //       alert('Image Downloaded Successfully.');
  //     });
  // };

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
      .then(response => response.json())
      //If response is in json then in success
      .then(response => {
        //Success
        console.log(response);
        // DownloadQR(response.qr);
        setUrlQr(response.qr);
      })
      //If response is not in json then in error
      .catch(error => {
        //Error
        console.error(error);
        // Alert("Failed Try again1");
        // setModalVisible(true);
        setLoading(false);
      });
  };

  return (
    <View>
      <View style={{width: '100%', height: '100%'}}>
        <VideoPlayer
          style={{width: '100%', height: '100%'}}
          video={{
            uri: route.params.message,
          }}
          controls={true}
          // fullscreen={true}
          // resizeMode={'contain'}
        />
        <View
          style={{
            zIndex: 2,
            position: 'absolute',
            marginLeft: '80%',
            marginTop: '60%',
          }}>
          {!route.params.local && (
            <TouchableOpacity onPress={ () => {
              console.log('upload file');
              Upload(route.params.message);
            }}>
            <Image
              source={Up}
              style={{width: 40, height: 40, backgroundColor: '#700ff7', borderRadius:9}}></Image>
          </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => console.log('Favourite')}>
            <Image
              source={Fav}
              style={{width: 40, height: 40,marginTop:10, backgroundColor: '#700ff7', borderRadius:9}}></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Success')}>
            <Image
              source={Back}
              style={{width: 40, height: 40, marginTop:10, backgroundColor: '#700ff7', borderRadius:9}}></Image>
          </TouchableOpacity>
        </View>

        <Spinner
          visible={loading}
          textContent={'Uploading...'}
          textStyle={styles.spinnerTextStyle}
        />
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              El video se subio correctamente
            </Text>
            <Image source={{uri: urlQr}} style={{height: 150, width: 150}} />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={toggleModal}>
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
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
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * (9 / 16),
    backgroundColor: 'black',
  },
  buttons: {
    zIndex: 2,
    flex: 1,
  },
});
export default VideoPlay;

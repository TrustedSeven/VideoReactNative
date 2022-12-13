import styles from './styles';
import React, {Component, useEffect, useState, useContext} from 'react';
import {
  View,
  Alert,
  Text,
  Input,
  PermissionsAndroid,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import NumericInput from 'react-native-numeric-input';
import {LogLevel, FFmpegKit, FFmpegKitConfig} from 'ffmpeg-kit-react-native';
import base64 from 'react-native-base64';
import RNFetchBlob from 'rn-fetch-blob';
import VideoPlayer from 'react-native-video-player';
import Spinner from 'react-native-loading-spinner-overlay';

import Button from '../../components/Button';
import Background from '../../components/Background';
import BackButton from '../../components/BackButton';
import Header from '../../components/Header';
import {AuthContext} from '../../AuthProvider';
import MyView from '../../components/MyView';


const SuccessScreen = ({navigation}) => {
  const [selected, setSelected] = useState('');
  const {config} = useContext(AuthContext);
  const {userProfile} = useContext(AuthContext);
  const {register} = useContext(AuthContext);
  const [id_celular, setId_celular] = useState(null);
  const [jsonData, setJsonData] = useState([]);
  const [playurl, setPlayurl] = useState('');
  const fileUrl = 'https://social360.app/';
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  // const targeturi = '';

  const downloadFile = () => {
    if (jsonData.length === 0) {
      return;
    }

    let files = [];
    jsonData.forEach(data => {
      data['archivos'].forEach(arc => {
        let src = [];
        if (arc['tipoArchivo'] === 1) {
          src.push('imagen');
          src.push(arc['idArchivo'] + '.png');
        } else {
          src.push('audio');
          src.push(arc['idArchivo'] + '.mp3');
        }
        files.push(src);
      });
    });

    if (files.length === 0) {
      return;
    }
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = fileUrl;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const {config, fs} = RNFetchBlob;

    files.forEach(file => {
      let RootDir = fs.dirs.PictureDir;
      if (file[0] === 'audio') {
        RootDir = fs.dirs.MusicDir;
      }
      const targetPath = RootDir + '/file_' + file[1];
      console.log(targetPath);
      fs.exists(targetPath)
        .then((exist) => {
          if(!exist) {
            let options = {
              fileCache: true,
              addAndroidDownloads: {
                path: targetPath,
                description: 'downloading file...',
                notification: true,
                // useDownloadManager works with Android only
                useDownloadManager: true,
              },
            };
            config(options)
              .fetch('GET', fileUrl + file[0] + '/' + file[1])
              .then(res => {
                // Alert after successful downloading
                console.log('res -> ', JSON.stringify(res));
              });
          }
        })
    });
  };

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const checkPermission = async () => {
    if (Platform.OS === 'ios') {
      downloadFile();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile();
          console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log('++++' + err);
      }
    }
  };

  useEffect(() => {
    if (config !== null) {
      Load();
      setDownloading(false);
    }
  }, [config]);

  useEffect(() => {
    if (jsonData.length !== 0) {
      checkPermission();
    }
  }, [jsonData.length]);

  useEffect(() => {
    if (userProfile !== null) {
      setId_celular(userProfile.user_profile.id_celular);
    }
  }, [userProfile]);

  function decrypt(texto, clave) {
    var result = '';
    var string = base64.decode(texto);
    for (var i = 0; i < string.length; i++) {
      var char = string.substring(i, i + 1);
      var keychar = clave.substring(i % clave.length, i + 1);
      char = String.fromCharCode(char.charCodeAt(0) - keychar.charCodeAt(0));
      result += char;
    }
    return result;
  }

  const Load = () => {
    const data = decrypt(config.eventos, id_celular);
    const newJsonData = JSON.parse(data);
    let newData = [];
    Object.keys(newJsonData).forEach((key, idx) => {
      newData.push({key: idx + 1, value: newJsonData[key]['nombre_evento']});
    });
    setData1(newData);
    setJsonData(newJsonData);
  };

  const [data1, setData1] = useState([{key: 1, value: 'Event Options'}]);

  const data2 = [{key: 1, value: 'Audio Options'}];

  const [singleFile, setSingleFile] = useState();
  const [uri, setUri] = useState();

  const [startsec, setStartsec] = useState(0);
  const [recsec, setRecsec] = useState(0);

  const SingleFilePicker = async () => {
    FFmpegKitConfig.selectDocumentForRead('*/*').then(uri => {
      setPlayurl(uri);
      FFmpegKitConfig.getSafParameterForRead(uri).then(safUrl => {
        setSingleFile(safUrl);
        console.log(singleFile);
      });
    });
  };
  const Process = async () => {
    console.log('----------------Before Start------------------');
    console.log(singleFile);
    console.log(selected);
    if (selected) {
      const selectedData = jsonData.filter(val => {
        return val['nombre_evento'] == selected;
      });
      let cmd1 = selectedData[0]['cmd']['efecto 1'];
      cmd1 = cmd1.replace('input.mp4', singleFile);
      setLoading(true);

      FFmpegKitConfig.selectDocumentForWrite('video.mp4', 'video/*').then(
        targeturi => {
          console.log(targeturi+"-------------------");
          FFmpegKitConfig.getSafParameterForWrite(targeturi).then(safUrl1 => {
            cmd1 = cmd1.replace('out.mp4', safUrl1);
            FFmpegKit.executeAsync(cmd1)
              .then(res => {
                setLoading(false)
                console.log(res);
                navigation.push('VideoPlay', {message: targeturi});
                console.log('--------End---------');

              });
          });
        },
      );

      // const targeturi = await FFmpegKitConfig.selectDocumentForWrite('video.mp4', 'video/*');
      // const safUrl1 = await FFmpegKitConfig.getSafParameterForWrite(targeturi);
      // cmd1 = cmd1.replace('out.mp4', safUrl1);
      // const res = await FFmpegKit.executeAsync(cmd1);
      // console.log("success");
      // navigation.push('VideoPlay', {message: targeturi});
    }
  };

  return (
    <ScrollView style={styles.background}>
      <Background>
        {/* <BackButton goBack={navigation.goBack} /> */}
        
        <View style={styles.selectEvent}>
          <Header>Select Events</Header>
          <SelectList
            setSelected={val => setSelected(val)}
            data={data1}
            save="value"
          />
        </View>
        <View style={styles.buttons}>
          <Button
            style={{width: '100%',}}
            mode="contained"
            onPress={()=>{
              setDownloading(true);
              register(userProfile.user_profile.id_user, userProfile.user_profile.token);
            }}>
            Refresh
          </Button>
          <Spinner
            visible={downloading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        </View>
        <View style={styles.filepicker}>
          <Header>Select Video File</Header>

          {/* <Text> File Name: {singleFile ? singleFile[0].uri : ''} </Text> */}

          {/* <Text>file Type: {singleFile.type ? singleFile.type : ''}</Text>

        <Text>File Size: {singleFile.size ? singleFile.size : ''}</Text>

        <Text>File URI: {singleFile.uri ? singleFile.uri : ''}</Text> */}
        </View>
        <View style={styles.buttons}>
          <Button
            style={{width: '50%'}}
            mode="contained"
            onPress={SingleFilePicker}>
            Choose File
          </Button>
          <Button
            style={{width: '50%'}}
            mode="contained"
            onPress={() => {
              navigation.push('Camera');
            }}>
            Take Video
          </Button>
        </View>
        <View style={{width: '100%'}}>
          <VideoPlayer
            style={{width: '100%'}}
            video={{
              uri: playurl,
            }}
          />
        </View>
        <View style={styles.secondpicker}>
          <Header>Seconds to Start      </Header>
          <NumericInput
            onChange={value => {
              setStartsec(value);
            }}
          />
        </View>
        <View style={styles.secondpicker}>
          <Header>Recording Time        </Header>
          <NumericInput
            style={{marginLeft: 10}}
            onChange={value => {
              setRecsec(value);
            }}
          />
        </View>
        <View style={styles.selectEvent}>
          <Header>Select Audio</Header>
          <SelectList
            setSelected={val => setSelected(val)}
            data={data2}
            save="value"
          />
        </View>
        <View style={styles.buttons}>
          <Button
            style={{width: '100%', marginBottom: 60}}
            mode="contained"
            onPress={Process}>
            Process
          </Button>
          <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        </View>
      </Background>
    </ScrollView>
  );
};

export default SuccessScreen;

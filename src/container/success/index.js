import styles from './styles';
import React, {useEffect, useState, useContext} from 'react';
import {View, Alert, PermissionsAndroid, ScrollView} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import NumericInput from 'react-native-numeric-input';
import {LogLevel, FFmpegKit, FFmpegKitConfig} from 'ffmpeg-kit-react-native';
import base64 from 'react-native-base64';
import RNFetchBlob from 'rn-fetch-blob';
import VideoPlayer from 'react-native-video-player';
import Spinner from 'react-native-loading-spinner-overlay';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Button from '../../components/Button';
import Background from '../../components/Background';
import Header from '../../components/Header';
import {AuthContext} from '../../AuthProvider';

const SuccessScreen = ({navigation}) => {
  const [selected, setSelected] = useState('');
  const {config} = useContext(AuthContext);
  const {userProfile} = useContext(AuthContext);
  const {register} = useContext(AuthContext);
  const [id_celular, setId_celular] = useState(null);
  const [local, setLocal] = useState(false);
  const [jsonData, setJsonData] = useState('');
  const [playurl, setPlayurl] = useState('');
  const fileUrl = 'https://social360.app/';
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const route = useRoute();

  useEffect(() => {
    if (route.params !== undefined) {
      SingleFilePicker();
    }
  }, [route]);

  const downloadFile = files => {
    /*if (jsonData.length === 0) {
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
    });*/

    //console.log(files);
    //console.log(arrayFiles);

    //return;

    if (files.length === 0) {
      setLoading(false);
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
      fs.exists(targetPath).then(exist => {
        if (!exist) {
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
      });
    });
    setLoading(false);
    //setTimeout(() => { setLoading(false) }, 3000);
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
    setDownloading(false);
    if (config !== null) {
      console.log('config NO null');
      Load();
      setLocal(false);
      setShow2(true);
    } else {
      console.log('config null');
      Load2();
      setLocal(true);
      setShow2(false);
    }
  }, [config]);

  /*useEffect(() => {
    if (jsonData.length !== 0) {
      checkPermission();
    }
  }, [jsonData.length]);*/

  useEffect(() => {
    if (userProfile !== null) {
      const cargarDatos = async () => {
        try{
          let var_id_celular = await AsyncStorage.getItem('id_celular');
          console.log(var_id_celular);
          setId_celular(var_id_celular);
        }catch (err) {
          console.log(err);
        }
      }
      cargarDatos();
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

    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log(id_celular);
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    const validar = decrypt(config.v_token, id_celular);
    if(validar !== 'xN6WGiE9Qcu9U298'){
      try{
        AsyncStorage.multiRemove(['id_user', 'finToken', 'token', 'evento']);
      }catch (err) {
        console.log(err);
      }
      return false;
    }
    const data = decrypt(config.eventos, id_celular);
    const newJsonData = JSON.parse(data);
    let newData = [];
    let newData2 = [];
    Object.keys(newJsonData).forEach((key, idx) => {
      //newData.push({key: idx + 1, value: newJsonData[key]['nombre_evento']});
      newData.push({
        key: newJsonData[key]['id_evento'],
        value: newJsonData[key]['nombre_evento'],
      });
    });
    setData1(newData);
    setData2(newData2);
    setJsonData(newJsonData);
  };
  const Load2 = async () => {
    try{
      let ultimo_evento = await AsyncStorage.getItem('evento');
      if(ultimo_evento !== null){
        console.log(ultimo_evento);
        const newJsonData = JSON.parse(ultimo_evento);
        let newData = [];
        let newData2 = [];
        Object.keys(newJsonData).forEach((key, idx) => {
          newData.push({
            key: newJsonData[key]['id_evento'],
            value: newJsonData[key]['nombre_evento'],
          });
        });
        setData1(newData);
        setData2(newData2);
        setJsonData(newJsonData);
      }
    }catch (err) {
      console.log(err);
    }
  };

  const [data1, setData1] = useState([{key: 1, value: 'Seleccione Evento'}]);

  const [data2, setData2] = useState([{key: 1, value: 'Seleccione Audio'}]);
  //const data2 = [{key: 1, value: 'Audio Options'}];

  /* default numbers */
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);
  /* end default numbers*/

  const [singleFile, setSingleFile] = useState();
  const [uri, setUri] = useState();

  const [startsec, setStartsec] = useState(0);
  const [recsec, setRecsec] = useState(0);

  const [cmdevento, setCmdevento] = useState();
  const [cmdaudio, setCmdaudio] = useState();
  const [cmdimagen, setCmdimagen] = useState([]);

  const SingleFilePicker = async () => {
    FFmpegKitConfig.selectDocumentForRead('*/*').then(uri => {
      console.log(uri);
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
    console.log(cmdevento);
    console.log(number1);
    console.log(number2);

    const {config, fs} = RNFetchBlob;
    //let RootDir = fs.dirs.MusicDir + '/file_' + cmdaudio;
    //let RootDir = fs.dirs.MusicDir;

    //console.log(RootDir);
    console.log(cmdimagen);

    /*if (selected) {
      const selectedData = jsonData.filter(val => {
        return val['id_evento'] == selected;
      });
      let cmd1 = selectedData[0]['cmd']['efecto 1'];*/

    console.log(cmdevento.substring(0, 4));

    let cmd1 = cmdevento.substring(5);
    let daudio = number2;
    let filtroaudio = '';
    let imagenes = '';
    let filtroextra = '';

    switch (cmdevento.substring(0, 4)) {
      case 'C001':
        //solo si hay una imagen
        if (cmdimagen.length !== 0) {
          imagenes = ' -i ' + fs.dirs.PictureDir + '/file_' + cmdimagen[0];
          filtroextra = '[s1];[s1][1:v] overlay=0:0';
        }
        if (cmdaudio !== '') {
          daudio = number2 * 2 + 2;
          filtroaudio =
            ' -vn -i ' +
            fs.dirs.MusicDir +
            '/file_' +
            cmdaudio +
            ' -af atrim=duration=' +
            daudio;
        }
        break;
    }

    cmd1 = cmd1.replace('[TINICIO]', number1);
    cmd1 = cmd1.replace('[TFIN]', number2);
    cmd1 = cmd1.replace('[ARCHIVO]', singleFile);
    cmd1 = cmd1.replace('[OTROSARCHIVOS]', imagenes);
    cmd1 = cmd1.replace('[FILTROEXTRA]', filtroextra);
    cmd1 = cmd1.replace('[AUDIO]', filtroaudio);

    console.log(cmd1);

    // setLoading(true);
    // console.log(route.params.message);

    let fecha = new Date();
    let nombre =
      fecha.getFullYear().toString() +
      fecha.getMonth().toString() +
      fecha.getDate().toString() +
      fecha.getHours().toString() +
      fecha.getMinutes().toString() +
      fecha.getSeconds().toString();

    FFmpegKitConfig.selectDocumentForWrite(nombre + '.mp4', 'video/*').then(
      targeturi => {
        FFmpegKitConfig.getSafParameterForWrite(targeturi).then(safUrl1 => {
          cmd1 = cmd1.replace('[SALIDA]', safUrl1);
          setLoading(true);
          console.log(cmd1);
          FFmpegKit.execute(cmd1).then(() => {
            setLoading(false);
            navigation.push('VideoPlay', {message: targeturi, local:local});
            console.log('----------------------------');
          });
        });
      },
    ); //*/
    //}
  };

  /************************/
  const DownFileEvents = async () => {
    setLoading(true);
    //console.log('descargarrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
    //console.log(selected);
    if(selected == 1){
      setShow(false);
      setLoading(false);
      return;
    }
    //console.log(jsonData);
    const selectedJson = jsonData.filter(val => {
      return val['id_evento'] == selected;
    });

    try{
      await AsyncStorage.setItem('evento', JSON.stringify(selectedJson));
    }catch (err) {
      console.log(err);
    }
    //console.log(JSON.stringify(selectedJson));
    //console.log(selectedJson[0]['cmd']['efecto 1']);

    setCmdevento(selectedJson[0]['cmd']['efecto 1']);

    let number1 = selectedJson[0]['iniciar_evento'];
    let number2 = selectedJson[0]['grabar_evento'];

    let dataArchivos = [];
    let newData2 = [];
    let imageData = [];
    selectedJson[0]['archivos'].forEach(valArchivo => {
      let arrayArchivos = [];
      if (valArchivo['tipoArchivo'] === 1) {
        //dataArchivos.push({key: valArchivo['idArchivo'] + '.' + valArchivo['extencionArchivo'], value: valArchivo['nombreArchivo']});
        arrayArchivos.push('imagen');
        arrayArchivos.push(
          valArchivo['idArchivo'] + '.' + valArchivo['extencionArchivo'],
        );
        imageData.push(
          valArchivo['idArchivo'] + '.' + valArchivo['extencionArchivo'],
        );
      } else {
        arrayArchivos.push('audio');
        arrayArchivos.push(
          valArchivo['idArchivo'] + '.' + valArchivo['extencionArchivo'],
        );
        newData2.push({
          key: valArchivo['idArchivo'] + '.' + valArchivo['extencionArchivo'],
          value: valArchivo['nombreArchivo'],
        });
      }
      dataArchivos.push(arrayArchivos);
    });
    //console.log(dataArchivos);
    if (newData2.length == 0) {
      newData2.push({key: '', value: 'NO se encontro AUDIO'});
    }
    setCmdimagen(imageData);
    setData2(newData2);
    setNumber1(number1);
    setNumber2(number2);
    downloadFile(dataArchivos);
    setShow(true);
    //let cmd1 = selectedJson[0]['cmd']['efecto 1'];
  };

  const SelectAudio = async () => {
    setCmdaudio(selected);
  };

  return (
    <ScrollView style={styles.background}>
      <Background>
        <View style={styles.selectEvent}>
          <Header>Seleccionar Evento</Header>
          <SelectList
            setSelected={val => {
              setSelected(val);
            }}
            data={data1}
            save="key"
            onSelect={() => DownFileEvents()}
          />
          <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        </View>
        {show2 && (
        <View style={styles.buttons}>
          <Button
            style={{width: '100%'}}
            mode="contained"
            onPress={() => {
              setDownloading(true);
              register(
                userProfile.user_profile.id_user,
                userProfile.user_profile.token,
              );
            }}>
            Actualizar
          </Button>
          <Spinner
            visible={downloading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        </View>
        )}
        {show && (
          <View style={styles.filepicker}>
            <Header>Seleccione su video</Header>
          </View>
        )}
        {show && (
          <View style={styles.buttons}>
            <Button
              style={{width: '50%'}}
              mode="contained"
              onPress={SingleFilePicker}>
              Galeria
            </Button>
            <Button
              style={{width: '50%'}}
              mode="contained"
              onPress={() => {
                navigation.push('Camera');
              }}>
              Camara
            </Button>
          </View>
        )}
        {show && (
          <View style={{width: '100%'}}>
            <VideoPlayer
              style={{width: '100%'}}
              video={{
                uri: playurl,
              }}
            />
          </View>
        )}
        {show && (
          <View style={styles.secondpicker}>
            <Header>Segundo de inicio  </Header>
            <NumericInput
              initValue={number1}
              onChange={value => {
                setNumber1(value);
              }}
            />
          </View>
        )}
        {show && (
          <View style={styles.secondpicker}>
            <Header>Duracion de video  </Header>
            <NumericInput
              initValue={number2}
              style={{marginLeft: 10}}
              onChange={value => {
                setNumber2(value);
              }}
            />
          </View>
        )}
        {show && (
          <View style={styles.selectEvent}>
            <Header>Seleccionar Audio</Header>
            <SelectList
              setSelected={val => setSelected(val)}
              data={data2}
              save="key"
              onSelect={() => SelectAudio()}
              defaultOption={data2[0]}
            />
          </View>
        )}
        {show && (
          <View style={styles.buttons}>
            <Button
              style={{width: '100%', marginBottom: 60}}
              mode="contained"
              onPress={Process}>
              Procesar
            </Button>
          </View>
        )}
        {!show && (
          <View style={styles.hidepart}>
            <Header>¿Es la primera vez que ingresas?</Header>
            <Header>Visita www.social360.app y crea tus eventos.</Header>
          </View>
        )}
      </Background>
    </ScrollView>
  );
};

export default SuccessScreen;

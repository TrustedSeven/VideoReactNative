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
import base64 from 'react-native-base64'
import DeviceInfo from 'react-native-device-info';


import Button from '../../components/Button';
import Background from '../../components/Background';
import BackButton from '../../components/BackButton'
import Header from '../../components/Header';
import {AuthContext} from '../../AuthProvider'

const SuccessScreen = ({navigation}) => {
  const [selected, setSelected] = useState('');
  const {config } = useContext(AuthContext);
  const {userProfile } = useContext(AuthContext);
  const [keyval, setKeyval] = useState(2);
  // const [idcel, setIdcel] = useState('');
  const [id_celular, setId_celular] = useState('a67b30da35525c49');
  const [v_token, setV_token] = useState();
  const [Event, setEvent] = useState();
  const [jsonData, setJsonData] = useState([]);


  // const getdeviceId = () => {
  //   var uniqueId = DeviceInfo.getUniqueId();
  //   setIdcel(uniqueId);
  //   setId_celular(idcel._z);
  // };
  useEffect(() => {
    if(config !== null) {
      Load();
    }
  }, [config]);

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

  const Load  = () =>{
    // data1.push({key:'keyval', value:keyval});
    // setKeyval(keyval+1);
    // console.log(decrypt(config.v_token, id_celular));
    const data = (decrypt(config.eventos, id_celular));
    const newJsonData = JSON.parse(data);
    let newData = [];
    Object.keys(newJsonData).forEach((key, idx) => {
      newData.push({key: idx+1, value: newJsonData[key]['nombre_evento']});
      // console.log(jsonData[key]['id_evento']);
    })
    setData1(newData);
    setJsonData(newJsonData);
    // console.log(jsonData[0]);
    // console.log(jsonData[0]);
  }

  // useEffect(() => {
  //   if(selected == "Load Options"){
  //     data1.push({key:'2', value:config.v_token})
  //   }
  // }, [selected]);


  const [data1, setData1] = useState([{key: 1, value: 'Event Options'}])

  // const data1 = [
    
  // ];

  const data2 = [
    {key: 1, value: 'Load Options'},
  ];

  const [singleFile, setSingleFile] = useState();
  const [uri, setUri] = useState();

  const [startsec, setStartsec] = useState(0);
  const [recsec, setRecsec] = useState(0);

  const SingleFilePicker = async () => {
    FFmpegKitConfig.selectDocumentForRead('*/*').then(uri => {
      FFmpegKitConfig.getSafParameterForRead(uri).then(safUrl => {
        setSingleFile(safUrl);
        console.log(singleFile);
      });
    });
  };
  const Process = async () => {
    console.log('----------------Before Start------------------');
    console.log(singleFile)
    console.log(selected)
    if(selected) {
      const selectedData = jsonData.filter((val) => {
        return val['nombre_evento'] == selected;
      })
      // console.log(selectedData[0]["cmd"])  
      // selectedData.forEach((v) => {console.log(v); console.log('-----------------')})
      let cmd1 = selectedData[0]["cmd"]['efecto 1'];
      cmd1 = cmd1.replace("input.mp4", singleFile);
      
      FFmpegKitConfig.selectDocumentForWrite('video.mp4', 'video/*').then(uri => {
        FFmpegKitConfig.getSafParameterForWrite(uri).then(safUrl1 => {
            cmd1 = cmd1.replace("out.mp4", safUrl1);
            FFmpegKit.executeAsync(cmd1);
        });
      });
  
    }
   
    
    console.log('--------End---------');

    // navigation.push('VideoPlay');
  };
  

  return (
    <ScrollView style={styles.background}>
      <Background>
        {/* <BackButton goBack={navigation.goBack} /> */}
        <View style={styles.selectEvent}>
          <Header>Select Events</Header>
          {/* <TouchableOpacity onPress={
            // data1.push({key:'4', value:config.v_token})
            // console.log(config.v_token)
            Load
            }>
            <Text style={styles.link}>Load Events</Text>
          </TouchableOpacity> */}
          {/* <Button
            style={{width: '50%'}}
            mode="contained"
            onPress={() => {
              Load
            }}>
            Load Events
          </Button> */}
          <SelectList
            setSelected={val =>setSelected(val)}
            data={data1}
            save="value"
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
        <View style={styles.secondpicker}>
          <Header>Seconds to Start  </Header>
          <NumericInput onChange={value => {
            setStartsec(value)
            }} />
        </View>
        <View style={styles.secondpicker}>
          <Header>Recording Time    </Header>
          <NumericInput
            style={{marginLeft: 10}}
            onChange={value => {
              setRecsec(value)
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
        </View>
      </Background>
    </ScrollView>
  );
};

export default SuccessScreen;

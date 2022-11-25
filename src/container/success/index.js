import styles from './styles';
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
import {RNCamera} from 'react-native-camera';
import {SelectList} from 'react-native-dropdown-select-list';
import DocumentPicker from 'react-native-document-picker';
import {Video} from 'react-native-video';
import NumericInput from 'react-native-numeric-input';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Button from '../../components/Button';
import Background from '../../components/Background';
import CameraButton from '../../components/CameraButton';
import {theme} from '../../core/theme';
import Header from '../../components/Header';

const SuccessScreen = ({navigation}) => {
  const [selected, setSelected] = useState('');

  const data = [
    {key: '1', value: 'Event 1'},
    {key: '2', value: 'Event 2'},
    {key: '3', value: 'Event 3'},
    {key: '4', value: 'Event 4'},
    {key: '5', value: 'Event 5'},
    {key: '6', value: 'Event 1'},
    {key: '7', value: 'Event 2'},
    {key: '8', value: 'Event 3'},
    {key: '9', value: 'Event 4'},
    {key: '10', value: 'Event 5'},
    {key: '11', value: 'Event 1'},
    {key: '12', value: 'Event 2'},
    {key: '13', value: 'Event 3'},
    {key: '14', value: 'Event 4'},
    {key: '15', value: 'Event 5'},
  ];

  const [singleFile, setSingleFile] = useState();

  const [startsec, setStartsec] = useState(0);
  const [recsec, setRecsec] = useState(0);

  const SingleFilePicker = async () => {
    try {
      console.log("BEFORE PICKET >>>>>>>>>>>>>>>>>>>>");
      // const file = await DocumentPicker.pick({
      //   type: [DocumentPicker.types.pdf],
      //   // copyTo: 'documentDirectory',
      // });
      const res = await DocumentPicker.pick();
      console.log("RESULT PICKET >>>>>>>>>>>>>>>>>>>>", res);

      // this.setState({ singleFileOBJ: res });
      setSingleFile(res);
      
    } catch (err) {
      console.log("FAILD PICKET >>>>>>>>>>>>>>>>>>>>", err);

      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Canceled');
      } else {
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  const Process = async() =>{
    
    console.log('Process')

  }

  return (
    <ScrollView style={styles.background}>
      <Background>
        <View style={styles.selectEvent}>
          <Header>Select Edit Option</Header>
          <SelectList
            setSelected={val => setSelected(val)}
            data={data}
            save="value"
          />
        </View>
        <View style={styles.filepicker}>
          <Header>Select Video File</Header>

          <Text> File Name: {singleFile?singleFile[0].name:''} </Text>

          {/* <Text>file Type: {singleFile.type ? singleFile.type : ''}</Text>

        <Text>File Size: {singleFile.size ? singleFile.size : ''}</Text>

        <Text>File URI: {singleFile.uri ? singleFile.uri : ''}</Text> */}
        </View>
        <View style={styles.buttons}>
          {/* <CameraButton
          onPress={() => {
            navigation.push('Camera');
          }}></CameraButton> */}
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
          <Header>Seconds to Start   </Header>
          <NumericInput onChange={value => console.log(value)} />
          {/* <Input keyboardType='numeric' /> */}
        </View>
        <View style={styles.secondpicker}>
          <Header>Recording Time     </Header>
          <NumericInput style={{marginLeft: 10}} onChange={value => console.log(value)} />
          {/* <Input keyboardType='numeric' /> */}
        </View>
        <View style={styles.selectEvent}>
          <Header>Select Audio</Header>
          <SelectList
            setSelected={val => setSelected(val)}
            data={data}
            save="value"
          />
        </View>
        <View style={styles.buttons}>
          {/* <CameraButton
          onPress={() => {
            navigation.push('Camera');
          }}></CameraButton> */}
          <Button
            style={{width: '100%', marginBottom:60}}
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

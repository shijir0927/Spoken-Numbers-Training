import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Button
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import { default as Sound } from 'react-native-sound';

const HomeScreen = () => {

  const [digits, setDigits] = useState('0');
  const [speed, setSpeed] = useState('1000');
  // const [language, setLanguage] = useState('');

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleStart = async () =>{

    for(let i=0; i<Number(digits); i++){

      //generating a random index
      let index = Math.floor(Math.random()*9);

      let sound = new Sound(audioFiles[index].url, (error) =>{
        if(error){
          alert('error ' + error.message);
          return;
        }
        sound.play(()=>{
          sound.release();
        })
      })
      //waiting for the previous number to be spoken
      await sleep(Number(speed));
    }
  }


  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >

          <Text>Spoken Numbers</Text>
          <View style = {styles.row}>
                <Text style = {styles.text}>Digits to memorise:</Text>
                <TextInput 
                    style = {styles.input} 
                    keyboardType = 'number-pad'
                    onChangeText={text => setDigits(text)}
                    value={digits}
                />
            </View>

            <View style = {styles.row}>
                <Text style = {styles.text}>Memorization Speed(ms):</Text>
                <TextInput 
                    style = {styles.input} 
                    keyboardType = 'number-pad'
                    onChangeText={text => setSpeed(text)}
                    value={speed}
                />
            </View>

            {/* <View style = {styles.row}>
                <Text style = {styles.text}>Language:</Text>
                <DropDownPicker
                  items={[
                      {label: 'English', value: 'eng'},
                      {label: 'Mongolian', value: 'mng'},
                  ]}
                  defaultIndex={0}
                  containerStyle={{width: 100}}
                  onChangeItem={item => setLanguage(item.value)}
                />
            </View> */}

            <View style = {styles.start}>
                <Button title = 'Start' onPress = {handleStart}/>
            </View>

        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
    height: '100%'
  },
  text:{
    fontSize: 20
  },
  input:{
      borderWidth:1,
      borderColor: 'grey',
      width: 100,
      height: 35,
      borderRadius: 4,
      marginLeft: 20,
      paddingLeft: 5,
      fontSize: 18
  },
  row:{
      width: 300,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
      marginLeft: 20
  },
  start:{
      marginTop: 50
  },
  video:{
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    // backgroundColor: 'red'
  }
});

export default HomeScreen;

const audioFiles = [
  {
    title: '0',
    url: require('../assets/0.wav')
  },
  {
    title: '1',
    url: require('../assets/1.wav')
  },
  {
    title: '2',
    url: require('../assets/2.wav')
  },
  {
    title: '3',
    url: require('../assets/3.wav')
  },
  {
    title: '4',
    url: require('../assets/4.wav')
  },
  {
    title: '5',
    url: require('../assets/5.wav')
  },
  {
    title: '6',
    url: require('../assets/6.wav')
  },
  {
    title: '7',
    url: require('../assets/7.wav')
  },
  {
    title: '8',
    url: require('../assets/8.wav')
  },
  {
    title: '9',
    url: require('../assets/9.wav')
  },

]
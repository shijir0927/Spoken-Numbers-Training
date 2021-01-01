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

const App = () => {

  const [digits, setDigits] = useState('');
  const [speed, setSpeed] = useState('');
  const [language, setLanguage] = useState('');

  const zero = new Sound('0.vaw', Sound.MAIN_BUNDLE, (error) =>{
    if(error) return;
  })

  const handleClick = () =>{
    // alert(`Memorizing ${digits} numbers with ${speed} speed in ${language}`)
    zero.play((success)=>{
      if(success) alert('finished playing');
      else alert('error occured');
    })
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
                <Text style = {styles.text}>Memorization Speed:</Text>
                <TextInput 
                    style = {styles.input} 
                    keyboardType = 'number-pad'
                    onChangeText={text => setSpeed(text)}
                    value={speed}
                />
            </View>

            <View style = {styles.row}>
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
            </View>

            <View style = {styles.start}>
                <Button title = 'Start' onPress = {handleClick}/>
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

export default App;

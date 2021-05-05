import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Button,
  TouchableOpacity,
  Modal,
  Pressable
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { default as Sound } from 'react-native-sound';

const PRIMARY_COLOR= '#4265d6';
const SECONDARY_COLOR='#F2AC20';
const TEXT_COLOR = '#293855';
const LIGH_COLOR = '#C2E7C9';

const App = () => {

  const [digits, setDigits] = useState('0');
  const [recall, setRecall] = useState('');
  const [speed, setSpeed] = useState('1000');
  const [generatedDigits, setGeneratedDigits] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [stopPressed, setStopPressed] = useState(false);

  // const [language, setLanguage] = useState('');

  const sleep = (ms) => {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }

  const handleStart = async () =>{
    setStopPressed(false);
    setModalVisible(true);
    setTimeout(()=>{}, 5000)
    for(let i=0; i<Number(digits); i++){
      if(stopPressed){
        setModalVisible(false)
        break
      }
      //generating a random index
      let index = Math.floor(Math.random()*9);
      setGeneratedDigits(generatedDigits => generatedDigits.concat(index));
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

      if(i === Number(digits)-1){
        setModalVisible(false)
      }
    }    
  }
  
  const handleFinish = () =>{
    let result = 0;
    for(let i = 0; i<generatedDigits.length; i++){
      if(generatedDigits[i] == recall[i]) result++;
    }
    (generatedDigits !== [] && recall !== '') && alert(result)
    setGeneratedDigits([]);
    setDigits('0')
    setStopPressed(false)
  }

  const handleStop = () =>{
    setModalVisible(false);
    setStopPressed(true)
  }


  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView style={{height: '100%'}}>
          <View style={styles.scrollView}>
          
          <Text style={styles.header}>Spoken Numbers</Text>
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
              <Text style = {styles.text}>Frequency(ms):</Text>
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

          <TouchableOpacity style = {styles.button} activeOpacity={0.8} onPress={handleStart}>
              <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>

          {/* <View style={styles.row}>
            <Text style={styles.text}>Recall here:</Text>
          </View> */}
          
          <TextInput 
            style = {styles.recallInput} 
            keyboardType = 'number-pad'
            onChangeText={text => setRecall(text)}
            value={recall}
            maxLength={Number(digits)}
            placeholder="recall"
            multiline={true}
          />

          <TouchableOpacity style = {styles.button} activeOpacity={0.8} onPress={handleFinish}>
            <Text style={styles.buttonText}>Evaluate</Text>
          </TouchableOpacity>

          {generatedDigits.map((d, index) =>{
            return <Text key = {index}>{d}{stopPressed.toString()}</Text>
          })}
          </View> 
          <Text>digits: {digits}</Text>
          <Text>modal: {modalVisible.toString()}</Text>
          <Text>stop pressed: {stopPressed.toString()}</Text>
        </ScrollView>

        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Spoken numbers has been closed.");
          setModalVisible(!modalVisible);
        }}
        >
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Memorization in progress!</Text>
            <Pressable
              style={styles.modalButton}
              onPress={handleStop}
            >
              <Text style={{color: 'white'}}>Stop</Text>
            </Pressable>
          </View>
        </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView:{
    display:'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    // backgroundColor: LIGH_COLOR
  },
  header:{
    fontSize: 32,
    fontWeight: 'bold',
    textAlign:'center',
    marginBottom: 40,
  },
  text:{
    fontSize: 20,
    // color: TEXT_COLOR
  },
  input:{
    borderWidth:1,
    borderColor: 'grey',
    width: 100,
    height: 35,
    borderRadius: 4,
    paddingLeft: 5,
    fontSize: 18
  },
  recallInput: {
    borderWidth:1,
    borderColor: 'grey',
    width: '90%',
    minHeight: 35,
    borderRadius: 4,
    paddingLeft: 5,
    fontSize: 18,
    marginTop: 20
  },
  row:{
      width: '90%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
      marginLeft: 10,
      marginRight: 10
  },
  button:{
      marginTop: 40,
      marginBottom:40,
      width: '90%',
      height: 50,
      backgroundColor: PRIMARY_COLOR,
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
  },
  buttonText:{
    fontSize: 20,
    fontWeight: '600',
    color: 'white'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalButton:{
    height: 'auto',
    width: '100%',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_COLOR,
    padding: 10,
    marginTop:20
  }
});

export default App;

const audioFiles = [
  {
    title: '0',
    url: require('./assets/0.wav')
  },
  {
    title: '1',
    url: require('./assets/1.wav')
  },
  {
    title: '2',
    url: require('./assets/2.wav')
  },
  {
    title: '3',
    url: require('./assets/3.wav')
  },
  {
    title: '4',
    url: require('./assets/4.wav')
  },
  {
    title: '5',
    url: require('./assets/5.wav')
  },
  {
    title: '6',
    url: require('./assets/6.wav')
  },
  {
    title: '7',
    url: require('./assets/7.wav')
  },
  {
    title: '8',
    url: require('./assets/8.wav')
  },
  {
    title: '9',
    url: require('./assets/9.wav')
  },

]
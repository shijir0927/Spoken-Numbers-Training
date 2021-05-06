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
  Pressable,
  Switch
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { default as Sound } from 'react-native-sound';
import {audioFiles} from './assets';

const PRIMARY_COLOR= '#4265d6';
const SECONDARY_COLOR='#F2AC20';
const TEXT_COLOR = '#293855';
const LIGH_COLOR = '#C2E7C9';

let stopPressed = false;
const TIME = 20;

const App = () => {

  const [digits, setDigits] = useState('0');
  const [recall, setRecall] = useState('');
  const [speed, setSpeed] = useState('1000');
  const [generatedDigits, setGeneratedDigits] = useState([]);
  const [score, setScore] = useState(0);
  const [correctDigits, setCorrectDigits] = useState(0);
  const [memoModalVisible, setMemoModalVisible] = useState(false);
  const [recallModalVisible, setRecallModalVisible] = useState(false);
  const [countDownTime, setCountDownTime] = useState(20)
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  // const [language, setLanguage] = useState('');

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleStart = async () =>{

    if(digits === '' || Number(digits)===0) return
    stopPressed = false;

    if(isEnabled){
      setMemoModalVisible(true)
      startCountdownTimer();
      await sleep(20000)
      setIsEnabled(false)
    }

    setGeneratedDigits([]);
    setMemoModalVisible(true);
    setScore(0)

    for(let i=0; i<Number(digits); i++){
      if(stopPressed){
        setMemoModalVisible(false)
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
        setMemoModalVisible(false)
      }
    }    
  }
  
  const handleFinish = () =>{
    let scoreTemp = 0;
    let correctDigitsTemp = 0;
    for(let i = 0; i<generatedDigits.length; i++){
      if(generatedDigits[i] !== Number(recall[i])){
        scoreTemp = i;
        break;
      }else{
        scoreTemp = i+1;
      }
    }

    for(let i = 0; i<generatedDigits.length; i++){
      if(generatedDigits[i] == recall[i]){
        correctDigitsTemp++;
      }
    }


    if(generatedDigits !== [] && recall !== ''){
      setScore(scoreTemp)
      setCorrectDigits(correctDigitsTemp)
      setRecallModalVisible(true)
    }
    stopPressed = false;
  }

  const handleStop = () =>{
    setMemoModalVisible(false);
    stopPressed = true;
  }

  const startCountdownTimer = ()=>{
    let timeLeft = 20;
    let timer = setInterval(()=>{
      if(timeLeft < 1){
        clearInterval(timer);
        setIsEnabled(false);
        setCountDownTime(20);
        timeLeft = 20;
      }
      timeLeft --;
      setCountDownTime(time=> time-1);
    }, 1000)
  }

  const handleCancel = () =>{
    setMemoModalVisible(false)
    setIsEnabled(false);
    stopPressed = true;
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

          <View style={styles.row}>
            <Text style={styles.text}>Concentration time(20s):</Text>
            <Switch
              trackColor={{ false: "grey", true: PRIMARY_COLOR }}
              // thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
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
            maxLength={generatedDigits.length}
            placeholder="recall"
            multiline={true}
          />

          <TouchableOpacity style = {styles.button} activeOpacity={0.8} onPress={handleFinish}>
            <Text style={styles.buttonText}>Evaluate</Text>
          </TouchableOpacity>

          {/* {generatedDigits.map((d, index) =>{
            return <Text key = {index}>{d}</Text>
          })} */}
          </View> 
          {/* <Text>digits: {digits}</Text>
          <Text>modal: {memoModalVisible.toString()}</Text>
          <Text>stop pressed: {stopPressed.toString()}</Text>
          <Text>score: {score.toString()}</Text> */}
          {/* <Text>Recall: {recall[0]} generated {generatedDigits[0]}</Text> */}
        </ScrollView>

        <Modal
        animationType="slide"
        transparent={true}
        visible={memoModalVisible}
        onRequestClose={() => {
          Alert.alert("Spoken numbers has been closed.");
          setMemoModalVisible(!memoModalVisible);
        }}
        >
          <View style={styles.centeredView}>
            {isEnabled ? 
            <View style={styles.modalView}>
              <Text style={styles.text}>{countDownTime}</Text>
              <Pressable
                style={styles.modalButton}
                onPress={handleCancel}
              >
                <Text style={{color: 'white'}}>Cancel</Text>
              </Pressable>
            </View>
            :<View style={styles.modalView}>
              <Text style={styles.modalText}>Memorization in progress!</Text>
              <Pressable
                style={styles.modalButton}
                onPress={handleStop}
              >
                <Text style={{color: 'white'}}>Stop</Text>
              </Pressable>
            </View>}
          </View>
        </Modal>

        <Modal
        animationType="slide"
        transparent={true}
        visible={recallModalVisible}
        onRequestClose={() => {
          Alert.alert("Spoken numbers has been closed.");
          setMemoModalVisible(!recallModalVisible);
        }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>You got {score} point{score > 1 && 's'}! ({`${correctDigits}/${generatedDigits.length}`})</Text>
              <View style={styles.recallResult}>
                {generatedDigits.map((d, index) =>{
                  let color = 'black';
                  if(d !== Number(recall[index])){
                    color = 'red'
                  }
                  return <Text key = {index} style={{color: color, fontSize:20, letterSpacing: 3}}>{d}</Text>
                })}
              </View>
              <Pressable
                style={styles.modalButton}
                onPress={()=>setRecallModalVisible(false)}
              >
                <Text style={{color: 'white'}}>Close</Text>
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
    marginBottom: 20,
    marginTop: 20
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
    padding: 5,
    fontSize: 18
  },
  recallInput: {
    borderWidth:1,
    borderColor: 'grey',
    width: '90%',
    minHeight: 35,
    borderRadius: 4,
    padding: 5,
    fontSize: 18,
    marginTop: 20,
    letterSpacing: 2
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
  },
  modalText:{
    fontSize: 24,
    marginBottom: 20
  },
  recallResult:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'flex-start'
  }
});

export default App;
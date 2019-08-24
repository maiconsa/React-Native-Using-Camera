import React,{Component} from 'react';
import {StyleSheet,TouchableOpacity,Text,ToastAndroid,View,Image,Dimensions} from 'react-native';

import Video from 'react-native-video';

import {createAppContainer,createStackNavigator} from 'react-navigation';

import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
const {width,height} = Dimensions.get('window');



class CameraScreen extends Component{

  state = {
    type : 'back',
    flash: 'on',
    
    colorCameraButton: "#000",
    iconCameraButton : 'ios-radio-button-on',
    recordTime:0,
    isRecording: false
  }
  /* 
   *  Toggles Events Handler
  */
  toggleFacing = () =>{
    this.setState({
      type: this.state.type ==  'back' ? 'front' : 'back'
    });
  }

  toggleFlash = ()=> {
    this.setState({
      flash: this.state.flash == 'off' ? 'on' : 'off'
    });
  }
  takePicture = async () =>{
    if(this.camera){
      const {uri} = await this.camera.takePictureAsync({});
      if(uri){
  
            this.props.navigation.navigate('PictureVideoPreview',{type:'picture','uri' : uri});
      }

    }
  }

  recordVideo =  async () =>{
    this.setState({recordTime : 0.0,
      colorCameraVideoButton:"#F00",
      iconCameraVideButton:"ios-videocam",
      isRecording:true
      });

    this.setState();
      this.timerId = setInterval(()=>{ 
        this.setState({recordTime : this.state.recordTime+0.1});
      },100);
 
         const { uri,isRecordingInterrupted} = await this.camera.recordAsync();
         if(uri){
          this.props.navigation.navigate('PictureVideoPreview',{type:'video','uri' : uri});
         }
 
   
     
     
  }

  unpress = ()=>{
    if(this.state.isRecording){
      this.setState({colorCameraButton:"#000"});
     this.setState({iconCameraButton:"ios-radio-button-on"});
      clearInterval(this.timerId);
      this.camera.stopRecording();

      this.setState({isRecording: false});
    }
    
  }

  render(){return(

        <RNCamera
        ref={ref => this.camera = ref}
          style={styles.camera}
          type={this.state.type}
          flash={this.state.flash}
        >
          { this.state.isRecording && <Text style={styles.timerText}>{this.state.recordTime.toFixed(2)}s</Text>}
          {/*
            Controls Camera
          */}
         <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={this.toggleFacing}>
          <Icon size={32} name="ios-reverse-camera" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPressOut={this.unpress} onLongPress={this.recordVideo} onPress={this.takePicture} >
          <Icon size={48} color={this.state.colorCameraButton}  name={this.state.iconCameraButton} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.toggleFlash} >
              <Icon size={32} name={this.state.flash == 'off' ? "md-flash" : "md-flash-off"} />
          </TouchableOpacity>
        </View>

        </RNCamera>

  )};
}

const styles = StyleSheet.create({
    camera:{
      flex:1,
      alignItems:"center"
    
    },
    controls:{
      flex:1,
      flexDirection:"row",
      alignItems: 'center',
      justifyContent: 'center',
      bottom:10,
      position:"absolute",

    },
    timerText:{
        margin:15,
        fontWeight:"bold",
        color:"#FFF",
        fontSize:25
    },
    button:{
      flex:1,
      backgroundColor:"rgba(255,255,255,0.5)",
      marginLeft:5,
      alignItems:"center",
      borderRadius:200
    },
    previewContainer:{
      flex:1,
      alignItems:"stretch"
    },
    resourcePreview:{
         flex:1,
    }

   
});

class PreviewScreen extends Component{

  constructor(props){
    super(props)
    this.state = {
      uri:this.props.navigation.getParam('uri'),
      type: this.props.navigation.getParam('type')
    };
  }
 


  render(){return(
    <View style={styles.previewContainer}>
      {
        this.state.type== 'picture' &&
        <Image  style={styles.resourcePreview} source={{uri:this.state.uri}} />
      }

      {
           this.state.type== 'video' &&
         <Video controls={true} paused={true} source={{uri:this.state.uri}} style={styles.resourcePreview} />
      }
    </View>
  )};
}

const stack = createAppContainer(
  createStackNavigator(
  //Routes Config
    {
      Home:{
        screen:CameraScreen,
        navigationOptions: {
          header:null
        }
        
      },
      PictureVideoPreview:{
        screen:PreviewScreen,
        navigationOptions:({navigation}) =>{
          //Handler Props
          const title =  'Preview - ' + navigation.getParam('type');

          //Always return the properties
          return {
              title,
          }
        }
      }
  },
  //Options
  {
    initialRouteName: 'Home',
    defaultNavigationOptions:{
      headerStyle:{
        backgroundColor:"#000",
      },
      headerTitleStyle:{
        fontWeight:"bold",
        color:"#fff"
      },
      headerTintColor:"#fff",
    }

}));


export default stack;
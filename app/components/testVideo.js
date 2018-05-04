/*
* @Author: huanghanzhilian
* @Date:   2018-04-28 10:07:47
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-05-03 18:50:54
*/
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  InteractionManager
} from 'react-native';
const vttToJson = require("vtt-to-json")
//const VideoPlayer=require('awesome-react-native-video-controls')
//import VideoPlayer from 'awesome-react-native-video-controls';
import VideoPlayer from './watch/videoControls';

var {height, width} = Dimensions.get('window');
import Head from './header/head';
var request=require('../common/request')

export default class topTitle extends Component {
  constructor(props){
    super(props)
    this.state={
      videoUrl:'http://video.samuredwonder.com/video%2Fuser%2F33%2Flngc1yQfV5HoVgoDrbQmP0zroRmT.mp4.m3u8?pm3u8/0/expires/90334&e=1524934864&token=vcZj_ZMWMJ8gU759Lfsd8_A2jgriPXGS6tBJX1Ss:M4uhw7T2lP57siAr79djan-dMbI=',
      subtitle:[],
      subtitle2:[{
         "startTime": "00:00:04,123", //hh:mm:ss,SSS
         "endTime": "00:00:05,001",
         "part": "When you convert your subtitle file, you might need to modify your JSON"
      },
      {
         "startTime": "00:00:08,008",
         "endTime": "00:00:09,876",
         "part": "Before passing it to the VidePlayer component"
      }],



      isFullScreen:false,
      videoWidth: width,
      videoHeight: width * 9/16, // 默认16：9的宽高比
    }
  }
  componentDidMount(){
    InteractionManager.runAfterInteractions(()=>{  
      request.XMLget('http://static.samuredwonder.com/subtitle/user/33/FjHW2dxyeSG1enp6u-0-5rp_-DuV.vtt')
      .then((data)=>{
        vttToJson(data)
        .then((result)=>{
          this.setState({
            subtitle:result
          })
          //console.log(result)
        })
      })
    })
  }
  render() {
    return (
      <View style={styles.container}>
      	{/*<Head title='视频字幕测试' navigator={this.props.navigator} />*/}
        <View style={{width: this.state.videoWidth,height: this.state.videoHeight,backgroundColor:'#000000',paddingTop:15}}>
          <VideoPlayer
              style={{width: this.state.videoWidth,height: this.state.videoHeight,backgroundColor:'#000000',paddingTop:15}}
              source={{ uri: this.state.videoUrl}}
              navigator={ this.props.navigator }
              onFullStatus={(status)=>this._fullStatus(status)} 
              //toggleFullscreen={YourCustomizedFunction}
              subtitle={this.state.subtitle}
              isSubtitle={true}
              isFullScreen={this.state.isFullScreen}
              videoTitle='这是视频的标题这是视频'//标题
          /> 
        </View>
           
      </View>
    )
  }
  componentWillUnmount() {
    //_isMounted=false
    this.setState = () => {};
  }
  _fullStatus(status){
    var {height, width} = Dimensions.get('window');

    let state = this.state;
    if(status){
      state.videoWidth=width;
      state.videoHeight=height;
      state.isFullScreen = true;
    }else{
      state.videoWidth=width;
      state.videoHeight=width * 9/16;
      state.isFullScreen = false;
    }
    //console.log(this)
    this.setState(state);
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  VideoPlayerstyles:{
    width: width,
    height: width * 9/16,
    backgroundColor:'#000000'
  }
});
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
  LayoutAnimation,//当布局变化时，自动将视图运动到它们新的位置上。
} from 'react-native';

var {height, width} = Dimensions.get('window');
import Video from "react-native-video"
import Icon from 'react-native-vector-icons/Ionicons';

import Nav from './widgets/nav';
export default class PlayVid extends Component {
 constructor(props, context, ...args) {
    super(props, context, ...args);
    this.state = {
      showVideoPlayer: true,
      narrowVideo:false,
      video:{
        position:'absolute',
        right:-146,
        top:146,
        width:height,
        height:width,
        backgroundColor:'rgba(0,0,0,0.9)',
        transform: [{rotate: '90deg'}],
      },
      //视频控制相关
      rate:1,// 1为正常
      muted:false,
      resizeMode:'contain',//填满整个屏幕宽高比。*
      repeat:false,//是否重复播放
      playing:false,//是否播放结束
      videoLoaded:false,//视频加载中动画  加载完毕
      videoProgress:0.01,//进度条
      videoTotal:0,//视频整个时间
      currentTime:0,//当前时间
      paused:false,//是否暂停
      videoOk:true,//视频是否出错
    }

    

  }

  onClosePressed() {
    this.setState({showVideoPlayer: false});
  }

  componentDidMount(){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setTimeout(() => this.setVideo(), 3000)

  }

  setVideo(){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    // this.setState({
    //   video:{
    //       position:'absolute',
    //       right:5,
    //       top:height-90,
    //       width:150,
    //       height:80,
    //       backgroundColor:'rgba(0,0,0,0.9)',
    //       transform: [{rotate: '0deg'}],
  
    //     }
    // })
    this.setState({
      narrowVideo:true
    })
  }

  render() {
    return (
      <View style={[!this.state.narrowVideo?styles.container:styles.container1]}>
        <View style={[!this.state.narrowVideo?styles.playBox:styles.playBox1]}>
          <View style={[!this.state.narrowVideo?styles.videoBox:styles.videoBox1]}>
            <Video
              source={require('./kid.mp4')}
              style={[!this.state.narrowVideo?styles.video:styles.video1]}
              ref='videoPlayer'

              volume={1.0}//0是柔和的,1是正常的
              paused={this.state.paused} //是否暂停 true为暂停
              rate={this.state.rate}//视频速度 1为正常
              muted={this.state.muted} //音频
              resizeMode={this.state.resizeMode}//填满整个屏幕宽高比。*
              repeat={this.state.repeat}//是否重复播放

              onLoadStart={this._onLoadStart.bind(this)}//回调视频启动时加载
              onLoad={this._onLoad.bind(this)} //视频载入时回调
              onProgress={this._onProgress.bind(this)} //回调与currentTime每~ 250毫秒
              onEnd={this._onEnd.bind(this)}
              onError={this._onError.bind(this)}
            />
            {
              !this.state.narrowVideo
              ?<View>
                {
                  !this.state.videoLoaded&&<ActivityIndicator color='#ee735c' style={styles.loading} />
                }

                {
                  //加载中&未播放结束
                  this.state.videoLoaded&&!this.state.playing
                  ?<Icon
                    onPress={this._rePlay}
                    name='ios-play'
                    style={styles.playIcon}
                    size={48}
                  />
                  :null
                }

                {
                  this.state.videoLoaded&&this.state.playing
                  ?<TouchableOpacity onPress={this._pause.bind(this)} style={styles.pauseBtn}>
                    {
                      //是否暂停了
                      this.state.paused
                      ?<Icon
                        name='ios-play'
                        style={styles.resumeIcon}
                        size={48}
                      />
                      :null
                    }
                  </TouchableOpacity>
                  :null
                }

                {
                  !this.state.videoOk&&<Text style={styles.failText}>视频出错了！很抱歉</Text>
                }
                <TouchableOpacity onPress={this._leap.bind(this)}>
                  <View style={styles.progressBox}>
                    <View style={[styles.progressBar,{width:width*this.state.videoProgress}]}></View>
                  </View>
                </TouchableOpacity>
              </View>
              :null
            }
              
          </View>
          
        </View> 
        <Text>123</Text>
      </View>
       
    )
  }

  /*视频控制相关方法s */ 

  //当视频开始加载那一刹那来调用
  _onLoadStart(){
    console.log('当视频开始加载那一刹那来调用')
  }

  //当视频在不断地加载 会不断地来触发
  _onLoad(){
    console.log('当视频在不断地加载 会不断地来触发')
  }

  //当视频在播放时的时候每隔250毫秒会来调用一下
  _onProgress(data){
    if(!this.state.videoLoaded){
      this.setState({
        videoLoaded:true
      })
    }


    var duration=data.seekableDuration;
    var currentTime=data.currentTime;
    var precent=Number((currentTime/duration).toFixed(2));//比例
    var newState={
      videoTotal:duration,
      currentTime:Number(data.currentTime.toFixed(2)),
      videoProgress:precent
    }

    if(!this.state.videoLoaded){
      newState.videoLoaded=true
    }
    if(!this.state.playing){
      newState.playing=true
    }

    this.setState(newState)

    //console.log(data)
    //console.log('当视频在播放时的时候每隔250毫秒会来调用一下')
  }


  //播放结束
  _onEnd(){
    this.setState({
      videoProgress:1,
      playing:false
    })
    console.log('播放结束')
  }

  //视频出错的时候
  _onError(e){
    this.setState({
      videoOk:false
    })
    console.log(e)
    console.log('视频出错的时候')
  }

  //重新播放视频
  _rePlay(){
    console.log(this)
    this.refs.videoPlayer.seek(0)
  }

  //暂停
  _pause(){
    if(!this.state.paused){
      this.setState({
        paused:true
      })
    }else{
      this.setState({
        paused:false
      })
    } 
  }

  //开始播放按钮
  _resume(){
    if(this.state.paused){
      this.setState({
        paused:false
      })
    } 
  }

  _leap(e){
    // console.log(width);
    // console.log(e.nativeEvent.pageX);
    
    var pswpo=Number((e.nativeEvent.pageX/width).toFixed(2))
    var videoTotal=Number((this.state.videoTotal*pswpo).toFixed(2))
    console.log(videoTotal)
    this.refs.videoPlayer.seek(videoTotal)
    // console.log(e.nativeEvent.target);
  }
  /*视频控制相关方法e */
}

const styles = StyleSheet.create({
  container: {
    width:width,
    height:height,
    position:'absolute',
    top:0,
    left:0,
    backgroundColor:'#212121'

  },

  playBox:{
    flex:1,
    paddingTop:20,
    borderBottomColor:'#fff',
  },

  videoBox:{
    width:width,
    height:width*0.56,
    backgroundColor:'#000'
  },
  container1:{
    position:'absolute',
    right:5,
    top:height-190,
    width:150,
    height:80,
    backgroundColor:'rgba(0,0,0,0.9)',
    transform: [{rotate: '0deg'}],
  },
  playBox1:{

  },
  videoBox1:{

  },

  video:{
    width:width,
    height:width*0.56,
    backgroundColor:'#000'
  },

  video1:{
    position:'absolute',
    top:0,
    left:0,
    width:150,
    height:80,
    backgroundColor:'rgba(0,0,0,0.9)',
    //transform: [{rotate: '0deg'}],
  },

  loading:{
    position:'absolute',
    left:0,
    top:80,
    width:width,
    alignSelf:'center',
    backgroundColor:'transparent'
  },

  progressBox:{
    width:width,
    height:10,
    backgroundColor:'#ccc',
  },
  progressBar:{
    width:1,
    height:10,
    backgroundColor:'#ff6600'
  },
  playIcon:{
    position:'absolute',
    top:90,
    left:width/2-30,
    width:60,
    height:60,
    paddingTop:8,
    paddingLeft:22,
    backgroundColor:'transparent',
    borderColor:'#fff',
    borderWidth:1,
    borderRadius:30,
    color:'#ed7b66'
  },
  pauseBtn:{
    width:width,
    height:width*0.56,
    position:'absolute',
    top:0,
    left:0,
  },
  resumeIcon:{
    position:'absolute',
    top:80,
    left:width/2-30,
    width:60,
    height:60,
    paddingTop:8,
    paddingLeft:22,
    backgroundColor:'transparent',
    borderColor:'#fff',
    borderWidth:1,
    borderRadius:30,
    color:'#ed7b66'
  },
  failText:{
    position:'absolute',
    left:0,
    top:90,
    width:width,
    textAlign:'center',
    color:'#fff',
    backgroundColor:'transparent'
  },


  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});


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
  TouchableHighlight,
  View,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  LayoutAnimation,//当布局变化时，自动将视图运动到它们新的位置上。
} from 'react-native';

var {height, width} = Dimensions.get('window');
import Video from "react-native-video"
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

var request=require('../common/request')
var config=require('../common/config');
import Nav from './widgets/nav';
import {timeCycle,formatDuring} from '../common/util'
import TopTitle from './watch/topTitle';
import ShareWrap from './watch/shareWrap';
import UpInfo from './watch/upInfo';
import RecommendList from './watch/recommendList';




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

      //请求到的数据
      recommends:[],//推荐列表
      toPlayInfo:null,//当前视频相关信息
      videoUri:'1',

      //全屏逻辑
      isFullScreen:false
    }

    

  }

  onClosePressed() {
    this.setState({showVideoPlayer: false});
  }

  componentDidMount(){

    this._fetchData()





    console.log('启动播放页了')
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    //setTimeout(() => this.setVideo(), 3000)

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
    //this.state.narrowVideo
    if(this.state.narrowVideo){
      this.setState({
        narrowVideo:false
      })
    }else{
      this.setState({
        narrowVideo:true
      })
    }
    return 1
    // this.setState({
    //   narrowVideo:true
    // })
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={1} onPress={this._recovery.bind(this)} style={[!this.state.narrowVideo?styles.container:styles.container1]}>
        <View style={[!this.state.narrowVideo?styles.playBox:styles.playBox1]}>
          <View style={[!this.state.narrowVideo?styles.videoBox:styles.videoBox1,this.state.isFullScreen?styles.videoFullScreen:null]}>
            {
              this.state.videoUri
              ?<Video
                source={require('./kid.mp4')}
                //source={{uri: this.state.videoUri}}
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
              :null
            }
              
 

            {
              !this.state.narrowVideo&&!this.state.videoLoaded&&<ActivityIndicator color='#ee735c' style={styles.loading} />
            }

            {
              //加载中&未播放结束
              !this.state.narrowVideo&&this.state.videoLoaded&&!this.state.playing
              ?<Icon
                onPress={this._rePlay}
                name='ios-play'
                style={styles.playIcon}
                size={48}
              />
              :null
            }

            {
              !this.state.narrowVideo&&this.state.videoLoaded&&this.state.playing
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
              !this.state.narrowVideo&&!this.state.videoOk&&<Text style={styles.failText}>视频出错了！很抱歉</Text>
            }
            {
              !this.state.narrowVideo
              ?<TouchableOpacity onPress={this._videoDown.bind(this)} style={styles.zoomBtnBox}>
                <Icon
                  name='ios-arrow-down'
                  style={styles.zoomBtnIcon}
                  size={24}
                />
              </TouchableOpacity>
              :null
            }
            {
              //时长视图 全屏
              !this.state.narrowVideo
              ?<View style={styles.videoControllerBox}>
                <View style={styles.videoControllerBoxl}>
                  <Text style={styles.currentTimeCtl}>{formatDuring(this.state.currentTime)}</Text>
                </View>
                <View style={styles.videoControllerBoxr}>
                  <Text style={styles.videoTotalCtl}>{formatDuring(this.state.videoTotal)}</Text>
                  <Icon2
                    onPress={this._fullScreen.bind(this)}
                    name='fullscreen'
                    style={styles.fullscreenIcon}
                    size={24}
                  />
                </View>
              </View>
              :null
            }
            {
              !this.state.narrowVideo
              ?<TouchableOpacity style={styles.progressBox} onPress={this._leap.bind(this)}>
                <View style={styles.progressBox}>
                  <View style={[styles.progressBar,{width:width*this.state.videoProgress}]}></View>
                </View>
              </TouchableOpacity>
              :null
            }
              
              
              
          </View>
          
        </View> 
        {
          //视频相关信息 集合组件  <RecommendList data={this.state.recommends} />
          !this.state.narrowVideo&&!this.state.isFullScreen&&this.state.toPlayInfo&&this.state.recommends
          ?<ScrollView contentContainerStyle={styles.contentContainer}>
            <View>
              <TopTitle 
                {...this.props} 
                navigator={navigator} 
                data={this.state.toPlayInfo} />
              <ShareWrap data={this.state.toPlayInfo} />
              <UpInfo 
                {...this.props} 
                navigator={this.props.navigator} 
                data={this.state.toPlayInfo}
                videoDown={()=>this._videoDown()}
              />
              <RecommendList data={this.state.recommends} />
              
              
            </View>
          </ScrollView>
          :null

        }        
      </TouchableOpacity>
       
    )
  }

  //获取相关数据
  async _fetchData(){
    var _id=this.props.videoInfo.id
    await request.get(config.api.base+config.api.videoinfo,{
      id:_id
    })
    .then((data)=>{
      if(data&&data.code==0){
        this.setState({
          recommends:data.data.recommends,
          toPlayInfo:data.data.toPlayInfo
        })
        //console.log(this.state.recommends)
      }
    })
    await request.get(config.api.base+config.api.videourl,{
      id:_id
    })
    .then((data)=>{
      console.log(data)
      if(data&&data.code==0){
        this.setState({
          videoUri:data.data.videoUrls[0].url
        })
      }
    })

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

  //缩小视频
  _videoDown(){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setVideo()
  }

  //恢复播放页
  _recovery(){
    if(this.state.narrowVideo){
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      this.setVideo()
    }
  }
  //全屏
  _fullScreen(){
    var isFullScreen=!this.state.isFullScreen
    this.setState({
      isFullScreen:isFullScreen
    })
    
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
    //flex:1,
    paddingTop:20,
    width:width,
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
  videoFullScreen:{
    position:'absolute',
    right:-146,
    top:146,
    width:height,
    height:width,
    backgroundColor:'rgba(0,0,0,0.9)',
    transform: [{rotate: '90deg'}],
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
    position:'absolute',
    left:0,
    bottom:0,
    width:width,
    height:4,
    backgroundColor:'#ccc',
  },
  progressBar:{
    
    width:1,
    height:4,
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
    //borderColor:'#fff',
    //borderWidth:1,
    //borderRadius:30,
    color:'#fff'
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
    //borderColor:'#fff',
    //borderWidth:1,
    //borderRadius:30,
    color:'#fff'
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
  zoomBtnBox:{
    position:'absolute',
    left:10,
    top:10,
    width:40,
    height:20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomBtnIcon:{
    color:'#fff',
    backgroundColor:'transparent'
  },
  videoControllerBox:{
    position:'absolute',
    left:0,
    bottom:10,
    width:width,
    height:20,
    //backgroundColor:'red',
    flexDirection:'row',
    //justifyContent: 'center',
    justifyContent:'space-between',
    alignItems: 'center',
    paddingLeft:10,
    paddingRight:10,

  },
  videoControllerBoxl:{

  },
  currentTimeCtl:{
    fontSize:14,
    color:'#fff',
    backgroundColor:'transparent',
  },
  videoControllerBoxr:{
    flexDirection:'row',
    alignItems: 'center',
  },
  videoTotalCtl:{
    fontSize:14,
    color:'#fff',
    marginRight:10,
    backgroundColor:'transparent',
  },
  fullscreenIcon:{
    color:'#fff',
    backgroundColor:'transparent',
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


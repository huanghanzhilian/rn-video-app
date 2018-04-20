import React, {Component} from 'react';
import {View, Dimensions, 
  Image, 
  Text, 
  Slider, 
  TouchableWithoutFeedback, 
  TouchableOpacity, 
  Button, 
  StyleSheet,
  InteractionManager,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';
import Toast, {DURATION} from 'react-native-easy-toast'
import RNFetchBlob from 'react-native-fetch-blob'
import StaticServer from 'react-native-static-server';

import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

var request=require('../common/request')
var config=require('../common/config');
import TopTitle from './watch/topTitle';
import ShareWrap from './watch/shareWrap';
import UpInfo from './watch/upInfo';
import RecommendList from './watch/recommendList';
const screenWidth = Dimensions.get('window').width;

function formatTime(second) {
  let h = 0, i = 0, s = parseInt(second);
  if (s > 60) {
    i = parseInt(s / 60);
    s = parseInt(s % 60);
  }
  // 补零
  let zero = function (v) {
    return (v >> 0) < 10 ? "0" + v : v;
  };
  return [zero(h), zero(i), zero(s)].join(":");
}

var timerq=null

export default class VideoPlayScreen extends Component {
  
  static navigationOptions = {
    headerTitle: '测试视频播放'
  };
  
  constructor(props) {
    super(props);
    this.state = {
      videoUrl: "http://124.129.157.208:8810/SD/2017qingdao/xiaoxueEnglish/grade3/b/1.mp4",
      videoCover: "http://124.129.157.208:8889/data/uploads/kecheng/2018/01/18/5a600b2c99836.png@0o_0l_220w.png",
      videoWidth: screenWidth,
      videoHeight: screenWidth * 9/16, // 默认16：9的宽高比
      showVideoCover: false,    // 是否显示视频封面
      showVideoControl: false, // 是否显示视频控制组件
      isPlaying: true,        // 视频是否正在播放
      isPlaying2:false,
      isPlaying3:false,
      currentTime: 0,        // 视频当前播放的时间
      currentTime2:0,
      duration: 0,           // 视频的总时长
      isFullScreen: false,     // 当前是否全屏显示
      playFromBeginning: false, // 是否从头开始播放
      videoLoaded:false,//视频加载中动画  加载完毕
      isDrag:false,//是否正在拖动

      //请求到的数据
      recommends:[],//推荐列表
      toPlayInfo:null,//当前视频相关信息
      videoUri:'',

      testimage:'',
      testVideo:'/Users/macintoshhd/Library/Developer/CoreSimulator/Devices/598B2F69-EEF0-4BAB-8509-1345D0BE81D8/data/Containers/Data/Application/EE9DF030-32BD-4FAE-99E0-48158768EFFC/Documents/videocache/ll.m3u8'

    };
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(()=>{  
      // var fs=RNFetchBlob.fs
      // var path=RNFetchBlob.fs.dirs.DocumentDir

      // //建立食品主文件
      // var videocache=path+'/videocache/a88334ea743bdebd8f1e5df484fbc237-d5jtq9j.jpg'
      // this.setState({
      //   testimage:videocache
      // })
      // console.log(videocache)
      // request.get('http://localhost:8081/loeEbHr6-FeSrHiFIu253ClJq3zE/ll.m3u8')
      // .then((data)=>{
      //   console.log(data)
      // })
      // Start the server
      // server.start().then((url) => {
      //   console.log("Serving at URL", url);
      // });
      this._fetchData()
    });
    
  }
  
  render() {
    return (
      <View style={styles.container} onLayout={this._onLayout}>
        <View style={{ width: this.state.videoWidth, height: this.state.videoHeight, backgroundColor:'#000000' }}>
          {
            this.state.videoUri
            ?<View style={{ width: this.state.videoWidth, height: this.state.videoHeight, backgroundColor:'#000000' }}>
              <Video
                ref={(ref) => this.videoPlayer = ref}
                //source={{uri: this.state.videoUri}}
                source={{uri: this.state.videoUrl}}
                rate={1.0}
                volume={1.0}
                muted={false}
                paused={!this.state.isPlaying}
                resizeMode={'contain'}
                playWhenInactive={false}
                playInBackground={false}
                ignoreSilentSwitch={'ignore'}
                progressUpdateInterval={250.0}
                onLoadStart={this._onLoadStart}
                onLoad={this._onLoaded}
                onProgress={this._onProgressChanged}
                onEnd={this._onPlayEnd}
                onError={this._onPlayError}
                onBuffer={this._onBuffering}
                style={{width: this.state.videoWidth, height: this.state.videoHeight}}
              />
              {
                this.state.showVideoCover ?
                  <Image
                    style={{
                      position:'absolute',
                      top: 0,
                      left: 0,
                      width: this.state.videoWidth,
                      height: this.state.videoHeight
                    }}
                    resizeMode={'cover'}
                    source={{uri: this.state.videoCover}}
                  /> : null
              }
              <TouchableWithoutFeedback onPress={() => { this.hideControl() }}>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: this.state.videoWidth,
                    height: this.state.videoHeight,
                    backgroundColor: this.state.isPlaying ? 'transparent' : 'rgba(0, 0, 0, 0.2)',
                    alignItems:'center',
                    justifyContent:'center'
                  }}>
                  {
                    this.state.isPlaying ? null :
                      <TouchableWithoutFeedback onPress={() => { this.onPressPlayButton() }}>
                        <Image
                          style={styles.playButton}
                          source={require('../images/image/icon_video_play.png')}
                        />
                      </TouchableWithoutFeedback>
                  }
                </View>
              </TouchableWithoutFeedback>
              
              {
                this.state.showVideoControl ?
                  <View style={[styles.control, {width: this.state.videoWidth}]}>
                    <TouchableOpacity activeOpacity={0.3} onPress={() => { this.onControlPlayPress() }}>
                      <Image
                        style={styles.playControl}
                        source={this.state.isPlaying ? require('../images/image/icon_control_pause.png') : require('../images/image/icon_control_play.png')}
                      />
                    </TouchableOpacity>
                    <Text style={styles.time}>{formatTime(this.state.currentTime)}</Text>
                    <Slider
                      style={{flex: 1}}
                      step={this.state.duration/screenWidth}
                      maximumTrackTintColor={'#999999'}
                      minimumTrackTintColor={'#00c06d'}
                      thumbImage={require('../images/image/icon_control_slider.png')}
                      value={this.state.isDrag?this.state.currentTime2:this.state.currentTime}
                      minimumValue={0}
                      maximumValue={this.state.duration}
                      onValueChange={(currentTime) => { this.onSliderValueChanged(currentTime) }}
                      onSlidingComplete={(currentTime) => { this.onSlidingCompletess(currentTime) }}
                    />
                    <Text style={styles.time}>{formatTime(this.state.duration)}</Text>
                    <TouchableOpacity activeOpacity={0.3} onPress={() => { this.onControlShrinkPress() }}>
                      <Image
                        style={styles.shrinkControl}
                        source={this.state.isFullScreen ? require('../images/image/icon_control_shrink_screen.png') : require('../images/image/icon_control_full_screen.png')}
                      />
                    </TouchableOpacity>
                  </View> : null
              }
              
            </View>
            :null
          }
          <TouchableOpacity onPress={this._videoDown.bind(this)} style={styles.zoomBtnBox}>
            <Icon
              name='ios-arrow-back'
              style={styles.zoomBtnIcon}
              size={24}
            />
          </TouchableOpacity>
          {
            !this.state.videoLoaded&&<ActivityIndicator color='#ee735c' style={styles.loading} />
          }
        </View>
          
          
        {
          //视频相关信息 集合组件  <RecommendList data={this.state.recommends} />
          this.state.toPlayInfo&&this.state.recommends
          ?<ScrollView contentContainerStyle={styles.contentContainer}>
            <View>
             
              <TopTitle 
                {...this.props} 
                navigator={navigator} 
                data={this.state.toPlayInfo} />
              <ShareWrap data={this.state.toPlayInfo} toast={(text)=>this._toast(text)}/>
              <UpInfo 
                {...this.props} 
                navigator={this.props.navigator} 
                data={this.state.toPlayInfo}
                videoDown={()=>this._videoDown()}
                goDetailTv={(id)=>this._goDetailTv(id)}
              />
              <RecommendList fetchData={(id)=>this._fetchData(id)} data={this.state.recommends} />
              
              
            </View>
          </ScrollView>
          :null

        } 
        <Toast 
          ref="toast"
          position='center'
        />
        {/*<View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
          <Button title={'开始播放'} onPress={() => {this.playVideo()}}/>
          <Button title={'暂停播放'} onPress={() => {this.pauseVideo()}}/>
          <Button title={'切换视频'} onPress={() => {this.switchVideo("http://124.129.157.208:8810/SD/zhishidian/grade_8_1/wuli_shu/01.mp4", 0)}}/>
        </View>*/}
      </View>
    )
  }

  //提示
  _toast(text){
    this.refs.toast.show(text)
  }

  //获取相关数据
  async _fetchData(id){
    var _id=this.props.videoId
    if(id){
      _id=id
    }else{
      _id=this.props.videoId
    }
    var _id=this.props.videoId
    await request.get(config.api.base+config.api.videoinfo,{
      id:_id
    })
    .then((data)=>{
      if(data&&data.code==0){
        //console.log(data.data.recommends)
        // if(id){
        //   this.setState({
        //     recommends:[],
        //     toPlayInfo:data.data.toPlayInfo
        //   })
        // }else{
        //   this.setState({
        //     recommends:data.data.recommends,
        //     toPlayInfo:data.data.toPlayInfo
        //   })
        // }
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
      //console.log(data)
      if(data&&data.code==0){
        // if(id){
        //   this.setState({
        //     videoUri:'http://124.129.157.208:8810/SD/zhishidian/grade_8_1/wuli_shu/01.mp4'
        //   })
        // }else{
        //   this.setState({
        //     videoUri:data.data.videoUrls[0].url
        //   })
        // }
        this.setState({
          videoUri:data.data.videoUrls[0].url
        })
      }
    })

  }
  
  /// -------Video组件回调事件-------
  
  _onLoadStart = () => {
    console.log('视频开始加载');
  };
  
  _onBuffering = () => {
    console.log('视频缓冲中...')
    this.setState({
      videoLoaded:false
    })
  };
  
  _onLoaded = (data) => {
    console.log('视频加载完成');
    this.setState({
      duration: data.duration,
    });
  };
  
  _onProgressChanged = (data) => {
    console.log('视频进度更新');
    if (this.state.isPlaying) {
      this.setState({
        currentTime: data.currentTime,
        videoLoaded:true
      })
    }
  };
  
  _onPlayEnd = () => {
    console.log('视频播放结束');
    this.setState({
      currentTime: 0,
      isPlaying: false,
      playFromBeginning: true
    });
  };
  
  _onPlayError = () => {
    console.log('视频播放失败');
  };
  
  //页面离开
  componentWillUnmount(){
    clearInterval(timerq)
    // this.setState({
    //   isPlaying: false
    // });
    //console.log('卸载')
  }
  ///-------控件点击事件-------
  
  /// 控制播放器工具栏的显示和隐藏
  hideControl(nums) {
    clearInterval(timerq)

    if(nums==1){
      this.setState({
        showVideoControl: true,
      })
      return
    }
    if(nums==2){
      timerq=setTimeout(() => {
          this.setState({
            showVideoControl: false
          })
      }, 5000)
      return
    }

    if (this.state.showVideoControl) {
      this.setState({
        showVideoControl: false,
      })
    } else {
      this.setState({
          showVideoControl: true,
      },
        // 5秒后自动隐藏工具栏
        ()=>{
          timerq=setTimeout(() => {
              this.setState({
                showVideoControl: false
              })
          }, 5000)
        }
      )
    }
  }
  
  /// 点击了播放器正中间的播放按钮
  onPressPlayButton() {
    let isPlay = !this.state.isPlaying;
    this.setState({
      isPlaying: isPlay,
      showVideoCover: false
    });
    if (this.state.playFromBeginning) {
      this.videoPlayer.seek(0);
      this.setState({
        playFromBeginning: false,
      })
    }
  }
  
  /// 点击了工具栏上的播放按钮
  onControlPlayPress() {
    this.onPressPlayButton();
  }
  
  /// 点击了工具栏上的全屏按钮
  onControlShrinkPress() {

    if (this.state.isFullScreen) {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscape();
    }
  }
  
  /// 进度条值改变
  onSliderValueChanged(currentTime) {
    var newState={
      isDrag:true,
      isPlaying: false,
      currentTime: currentTime
    }
    if(!this.state.isDrag){
      var currentTime2=this.state.currentTime
      newState.currentTime2=currentTime2
      newState.isPlaying2=this.state.isPlaying
    }


    
    this.setState(newState)
    this.hideControl(1)
    // if (this.state.isPlaying) {
    //   this.setState({
    //     currentTime: currentTime
    //   })
    // } else {
    //   this.setState({
    //     currentTime: currentTime,
    //     isPlaying: true,
    //     showVideoCover: false
    //   })
    // }
  }
  //拖动结束
  onSlidingCompletess(currentTime) {
    var newState={
      isDrag:false
    }
    if(this.state.isPlaying2){
      newState.isPlaying=true
    }
    
    this.videoPlayer.seek(currentTime);
    this.setState(newState)
    this.hideControl(2)
    // console.log(currentTime)
  }
  
  /// 屏幕旋转时宽高会发生变化，可以在onLayout的方法中做处理，比监听屏幕旋转更加及时获取宽高变化
  _onLayout = (event) => {
    //获取根View的宽高
    let {width, height} = event.nativeEvent.layout;
    console.log('通过onLayout得到的宽度：' + width);
    console.log('通过onLayout得到的高度：' + height);
    
    // 一般设备横屏下都是宽大于高，这里可以用这个来判断横竖屏
    let isLandscape = (width > height);
    if (isLandscape){
      this.setState({
        videoWidth: width,
        videoHeight: height,
        isFullScreen: true,
      })
    } else {
      this.setState({
        videoWidth: width,
        videoHeight: width * 9/16,
        isFullScreen: false,
      })
    }
    Orientation.unlockAllOrientations();
  };
  
  /// -------外部调用事件方法-------
  
  ///播放视频，提供给外部调用
  playVideo() {
    this.setState({
      isPlaying: true,
      showVideoCover: false
    })
  }
  
  /// 暂停播放，提供给外部调用
  pauseVideo() {
    this.setState({
      isPlaying: false,
    })
  }
  
  /// 切换视频并可以指定视频开始播放的时间，提供给外部调用
  switchVideo(videoURL, seekTime) {
    this.setState({
      videoUrl: videoURL,
      currentTime: seekTime,
      isPlaying: true,
      showVideoCover: false
    });
    this.videoPlayer.seek(seekTime);
  }
  //返回
  _videoDown(){
    if (this.state.isFullScreen) {
      this.onControlShrinkPress()
      return
    }
    this.props.navigator.pop()
  }

  _goDetailTv(id){
    var isPlaying3=this.state.isPlaying
    if(this.state.isPlaying){
      this.setState({
        isPlaying3:isPlaying3,
        isPlaying:false
      })
    }else{
      this.setState({
        isPlaying3:isPlaying3,
      })
    }
    this.props.navigator.push({
      name:'detailTv',
      id:'detailTv',
      params:{
        _id:id,
        callback:this._changeText.bind(this)
      }
    })
  }
  _changeText(){
    if(this.state.isPlaying3){
      this.setState({
        isPlaying:true
      })
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#212121'
  },
  playButton: {
    width: 50,
    height: 50,
  },
  playControl: {
    width: 24,
    height: 24,
    marginLeft: 15,
  },
  shrinkControl: {
    width: 15,
    height: 15,
    marginRight: 15,
  },
  time: {
    fontSize: 12,
    color: 'white',
    marginLeft: 10,
    marginRight: 10,
    width:55
  },
  control: {
    flexDirection: 'row',
    height: 44,
    alignItems:'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  //返回键
  zoomBtnBox:{
    position:'absolute',
    left:10,
    top:20,
    width:40,
    height:20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomBtnIcon:{
    color:'#fff',
    backgroundColor:'transparent'
  },
  //视频加载中
  loading:{
    position:'absolute',
    left:0,
    top:80,
    width:screenWidth,
    alignSelf:'center',
    backgroundColor:'transparent'
  },
});
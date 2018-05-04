/*
* @Author: huanghanzhilian
* @Date:   2018-04-28 10:07:47
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-05-03 19:33:51
*/
import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  TouchableHighlight,
  ImageBackground,
  PanResponder,
  StyleSheet,
  Touchable,
  Animated,
  Platform,
  Easing,
  Image,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Slider,
  Dimensions
} from 'react-native';
//import VideoPlayer from 'awesome-react-native-video-controls';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

var {height, width} = Dimensions.get('window');
var timerq=null
function formatTime(result) {
  // let h = 0, i = 0, s = parseInt(second);
  // if (s > 60) {
  //   i = parseInt(s / 60);
  //   s = parseInt(s % 60);
  // }
  // // 补零
  let zero = function (v) {
    return (v >> 0) < 10 ? "0" + v : v;
  };
  // return [zero(h), zero(i), zero(s)].join(":");
  var h = zero(Math.floor(result / 3600));
  var m = zero(Math.floor((result / 60 % 60)));
  var s = zero(Math.floor((result % 60)));
  return result = h!='00'?(h + ":"):'' + m + ":" + s;
}
export default class topTitle extends Component {
  constructor(props){
    super(props)

    this.state={
    	// Video
      resizeMode: this.props.resizeMode || 'contain',
      muted: this.props.muted || false,
      volume: this.props.volume || 1,
      rate: this.props.rate || 1,
      isPlaying: true,// 视频是否正在播放
      isPlaying2:false,
      playFromBeginning:false,// 是否从头开始播放

      currentTime: 0,        // 视频当前播放的时间
      currentTime2: 0,
      duration: 0,           // 视频的总时长

      videoWidth: width,
      videoHeight: width * 9/16, // 默认16：9的宽高比


      // Controls
      isDrag:false,//是否正在拖动
      isFullScreen: this.props.isFullScreen||false,
      showVideoControl:this.props.showVideoControl||false,//是否显示控制器

      //title
      videoTitle:this.props.videoTitle||'',




      //Subtitle
      isSubtitle:true,// 是否开启字幕
      subtitleIndex: 0,
      currentTimeInDeciSeconds: 0,
      text:null
    }

    /**
     * Player information
     */
    this.player = {
      controlTimeoutDelay: this.props.controlTimeout || 15000,
      volumePanResponder: PanResponder,
      seekPanResponder: PanResponder,
      controlTimeout: null,
      volumeWidth: 150,
      iconOffset: 7,
      seekWidth: 0,
      ref: Video
    };

    /**
     * Our app listeners and associated methods
     */
    this.events = {
      onError: this.props.onError || this._onError.bind(this),
      onEnd: this.props.onEnd || this._onEnd.bind(this),
      // onScreenTouch: this._onScreenTouch.bind(this),
      onLoadStart: this._onLoadStart.bind(this),
      onProgress: this._onProgress.bind(this),
      onLoad: this._onLoad.bind(this)
    };

    /**
     * Various styles that be added...
     */
    this.styles = {
      videoStyle: this.props.videoStyle || {},
      containerStyle: this.props.style || {}
    };

    
  }
  componentWillMount(){
    let initial = Orientation.getInitialOrientation();

    if (initial === 'PORTRAIT') {
      // do something
      console.log('成功')
    } else {
      // do something else
      console.log('失败')
    }
  	
  }
  shouldComponentUpdate(){
  	this.showSubtitle()
  	//this.setState({text:this.state.text+1})
  	//this.showSubtitle()
  	return true
  }

  componentDidMount() {
    console.log('挂载后------')
    if(this.state.isFullScreen){
      //全屏
      Orientation.lockToLandscape();
    }else{
      //不全屏
      Orientation.lockToPortrait()
    }
    
    Orientation.addOrientationListener((orientation)=>{this._orientationDidChange(orientation)});
    
    
  }
  componentWillUnmount() {
    this.setState = () => {};
    clearInterval(timerq)
    Orientation.getOrientation((err, orientation) => {
      console.log(`Current Device Orientation: ${orientation}`);
    });


    // Remember to remove listener
    Orientation.removeOrientationListener(this._orientationDidChange);
  }



  _orientationDidChange = (orientation) => {
    //var {height, width} = Dimensions.get('window');
    let state = this.state;
    
    if (orientation === 'LANDSCAPE') {
      //监听到是全屏状态
      state.isFullScreen = true;
      this.props.onFullStatus(true)
    } else {
      //监听到非全屏状态
      state.isFullScreen = false;
      this.props.onFullStatus(false)
    }
    this.setState(state);
    Orientation.unlockAllOrientations();
      
  }
  

  

  //字幕渲染
  renderSubtitle() {
    return (
      <View
        style={
          !this.props.isFullscreen
            ? styles.player.subtitleContainerLandscape
            : styles.player.subtitleContainerPortrait
        }>
        <Text style={styles.player.subtitle}>{this.showSubtitle()}</Text>
      </View>
    );
  }
  /**
   * 加载视频渲染
   * Show loading icon
   */
  renderLoader() {
    if (this.state.loading) {
      return (
        <ActivityIndicator color='#ee735c' style={styles.loader.container} />
      );
    }
    return null;
  }
  //渲染错误
  renderError() {
    if (this.state.error) {
      return (
        <View style={styles.error.container}>
          <Image
            source={require('../../images/img/error-icon.png')}
            style={styles.error.icon}
          />
          <Text style={styles.error.text}>Video unavailable</Text>
        </View>
      );
    }
    return null;
  }
  //字幕渲染
  showSubtitle() {
    //console.log(this.props.subtitle)
    if (!this.props.subtitle) return null;

    let currentTime = this.state.currentTimeInDeciSeconds;
    let subtitleIndex = this.state.subtitleIndex;
    let subtitles = this.props.subtitle;
    if (!subtitles[subtitleIndex])
      return null;
    // let startTime = this.parseTimeStringToDeciSecond(
    //   subtitles[subtitleIndex].startTime
    // );
    // let endTime = this.parseTimeStringToDeciSecond(
    //   subtitles[subtitleIndex].endTime
    // );
    let startTime = subtitles[subtitleIndex].startTime
    let endTime = subtitles[subtitleIndex].endTime
    // console.log('currentTime+++++++',currentTime)
    //console.log('startTime+++++++',startTime)
    // console.log('endTime+++++++',endTime)
    if (currentTime > endTime)
      this.setState({ subtitleIndex: subtitleIndex + 1 });
    if (currentTime < endTime && currentTime > startTime) {
      this.setState({ text:subtitles[subtitleIndex].part});
      //return subtitles[subtitleIndex].text;
    } else this.setState({ text:null});//return null;
  }




  //视频开始加载时回调
  _onLoadStart() {
    let state = this.state;
    state.loading = true;
    this.setState(state);
  }
  //视频加载方法
  _onLoad(data = {}) {
    let state = this.state;

    state.duration = data.duration;
    state.loading = false;
    this.setState(state);

    // if (state.showControls) {
    //   this.setControlTimeout();
    // }

    // if (typeof this.props.onLoad === 'function') {
    //   this.props.onLoad(...arguments);
    // }
  }
  //视频错误方法
  _onError(err) {
    let state = this.state;
    state.error = true;
    state.loading = false;
    this.setState(state);
  }
  

  _onProgress = (data) => {
    //console.log('视频进度更新');
    var newState={}
    
    if (this.state.isPlaying) {
      newState.currentTime=data.currentTime
      newState.currentTimeInDeciSeconds = Math.floor(data.currentTime * 10) / 10.0;
      this.setState(newState)
    }
    
  }
  //播放结束
  _onEnd(){
    this.setState({
      currentTime: 0,
      isPlaying: false,
      playFromBeginning: true
    });
  }
  parseTimeStringToDeciSecond = str => {
    let splitByComma = str.split(',');
    let result = 0.0;
    result = Math.round(parseInt(splitByComma[1]) / 100.0) / 10.0;
    let splitByColon = splitByComma[0].split(':');
    for (let i = 0; i < 3; i++) {
      result += splitByColon[i] * Math.pow(60, 2 - i);
    }
    return (Math.floor(result * 10) / 10.0).toFixed(1);
  }

  

  /// 点击了播放器正中间的播放按钮
  onPressPlayButton() {
    let isPlay = !this.state.isPlaying;
    this.setState({
      isPlaying: isPlay,
      //showVideoCover: false
    });
    if (this.state.playFromBeginning) {
      this.videoPlayer.seek(0);
      this.setState({
        playFromBeginning: false,
      })
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

  //字幕开关
  onOpenSubtitle(){
    var newState={}
    if(this.state.isSubtitle){
      newState.isSubtitle=false
    }else{
      newState.isSubtitle=true
    }
    this.setState(newState)
  }

  //返回
  _videoDown(){
    this.props.navigator.pop()
  }



  render() {
    // console.log(this.props.style)
    //console.log(this.styles.containerStyle)
    return (
      <View style={[styles.player.container, this.props.style]}>
        <Video
          resizeMode={'contain'}
          style={[styles.player.container, this.props.style]}
          source={this.props.source}
          ref={(ref) => this.videoPlayer = ref}
          volume={this.state.volume}
          paused={!this.state.isPlaying}
          muted={this.state.muted}
          rate={this.state.rate}
          onLoadStart={this.events.onLoadStart}//视频开始加载时回调
          onLoad={this.events.onLoad}
          onProgress={this.events.onProgress}//视频播放持续回调
          onError={this.events.onError}
          onEnd={this.events.onEnd}//播放结束
          //navigator={ this.props.navigator }
          //toggleFullscreen={YourCustomizedFunction}
          //subtitle={this.state.subtitle}
        />  
        <View
          style={
            this.state.showVideoControl
              ? styles.player.subtitleContainerLandscape
              : styles.player.subtitleContainerPortrait
          }>
          {
            this.state.text&&this.state.isSubtitle
            ?<Text style={styles.player.subtitle}>{this.state.text}</Text>
            :null
          }
        </View>
        <TouchableWithoutFeedback onPress={() => { this.hideControl() }}>
          <View
            style={[this.props.style,{
              position: 'absolute',
              top: -15,
              left: 0,
              backgroundColor: !this.state.isPlaying ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
              alignItems:'center',
              justifyContent:'center'
            }]}>
            {
              this.state.isPlaying
              ?null
              :<TouchableWithoutFeedback onPress={() => { this.onPressPlayButton() }}>
                <Image
                  style={styles.playButton}
                  source={require('../../images/image/icon_video_play.png')}
                />
              </TouchableWithoutFeedback>
            }
              
          </View>
        </TouchableWithoutFeedback>
        {this.renderLoader()}
        {this.renderError()}
        {this.renderTopControlsTop()}
        {this.renderBottomControls()}
      </View>
    )
  }
  
  //非全屏下top部控制台
  renderNofullTopControls() {
    return (
      <View style={styles.controlsTop.controlsTopItem}>
        <View style={styles.controlsTop.controlsTopLeft}>
          <TouchableOpacity style={styles.controlsTop.zoomBtnBox} onPress={this._videoDown.bind(this)} >
            <Icon
              name='ios-arrow-back'
              style={styles.controlsTop.zoomBtnIcon}
              size={24}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.controlsTop.controlsTopRight}>
          <Text></Text>
        </View>
      </View>
    );
  }
  //全屏下top部控制台
  renderYesfullTopControls() {
    return (
      <View style={styles.controlsTop.controlsTopItem}>
        <View style={styles.controlsTop.controlsTopLeft}>
          {/*<TouchableOpacity style={styles.controlsTop.zoomBtnBox}>
            <Icon
              name='ios-arrow-back'
              style={styles.controlsTop.zoomBtnIcon}
              size={24}
            />
          </TouchableOpacity>*/}
          <Text numberOflines={1} style={styles.controlsTop.title}>{this.state.videoTitle}</Text>
          
        </View>
        <View style={styles.controlsTop.controlsTopRight}>
          <TouchableOpacity style={styles.controlsTop.zoomBtnBox}>
            <Icon
              name='md-more'
              style={styles.controlsTop.moreIcon}
              size={24}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  /**
   * top控制条渲染
   */
  renderTopControlsTop() {
    const isFullScreenControls = this.state.isFullScreen
      ? this.renderYesfullTopControls()
      : this.renderNofullTopControls();
    return (
      <View style={styles.controlsTop.controlsTopWrap}>
        {isFullScreenControls}
      </View>
    );
    
  }
  //非全屏下底部控制台
  renderNofullBottomControls() {
    return (
      <View style={styles.controlsBottom.controlsBottomWrapItem}>
        <TouchableOpacity style={styles.controlsTop.zoomBtnBox} activeOpacity={0.3} onPress={this.onPressPlayButton.bind(this)}>
          <Image
            style={styles.controlsBottom.playControl}
            source={this.state.isPlaying ? require('../../images/image/icon_control_pause.png') : require('../../images/image/icon_control_play.png')}
          />
        </TouchableOpacity>
        <Slider
          style={{flex: 1}}
          maximumTrackTintColor={'#999999'}//滑块右侧轨道的颜色
          minimumTrackTintColor={'#00c06d'}//滑块左侧轨道的颜色
          thumbImage={require('../../images/image/icon_control_slider.png')}
          value={this.state.isDrag?this.state.currentTime2:this.state.currentTime}//滑块的初始值
          minimumValue={0}//滑块的最小值
          maximumValue={this.state.duration}//滑块的最大值
          onValueChange={(currentTime) => { this.onSliderValueChanged(currentTime) }}//在用户拖动滑块的过程中不断调用此回调
          onSlidingComplete={(currentTime) => { this.onSlidingCompletess(currentTime) }}//用户结束滑动的时候调用此回调。
        />
        <Text style={styles.controlsBottom.time}>{formatTime(this.state.currentTime)}/{formatTime(this.state.duration)}</Text>

        <TouchableOpacity style={styles.controlsTop.zoomBtnBox} onPress={() => { this.onControlShrinkPress() }}>
          <Icon2
            name={1?'fullscreen':'fullscreen-exit'}
            style={styles.controlsTop.moreIcon}
            size={24}
          />
        </TouchableOpacity>
          
      </View>
    );
  }

  
  
  //全屏下底部控制台
  renderYesfullBottomControls() {
    return (
      <View style={styles.controlsBottom.controlsBottomWrapItem2}>
        <View style={styles.controlsBottom.controlsTopLeft}>
          <TouchableOpacity style={styles.controlsTop.zoomBtnBox} activeOpacity={0.3} onPress={this.onPressPlayButton.bind(this)}>
            <Image
              style={styles.controlsBottom.playControl}
              source={this.state.isPlaying ? require('../../images/image/icon_control_pause.png') : require('../../images/image/icon_control_play.png')}
            />
          </TouchableOpacity>
          <Text style={styles.controlsBottom.time}>{formatTime(this.state.currentTime)}/{formatTime(this.state.duration)}</Text>
          {
            this.props.subtitle
            ?<TouchableOpacity style={styles.controlsTop.zoomBtnBox} onPress={this.onOpenSubtitle.bind(this)}>
              <Icon
                name={this.state.isSubtitle?'ios-closed-captioning':'ios-closed-captioning-outline'}
                style={[styles.controlsTop.moreIcon,this.state.isSubtitle?{color:'red'}:{color:'#fff'}]}
                size={24}
              />
            </TouchableOpacity>
            :null
          }
          
          
        </View>
        <View style={styles.controlsBottom.controlsTopRight}>
          <View style={styles.controlsBottom.menuContent}>
            <Text style={styles.controlsBottom.text}>00</Text>
          </View>
          <TouchableOpacity style={styles.controlsTop.zoomBtnBox} onPress={() => { this.onControlShrinkPress() }}>
            <Icon2
              name={1?'fullscreen':'fullscreen-exit'}
              style={styles.controlsTop.moreIcon}
              size={24}
            />
          </TouchableOpacity>
        </View>
        <Slider
          style={[styles.controlsBottom.progress,{width:this.props.style.width}]}
          maximumTrackTintColor={'#999999'}//滑块右侧轨道的颜色
          minimumTrackTintColor={'#00c06d'}//滑块左侧轨道的颜色
          thumbImage={require('../../images/image/icon_control_slider.png')}
          value={this.state.isDrag?this.state.currentTime2:this.state.currentTime}//滑块的初始值
          minimumValue={0}//滑块的最小值
          maximumValue={this.state.duration}//滑块的最大值
          onValueChange={(currentTime) => { this.onSliderValueChanged(currentTime) }}//在用户拖动滑块的过程中不断调用此回调
          onSlidingComplete={(currentTime) => { this.onSlidingCompletess(currentTime) }}//用户结束滑动的时候调用此回调。
        />
      </View>
    );
  }

  /**
   * 空渲染
   */
  renderNullControl() {
    return (<View />);
  }

  /**
   * bottom控制条渲染
   */
  renderBottomControls() {
    var isFullScreenControls
    if(this.state.showVideoControl){
      if(this.state.isFullScreen){
        isFullScreenControls=this.renderYesfullBottomControls()
      }else{
        isFullScreenControls=this.renderNofullBottomControls()
      }
    }else{
      isFullScreenControls=this.renderNullControl()
    }
      
    
    return (
      <View style={styles.controlsBottom.controlsBottomWrap}>
        {isFullScreenControls}
      </View>
    );
  }
  /// 点击了工具栏上的全屏按钮
  onControlShrinkPress() {
    if (this.state.isFullScreen) {
      //取消全屏
      Orientation.lockToPortrait();
    } else {
      //全屏
      Orientation.lockToLandscape();
    }
  }

}
const styles = {
  controlsBottom: StyleSheet.create({
    controlsBottomWrap:{
      flexDirection: 'row',
      height: 44,
      width:'100%',
      alignItems:'center',
      position: 'absolute',
      bottom: 0,
      left: 0
    },
    progress:{
      position: 'absolute',
      //backgroundColor:'red',
      height:20,
      top: -10,
      //right: 0,
      //bottom: 0,
      left: 0
    },
    controlsBottomWrapItem:{
      paddingLeft:10,
      paddingRight:10,
      flexDirection: 'row',
      height: 44,
      width:'100%',
      alignItems:'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    controlsBottomWrapItem2:{
      paddingLeft:10,
      paddingRight:10,
      flexDirection: 'row',
      height: 44,
      width:'100%',
      alignItems:'center',
      justifyContent:'space-between',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    controlsTopLeft:{
      flexDirection: 'row',
      alignItems:'center',
    },
    controlsTopRight:{
      flexDirection: 'row',
      alignItems:'center',
    },
    playControl:{
      width: 24,
      height: 24,
      //marginLeft: 15,
    },
    time: {
      fontSize: 12,
      color: 'white',
      marginLeft: 10,
      marginRight: 10,
    },
  }),
  controlsTop: StyleSheet.create({
    controlsTopWrap:{
      flexDirection: 'row',
      alignItems:'center',
      //backgroundColor: 'rgba(0, 0, 0, 0.8)',
      position: 'absolute',
      top: 0,
      left: 0
    },
    controlsTopItem:{
      paddingTop:5,
      paddingBottom:5,
      paddingLeft:10,
      paddingRight:10,
      width:'100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      //backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backgroundColor:'transparent'
    },
    controlsTopLeft:{
      flexDirection: 'row',
      alignItems:'center',
    },
    zoomBtnBox:{
      paddingLeft:5,
      paddingRight:5,
      //backgroundColor:'red'
    },
    zoomBtnIcon:{
      color:'#fff',
    },
    title:{
      color:'#fff',
    },
    controlsTopRight:{
      flexDirection: 'row',
      alignItems:'center',
    },
    moreIcon:{
      color:'#fff',
    },
  }),
  player: StyleSheet.create({
    container: {
      backgroundColor: '#000',
      flex: 1,
      alignSelf: 'stretch',
      justifyContent: 'space-between'
    },
    subtitle: {
      color: 'white',
      textAlign: 'center',
      textShadowColor: 'black',
      textShadowOffset: { width: 1, height: 1 },
      paddingRight: 10,
      paddingLeft: 10
    },
    subtitleContainerPortrait: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      alignItems: 'center'
    },
    subtitleContainerLandscape: {
      position: 'absolute',
      bottom: 50,
      left: 0,
      alignItems: 'center'
    },
    video: {
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  }),
  error: StyleSheet.create({
    container: {
      backgroundColor: 'rgba( 0, 0, 0, 0.5 )',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'center'
    },
    icon: {
      marginBottom: 16
    },
    text: {
      backgroundColor: 'transparent',
      color: '#f27474'
    }
  }),
  //加载样式
  loader: StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }),
  volume: StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      height: 1,
      marginLeft: 20,
      marginRight: 20,
      width: 150
    },
    track: {
      backgroundColor: '#333',
      height: 1,
      marginLeft: 7
    },
    fill: {
      backgroundColor: '#FFF',
      height: 1
    },
    handle: {
      position: 'absolute',
      marginTop: -24,
      marginLeft: -24,
      padding: 16
    }
  }),
  seekbar: StyleSheet.create({
    container: {
      alignSelf: 'stretch',
      height: 28,
      marginLeft: 20,
      marginRight: 20
    },
    track: {
      backgroundColor: '#333',
      height: 1,
      position: 'relative',
      top: 14,
      width: '100%'
    },
    fill: {
      backgroundColor: '#FFF',
      height: 1,
      width: '100%'
    },
    handle: {
      position: 'absolute',
      marginLeft: -7,
      height: 28,
      width: 28
    },
    circle: {
      borderRadius: 12,
      position: 'relative',
      top: 8,
      left: 8,
      height: 12,
      width: 12
    }
  })
};

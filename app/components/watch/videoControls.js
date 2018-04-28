/*
* @Author: huanghanzhilian
* @Date:   2018-04-28 10:07:47
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-28 17:58:39
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
  ActivityIndicator
} from 'react-native';
//import VideoPlayer from 'awesome-react-native-video-controls';
import Video from 'react-native-video';

//var {height, width} = Dimensions.get('window');

export default class topTitle extends Component {
  constructor(props){
    super(props)
    this.state={
    	// Video
      resizeMode: this.props.resizeMode || 'contain',
      paused: this.props.paused || false,// 视频是否正在播放
      muted: this.props.muted || false,
      volume: this.props.volume || 1,
      rate: this.props.rate || 1,

      // Controls
      isFullscreen: this.props.resizeMode === 'cover' || false,
      showTimeRemaining: true,
      volumeTrackWidth: 0,
      lastScreenPress: 0,
      volumeFillWidth: 0,
      seekerFillWidth: 0,
      showControls: true,
      volumePosition: 0,
      seekerPosition: 0,
      volumeOffset: 0,
      seekerOffset: 0,
      seeking: false,
      loading: false,//视频正在加载
      currentTime: 0,
      error: false,
      duration: 0,


      //Subtitle
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
      // onEnd: this.props.onEnd || this._onEnd.bind(this),
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
  	console.log('挂载前')
  }
  shouldComponentUpdate(){
  	this.showSubtitle()
  	//this.setState({text:this.state.text+1})
  	//this.showSubtitle()
  	return true
  }
  render() {

    return (
      <View style={[styles.player.container, this.styles.containerStyle]}>
        <Video
        	style={[styles.player.container, this.styles.containerStyle]}
			    source={this.props.source}
			    onProgress={this._onProgressChanged}
			    ref={videoPlayer => (this.player.ref = videoPlayer)}
			    volume={this.state.volume}
          paused={this.state.paused}
          muted={this.state.muted}
          rate={this.state.rate}
          onLoadStart={this.events.onLoadStart}//视频开始加载时回调
          onLoad={this.events.onLoad}
          onProgress={this.events.onProgress}//视频播放持续回调
          onError={this.events.onError}
			    //navigator={ this.props.navigator }
			    //toggleFullscreen={YourCustomizedFunction}
			    //subtitle={this.state.subtitle}
				/>  
        <View
	        style={
	          this.props.isFullscreen
	            ? styles.player.subtitleContainerLandscape
	            : styles.player.subtitleContainerPortrait
	        }>
	        {
	        	this.state.text
	        	?<Text style={styles.player.subtitle}>{this.state.text}</Text>
	        	:null
	        }
	      </View>
	      {this.renderLoader()}
	      {this.renderError()}
      </View>
    )
  }
  //视频开始加载时回调
  _onLoadStart() {
    let state = this.state;
    state.loading = true;
    this.setState(state);
  }

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
  _onError(err) {
    let state = this.state;
    state.error = true;
    state.loading = false;
    this.setState(state);
  }
  

  _onProgress = (data) => {
    //console.log('视频进度更新');
    var newState={}
    newState.currentTime=data.currentTime
    newState.currentTimeInDeciSeconds = Math.floor(data.currentTime * 10) / 10.0;
    this.setState(newState)
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

  showSubtitle() {
  	console.log(this.props.subtitle)
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
}
const styles = {
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
      left: 0
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
  controls: StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: null,
      width: null
    },
    column: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: null,
      width: null
    },
    vignette: {
      resizeMode: 'stretch'
    },
    control: {
      padding: 16
    },
    text: {
      backgroundColor: 'transparent',
      color: '#FFF',
      fontSize: 14,
      textAlign: 'center'
    },
    pullRight: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    top: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent: 'flex-start'
    },
    bottom: {
      alignItems: 'stretch',
      flex: 2,
      justifyContent: 'flex-end'
    },
    topControlGroup: {
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: null,
      margin: 12,
      marginBottom: 18
    },
    bottomControlGroup: {
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginLeft: 12,
      marginRight: 12,
      marginBottom: 0
    },
    volume: {
      flexDirection: 'row'
    },
    fullscreen: {
      flexDirection: 'row'
    },
    playPause: {
      position: 'relative',
      width: 80,
      zIndex: 0
    },
    title: {
      alignItems: 'center',
      flex: 0.6,
      flexDirection: 'column',
      padding: 0
    },
    titleText: {
      textAlign: 'center'
    },
    timer: {
      width: 80
    },
    timerText: {
      backgroundColor: 'transparent',
      color: '#FFF',
      fontSize: 11,
      textAlign: 'right'
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

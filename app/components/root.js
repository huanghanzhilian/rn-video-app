import React, { Component } from 'react';
import {
  StyleSheet,
  StatusBar,
  Image,
  Text,
  View,
  AsyncStorage,
  BackHandler,
  Platform
} from 'react-native';
import NavigationExperimental from 'react-native-deprecated-custom-components';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import Toast, {DURATION} from 'react-native-easy-toast'
import *as wechat from 'react-native-wechat'


import { connect } from 'react-redux';
import { addTodo,updateText,decTodo,setUserInfo,getVideoInfo} from '../redux/action';


import Splash from './splash'//电影
import Play from './play'//播放
import Holder from './holder'

import Login from "../page/login/login"
import Register from "../page/register/register"
import History from "../page/history/history"
import Collect from "../page/collect/collect"
import CollectAlbum from "../page/collectAlbum/collectAlbum"//专辑页
import Notifications from "../page/notifications/notifications"//系统通知页

import DetailTv from "../page/detailTv/detailTv"//频道页
import Search from "../page/search/search"//搜页

import Testvideo from "./VideoPlayScreen"//搜页

import Borderlands from "../page/borderlands/borderlands"
import Information from "../page/information/information"
import Movie from "../page/movie/movie"
import Drama from "../page/drama/drama"
import Recharge from "../page/recharge/recharge"

import Testvideo2 from "./testVideo"










class Root extends Component{
  constructor(props){
    super(props)
    this.state={
      logined:false,//是否登录
      user:null,//用户信息

      noVideo:true,//为false时 播放视频
    }
  }

  //开始安装  1
  componentWillMount(){
    
    //console.log('father','开始安装')
  }

  //安装过  3
  componentDidMount(){
    wechat.registerApp('wx03f6c209034fb0f2')
    if (Platform.OS === 'android') {
        

        BackHandler.addEventListener("back", this.onBackClicked.bind(this));
    }else {

    }


    let me = this;

    //全局toast提示
    RCTDeviceEventEmitter.addListener('tongzhitoast', function (text) {
      me.refs.toast.show(text)
    })
    //退出登录
    RCTDeviceEventEmitter.addListener('tuichu', function () {
      me._logout()
    })

    this._asyncAppStatus()//异步读取本机存储
  }

  onBackClicked(){
    const navigator = this.refs.toastaa;
    if (navigator && navigator.getCurrentRoutes().length > 2) {
       navigator.pop();
       return true;//true 表示返回上一页
    }
    return false; // 默认false  表示跳出RN
  }

  play(){
    if(!this.props.videoInfo.open){
      return(<View />)
    }else{
      return(<Play {...this.props.videoInfo} {...this.props} navigator={this.refs.toastaa}/>)
    }
  }
  //子组件点击播放视频 通知父组件触发
  pressPlay(){
    if(!this.state.noVideo){
      this.setState({
        noVideo:true
      })
    }else{
      // this.setState({
      //   noVideo:false
      // })
    }
    setTimeout(() => {
      this.setState({
        noVideo:false
      })
    }, 100)

  }
  render() {
    // console.log('index')
    //console.log(this)
    return (
      <View style={{flex:1,backgroundColor:'#212121'}}>
        <StatusBar 
          backgroundColor="#212121"
          barStyle="light-content"
          translucent={true}
        />
        <NavigationExperimental.Navigator
          ref="toastaa"
          style={{flex: 1}}
          initialRoute={{id: 'splash', name: 'splash'}}
          configureScene={(route) =>{
            //console.log()
            let configure = NavigationExperimental.Navigator.SceneConfigs.FloatFromRight;
            switch (route.name){
              case 'login':
                configure = NavigationExperimental.Navigator.SceneConfigs.FloatFromBottom;
                break;
              default:
                configure =  NavigationExperimental.Navigator.SceneConfigs.FloatFromRight;
            };
            return {...configure,gestures:{}}
          }} 
          renderScene={this.renderScene.bind(this)}/>
        <Toast 
          ref="toast"
          position='center'
        />
        
        {this.play()}
      </View>
    )
  }
 
  renderScene(route, navigator) {
    var {state,actions} = this.props;
    var routeId = route.id;

    if (routeId === 'holder') {
      return (
        <Holder
        {...this.props} 
        navigator={navigator} />
        );
    }
    if (routeId === 'play') {
      return (
        <Play
          {...this.props} 
          navigator={navigator} />
        );
    }
    
    if (routeId === 'splash') {
      return (
        <Splash
          {...this.props} 
          navigator={navigator} />
      );
    }
    if (routeId === 'login') {
      return (
        <Login
        afterLondin={this._afterLondin.bind(this)}
        {...this.props} 
        navigator={navigator} />
      );
    }
    
    if (routeId === 'register') {
      return (
        <Register
        {...this.props} 
        navigator={navigator} />
      );
    }

    if (routeId === 'history') {
      return (
        <History
        {...this.props} 
        navigator={navigator} />
      );
    }

    if (routeId === 'collect') {
      return (
        <Collect
        {...this.props} 
        navigator={navigator} />
      );
    }

    if (routeId === 'collectAlbum') {
      return (
        <CollectAlbum
        {...this.props} 
        navigator={navigator} />
      );
    }
    
    
    if (routeId === 'notifications') {
      return (
        <Notifications
        {...this.props} 
        navigator={navigator} />
      );
    }
    if (routeId === 'detailTv') {
      return (
        <DetailTv
        {...this.props} 
        {...route.params}
        navigator={navigator} />
      );
    }

    if (routeId === 'search') {
      return (
        <Search
        {...this.props} 
        {...route.params}
        navigator={navigator} />
      );
    }

    if (routeId === 'testvideo') {
      return (
        <Testvideo
        {...this.props} 
        {...route.params}
        navigator={navigator} />
      );
    }

    if (routeId === 'borderlands') {
      return (
        <Borderlands
        {...this.props} 
        {...route.params}
        navigator={navigator} />
      );
    }

    if (routeId === 'information') {
      return (
        <Information
        {...this.props} 
        {...route.params}
        navigator={navigator} />
      );
    }
    if (routeId === 'movie') {
      return (
        <Movie
        {...this.props} 
        {...route.params}
        navigator={navigator} />
      );
    }
    if (routeId === 'drama') {
      return (
        <Drama
        {...this.props} 
        {...route.params}
        navigator={navigator} />
      );
    }
    
    if (routeId === 'recharge') {
      return (
        <Recharge
        {...this.props} 
        {...route.params}
        navigator={navigator} />
      );
    }

    if (routeId === 'testvideo2') {
      return (
        <Testvideo2
        {...this.props} 
        {...route.params}
        navigator={navigator} />
      );
    }

    

    
    


  }

  //登录之后存储用户信息
  _afterLondin(user){
    const { onSetUserInfo } = this.props;
    var users=user
    //将json转成字符串
    user=JSON.stringify(user)
    AsyncStorage.setItem('user',user)
      .catch((error) => console.warn("fetch error:", error))
      .then(()=>{
        onSetUserInfo(users)
        this.setState({
          logined:true,
          user:user
        })
      })
  }
  //退出登录
  _logout(){
    const { onSetUserInfo } = this.props;
    onSetUserInfo(null)
    AsyncStorage.removeItem('user')
    this.setState({
      logined:false,
      user:null
    })
  }
  //异步读取本机存储
  _asyncAppStatus(){
    const { onSetUserInfo } = this.props;
    var that=this
    AsyncStorage.getItem('user')
      .then((data)=>{
        var user
        var newState={}

        if(data){
          //console.log(data)
          //转成json
          user=JSON.parse(data)
          
        }
        if(user&&user.id){
          onSetUserInfo(user)
          that.setState({
            user:user,
            logined:true
          })
        }
      })
  }


}
// 获取 state 变化
const mapStateToProps = (state) => {
    return {
        num: state.num ,  
        text:state.text ,
        userInfo:state.userInfo,
        videoInfo:state.videoInfo
    }
};

// 发送行为
const mapDispatchToProps = (dispatch) => {
    return {
        onAddTodo: (num) => dispatch(addTodo(num)),
        onUpdateText: (text) => dispatch(updateText(text)),
        onDecTodo: (num) => dispatch(decTodo(num)),
        onSetUserInfo: (userInfo) => dispatch(setUserInfo(userInfo)),
        ongetVideoInfo: (obj) => dispatch(getVideoInfo(obj)),
        //onChangeText: () => dispatch(changeText('外部传值111')),
    }
};

// 进行第二层包装,生成的新组件拥有 接收和发送 数据的能力
export default connect(mapStateToProps,mapDispatchToProps)(Root) 
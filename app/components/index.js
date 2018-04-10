import React, { Component } from 'react';
import {
  StyleSheet,
  StatusBar,
  Image,
  Text,
  View,
  AsyncStorage
} from 'react-native';
import NavigationExperimental from 'react-native-deprecated-custom-components';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import Toast, {DURATION} from 'react-native-easy-toast'


import Splash from './splash'//电影
import Play from './play'//播放
import Holder from './holder'

import Login from "../page/login/login"
import Register from "../page/register/register"





export default class Index extends Component {
  //获取属性获取获取初始化的状态值
  //新建构造器 传入一个参数
  constructor(props){
    //通过super(props)来继承拿到外面的属性
    super(props)
    //设置初始状态值
    this.state={
      logined:false,//是否登录
      user:null,//用户信息
    }
  }

  //开始安装  1
  componentWillMount(){
    console.log('father','开始安装')
  }

  //安装过  3
  componentDidMount(){
    let me = this;
    // RCTDeviceEventEmitter.addListener('change', function (text) {
    //   console.log(text)
    //     // me.setState({
    //     //     text: text
    //     // })
    // })
    RCTDeviceEventEmitter.addListener('tongzhitoast', function (text) {
      me.refs.toast.show(text)
    })
    RCTDeviceEventEmitter.addListener('tuichu', function () {

      me._logout()
    })
    this._asyncAppStatus()    
  }
  //退出登录
  _logout(){
    AsyncStorage.removeItem('user')
    this.setState({
      logined:false,
      user:null
    })
  }
  //异步读取本机存储
  _asyncAppStatus(){
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
          that.setState({
            user:user,
            logined:true
          })
        }
        // if(user&&user.accessToken){
        //   newState.user=user
        //   newState.logined=true
        // }else{
        //   newState.logined=false
        // }
        // this.setState(newState)
      })
  }


  //进入运行状态
  //进行渲染  2  在开始安装和安装了之间运行
  render() {
    console.log('index')
    console.log(this)
    return (
      <View style={{flex:1}}>
        <StatusBar 
         barStyle="light-content"
        />
        <NavigationExperimental.Navigator
         style={{flex: 1}}
         initialRoute={{id: 'splash', name: 'splash'}}
         configureScene={(route) =>{
          return NavigationExperimental.Navigator.SceneConfigs.FloatFromRight
        }} 
         renderScene={this.renderScene.bind(this)}/>
        <Toast 
          ref="toast"
          position='center'
        />
      </View>
    )
  }
 
  renderScene(route, navigator) {
    var {state,actions} = this.props;
    var routeId = route.id;

    if (routeId === 'holder') {
      return (
        <Holder
        user={this.state.user}
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




  }

  //登录之后存储用户信息
  _afterLondin(user){
    //将json转成字符串
    user=JSON.stringify(user)
    AsyncStorage.setItem('user',user)
      .catch((error) => console.warn("fetch error:", error))
      .then(()=>{
        this.setState({
          logined:true,
          user:user
        })
      })
  }


}


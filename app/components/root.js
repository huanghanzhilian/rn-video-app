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


import { connect } from 'react-redux';
import { addTodo,updateText,decTodo,setUserInfo} from '../redux/action';

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








class Root extends Component{
  constructor(props){
    super(props)
    this.state={
      logined:false,//是否登录
      user:null,//用户信息
    }
  }

  //开始安装  1
  componentWillMount(){
    //console.log('father','开始安装')
  }

  //安装过  3
  componentDidMount(){



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



  //进入运行状态
  //进行渲染  2  在开始安装和安装了之间运行
  render() {
    // console.log('index')
    // console.log(this)
    return (
      <View style={{flex:1,backgroundColor:'#212121'}}>
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
        <View>
          <Text>1</Text>
        </View>
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
        userInfo:state.userInfo
    }
};

// 发送行为
const mapDispatchToProps = (dispatch) => {
    return {
        onAddTodo: (num) => dispatch(addTodo(num)),
        onUpdateText: (text) => dispatch(updateText(text)),
        onDecTodo: (num) => dispatch(decTodo(num)),
        onSetUserInfo: (userInfo) => dispatch(setUserInfo(userInfo)),
        //onChangeText: () => dispatch(changeText('外部传值111')),
    }
};

// 进行第二层包装,生成的新组件拥有 接收和发送 数据的能力
export default connect(mapStateToProps,mapDispatchToProps)(Root);
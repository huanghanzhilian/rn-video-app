import React, { Component } from 'react';
import {
  StyleSheet,
  StatusBar,
  Image,
  Text,
  View
} from 'react-native';
import NavigationExperimental from 'react-native-deprecated-custom-components';



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
      
    }
  }

  //开始安装  1
  componentWillMount(){
    console.log('father','开始安装')
  }

  //进入运行状态
  //进行渲染  2  在开始安装和安装了之间运行
  render() {
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


}


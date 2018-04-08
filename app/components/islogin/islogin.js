/*
* @Author: huanghanzhilian
* @Date:   2018-04-08 13:03:33
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-08 16:05:50
*/

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from 'react-native';
import  Button from 'react-native-button'

var {height, width} = Dimensions.get('window');


export default class islogin extends Component {
  constructor(props){
    super(props)
    this.state={
      
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../../images/sign_in_promo-vfluaJRxi.png')} resizeMode="contain" style={styles.img} />
    		<Text style={styles.loginlog}>
          您尚未登录
        </Text>
        <Button
        style={styles.loginBtn}
        onPress={this._loadLodin.bind(this)}>登录</Button>
      </View>
    );
  }

  //去登录页
  _loadLodin(){
    this.props.navigator.push({
      name:'login',
      id:'login'
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#212121',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img:{
  	width:width
  },
  loginlog:{
  	fontSize:22,
  	color:'#c8c6c9',
  	marginBottom:20,
  },
  loginBtn:{
    paddingTop:8,
    paddingBottom:8,
    paddingLeft:20,
    paddingRight:20,
    color:'#e34849',
    borderColor:'#383838',
    textAlign:'center',
    fontWeight:'600',
    fontSize:15, 
    borderWidth:1,
    //borderRadius:2
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

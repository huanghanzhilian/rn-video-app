/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'

import Islogin from "./islogin/islogin"


export default class Profile extends Component {
  constructor(props){
    super(props)

    this.state = {
      users:this.props.user||null
    }
  }
  render() {
    console.log('我的页---------')
    console.log(this.props.user)
    console.log('我的页---------')
    if(this.props.user){
      return (
        <View style={styles.container}>
          <Text onPress={this._logout.bind(this)}>退出</Text>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Islogin navigator={this.props.navigator} />
      </View>
    );
  }

  //退出登录
  _logout(){
    RCTDeviceEventEmitter.emit('tuichu');
    //this.props.logout()
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    //backgroundColor: '#000',
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


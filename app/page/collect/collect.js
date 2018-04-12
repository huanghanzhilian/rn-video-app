/*
* @Author: huanghanzhilian
* @Date:   2018-04-12 14:11:25
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-12 15:33:22
*/
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

var {height, width} = Dimensions.get('window');
import Head from '../../components/header/head'
import VideoList from '../../components/videoList'


export default class collect extends Component {
  constructor(props){
    super(props)
    this.state={
      
    }
  }

  render() {
    return (
      <View style={styles.container}>
      	<Head title='顶过得视频' navigator={this.props.navigator} />
        <VideoList {...this.props} api='getCollect'/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#212121',
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
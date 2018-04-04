/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
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


export default class topTitle extends Component {
  constructor(props){
    super(props)
    this.state={
      data:props.data,
    }
  }

  render() {
    var data=this.state.data
    return (
      <View style={styles.container}>
        <View style={styles.video_info_title}>
          <Text numberOfLines={1} style={styles.dusnlo_title}>{data.name}</Text> 
          <Text numberOfLines={1} style={styles.watch_ci}>{data.watchAmount} 次观看</Text> 
        </View>
        <Text numberOfLines={1} style={styles.video_detail_title}>{data.sourceName}</Text> 
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    width:width,
    padding:8,
    backgroundColor:'#252525'
  },
  video_info_title:{
    height:30,
    flexDirection:'row',
    //justifyContent: 'center',
    justifyContent:'space-between',
    alignItems: 'center',
  },
  dusnlo_title:{
    width:width*0.7,
    fontSize:16,
    color:'#848484'
  },
  watch_ci:{
    fontSize:12,
    color:'#525252'
  },
  video_detail_title:{
    color:'#525252',
    fontSize:14,
    //paddingTop:4,
    //paddingBottom:4,
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


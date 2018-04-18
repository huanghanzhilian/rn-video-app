/*
* @Author: huanghanzhilian
* @Date:   2018-04-08 14:46:18
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-18 10:23:13
*/
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var {height, width} = Dimensions.get('window');


export default class head extends Component {
  constructor(props){
    super(props)
    this.state={
      title:this.props.title||'samuredwonder'
    }
  }

  render() {
    return (
      <View style={styles.header}>
        <TouchableOpacity style={styles.popBox} onPress={this._pop.bind(this)}>
          <Icon style={styles.backIcon} name="ios-arrow-back" />
          <Text style={styles.backText}>返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOflines={1}>{this.state.title}</Text>
      </View>
    );
  }

  //返回上一页
  _pop(){
    // Use navigator pop
    if( this.props.callback ){
        this.props.callback()
    }
    this.props.navigator.pop()
  }


}

const styles = StyleSheet.create({
  header:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width:width,
    height:64,
    paddingTop:20,
    paddingLeft:10,
    paddingRight:10,
    borderBottomWidth:1,
    borderBottomColor:'rgba(0,0,0,0.1)',
    backgroundColor:'#212121'
  },
  popBox:{
    position:'absolute',
    left:12,
    top:32,
    width:50,
    flexDirection:'row',
    alignItems:'center',
  },
  backIcon:{
    color:'#848484',
    fontSize:20,
    marginRight:5,
  },
  backText:{
    color:'#848484',

  },
  headerTitle:{
    width:width-120,
    textAlign:'center',
    color:'#848484',
    fontSize:16
  },
});
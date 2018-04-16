/*
* @Author: huanghanzhilian
* @Date:   2018-04-12 14:11:25
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-16 18:25:09
*/
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  InteractionManager
} from 'react-native';

var {height, width} = Dimensions.get('window');
import Head from '../../components/header/head'
import VideoList from '../../components/videoList'


export default class collect extends Component {
  constructor(props){
    super(props)
    this.state={
      renderPlaceholderOnly:true
    }
  }
  //安装过  3
  componentDidMount(){
    InteractionManager.runAfterInteractions(()=>{  
      this.setState({renderPlaceholderOnly: false});
    });
    
  }
  _renderPlaceholderView() {
    return (
      <View style={styles.container}>
        <View style={styles.loadingF}>
          <Text style={styles.loadingFMore}>Loading...</Text>
        </View>
      </View>
    )
  }
  render() {
    if (this.state.renderPlaceholderOnly) {
      return this._renderPlaceholderView();
    }
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

  /*父加载交互s*/
  loadingF:{
    flex:1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingFMore:{
    color:'#777',
    textAlign:'center'
    //marginVertical:20
  },
  
  /*父加载交互e*/
});
/*
* @Author: huanghanzhilian
* @Date:   2018-04-12 17:28:41
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-12 17:44:43
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
import AlbumList from '../../components/albumList'


export default class collectAlbum extends Component {
  constructor(props){
    super(props)
    this.state={
      
    }
  }

  render() {
    return (
      <View style={styles.container}>
      	<Head title='收藏专辑' navigator={this.props.navigator} />
        <AlbumList {...this.props} api='getCollectAlbum' />
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
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
import Icon from 'react-native-vector-icons/Feather';

var {height, width} = Dimensions.get('window');


export default class shareWrap extends Component {
  constructor(props){
    super(props)
    this.state={
      
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.list}>
          <Icon
            name='thumbs-up'
            style={styles.Icon}
            size={24}
          />
          <Text style={styles.text}>3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.list}>
          <Icon
            name='thumbs-up'
            style={styles.Icon}
            size={24}
          />
          <Text style={styles.text}>3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.list}>
          <Icon
            name='thumbs-up'
            style={styles.Icon}
            size={24}
          />
          <Text style={styles.text}>3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.list}>
          <Icon
            name='thumbs-up'
            style={styles.Icon}
            size={24}
          />
          <Text style={styles.text}>3</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    width:width,
    padding:8,
    backgroundColor:'#252525',
    flexDirection:'row',
    
  },
  list:{
    flex:1,
    height:40,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Icon:{
    color:'#c8c6c9',
    fontSize:18
  },
  text:{
    marginTop:8,
    color:'#c8c6c9',
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


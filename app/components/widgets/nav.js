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
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Iconz from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/Feather'

var {height, width} = Dimensions.get('window');

export default class Subs extends Component {
  constructor(props){
    super(props)

    this.state = {
      
    }
  }
  render() {
    //console.log(this)
    if(!this.props.dark){
      return (
        <View style={styles.container}>
          
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Icon3 name="list" style={{margin:10,}} size={20} color="#fff" onPress={this.props.onSelect} />
            <Text style={{color:'#fff', margin:8, fontWeight:'500', fontSize:15}}>{this.props.name}</Text>
          </View>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <TouchableOpacity onPress={this._goSearch.bind(this)}>
              <Icon3 name="search" style={{margin:10}} size={20} color="#fff" />
            </TouchableOpacity>
            {/*<TouchableOpacity>
              <Iconz name="more-vert" style={{margin:5}} size={20} color="#fff" />
            </TouchableOpacity>*/}
          </View>
        </View>
      )
    }else{
      return (
        <View style={styles.containerD}>
          <Dialog
            ref="dialog"
          />
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Icon name="logo-youtube" style={{margin:10,}} size={30} color="#fff" />
            <Text style={{color:'#fff', margin:8, fontWeight:'500', fontSize:17}}>{this.props.name}</Text>
          </View>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <TouchableOpacity>
              <Iconz name="search" style={{margin:5}} size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Iconz name="more-vert" style={{margin:5}} size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  //去搜索页面
  _goSearch(){

    this.props.navigator.push({
      name:'search',
      id:'search'
    })
  }
  
}


const styles = StyleSheet.create({
  container: {
   height:60,
   paddingTop:13,
   flexDirection:'row',
   backgroundColor:'#212121',
   justifyContent:'space-between',
   borderBottomWidth:1,
   borderColor:'#212121'

  },
  containerD: {
   height:60,
   paddingTop:13,
   flexDirection:'row',
   backgroundColor:'#333',
   justifyContent:'space-between',
   borderBottomWidth:1,
   borderColor:'#444'

  },


  
});


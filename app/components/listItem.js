/*
* @Author: huanghanzhilian
* @Date:   2018-04-13 10:58:39
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-13 15:15:46
*/
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

var {height, width} = Dimensions.get('window');
import {timeCycle,formatDuring,imageUrl} from '../common/util'

export default class listItem extends Component {
  constructor(props){
    super(props)
    var row=this.props.row
    this.state={
    	_id:row.user.id,
      row:row
    }
  }

  render() {
  	var row=this.state.row
    return (
      <TouchableOpacity style={styles.itemBox} >         
        <View style={styles.item}>
          <Image 
            source={{uri : imageUrl(row.cover)}} 
            resizeMode="stretch" 
            style={styles.thumb}
          >
            <Text numberOfLines={1} style={styles.duration}>{formatDuring(row.duration)}</Text>
          </Image>
          <TouchableOpacity onPress={this._goDetailTv.bind(this)} style={styles.iteminfoBox}>
            <Image 
              style={styles.upImg} 
              source={{uri : imageUrl(row.user.head)}} 
              resizeMode="contain"/>
            <View style={styles.iteminfoCon}>
              <Text numberOfLines={1} style={styles.upName} >
                {row.user.name}
              </Text>
              <Text numberOfLines={1} style={styles.videoName} >
                {row.name}
              </Text>
              <Text style={styles.describeBox}>
                {row.watchAmount} 次观看
                <Icon name="fiber-manual-record" style={styles.fenge} color="#777" size={6} /> 
                {timeCycle(row.publishTime)} 
              </Text>
            </View>
          </TouchableOpacity>
        </View>    
      </TouchableOpacity>
    );
  }

  //去频道
  _goDetailTv(){
  	this.props.navigator.push({
      name:'detailTv',
      id:'detailTv',
      params:{
        _id:this.state._id
      }
    })
  }


}

const styles = StyleSheet.create({
  itemBox:{
    //backgroundColor:'#000',
  },
  item:{
    //height:300,
    width:width,
    backgroundColor:'#212121',
    borderBottomWidth:1,
    borderColor:'#383838'
  },
  thumb:{
    width:350,
    alignSelf:'center',
    height:width*0.5625,
    margin:15,
    marginBottom:0
  },
  duration:{
    position:'absolute',
    bottom:8,
    right:8,
    //width:46,
    height:17,
    paddingRight:8,
    paddingLeft:8,
    backgroundColor:'rgba(0,0,0,.6)',
    color:'#fff'
  },
  iteminfoBox:{
    padding:15, 
    height:80, 
    alignItems:'center', 
    width:350, 
    flexDirection:'row'
  },
  upImg:{
    height:40,
    width:40, 
    borderRadius:20
  },
  iteminfoCon:{
    margin:2, 
    marginLeft:10
  },
  upName:{
    color:'#868486', 
    margin:2, 
    fontSize:13, 
    width:260,
  },
  videoName:{
    color:'#c8c6c9', 
    margin:2, 
    fontSize:15, 
    width:260,
    marginTop:2,
    marginBottom:2
  },
  describeBox:{color:'#666', 
    margin:2, 
    marginTop:0, 
    fontSize:12
  },
  fenge:{
    margin:3
  },
});
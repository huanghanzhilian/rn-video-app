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
  Image
} from 'react-native';

import {timeCycle,formatDuring,imageUrl} from '../../common/util'
var {height, width} = Dimensions.get('window');


export default class upInfo extends Component {
  constructor(props){
    super(props)
    this.state={
      data:props.data,
    }
  }

  render() {
    var data=this.state.data
    return (
      <TouchableOpacity style={styles.container} onPress={()=>this.props.goDetailTv(this.state.data.user.id)}>
        <Image 
          style={styles.upImg} 
          source={{uri : imageUrl(data.user.head)}} 
          resizeMode="contain"/>
        <View style={styles.iteminfoCon}>
          <Text numberOfLines={1} style={styles.upName} >
            {data.user.name}
          </Text>
          <Text numberOfLines={1} style={styles.videoName} >
            {data.user.name}
          </Text>
        </View>
        <View style={styles.dingyue}>
          {/*<Text numberOfLines={1} style={styles.dingyuenum} >
            订阅100
          </Text>*/}
        </View>
      </TouchableOpacity>
    );
  }
  //去频道
  _goDetailTv(){
    //console.log(this.props.navigator.getCurrentRoutes())
    //return
    var id=this.state.data.user.id
    /*var navio=this.props.navigator.getCurrentRoutes()
    var status=false
    for (var i = 0; i < navio.length; i++) {
      if(navio[i].name=='detailTv'&&navio[i].params._id==id){
        status=true
        break
      }
      status=false
    }
    this.props.videoDown()

    if(status){
      return
    }
    
    setTimeout(() => {
      this.props.navigator.push({
        name:'detailTv',
        id:'detailTv',
        params:{
          _id:id
        }
      })
    }, 800)*/

    // this.props.navigator.push({
    //   name:'detailTv',
    //   id:'detailTv',
    //   params:{
    //     _id:id
    //   }
    // })
      
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    padding:8, 
    paddingTop:4,
    paddingBottom:4,
    //height:80, 
    alignItems:'center', 
    width:width, 
    flexDirection:'row',
    borderColor:'#393939',
    borderWidth:1,
    borderLeftWidth:0,
    borderRightWidth:0,
    //backgroundColor:'red'
  },
  upImg:{
    height:40,
    width:40, 
    borderRadius:20
  },
  iteminfoCon:{
    flex:1,
    margin:2, 
    marginLeft:10
  },

  dingyue:{

    width:80,
  },
  dingyuenum:{
    color:'#868486',
    fontSize:12,
    textAlign:'right',
  },
  upName:{
    color:'#c8c6c9',
    marginBottom:8,
    fontSize:14
  },
  videoName:{
    color:'#868486',
    fontSize:12
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


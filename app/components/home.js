/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ListView,
  View
} from 'react-native';

//组件或者工具模块 就是本地项目模块
var request=require('../common/request')
var config=require('../common/config');
import {timeCycle} from '../common/util'
import Play from './play'

var {height, width} = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Home extends Component {
  constructor(props){
    super(props)
    console.log(this.props)
    this.state={
      fill:50,
      noVideo:true,
      // dataSource: ds.cloneWithRows(this.props.vid),
      dataSource: ds.cloneWithRows([]),
    }
  }

  eachVid(x){
    return(
      <TouchableOpacity 
        onPress={this.props.press} 
        style={{height:295, width:width,backgroundColor:'#212121', borderBottomWidth:1, borderColor:'#e6e6e6'}}>
          <Image source={{uri : x.cover}} resizeMode="stretch" style={{width:350, alignSelf:'center', height:200, margin:15, marginBottom:0}} />
          
          <View style={{padding:15, height:80, alignItems:'center', width:350, flexDirection:'row'}}>
            <Image source={{uri : x.user.head}} resizeMode="contain" style={{height:40,width:40, borderRadius:20}} />
            <View style={{margin:2, marginLeft:10}}>
              <Text numberOfLines={1} style={{color:'#333', margin:2, fontSize:13, width:260}}>
                {x.name}
              </Text>
              <Text numberOfLines={1} style={{color:'#333', margin:2, fontSize:13, width:260}}>
                {x.name}
              </Text>
              <Text style={{color:'#666', margin:2, marginTop:0, fontSize:12}}>
                {x.watchAmount} 次观看
                <Icon name="fiber-manual-record" color="#777" size={6} style={{margin:3}} /> 
                {timeCycle(x.publishTime)} 
              </Text>
            </View>
          </View>
      </TouchableOpacity>

      
    )
  }

  //获取数据
  _fetchData(){
    request.get(config.api.base+config.api.creations,{pageSize:8,pageNum:1})
    .then((data) => {
      if(!data.code){

      }
      console.log(data)
      this.setState({
        dataSource:this.state.dataSource.cloneWithRows(data.data.row)
        // dataSource:this.state.dataSource.cloneWithRows(this.props.vid)
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }
  //开始安装  1
  componentWillMount(){
    console.log('开始安装')
  }
  //安装过  3
  componentDidMount(){

    console.log('安装完毕11')
    this._fetchData()
  }
  render() {
    return (
      <View style={{flex:1}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this.eachVid(rowData)}
          style={{marginTop:5}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'red'
    //backgroundColor:'#212121'
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


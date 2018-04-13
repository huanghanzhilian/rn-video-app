/*
* @Author: huanghanzhilian
* @Date:   2018-04-13 11:20:00
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-13 15:46:09
*/
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  AlertIOS
} from 'react-native';

var ScrollableTabView = require('react-native-scrollable-tab-view');//轮播组件

var request=require('../../common/request')
var config=require('../../common/config');
import {timeCycle,formatDuring,imageUrl} from '../../common/util'
var {height, width} = Dimensions.get('window');
import Head from '../../components/header/head'
import VideoList from '../../components/videoList'
import AlbumList from '../../components/albumList'
import DetailTvTab from '../../components/detailTvTab'


export default class detailTv extends Component {
  constructor(props){
    super(props)
    this.state={
      upInfo:null
    }
  }
  //开始安装  1
  componentWillMount(){
  }
  //安装过  3
  componentDidMount(){
    var id=this.props._id
    this._fetchData(id)
  }
  render() {
  	var id=this.props._id
    return (
      <View style={styles.container}>
      	{
      		this.state.upInfo
      		?<View style={styles.container}>
	      		<Head title={this.state.upInfo.name} navigator={this.props.navigator} />
		      	<ScrollableTabView 
		      		renderTabBar={()=><DetailTvTab upInfo={this.state.upInfo}/>}
		      	>
			        <VideoList {...this.props} _id={id} api='getChannelvideos' tabLabel="视频" />
			        <AlbumList {...this.props} _id={id} api='getChannelalbums' tabLabel="专辑" />
			        <View tabLabel="简介" style={styles.briefBox}>
			        	<Text numberOfLines={1} style={styles.briefItemBox} >
                  <Text numberOfLines={1} style={styles.brief_l} >
	                  简介：
	                </Text>
	                <Text style={styles.brief_r} >
	                  {this.state.upInfo.summary}
	                </Text>
                </Text>
			        </View>
			      </ScrollableTabView>
	      	</View>
      		:null
      	}

	      	
      </View>
    );
  }

  //获取数据
  _fetchData(id){
    request.get(config.api.base+config.api.getUpuserinfo,{
    	userId:id
    })
    .then((data) => {
      if(data.code==0){
        
        this.setState({
          upInfo:data.data
        })
      }
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        isLoadingTail:false
      })
    });
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#212121',
  },

  briefBox:{
  	padding:10,
  },
  briefItemBox:{
  	flexDirection:'row',
  },
	brief_l:{
		fontSize:14,
		color:'#848484'
	},
	brief_r:{
		fontSize:14,
		color:'#525252'
	},

  
});

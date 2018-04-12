/*
* @Author: huanghanzhilian
* @Date:   2018-04-12 18:12:23
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-12 19:05:08
*/
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ListView,
  ActivityIndicator,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/Ionicons';


//组件或者工具模块 就是本地项目模块
var request=require('../../common/request')
var config=require('../../common/config');
import {timeCycle,formatDuring,imageUrl} from '../../common/util'
var {height, width} = Dimensions.get('window');
import Head from '../../components/header/head'

var cachedResults={
  nextPage:1,
  pageSize:8,
  items:[],
  total:0
}
export default class notifications extends Component {
  constructor(props){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    super(props)
    this.state={
      dataSource:ds.cloneWithRows([]),

      //加载交互
      isLoadingTail:false,//初始化转菊花
      isRefreshing:false,//是否重新加载 转菊花

      //modal
      modalVisible:true,//是否打开浮层
    }
  }

  //开始安装  1
  componentWillMount(){
  }
  //安装过  3
  componentDidMount(){
    var page= 1
    this._fetchData(page)
  }

  componentWillUnmount(){
    cachedResults={
      nextPage:1,
      pageSize:8,
      items:[],
      total:0
    }
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows([])
    })
    //console.log('卸载')
  }

  render() {
    return (
      <View style={styles.container}>
      	<Head title='系统通知' navigator={this.props.navigator} />
        <View style={styles.container2}>
          <ListView
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={false}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this.eachVid(rowData)}
          renderFooter={this._renderFooter.bind(this)}//页头与页脚会在每次渲染过程中都重新渲染
          onEndReached={this._fechMoreData.bind(this)}//滑动到底部事件
          onEndReachedThreshold={20}//滑动到底部事件 距离底部20触发
          
          style={{marginTop:5}}
        />
      	</View>
      	<Modal
          animationType={'fade'}//定义浮层出现形式
          visible={this.state.modalVisible}//是否开启
          onRequsetClose={()=>{this._setModalVisible(false)}}//关闭时候
          >
          <View style={styles.modalContainer}>
            <Icon3
              onPress={this._closeModal.bind(this)}
              name='ios-close-outline'
              style={styles.closeIcon}
              size={24}
             />
            <View style={styles.commentBox}>
              <Text style={styles.not_text}>拼命加载中...</Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  //取关模态窗
  _setModalVisible(islVisible){
    this.setState({
      modalVisible:islVisible
    })
  }
  _closeModal(){
    this._setModalVisible(false)
  }
  //页头与页脚会在每次渲染过程中都重新渲染
  _renderFooter(){
    //如何没有数据了和数据长度不为0
    if(!this._hasMore()&&cachedResults.total!==0){
      return (
        <View style={styles.loadingMore}><Text style={styles.loadingText}>没有更多了</Text>
        </View>
      )
    }
    if(this.state.isLoadingTail){
      return (
        <View style={styles.loadingMore}>
          <Text style={styles.loadingText}>拼命加载中...</Text>
          <ActivityIndicator style={styles.loadingMore} />
        </View>
      )
    }
  }

  //获取更多数据
  _fechMoreData(){
    //如果有更多数据了或者是在加载中 直接返回
    if(!this._hasMore()||this.state.isLoadingTail){
      return
    }
    var page= cachedResults.nextPage
    this._fetchData(page)
  }
  //是否没有更多新数据了 返回true为还有数据
  _hasMore(){
    return cachedResults.items.length!==cachedResults.total 
  }

  //渲染列表
  eachVid(x){
    return(
      <TouchableOpacity style={styles.itemBox} onPress={this.props.press}>         
        <View style={styles.item}>
          <Text numberOfLines={1} style={styles.not_title}>{x.title}</Text>
          <View style={styles.item_bottom}>
          	<Icon2
              name='message'
              style={styles.not_icon}
              size={24}
            />
	          <Text numberOfLines={1} style={styles.not_time}>{timeCycle(x.createTime)}</Text>
	          
	        </View> 
        </View>    
      </TouchableOpacity>
    )
  }
  //获取数据
  _fetchData(page){
    var api=this.props.api
    this.setState({
      isLoadingTail:true
    })

    request.get(config.api.base+config.api.getNotifications,{
      pageSize:cachedResults.pageSize,
      pageNum:page
    })
    .then((data) => {
      //console.log(data)
      if(data.code==0){
        var items=cachedResults.items.slice()
        console.log(items)
        items=[...items,...data.data.row]
        cachedResults.nextPage+=1
        cachedResults.items=items
        cachedResults.total=data.data.recordAmount//获取视频总数
        this.setState({
          isLoadingTail:false,
          dataSource:this.state.dataSource.cloneWithRows(cachedResults.items)
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
  container2: {
    flex: 1,
    backgroundColor:'#212121',
  },

  itemBox:{
  	padding:8,
  	borderBottomWidth:1,
  	borderBottomColor:'#383838',
  },
	not_title:{
		color:'#c8c6c9'
	},
	item_bottom:{
		flexDirection:'row',
		alignItems: 'center',
		marginTop:4,
	},
	not_icon:{
		color:'#555456'
	},
	not_time:{
		marginLeft:4,
		color:'#555456'
	},


	modalContainer:{
    flex:1,
    paddingTop:45,
    borderBottomColor:'#fff',
  },
  closeIcon:{
    alignSelf:'center',
    fontSize:30,
    color:'#c8c6c9'
  },


  /*加载交互s*/
  loadingText:{
    color:'#777',
    textAlign:'center'
  },
  loadingMore:{
    marginVertical:20
  },
  listHeader:{
    marginTop:10,
    width:width
  },
  /*加载交互e*/
});
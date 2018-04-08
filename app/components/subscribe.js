/*
* @Author: huanghanzhilian
* @Date:   2018-04-08 12:18:19
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-08 17:45:08
*/
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ListView,
  View,
  RefreshControl,//下拉刷新组件
  ActivityIndicator
} from 'react-native';

//组件或者工具模块 就是本地项目模块
var request=require('../common/request')
var config=require('../common/config');
import {timeCycle,formatDuring,imageUrl} from '../common/util'
import Play from './play'

var {height, width} = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import Icon from 'react-native-vector-icons/MaterialIcons';


var cachedResults={
  nextPage:1,
  pageSize:10,
  items:[],
  total:0
}
export default class subscribe extends Component {
  constructor(props){
    super(props)
    console.log(this.props)
    this.state={
      fill:50,
      noVideo:true,
      // dataSource: ds.cloneWithRows(this.props.vid),
      dataSource: ds.cloneWithRows([]),

      
      //加载交互
      isLoadingTail:false,//初始化转菊花
      isRefreshing:false,//是否重新加载 转菊花

    }
  }

  eachVid(x){
    return(
      <TouchableOpacity style={styles.itemBox} onPress={this.props.press}>         
        <View style={styles.item}>
          <Image 
            source={{uri : imageUrl(x.cover)}} 
            resizeMode="stretch" 
            style={styles.thumb}
          >
            <Text numberOfLines={1} style={styles.duration}>{formatDuring(x.duration)}</Text>
          </Image>
          <View style={styles.iteminfoBox}>
            <Image 
              style={styles.upImg} 
              source={{uri : imageUrl(x.user.head)}} 
              resizeMode="contain"/>
            <View style={styles.iteminfoCon}>
              <Text numberOfLines={1} style={styles.upName} >
                {x.user.name}
              </Text>
              <Text numberOfLines={1} style={styles.videoName} >
                {x.name}
              </Text>
              <Text style={styles.describeBox}>
                {x.watchAmount} 次观看
                <Icon name="fiber-manual-record" style={styles.fenge} color="#777" size={6} /> 
                {timeCycle(x.publishTime)} 
              </Text>
            </View>
          </View>
        </View>    
      </TouchableOpacity>
    )
  }

  
  //开始安装  1
  componentWillMount(){
    console.log('开始安装')
  }
  //安装过  3
  componentDidMount(){

    console.log('安装完毕11')
    var page= this.state.pageNum
    this._fetchData(page)
  }
  render() {
    return (
      <View style={{flex:1}}>
        <ListView
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={false}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this.eachVid(rowData)}
          renderFooter={this._renderFooter.bind(this)}//页头与页脚会在每次渲染过程中都重新渲染
          onEndReached={this._fechMoreData.bind(this)}//滑动到底部事件
          onEndReachedThreshold={20}//滑动到底部事件 距离底部20触发
          refreshControl={//下拉刷新
            <RefreshControl
              refreshing={this.state.isRefreshing}//在视图开始刷新时调用
              onRefresh={this._onRefresh.bind(this)}//刷新
              tintColor="#ff6600"
              title="加载中..."
            />
          }
          style={{marginTop:5}}
        />
      </View>
    );
  }

  //是否没有更多新数据了 返回true为还有数据
  _hasMore(){
    return cachedResults.items.length!==cachedResults.total 
  }
  _onRefresh(){
    this._fetchData(0)
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

  //获取数据
  _fetchData(page){
    var pages=page
    if(page!==0){
      this.setState({
        isLoadingTail:true
      })
    }else{
      pages=1
      this.setState({
        isRefreshing:true,
      })
    }

    request.get(config.api.base+config.api.creations,{
      pageSize:cachedResults.pageSize,
      pageNum:page
    })
    .then((data) => {
      if(data.code==0){
        var items=cachedResults.items.slice()
        if(page!==0){
          items=[...items,...data.data.row]
          cachedResults.nextPage+=1
        }else{
          cachedResults.nextPage=1
          cachedResults.nextPage+=1
          items=data.data.row
        }
        cachedResults.items=items
        cachedResults.total=data.data.recordAmount//获取视频总数
        console.log('数据总数'+cachedResults.total)
        console.log('当前页'+(cachedResults.nextPage-1))
        console.log('下一页'+cachedResults.nextPage)
        console.log(cachedResults.items.length)
        if(page!==0){
          this.setState({
            isLoadingTail:false,
            dataSource:this.state.dataSource.cloneWithRows(cachedResults.items)
          })
        }else{
          this.setState({
            isRefreshing:false,
            dataSource:this.state.dataSource.cloneWithRows(cachedResults.items)
          })
        }
        
      }
    })
    .catch((error) => {
      console.error(error);
      if(page!==0){
        this.setState({
          isLoadingTail:false
        })
      }else{
        this.setState({
          isRefreshing:false
        })
      }
    });
  }



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'red'
    //backgroundColor:'#212121'
  },

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
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
  View,
  RefreshControl,//下拉刷新组件
  ActivityIndicator
} from 'react-native';

//组件或者工具模块 就是本地项目模块
var request=require('../common/request')
var config=require('../common/config');

import Islogin from "./islogin/islogin"
import Play from './play'
import ListItem from './listItem'
import Nav from './widgets/nav'

var {height, width} = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});



var cachedResults={
  nextPage:1,
  pageSize:10,
  items:[],
  total:0
}
export default class Subscribe extends Component {
  constructor(props){
    super(props)
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
    //onPress={this.props.press}
    return(
      <ListItem 
        navigator={this.props.navigator} {...this.props}
        key={x.id} 
        //onSelect={()=>this._loadPage(row)} 
        row={x} />
    )
  }

  
  //开始安装  1
  componentWillMount(){
    //console.log('开始安装')
  }
  //安装过  3
  componentDidMount(){

    //console.log('安装完毕11')
    var page= this.state.pageNum
    this._fetchData(page)
  }
  render() {
    if(this.props.userInfo){
      return (
        <View style={{flex:1,backgroundColor:'#212121'}}>
          <Nav navigator={this.props.navigator} {...this.props} name="订阅" dark={false} onSelect={()=>this._dialog()} />
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
                tintColor="#fff"
                title="加载中..."
                titleColor="#fff"
              />
            }
            style={{marginTop:5}}
          />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Nav navigator={this.props.navigator} {...this.props} name="订阅" dark={false} onSelect={()=>this._dialog()} />
        <Islogin navigator={this.props.navigator} />
      </View>
    );
      
  }
  _dialog(){
    this.props.onSelect()
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

    request.get(config.api.base+config.api.getSubscription,{
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
        // console.log('数据总数'+cachedResults.total)
        // console.log('当前页'+(cachedResults.nextPage-1))
        // console.log('下一页'+cachedResults.nextPage)
        // console.log(cachedResults.items.length)
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
    //backgroundColor:'red'
    backgroundColor:'#212121'
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


/*
* @Author: huanghanzhilian
* @Date:   2018-04-13 18:58:01
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-16 12:20:43
*/
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  ListView,
  ActivityIndicator,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/Foundation';

//组件或者工具模块 就是本地项目模块
var request=require('../../common/request')
var config=require('../../common/config');
import {timeCycle,formatDuring,imageUrl} from '../../common/util'
var {height, width} = Dimensions.get('window');

var cachedResults={
  nextPage:1,
  pageSize:8,
  items:[],
  total:0
}
export default class search extends Component {
  constructor(props){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    super(props)
    this.state={
      content:'',//搜索内容

      dataSource:ds.cloneWithRows([]),

      //加载交互
      isLoadingTail:false,//初始化转菊花
      isRefreshing:false,//是否重新加载 转菊花
    }
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
    		<View style={styles.header}>
	        <TouchableOpacity style={styles.popBox} onPress={this._pop.bind(this)}>
	          <Icon style={styles.backIcon} name="ios-arrow-back" />
	        </TouchableOpacity>
          <View style={styles.inputWrap}>
            <View style={styles.inputBox}>
              <TextInput 
                placeholder='搜索视频'
                placeholderTextColor='#7e7e7e'
                autoCaptialize={'none'}//不去纠正大小写
                autoCorrect={false}//不去纠正内容对与错
                keyboradType={'number-pad'}//键盘配置
                style={styles.inputField}
                onFocus={this._accountFocus.bind(this)}//聚焦
                onBlur={this._accountBlur.bind(this)}//失去焦点
                defaultValue={this.state.content}//初始值
                onChangeText={(text)=>{
                  //var content=text
                  if(text.length<=0){
                    cachedResults={
                      nextPage:1,
                      pageSize:8,
                      items:[],
                      total:0
                    }
                    this.setState({
                      dataSource: this.state.dataSource.cloneWithRows([])
                    })
                  }
                  this.setState({
                    content:text
                  })
                }}
                onSubmitEditing={this._submit.bind(this)}
              />
            </View>
            <Text onPress={this._cancel.bind(this)} style={styles.cancel}>取消</Text>
          </View>
              
	      </View>
        {
          !this.state.content||!cachedResults.items.length&&!this.state.isLoadingTail
          ?<View style={styles.historyBox}>
            <Text style={styles.historyTitle}>历史搜索</Text>
            <View style={styles.historyItemBox}>
              <View style={styles.historyItem}>
                <Icon2 style={styles.historyItemIcon} name="history" />
                <Text style={styles.historyItemContent}>lll</Text>
              </View>
            </View>
          </View>
          :null
        }
          
        <View>
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
        
        {/*  {
            this.state.content&&cachedResults.items.length
            ?<View>
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
            :null
          }*/}
            
      </View>
    );
  }
  //聚焦
  _accountFocus(){

  }
  //失去焦点
  _accountBlur(){

  }
  //取消搜索
  _cancel(){
    cachedResults={
      nextPage:1,
      pageSize:8,
      items:[],
      total:0
    }
    this.setState({
      content:'',
      dataSource: this.state.dataSource.cloneWithRows([])
    })
  }
  //搜索提交
  _submit(){
    var content=this.state.content
    if(!content){
      return
    }
    this._fetchData(1)

  }

  //渲染列表
  eachVid(x){
    
      if(x.rowFlag==1){
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
              <View style={styles.iteminfoCon}>
                {
                  x.user
                  ?<Text numberOfLines={1} style={styles.upName} >
                    {x.user.name}
                  </Text>
                  :null
                }
                  
                <Text numberOfLines={1} style={styles.videoName} >
                  {x.name}
                </Text>
                <Text style={styles.describeBox}>
                  {x.watchAmount} 次观看
                  <Icon2 name="fiber-manual-record" style={styles.fenge} color="#777" size={6} /> 
                  {timeCycle(x.publishTime)} 
                </Text>
              </View>
            </View>
          </View>    
        </TouchableOpacity>
        )
      }
      if(x.rowType==3){
        return(
        <TouchableOpacity style={styles.itemBox} onPress={this.props.press}>         
          <View style={styles.item}>
            <Image 
              source={{uri : imageUrl(x.playlistCover)}} 
              resizeMode="stretch" 
              style={styles.thumb}
            >
              <View style={styles.moskBox}>
                <Text numberOfLines={1} style={styles.albumNum}>{x.videoAmount}</Text>
                <Icon3 name="indent-more" style={styles.albumIcon} color="#777" size={24} /> 
              </View>
              {/*<Text numberOfLines={1} style={styles.duration}>{formatDuring(x.duration)}</Text>*/}
            </Image>


            <View style={styles.iteminfoBox}>
              <View style={styles.iteminfoCon}>
                {
                  x.user
                  ?<Text numberOfLines={1} style={styles.upName} >
                    {x.user.name}
                  </Text>
                  :null
                }
                  
                <Text numberOfLines={1} style={styles.videoName} >
                  {x.playlistName}
                </Text>
                <Text style={styles.describeBox}>
                  {x.watchAmount} 次观看
                  <Icon2 name="fiber-manual-record" style={styles.fenge} color="#777" size={6} /> 
                  {timeCycle(x.playlistPublishTime)} 
                </Text>
              </View>
            </View>


          </View>    
        </TouchableOpacity>
        )
      }
      
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
  //获取数据
  _fetchData(page){
    var content=this.state.content
    this.setState({
      isLoadingTail:true
    })
    var body={
      pageSize:cachedResults.pageSize,
      pageNum:page
    }
    if(content){
      body.key=content
    }
    request.get(config.api.base+config.api.getSearch,body)
    .then((data) => {

      if(data.code==0){
        var items=cachedResults.items.slice()
        //console.log(data)
        items=[...items,...data.data.row]
        cachedResults.nextPage+=1
        cachedResults.items=items
        cachedResults.total=data.data.recordAmount//获取视频总数
        // this.setState({
        //   isLoadingTail:false,
        //   dataSource:this.state.dataSource.cloneWithRows(cachedResults.items)
        // })
        
        setTimeout(()=>{
          this.setState({
            isLoadingTail:false,
            dataSource:this.state.dataSource.cloneWithRows(cachedResults.items)
          })
        },1000)
          
          
      }
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        isLoadingTail:false
      })
    });
  }

  //返回上一页
  _pop(){
    this.props.navigator.pop()
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#212121',
  },
  
  /*tap s*/
  header:{
    flexDirection:'row',
    // justifyContent:'center',
    alignItems:'center',
    width:width,
    height:64,
    paddingTop:20,
    paddingLeft:10,
    paddingRight:10,
    borderBottomWidth:1,
    borderBottomColor:'rgba(0,0,0,0.1)',
    backgroundColor:'#212121'
  },
  popBox:{
    /*position:'absolute',
    left:12,
    top:32,*/
    width:30,
    flexDirection:'row',
    alignItems:'center',
  },
  backIcon:{
    color:'#848484',
    fontSize:20,
    marginRight:5,
  },

  inputWrap:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  inputBox:{
    flex:1,
    height:25,
  },
  inputField:{
    backgroundColor:'#fff',
    flex:1,
    padding:4,
    fontSize:14,
    color:'#7e7e7e',
  },
  cancel:{
    width:50,
    textAlign:'center',
    color:'#848484',
  },
  

  /*tap e*/


  /*历史搜索 s */
  historyBox:{
    padding:10,
  },
  historyTitle:{
    color:'#525252',
    fontSize:14,
    height:30,
    lineHeight:30,
  },
  historyItemBox:{

  },
  historyItem:{
    flexDirection:'row',
    //justifyContent:'center',
    alignItems:'center',
    height:40,
    borderBottomColor:'#383838',
    borderBottomWidth:1,
  },
  historyItemIcon:{
    color:'#848484',
    fontSize:14,
  },
  historyItemContent:{
    color:'#848484',
    fontSize:14,
    paddingLeft:8
  },
  /*历史搜索 e */


   /*列表样式s */
  item:{
    //height:300,
    width:width,
    backgroundColor:'#212121',
    borderBottomWidth:1,
    borderColor:'#383838',
    flexDirection:'row',
    padding:8,
  },
  thumb:{
    width:142,
    alignSelf:'center',
    height:142*0.5625,
    //margin:15,
    //marginBottom:0
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
    flex:1,
    //padding:15, 
    //alignItems:'center', 
    //width:350, 
    flexDirection:'row',
    paddingRight:0,
    paddingLeft:8,
    paddingTop:4,
    paddingBottom:4,
  },
  iteminfoCon:{

  },
  upName:{
    color:'#868486', 
    fontSize:13, 
  },
  videoName:{
    color:'#c8c6c9', 
    fontSize:15, 
    marginTop:6,
    marginBottom:6
  },
  describeBox:{color:'#666', 
    margin:2, 
    marginTop:0, 
    fontSize:12
  },
  fenge:{
    margin:3
  },
  /*列表样式e */

  /*专辑列表样式s */
  moskBox:{
    backgroundColor:'rgba(0,0,0,.6)',
    width:50,
    height:142*0.5625,
    position:'absolute',
    top:0,
    right:0,
    justifyContent: 'center',
    alignItems: 'center',

  },
  albumNum:{
    color:'#c8c6c9'
  },
  albumIcon:{
    color:'#c8c6c9'
  },
  /*专辑列表样式e */


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
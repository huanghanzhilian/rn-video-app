/*
* @Author: huanghanzhilian
* @Date:   2018-04-12 14:20:42
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-17 15:27:14
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
  Image,
  InteractionManager
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

//组件或者工具模块 就是本地项目模块
var request=require('../common/request')
var config=require('../common/config');
import {timeCycle,formatDuring,imageUrl} from '../common/util'
var {height, width} = Dimensions.get('window');

//const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var cachedResults={
  nextPage:1,
  pageSize:8,
  items:[],
  total:0
}
export default class videoList extends Component {

  constructor(props){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    super(props)
    this.state={
      dataSource:ds.cloneWithRows([]),

      //加载交互
      isLoadingTail:false,//初始化转菊花
      isRefreshing:false,//是否重新加载 转菊花
    }
  }


  //开始安装  1
  componentWillMount(){
  }
  //安装过  3
  componentDidMount(){
    var page= 1
    this._fetchData(page)
    // InteractionManager.runAfterInteractions(()=>{  
    //   var page= 1
    //   this._fetchData(page)
    // }); 
    
  }

  render() {

    //console.log(this)
  	//console.log(this.state.dataSource)
    return (
      <View style={styles.container}>
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
    );
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

  //渲染列表
  eachVid(x){
    return(
      <TouchableOpacity style={styles.itemBox} onPress={
        ()=>{
          this.props.ongetVideoInfo({open:false,id:0})
          setTimeout(() => {
            this.props.ongetVideoInfo({open:true,id:x.id})
          }, 100)
        }
      }>         
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
                <Icon name="fiber-manual-record" style={styles.fenge} color="#777" size={6} /> 
                {timeCycle(x.publishTime)} 
              </Text>
            </View>
          </View>
        </View>    
      </TouchableOpacity>
    )
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
    var _id=this.props._id||''
    var api=this.props.api
    this.setState({
      isLoadingTail:true
    })
    var body={
      pageSize:cachedResults.pageSize,
      pageNum:page
    }
    if(_id){
      body.userId=_id
    }
    request.get(config.api.base+config.api[api],body)
    .then((data) => {
      //console.log(data)
      if(data.code==0){
        var items=cachedResults.items.slice()
        //console.log(data)
        items=[...items,...data.data.row]
        cachedResults.nextPage+=1
        cachedResults.items=items
        cachedResults.total=data.data.recordAmount//获取视频总数
        this.setState({
            isLoadingTail:false,
            dataSource:this.state.dataSource.cloneWithRows(cachedResults.items)
          })
        // setTimeout(()=>{
        //   this.setState({
        //     isLoadingTail:false,
        //     dataSource:this.state.dataSource.cloneWithRows(cachedResults.items)
        //   })
        // },1000)
          
	        
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
  },

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
/*
* @Author: huanghanzhilian
* @Date:   2018-04-12 14:20:42
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-21 00:06:47
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
  InteractionManager,
  Modal,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/Ionicons';

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

      //modal
      modalVisible:false,//是否打开浮层

      //加载交互
      isLoadingTail:false,//初始化转菊花
      isRefreshing:false,//是否重新加载 转菊花

      sortArr: [{
        "id": 100,
        "parentId": 0,
        "value": "  排序依据",
        "key": "4_1_011"
      }, {
        "id": 2000,
        "parentId": 100,
        "value": "播放量",
        "key": 100
      }, {
        "id": 2001,
        "parentId": 100,
        "value": "发布时间",
        "key": 101
      }],
      sialArrayData: [],
      sort:'',//排序
      type:'',//类型
      years:'',
      country:'',

    }
  }


  //开始安装  1
  componentWillMount(){
  }
  //安装过  3
  componentDidMount(){
    if(this.props.tag){
      this._fetchTag()
    }
    
    var page= 1
    this._fetchData(page)
    // InteractionManager.runAfterInteractions(()=>{  
    //   var page= 1
    //   this._fetchData(page)
    // }); 
    
  }


  render() {

    // console.log(this)
  	//console.log(this.state.dataSource)
    return (
      <View style={styles.container}>
        {
          this.props.tag
          ?<View style={styles.tagBox}>
            <Text style={styles.videoNum}>共{cachedResults.total}个视频</Text>
            <Icon
              name='dehaze'
              size={20}
              style={styles.chooseIcon}
              onPress={()=>{this._setModalVisible(true)}}
            />
          </View>
          :null
        }
          
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
        <Modal
          animationType={'fade'}//定义浮层出现形式
          visible={this.state.modalVisible}//是否开启
          onRequsetClose={()=>{this._setModalVisible(false)}}//关闭时候
          >
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.popBox} onPress={this._closeModal.bind(this)}>
                <Icon3
                  name='ios-close-outline'
                  style={styles.closeIcon}
                  size={28}
                 />
              </TouchableOpacity>
              <Text style={styles.headerTitle} numberOflines={1}>筛选条件</Text>
              <TouchableOpacity style={styles.popBoxr} onPress={this._initDatasaixuan.bind(this)}>
                <Icon3
                  name='ios-checkmark-outline'
                  style={styles.closeIcon}
                  size={28}
                 />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.commentBox}>
              
              {this.state.sialArrayData.map((tab, i) => {
                return <View key={tab.key} style={styles.slpe_wrap}>
                  <View style={styles.saixuan_wrap}>
                    <Text style={styles.comment_text}>{tab.value}</Text>
                    <View style={styles.saixuan_list}>
                      {tab.data.map((items, indexs) => {
                        return <Text 
                            onPress={()=>this._filterBtn(i,items,indexs)}
                            key={items.key} 
                            style={[styles.saixuan_item,items.status==1?styles.saixuan_item_active:null]}
                          >{items.value}
                          </Text>;
                      })}

                    </View>
                  </View>
                </View>;
              })}
            </View>
            </ScrollView>
          </View>
        </Modal>
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

  //取关模态窗
  _setModalVisible(islVisible){
    this.setState({
      modalVisible:islVisible
    })
  }
  //关闭弹出
  _closeModal(){
    this._setModalVisible(false)
  }
  //赛选提交
  _initDatasaixuan(){
    this._fetchData(-1)
    this._closeModal()
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


  //for异步循环
  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }
  async walk(api){
    var datas=[]
    await this.asyncForEach(api, async x => {
      var data = await request.get(config.api.base+config.api[x])
      datas=[...datas,...data.data]
    })
    return datas
  }
  //获取tag数据
  async _fetchTag(){
    var api=this.props.tag
    // request.get(config.api.base+config.api[api])
    // .then((res) => {

    // })
    // .catch((error) => {
    //   console.error(error)
    // })
    var category=await this.walk(api)

    category = [...category, ...this.state.sortArr];
    var category1 = [];
    for (var i = 0, k = category; i < k.length; i++) {
      if (k[i].parentId == 0 
        && (k[i].key == '1_1_0' 
        || k[i].key == '2_7_0' 
        || k[i].key == '3_11_0' 
        || k[i].key == '7_102_0' 
        || k[i].key == '5_60_0' 
        || k[i].key == '4_1_011')) {
        var box = k[i];
        box.data = []
        var ndata = {
          "status": 1,
          "value": "全部",
          "parentId": k[i].id,
          "key": ''
        }
        box.data.push(ndata)
        for (var e = 0, j = category; e < j.length; e++) {
          if (box.id == j[e].parentId) {
            //j[e].status = 0;
            box.data.push(j[e])
          }
        }
        category1.push(box);
      }
    }
    this.setState({
      sialArrayData:category1
    })
    console.log(this.state.sialArrayData) 
  }

  //筛选多选方法
  _filterBtn(s,o, w) {

    if (o.status) {
      return
    }
    var datas=this.state.sialArrayData
    for (var i = 0, k = datas; i < k.length; i++) {
      if (k[i].id == o.parentId) { //获取一级数组
        var keyis = k[i].id; //获取url索引
        for (var j = 0, q = k[i].data; j < q.length; j++) { //混还二级数组
          q[j].status = 0; //二级数组状态初始化
          if (j == w) { //点击索引等于二级数组索引
            q[j].status = 1;
            if(k[i].key == '1_1_0'||k[i].key == '2_7_0'||k[i].key=='3_11_0'){
              this.setState({
                type:q[j].key
              })
            }
            if(k[i].key == '4_1_011'){
              this.setState({
                sort:q[j].key
              })
            }

            if(k[i].key == '7_102_0'){
              this.setState({
                years:q[j].key
              })
            }

            if(k[i].key == '5_60_0'){
              this.setState({
                country:q[j].key
              })
            }

          }
        }
      }
    }
    var newState={
      sialArrayData:datas,
    }
    this.setState(newState)
  }


  //获取数据
  _fetchData(page){
    if(page==-1){
      cachedResults.nextPage=1
      page=1
      cachedResults.items=[]//清空
      cachedResults.total=0//清空
      this.setState({
        dataSource:this.state.dataSource.cloneWithRows(cachedResults.items)
      })  
    }
    var _id=this.props._id||''
    var api=this.props.api
    this.setState({
      isLoadingTail:true
    })
    var body={
      pageSize:cachedResults.pageSize,
      pageNum:page
    }
    //borderlands
    if(this.state.type){
      body.type=this.state.type
    }
    if(this.state.sort){
      body.sort=this.state.sort
    }
    if(this.state.years){
      body.years=this.state.years
    }
    if(this.state.country){
      body.country=this.state.country
    }


    if(_id){
      body.userId=_id
    }
    request.get(config.api.base+config.api[api],body)
    .then((data) => {
      //console.log(data)
      if(data.code==0){
        var items=cachedResults.items.slice()
        console.log(data)
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
  },

  /*模态窗s */
  modalContainer:{
    flex:1,
    //paddingTop:45,
    backgroundColor:'#212121',
    //borderBottomColor:'#fff',
  },

  header:{
    flexDirection:'row',
    justifyContent:'center',
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
    position:'absolute',
    left:12,
    top:28,
    width:50,
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center',
  },
  popBoxr:{
    position:'absolute',
    right:12,
    top:28,
    width:50,
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center',
  },
  closeIcon:{
    color:'#848484',
    fontSize:28,
    marginRight:5,
  },
  backText:{
    color:'#848484',

  },
  headerTitle:{
    width:width-120,
    textAlign:'center',
    color:'#848484',
    fontSize:16
  },

  /*内容区域s */
  commentBox:{
    padding:10,
  },
  comment_text:{
    fontSize:14,
    color:'#545454',
  },
  slpe_wrap:{

  },
  saixuan_wrap:{
  },
  saixuan_list:{
    marginTop:12,
    flexDirection:'row',
    flexWrap: 'wrap',

  },
  saixuan_item:{
    //paddingBottom:3,
    //paddingTop:3,
    paddingLeft:9,
    paddingRight:9,
    height:25,
    lineHeight:25,
    marginRight:8,
    marginBottom:14,
    textAlign:'center',
    borderWidth:1,
    borderColor:'#383838',
    color:'#c8c6c9'
  },
  saixuan_item_active:{
    borderColor:'#e34849',
    color:'#e34849'
  },
  /*内容区域e */

  /*模态窗e */

  /*赛选 s */
  tagBox:{
    backgroundColor:'#212121',
    flexDirection:'row',
    justifyContent:'space-between',
    borderBottomWidth:1,
    borderColor:'#383838',
  },
  videoNum:{
    color:'#636363',
    padding:10,
  },
  chooseIcon:{
    color:'#636363',
    padding:10,
  },
  /*赛选 e */

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
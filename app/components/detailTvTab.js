/*
* @Author: huanghanzhilian
* @Date:   2018-04-13 12:41:53
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-24 14:39:18
*/
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  AlertIOS
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast, {DURATION} from 'react-native-easy-toast'

var request=require('../common/request')
var config=require('../common/config');
import {timeCycle,formatDuring,imageUrl} from '../common/util'
var width=Dimensions.get('window').width//获取屏幕宽度
var height=Dimensions.get('window').height


const FacebookTabBar = React.createClass({

  getInitialState: function() {
    var upInfo=this.props.upInfo||null
    return {
    	up:upInfo.isSubscription,
    	upInfo:upInfo,
      nums:upInfo.subscriptionAmount
    }
  },
  tabIcons: [],

  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
  },

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
  },

  setAnimationValue({ value, }) {
    this.tabIcons.forEach((icon, i) => {
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
      
    });
  },

  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 255 + (255 - 255) * progress;
    const green = 255 + (255 - 255) * progress;
    const blue = 255 + (255 - 255) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  },

  render() {
  	var upInfo=this.state.upInfo
    //console.log(this.props.style)
    return (
    	<View style={[styles.content]}>
    		<View style={[styles.tabs]}>
		      {this.props.tabs.map((tab, i) => {
		        return <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
		          <Text style={[styles.icontxte,this.props.activeTab !== i?null:styles.icontxtea]}>{tab}</Text>
		        </TouchableOpacity>;
		      })}
	    	</View>
	    	{
	    		upInfo
	    		?<View style={styles.upinfoBox}>
	    			<View style={styles.image_wrap}>
	    				<Image 
		            source={{uri : imageUrl(upInfo.banner)}} 
		            resizeMode="stretch" 
		            style={styles.thumb}
		          />
	    			</View>

		    			

	    			<View style={styles.info_wrap}>
	    				<View style={styles.info_img_wrap}>
		    				<Image 
			            source={{uri : imageUrl(upInfo.head)}} 
			            resizeMode="stretch" 
			            style={styles.info_img}
			          />
		    			</View>
	    				<View style={styles.info_row_wrap}>
	    					<Text style={styles.infoname}>{upInfo.name}</Text>
	    					<Text style={styles.subscribe} onPress={this._up}>
	    						{this.state.up?'已订阅':'订阅'} {this.state.nums}
	    					</Text>
	    				</View>
	    			</View>

		      </View>
	    		:null
	    	}
        <Toast 
          ref="toast"
          position='center'
        />
    	</View>
    )
  },


  //点赞方法
  _up(){
  	//拿到当前row数据
    var upInfo=this.state.upInfo
    //拿到当前点赞状态 的取反
    var up=!this.state.up
    var num
    if(!up){
      num=this.state.nums-1
    }else{
      num=this.state.nums+1
    }
    
    
    //构建请求的url
    var url =config.api.base+config.api.setSwitch

    //构建post form表单的数据
    var body={
      channelUserId:upInfo.id
    }

    request.post(url,body)
      .then((data)=>{
        if(data.code==0){
          this.setState({
            up:up,
            nums:num
          })
          console.log(this)
          //this.refs.toast.show('订阅成功')
          //AlertIOS.alert('订阅成功')
        }
        else{
          AlertIOS.alert('订阅失败，稍后重试')
        }
      })
      //错误捕获
      .catch(function(err){
        console.log(err)
        AlertIOS.alert('订阅失败，稍后重试')
      })

  },



});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    //paddingBottom: 10,
    backgroundColor:'#252525',
  },
  tabs: {
    height: 48,
    flexDirection: 'row',
    //paddingTop: 5,
    //borderWidth: 1,
    //borderTopWidth: 1,
    //backgroundColor:'#dd5057',
    backgroundColor:'#252525',
    //borderTopColor: '#383838',
  },
  icontxte:{
  	fontSize:14,
    color:'#636363'
  },
  icontxtea:{
    color:'#eee'
  },




  upinfoBox:{
  	backgroundColor:'#252525'
  },
	image_wrap:{

	},
	thumb:{
		width:width,
		height:width*0.24
	},



	info_wrap:{
		flexDirection:'row',
	},
	info_img_wrap:{
		width:86,
		height:42,
		paddingLeft:8,
	},
	info_img:{
		width:68,
		height:68,
		borderRadius:34,
		borderColor:'#212121',
		borderWidth:2,
		position:'absolute',
		top:-34,
		left:8,
	},
	info_row_wrap:{
		flex:1,
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems: 'center',
		paddingRight:8,
	},
	infoname:{
		fontSize:14,
		color:'#c8c6c9'
	},
	subscribe:{
		fontSize:14,
		color:'#6f6f6f'
	},



});

export default FacebookTabBar;
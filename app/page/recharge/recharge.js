/*
* @Author: huanghanzhilian
* @Date:   2018-04-23 09:37:33
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-24 14:05:33
*/

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  InteractionManager,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Feather';

var {height, width} = Dimensions.get('window');
//组件或者工具模块 就是本地项目模块
var request=require('../../common/request')
var config=require('../../common/config');
import Head from '../../components/header/head'


export default class Recharge extends Component {
  constructor(props){
    super(props)
    this.state={
      renderPlaceholderOnly:true,
      productDataList: [], //支付列表
      tagStatus: '',
      current: 0,
      cgoiceStatus:'weixin',//选择状态
    }
  }
  //安装过  3
  componentDidMount(){
    InteractionManager.runAfterInteractions(()=>{  
      this.setState({renderPlaceholderOnly: false});
      this._fetchData()
    });
    
  }

  //获取数据
  _fetchData(){
    request.get(config.api.base+config.api.getProductList)
    .then((data) => {
      if(data.code==0){
      	this.setState({
      		productDataList:data.data,
					tagStatus:data.data[0].productId,
					current:data.data[0].productPrice
      	})
      	
      	console.log(data)
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }
  //选择支付方式
  _cgoiceske(dataw){
    if(dataw==this.state.cgoiceStatus){
      return;
    }
    this.setState({
    	cgoiceStatus:dataw
    })
  }
  //切换价格tab
  _sortList(obj) {
    if (obj.productId == this.tagStatus) {
      return
    }
    this.setState({
			tagStatus:obj.productId,
			current:obj.productPrice
  	})
    
  }
  _renderPlaceholderView() {
    return (
      <View style={styles.container}>
        <View style={styles.loadingF}>
          <Text style={styles.loadingFMore}>Loading...</Text>
        </View>
      </View>
    )
  }
  render() {
  	var userInfo=this.props.userInfo||null
    if (this.state.renderPlaceholderOnly) {
      return this._renderPlaceholderView();
    }
    return (
      <View style={styles.container}>
        <Head title='购买vip会员' navigator={this.props.navigator} />
        <ScrollView contentContainerStyle={styles.contentContainer}>
	        <View style={styles.recharge_container}>
	        	{
	        		userInfo
	        		?<View style={styles.userinfo}>
			        	<View style={styles.userinfoItemBox}>
				        	<Text style={styles.username}>{userInfo.name}</Text>
				        	<Text style={styles.describe}>（会员）</Text>
				        </View>	
				        <View style={styles.userinfoItemBox}>
				        	<Text style={styles.describe}>开通会员尊享超清影视</Text>
				        </View>	
			        </View>
	        		:null
	        	}
	        	

		        <View style={[styles.userinfo,styles.price_option]}>
		        	<View style={styles.option_title}>
			        	<Text style={styles.username}>VIP会员</Text>
			        	<Text style={styles.describe}>适用于手机/PC端</Text>
			        </View>
			        

	            <View style={styles.product_list}>
	            	{this.state.productDataList.map((tab, i) => {
	                return <TouchableOpacity key={tab.productId} onPress={()=>this._sortList(tab)} style={[styles.item,this.state.tagStatus==tab.productId?styles.active:null]}>
								        		<View style={styles.part_left}>
								        			<Text style={styles.title}>{tab.productName}</Text>
									        		<Text style={styles.promotion}>{tab.productMonth}个月会员</Text>
								        		</View>
								        		<Text style={styles.price_area}>￥{tab.productPrice}</Text>
									        </TouchableOpacity>
			        	})}	
		
			        </View>	

			        	
			        
		        </View>	

		        <View style={styles.userinfo}>
		        	<TouchableOpacity onPress={()=>this._cgoiceske('weixin')} style={styles.chooseBox}>
		        		<View style={styles.chooseItem}>
				        	<Text style={styles.chooseText}>微信支付</Text>
		        		</View>
		        		{
		        			this.state.cgoiceStatus=='weixin'
		        			?<Icon2
			              name='check-circle'
			              size={16}
			              style={styles.chooseIcon}
			            />
		        			:<Icon2
			              name='circle'
			              size={16}
			              style={styles.chooseIcon}
			            />
		        		}
			        </TouchableOpacity>	
			        <TouchableOpacity onPress={()=>this._cgoiceske('zhifubao')} style={styles.chooseBox}>
		        		<View style={styles.chooseItem}>
				        	<Text style={styles.chooseText}>支付宝支付</Text>
		        		</View>
			        	{
		        			this.state.cgoiceStatus=='zhifubao'
		        			?<Icon2
			              name='check-circle'
			              size={16}
			              style={styles.chooseIcon}
			            />
		        			:<Icon2
			              name='circle'
			              size={16}
			              style={styles.chooseIcon}
			            />
		        		}
			        </TouchableOpacity>	

		        </View>

		        

	        </View>
        </ScrollView>
        <View style={styles.orderBottom}>
	        	<Text style={styles.total}>总计 ￥{this.state.current}</Text>
	        	<TouchableOpacity style={styles.doPayBox}>
	        		<Text style={styles.doPay}>确认支付</Text>
	        	</TouchableOpacity>
	        	
	        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#212121',
  },

  recharge_container:{
  	paddingBottom:50
  },
  /*top*/
	userinfo:{
		paddingTop:10,
		paddingBottom:10,
		paddingLeft:12,
		paddingRight:12,
		backgroundColor:'#383838'
	},
	userinfoItemBox:{
		flexDirection:'row',
	},
	username:{
		color:'#eee',
		marginRight:5,
		marginBottom:10,
	},
	describe:{
		color:'rgb(99, 99, 99)',
	},
	/*top*/

	price_option:{
		marginTop:10,
	},

	product_list:{

	},
	item:{
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems: 'center',
		padding:10,
		marginTop:10,
		borderWidth:1,
		borderColor:'#212121'
	},
	active:{
		borderColor:'#e34849'
	},
	part_left:{

	},
	title:{
		marginBottom:10,
		color:'#c8c6c9'
	},
	promotion:{
		color:'#636363'
	},
	price_area:{
		color:'#c8c6c9'
	},

	/*选择支付s */
	chooseBox:{
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems: 'center',
		paddingBottom:10,
		paddingTop:10,
		borderBottomWidth:1,
		borderColor:'#c8c6c9'
	},
	chooseItem:{
		flexDirection:'row',
		alignItems: 'center',
	},
	opIcon:{
		marginRight:8,
		color:'#c8c6c9'
	},
	chooseText:{
		color:'#c8c6c9'
	},
	chooseIcon:{
		color:'#c8c6c9',
		marginRight:10
	},
	/*选择支付e */

	orderBottom:{
		position:'absolute',
		width:width,
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems: 'center',
		borderTopWidth:1,
		borderColor:'#393939',
		height:48,
		bottom:0,
		left:0,
		paddingLeft:10,
		backgroundColor:'#212121'
	},
	total:{
		color:'#c8c6c9'
	},
	doPayBox:{
		backgroundColor:'#e34849',
		width:150,
		height:48,
		justifyContent:'space-between',
		alignItems: 'center',
		justifyContent: 'center',
		// textAlign:'center',
		// lineHeight:48,
		//color:'#fff'
	},
	doPay:{
		// backgroundColor:'#e34849',
		// width:150,
		// height:48,
		// textAlign:'center',
		// lineHeight:48,
		color:'#fff'
	},


  /*父加载交互s*/
  loadingF:{
    flex:1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingFMore:{
    color:'#777',
    textAlign:'center'
    //marginVertical:20
  },
  
  /*父加载交互e*/
});
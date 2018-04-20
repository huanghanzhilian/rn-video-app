/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/Ionicons';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'

import {timeCycle,formatDuring,imageUrl,formatDateTime} from '../common/util'
import Islogin from "./islogin/islogin"
import Nav from './widgets/nav'


export default class Profile extends Component {
  constructor(props){
    super(props)

    this.state = {
      
    }
  }
  render() {
    var userInfo=this.props.userInfo||null
    if(this.props.userInfo){
      return (
        <View style={styles.container}>
          <Nav navigator={this.props.navigator} {...this.props} name="我的" dark={false} onSelect={()=>this._dialog()} />
          <View style={styles.user_wrap}>
            <View style={styles.user_info_wrap}>
              <View style={styles.user_info_item}>
                <View style={styles.item_l}>
                  <Text style={styles.text}>{userInfo.name}</Text>
                </View>
                <View style={styles.item_r}>
                  <Text style={styles.text} onPress={this._logout.bind(this)}>退出</Text>
                </View>
              </View>
              <View style={styles.user_info_item}>
                <View style={styles.item_l}>
                  <Text style={styles.text}>会员到期时间：{formatDateTime(userInfo.membershipInvalidTime)}</Text>
                </View>
                <View style={styles.item_r}>
                  <Text style={styles.text} onPress={this._logout.bind(this)}>续费</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.dopser_list_wrap}>
            <TouchableOpacity onPress={()=>this._goPage('notifications')} style={styles.dopser_item}>
              <View style={styles.dopser_item_l}>
                <Icon2
                  name='message'
                  style={styles.dopser_item_icon}
                  size={24}
                />
              </View>
              <View style={styles.dopser_item_r}>
                <View style={styles.dopser_item_r}>
                  <Text style={styles.text}>系统通知</Text>
                  <Icon2
                    name='chevron-right'
                    style={styles.dopser_item_r_icon}
                    size={24}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this._goPage('collect')} style={styles.dopser_item}>
              <View style={styles.dopser_item_l}>
                <Icon
                  name='thumbs-up'
                  style={styles.dopser_item_icon}
                  size={24}
                />
              </View>
              <View style={styles.dopser_item_r}>
                <View style={styles.dopser_item_r}>
                  <Text style={styles.text}>顶过得视频</Text>
                  <Icon2
                    name='chevron-right'
                    style={styles.dopser_item_r_icon}
                    size={24}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this._goPage('collectAlbum')} style={styles.dopser_item}>
              <View style={styles.dopser_item_l}>
                <Icon3
                  name='ios-albums-outline'
                  style={styles.dopser_item_icon}
                  size={24}
                />
              </View>
              <View style={styles.dopser_item_r}>
                <View style={styles.dopser_item_r}>
                  <Text style={styles.text}>收藏专辑</Text>
                  <Icon2
                    name='chevron-right'
                    style={styles.dopser_item_r_icon}
                    size={24}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this._goPage('testvideo')} style={styles.dopser_item}>
              <View style={styles.dopser_item_l}>
                <Icon3
                  name='ios-albums-outline'
                  style={styles.dopser_item_icon}
                  size={24}
                />
              </View>
              <View style={styles.dopser_item_r}>
                <View style={styles.dopser_item_r}>
                  <Text style={styles.text}>测试</Text>
                  <Icon2
                    name='chevron-right'
                    style={styles.dopser_item_r_icon}
                    size={24}
                  />
                </View>
              </View>
            </TouchableOpacity>
            {/*<TouchableOpacity onPress={()=>this._goPage('d')} style={styles.dopser_item}>
              <View style={styles.dopser_item_l}>
                <Icon2
                  name='fullscreen'
                  style={styles.dopser_item_icon}
                  size={24}
                />
              </View>
              <View style={styles.dopser_item_r}>
                <View style={styles.dopser_item_r}>
                  <Text style={styles.text}>查看余额</Text>
                  <Icon2
                    name='chevron-right'
                    style={styles.dopser_item_r_icon}
                    size={24}
                  />
                </View>
              </View>
            </TouchableOpacity>*/}
            <TouchableOpacity onPress={()=>this._goPage('history')} style={styles.dopser_item}>
              <View style={styles.dopser_item_l}>
                <Icon2
                  name='history'
                  style={styles.dopser_item_icon}
                  size={24}
                />
              </View>
              <View style={styles.dopser_item_r}>
                <View style={styles.dopser_item_r}>
                  <Text style={styles.text}>历史记录</Text>
                  <Icon2
                    name='chevron-right'
                    style={styles.dopser_item_r_icon}
                    size={24}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>



          <View style={styles.dopser_list_wrap}>
            
          </View>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Nav navigator={this.props.navigator} {...this.props} name="我的" dark={false} onSelect={()=>this._dialog()} />
        <Islogin navigator={this.props.navigator} />
      </View>
    );
  }
  _dialog(){
    this.props.onSelect()
  }
  //退出登录
  _logout(){
    RCTDeviceEventEmitter.emit('tuichu');
    //this.props.logout()
  }

  //去对应页面
  _goPage(name){
    if(!name){
      return
    }
    this.props.navigator.push({
      name:name,
      id:name
    })
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#212121',
    //justifyContent: 'center',
    //alignItems: 'center',
    //backgroundColor: '#000',
  },

  /*用户头部s */
  user_wrap:{
    paddingTop:20,
    paddingBottom:20,
    paddingLeft:10,
    paddingRight:10,
  },
  user_info_wrap:{

  },
  user_info_item:{
    marginBottom:10,
    flexDirection:'row',
    justifyContent:'space-between',
  },
  item_l:{

  },
  item_r:{

  },
  text:{
    color:'#c8c6c9',
  },
  /*用户头部e */

  /*item部分 s */
  dopser_list_wrap:{

  },
  dopser_item:{
    //backgroundColor:'red',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'center', 
    borderBottomColor:'#383838',
    borderBottomWidth:1,
    paddingTop:15,
    paddingBottom:15
  },
  dopser_item_l:{
    width:35,
    alignItems: 'center', 
  },
  dopser_item_icon:{
    color:'#c8c6c9',
  },
  dopser_item_r:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'center', 
    paddingRight:3,
  },
  dopser_item_r_icon:{
    color:'#c8c6c9',
  },
  /*item部分 e */






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


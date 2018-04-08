/*
* @Author: huanghanzhilian
* @Date:   2018-04-08 14:14:23
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-08 17:34:45
*/
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  Image
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import  Button from 'react-native-button'
import Icon from 'react-native-vector-icons/Ionicons';
var {height, width} = Dimensions.get('window');


import Head from '../../components/header/head';
var request=require('../../common/request')
var config=require('../../common/config');


export default class login extends Component {
  constructor(props){
    super(props)
    this.state={
      account:'',//用户账户
      password:'',//用户密码
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Head title='登录' navigator={this.props.navigator} />
        <View style={styles.signin_container}>  
          <Image source={require('../../images/ytb_logo.png')} resizeMode="contain" style={styles.img} />
          <TextInput 
            placeholder='手机|邮箱账号'
            placeholderTextColor='#7e7e7e'
            autoCaptialize={'none'}//不去纠正大小写
            autoCorrect={false}//不去纠正内容对与错
            keyboradType={'number-pad'}//键盘配置
            style={styles.inputField}
            onChangeText={(text)=>{
              this.setState({
                account:text
              })
            }}
          />

          <TextInput 
            placeholder='密码'
            placeholderTextColor='#7e7e7e'
            secureTextEntry={true}
            autoCaptialize={'none'}//不去纠正大小写
            autoCorrect={false}//不去纠正内容对与错
            keyboradType={'number-pad'}//键盘配置
            style={styles.inputField}
            onChangeText={(text)=>{
              this.setState({
                password:text
              })
            }}
          />
          <Button
              style={styles.btn}
              onPress={this._submit.bind(this)}
            >登录</Button>
          <Text onPress={this._loadRegister.bind(this)} style={styles.register}>注册</Text>
        </View>
        <Toast 
          ref="toast"
          position='center'
        />
      </View>
    );
  }
  //去注册页
  _loadRegister(){
    this.props.navigator.push({
      name:'register',
      id:'register'
    })
  }
  //登录
  _submit(){
    var account=this.state.account
    var password=this.state.password
    if(!account||!password){
      this.refs.toast.show('账户或密码不能为空！')
      return
    }
    request.post(config.api.base+config.api.gologin,{
      account:account,
      password:password
    })
    .then((data)=>{
      console.log(data)
      if(data&&data.code==0){
        this.refs.toast.show('登录成功')
      }else{
        this.refs.toast.show(data.msg)
      }
    })
    .catch((err)=>{
      this.refs.toast.show('获取验证码失败，请检查网络是否良好')
    })
    //this.refs.toast.show('hello world!')
  }
  



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#212121',
    //alignItems: 'center',
  },

  signin_container:{
    marginTop:30,
    paddingLeft:35,
    paddingRight:35,
    //justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor:'red'
  },
  img:{
    width:92,
    marginBottom:65
  },
  inputField:{
    //flex:1,
    width:width-70,
    height:40,
    padding:10,
    color:'#7e7e7e',
    fontSize:16,
    backgroundColor:'#383838',
    marginBottom:5
    //borderRadius:4
  },
  btn:{
    padding:10,
    marginTop:10,
    backgroundColor:'transparent',
    borderColor:'#383838',
    width:width-70,
    borderWidth:1,
    //borderRadius:4,
    color:'#525252'
  },

  register:{
    color:'#e34849',
    marginTop:150
  },






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
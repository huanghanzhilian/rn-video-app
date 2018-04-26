/*
* @Author: huanghanzhilian
* @Date:   2018-04-08 14:14:23
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-26 09:58:41
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
var CountDownText= require('../../common/CountDownText')
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'

import Head from '../../components/header/head';
var request=require('../../common/request')
var config=require('../../common/config');


export default class login extends Component {
  constructor(props){
    super(props)
    this.state={
      account:'',//用户账户
      password:'',//用户密码

      verifycode:'',//验证码
      password1:'',//新密码
      password2:'',//确认密码

      userStatus: false, //用户信息状态 true为用户存在  false为不存在
      passwordError:false,//密码是否错误
      isFindpasStatus:false,//是否在修改密码状态下
      isCountdown:false,//倒计时是否在执行
    }
  }
  handleUpdateChange(text) {
        RCTDeviceEventEmitter.emit('change', text);
  }
  tongzhitoast(text){
    RCTDeviceEventEmitter.emit('tongzhitoast', text);
  }
  render() {
    return (
      <View style={styles.container}>
        <Head title='登录' navigator={this.props.navigator} />
        <View style={styles.signin_container}>  
          <Image source={require('../../images/ytb_logo.png')} resizeMode="contain" style={styles.img} />
          <TextInput 
            placeholder='手机|邮箱账号'
            underlineColorAndroid="transparent"
            placeholderTextColor='#7e7e7e'
            autoCaptialize={'none'}//不去纠正大小写
            autoCorrect={false}//不去纠正内容对与错
            keyboradType={'number-pad'}//键盘配置
            style={styles.inputField}
            onFocus={this._accountFocus.bind(this)}//聚焦
            onBlur={this._accountBlur.bind(this)}//失去焦点
            onChangeText={(text)=>{
              this.handleUpdateChange(text)
              var content={}
              content.account=text
              if(text.length<4){
                content.userStatus=false
              }
              this.setState(content)
            }}
          />

          {
            !this.state.isFindpasStatus
            ?<TextInput 
              underlineColorAndroid="transparent"
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
            :<View style={styles.inputErrerBox}>
              <View style={styles.inputWrap}>
                <TextInput 
                  placeholder='验证码'
                  underlineColorAndroid="transparent"
                  placeholderTextColor='#7e7e7e'
                  autoCaptialize={'none'}//不去纠正大小写
                  autoCorrect={false}//不去纠正内容对与错
                  keyboradType={'number-pad'}//键盘配置
                  style={styles.inputField}
                  onChangeText={(text)=>{
                    this.setState({
                      verifycode:text
                    })
                    
                  }}
                />
                {
                  this.state.isCountdown
                  ?<CountDownText
                  style={styles.countBtn}
                  countType='seconds' // 计时类型：seconds / date
                  auto={true} // 自动开始
                  afterEnd={this._countingDone.bind(this)} // 结束回调
                  timeLeft={6} // 正向计时 时间起点为0秒
                  step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                  startText='获取验证码' // 开始的文本
                  //endText='获取验证码' // 结束的文本
                  intervalText={(sec) => sec + 's'} // 定时的文本回调
                />
                  :null
                }
                
              </View>
              <View style={styles.inputWrap}>
                <TextInput 
                  placeholder='填写新密码'
                  underlineColorAndroid="transparent"
                  placeholderTextColor='#7e7e7e'
                  secureTextEntry={true}
                  autoCaptialize={'none'}//不去纠正大小写
                  autoCorrect={false}//不去纠正内容对与错
                  keyboradType={'number-pad'}//键盘配置
                  style={styles.inputField}
                  onChangeText={(text)=>{
                    
                    this.setState({
                      password1:text
                    })
                  }}
                />
              </View>
              <View style={styles.inputWrap}>
                <TextInput 
                  placeholder='确认新密码'
                  underlineColorAndroid="transparent"
                  placeholderTextColor='#7e7e7e'
                  secureTextEntry={true}
                  autoCaptialize={'none'}//不去纠正大小写
                  autoCorrect={false}//不去纠正内容对与错
                  keyboradType={'number-pad'}//键盘配置
                  style={styles.inputField}
                  onChangeText={(text)=>{
                    this.setState({
                      password2:text
                    })
                    
                  }}
                />
              </View>
            </View>
          }

            

              


          {
            !this.state.isFindpasStatus
            ?<Button
                style={[styles.btn,this.state.userStatus?styles.btn2:null]}
                onPress={this._submit.bind(this)}
              >登录</Button>
            :<Button
                style={[styles.btn,this.state.userStatus?styles.btn2:null]}
                onPress={this._resetPas.bind(this)}
              >重置密码</Button>
          }
            
          {
            this.state.passwordError&&!this.state.isFindpasStatus
            ?<View style={styles.psmerrorBox}>
              <Text style={styles.psmerrorlog}>密码有误</Text>
              <Text onPress={this._modifyPas.bind(this)} style={styles.psmerrorcal}>忘记密码？密码找回</Text>
            </View> 
            :null
          }
          {
            this.state.passwordError&&this.state.isFindpasStatus
            ?<View style={styles.psmerrorBox}>
              <Text style={styles.psmerrorlog}>验证码已发送</Text>
              <Text onPress={this._modifyPas.bind(this)} style={styles.psmerrorcal}>再次发送？</Text>
            </View>
            :null
          }
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
  //倒计时结束逻辑
  _countingDone(){
    this.setState({
      isCountdown:false
    })
  }
  //找回密码
  _modifyPas(){
    var userStatus=this.state.userStatus
    var account=this.state.account
    var password=this.state.password
    if (!account||this.state.isCountdown) {
      return;
    }
    request.post(config.api.base+config.api.getVerifycode,{
      account:account,
      type:2
    })
    .then((data)=>{
      if(data.code==0){
        this.setState({
          isFindpasStatus:true,
          isCountdown:true
        })
        this.refs.toast.show('发送验证码成功')
      }else{
        // this.setState({
        //   userStatus:false
        // })
        this.refs.toast.show(data.msg)
      }
    })
    .catch((err)=>{
      this.refs.toast.show('判断用户是否存在失败，请检查网络是否良好')
    })

  }
  //重置密码
  _resetPas(){
    var userStatus=this.state.userStatus
    var account=this.state.account
    var verifycodecc=this.state.verifycode
    var password1=this.state.password1
    var password2=this.state.password2
    if(!userStatus){
      return
    }
    if(!account){
      this.refs.toast.show('账户不能为空！')
      return
    }
    if(!verifycodecc){
      this.refs.toast.show('验证码不能为空！')
      return
    }
    if(password1!==password2){
      this.refs.toast.show('两次密码不匹配！')
      return
    }
    request.post(config.api.base+config.api.setPassword,{
      account:account,
      newPassword:password1,
      verifyCode:verifycodecc
    })
    .then((data)=>{
      if(data.code==0){
        // this.setState({
        //   isFindpasStatus:true,
        //   isCountdown:true
        // })
        this.refs.toast.show('修改密码成功')
      }else{
        // this.setState({
        //   userStatus:false
        // })
        this.refs.toast.show(data.msg)
      }
    })
    .catch((err)=>{
      this.refs.toast.show('判断用户是否存在失败，请检查网络是否良好')
    })
  }
  //用户输入框聚焦
  _accountFocus(){

  }
  //用户输入框失去焦点
  _accountBlur(){
    var account=this.state.account
    if (!account) {
      this.setState({
        userStatus:false
      })
      return;
    }
    request.post(config.api.base+config.api.isexistser,{
      account:account
    })
    .then((data)=>{
      console.log(data)
      if(data&&data.code==0&&data.data.isExists){
        this.setState({
          userStatus:true
        })
        this.refs.toast.show('用户存在')
      }else{
        this.setState({
          userStatus:false
        })
        this.refs.toast.show(data.msg)
      }
    })
    .catch((err)=>{
      this.setState({
        userStatus:false
      })
      this.refs.toast.show('判断用户是否存在失败，请检查网络是否良好')
    })
  }
  //登录
  _submit(){
    var userStatus=this.state.userStatus
    var account=this.state.account
    var password=this.state.password
    if(!userStatus){
      return
    }
    if(!account||!password){
      this.refs.toast.show('账户或密码不能为空！')
      return
    }
    request.post(config.api.base+config.api.gologin,{
      account:account,
      password:password
    })
    .then((data)=>{
      if(data&&data.code==0){
        this.props.afterLondin(data.data)
        this.tongzhitoast('登录成功')
        //this.refs.toast.show('登录成功')
        this.props.navigator.pop()
      }else{
        this.refs.toast.show(data.msg)
        this.setState({
          passwordError:true
        })
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
  btn2:{
    borderColor:'#e34849',
    color:'#e34849'
  },

  register:{
    color:'#e34849',
    marginTop:150
  },

  psmerrorBox:{
    marginTop:20,
  },
  psmerrorlog:{
    textAlign:'center',
    color:'#525252',
  },
  psmerrorcal:{
    textAlign:'center',
    marginTop:20,
    color:'#e34849',
  },

  countBtn:{
    //width:130,
    height:40,
    padding:10,
    marginLeft:8,
    backgroundColor:'#383838',
    color:'#c8c6c9',
    //borderColor:'#ee735c',
    textAlign:'center',
    fontWeight:'600',
    fontSize:15, 
    //borderRadius:2
    position:'absolute',
    right:0,
    top:0,
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
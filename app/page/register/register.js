/*
* @Author: huanghanzhilian
* @Date:   2018-04-08 14:14:23
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-24 16:46:29
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
import  Button from 'react-native-button'
import Icon from 'react-native-vector-icons/Ionicons';
var {height, width} = Dimensions.get('window');


import Head from '../../components/header/head';

export default class register extends Component {
  constructor(props){
    super(props)
    this.state={
      countingDone:true
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Head title='注册' navigator={this.props.navigator} />
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
            onChangeText={(text)=>{
              this.setState({
                phoneNumber:text
              })
            }}
          />

          <View style={styles.verifyCodeBox}>
            <TextInput 
              placeholder='输入验证码'
              underlineColorAndroid="transparent"
              placeholderTextColor='#7e7e7e'
              autoCaptialize={'none'}//不去纠正大小写
              autoCorrect={false}//不去纠正内容对与错
              keyboardType={'number-pad'}//键盘配置
              style={styles.inputField2}
              onChangeText={(text)=>{
                this.setState({
                  verifyCode:text
                })
              }}
            />
            
            {
              this.state.countingDone
              ?<Button
                  style={styles.countBtn}
                  onPress={this._sendVerifyCode}>获取验证码</Button>
              :<CountDownText
                style={styles.countBtn}
                countType='seconds' // 计时类型：seconds / date
                auto={true} // 自动开始
                afterEnd={this._countingDone} // 结束回调
                timeLeft={60} // 正向计时 时间起点为0秒
                step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                startText='获取验证码' // 开始的文本
                endText='获取验证码' // 结束的文本
                intervalText={(sec) => sec + '秒重新获取'} // 定时的文本回调
              />
            }
          </View>

          <TextInput 
            placeholder='密码'
            underlineColorAndroid="transparent"
            placeholderTextColor='#7e7e7e'
            secureTextEntry={true}
            autoCaptialize={'none'}//不去纠正大小写
            autoCorrect={false}//不去纠正内容对与错
            keyboradType={'number-pad'}//键盘配置
            style={styles.inputField}
            onChangeText={(text)=>{
              this.setState({
                phoneNumber:text
              })
            }}
          />
          <Button
              style={styles.btn}
              onPress={this._submit}
            >注册</Button>
          <Text onPress={this._loadLodin.bind(this)} style={styles.register}>登录</Text>
        </View>
        
      </View>
    );
  }

  //去登录页
  _loadLodin(){
    this.props.navigator.pop()
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
  inputField2:{
    flex:1,
    //width:99,
    height:40,
    padding:10,
    color:'#7e7e7e',
    fontSize:16,
    backgroundColor:'#383838',
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


  verifyCodeBox:{
    //width:100,
    marginBottom:5,
    flexDirection:'row',
    justifyContent:'space-between',
    //alignItems: 'center',
  },
  
  countBtn:{
    width:130,
    height:40,
    padding:10,
    marginLeft:2,
    backgroundColor:'#383838',
    color:'#848484',
    //borderColor:'#ee735c',
    textAlign:'center',
    fontWeight:'600',
    fontSize:15, 
    //borderRadius:2
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
/*
* @Author: huanghanzhilian
* @Date:   2018-04-20 10:52:17
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-26 13:23:43
*/
'use strict';  
import React, { Component } from 'react';  
import {  
  StyleSheet,  
  View,  
  Image,  
  Text,  
  TouchableHighlight,  
  Animated,  
  Easing,  
  Dimensions,  
} from 'react-native';  
import Icon from 'react-native-vector-icons/MaterialIcons';
  
//import TimerMixin from 'react-timer-mixin';  
  
const {width, height} = Dimensions.get('window');  
const navigatorH = 64; // navigator height  
const [aWidth, aHeight] = [width*0.8, height];  
const [left, top] = [0, 0];  
const [middleLeft, middleTop] = [0, (height - aHeight) / 2 - navigatorH];  
  
const styles = StyleSheet.create({  
  container: {  
    position:"absolute",  
    width:width,  
    height:height,  
    left:left,  
    top:top,  
  },  
  mask: {  
    justifyContent:"center",  
    backgroundColor:"#000",  
    opacity:0.2,  
    position:"absolute",  
    width:width,  
    height:height,  
    left:left,  
    top:top,  
  },  
  tip: {  
    width:aWidth,  
    height:aHeight,  
    left:middleLeft,  
    backgroundColor:'#212121',
    //alignItems:"center",  
    //justifyContent:"space-between",  
  },  
  tipTitleView: {  
  	paddingTop:10,
    height:55,  
    flexDirection:'row',  
    alignItems:'center',  
    justifyContent:'center',  
  },  
  tipTitleText:{  
    color:"#e34849",  
    fontSize:16,  
  },  
  tipContentView: {  
    width:aWidth,  
    //borderTopWidth:0.5,  
    //borderColor:"#f0f0f0",  
    height:45,  
    flexDirection:'row',  
    alignItems:'center',  
    justifyContent:'center',  
  },  
  tipContentViewItem:{
  	height:45,  
    flexDirection:'row',  
    alignItems:'center',  
    justifyContent:'center',
  },
  Icon:{
  	color:'#c8c6c9',
  	marginRight:6,
  },
  tipText:{  
    color:"#c8c6c9",  
    fontSize:17,  
    textAlign:"center",  
  },  
  button: {  
    height: 45,  
    backgroundColor: '#fff',  
    //borderColor: '#e6454a',  
    //borderWidth: 1,  
    //borderRadius: 4,  
    alignSelf: 'stretch',  
    justifyContent: 'center',  
    //marginLeft: 10,  
    //marginRight: 10,  
  },  
  buttonText: {  
    fontSize:15,  
    color:"#e6454a",  
    textAlign:"center",  
  },  
  gap:{  
    height:10,  
    width:aWidth,  
    backgroundColor:'#383838',  
    opacity:0.8,  
  },  
});  
  
//console.log('======');  
  
export default class Alert extends Component {  
  //mixins = [TimerMixin];  
  parent ={};  
  
  constructor(props) {  
    super(props);  
    this.state = {  
      offset: new Animated.Value(0),  
      opacity: new Animated.Value(0),  
      title: "",  
      choose1: "",  
      choose2: "",  
      hide: true,  
    };  
  }  
  
  render() {  
    if(this.state.hide){  
      return (<View />)  
    } else {  
      return (  
        <View style={styles.container} >  
          <Animated.View style={ styles.mask } > 
          	<TouchableHighlight style={ styles.mask } onPress={this.iknow.bind(this)}>  
              <Text style={styles.tipText} ></Text>  
            </TouchableHighlight> 
          </Animated.View>  
  
          <Animated.View style={[styles.tip , {transform: [{  
                translateX: this.state.offset.interpolate({  
                 inputRange: [0, 1],  
                 outputRange: [-aWidth, 0]  
                }),  
              }]  
            }]}>  
            <View style={styles.tipTitleView}>  
              <Text style={styles.tipTitleText}>{this.state.title}</Text>  
            </View>  
            <TouchableHighlight style={styles.tipContentView} underlayColor='#f0f0f0' onPress={this.choose.bind(this,'borderlands')}>  
              <View style={styles.tipContentViewItem}> 
              	<Icon
			            name='home'
			            size={22}
			            style={styles.Icon}
			          />
	              <Text style={styles.tipText} >BORDERLANDS</Text>  
              </View>    
            </TouchableHighlight> 
            <TouchableHighlight style={styles.tipContentView} underlayColor='#f0f0f0' onPress={this.choose.bind(this,'information')}>  
              <View style={styles.tipContentViewItem}> 
              	<Icon
			            name='home'
			            size={22}
			            style={styles.Icon}
			          />
	              <Text style={styles.tipText} >资讯</Text>  
              </View>    
            </TouchableHighlight> 
            <TouchableHighlight style={styles.tipContentView} underlayColor='#f0f0f0' onPress={this.choose.bind(this,'movie')}>  
              <View style={styles.tipContentViewItem}> 
              	<Icon
			            name='home'
			            size={22}
			            style={styles.Icon}
			          />
	              <Text style={styles.tipText} >电影</Text>  
              </View>    
            </TouchableHighlight> 
            <TouchableHighlight style={styles.tipContentView} underlayColor='#f0f0f0' onPress={this.choose.bind(this,'drama')}>  
              <View style={styles.tipContentViewItem}> 
              	<Icon
			            name='home'
			            size={22}
			            style={styles.Icon}
			          />
	              <Text style={styles.tipText} >剧集</Text>  
              </View>    
            </TouchableHighlight>  
  
           
            
          </Animated.View>  
        </View>  
      );  
    }  
  }  
  
  componentDidMount() {  
  }  

  choose(ssring){
  	this.props.navigator.push({
      name:ssring,
      id:ssring
    })
  }
  
  //显示动画  
  in() {  
    Animated.parallel([  
      Animated.timing(  
        this.state.opacity,  
        {  
          easing: Easing.ease,
          duration: 300,  
          toValue: 0.8,  
        }  
      ),  
      Animated.timing(  
        this.state.offset,  
        {  
          easing: Easing.ease,
          duration: 300,  
          toValue: 1,  
        }  
      )  
    ]).start();  
  }  
  
  //隐藏动画  
  out(){  
    Animated.parallel([  
      Animated.timing(  
        this.state.opacity,  
        {  
          easing: Easing.ease,
          duration: 300,   
          toValue: 0,  
        }  
      ),  
      Animated.timing(  
        this.state.offset,  
        {  
          easing: Easing.ease,
          duration: 300,   
          toValue: 0,  
        }  
      )  
    ]).start();  
  
    setTimeout(  
      () => this.setState({hide: true}),  
      500  
    );  
  }  
  
  //取消  
  iknow(event) {  
    if(!this.state.hide){  
      this.out();  
    }  
  }  
  
  //选择  
  // choose(msg) {  
  //   //console.log(msg);  
  //   if(!this.state.hide){  
  //     this.out();  
  //     this.parent.setState({sex:msg});  
  //   }  
  // }  
  
  show(title: string, choose1:string,choose2:string ,obj:Object) {  
    this.parent = obj;  
    if(this.state.hide){  
      this.setState({title: title, choose1: choose1, choose2: choose2, hide: false}, this.in);  
    }  
  }  
}  
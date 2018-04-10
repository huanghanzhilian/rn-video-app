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
  StatusBar
} from 'react-native';
var ScrollableTabView = require('react-native-scrollable-tab-view');//轮播组件

//组件或者工具模块 就是本地项目模块
var request=require('../common/request')
var config=require('../common/config');
import Home from "./home"
import Subscribe from "./subscribe"

import Profile from "./profile"
import Subs from "./subs"
import Trending from "./trending"
import FacebookTabBar from './facebook';
import Nav from './widgets/nav';
import Play from './play'

var subs = [
{
  name: "Gary Vaynerchuck",
  newSuff:true,
  image:'https://yt3.ggpht.com/-gYIpT9q6l2U/AAAAAAAAAAI/AAAAAAAAAAA/N7y-mZkllOc/s88-c-k-no-mo-rj-c0xffffff/photo.jpg'
},{
  name: "Kid Cudi",
  newSuff:true,
  image:'https://yt3.ggpht.com/-5dmZgoooFTQ/AAAAAAAAAAI/AAAAAAAAAAA/oSlKM7nhrKs/s88-c-k-no-mo-rj-c0xffffff/photo.jpg'
},{
  name: "Casey Neistat",
  newSuff:false,
  image:'https://yt3.ggpht.com/-x2NNN2y49G0/AAAAAAAAAAI/AAAAAAAAAAA/RhwVaxMvqW8/s88-c-k-no-mo-rj-c0xffffff/photo.jpg'
},{
  name: "Philip Defranco",
  newSuff:true,
  image:'https://yt3.ggpht.com/-nPmtKfa70lE/AAAAAAAAAAI/AAAAAAAAAAA/E66oeUI2kFw/s88-c-k-no-mo-rj-c0xffffff/photo.jpg'
},
{
  name: "David Dobrik",
newSuff:false,
  image:'https://yt3.ggpht.com/-dSY90LCzs9Q/AAAAAAAAAAI/AAAAAAAAAAA/kXfMKC_0TIY/s88-c-k-no-mo-rj-c0xffffff/photo.jpg'
}
]


var videos = [
{
  name: "Kid Cudi - Just What I Am ft King Chip",
  image: "i.ytimg.com/vi/hGbP_kTM4CA/maxresdefault.jpg",
  youtuber: "KidCudiVEVO",
  avatar: "https://yt3.ggpht.com/-5dmZgoooFTQ/AAAAAAAAAAI/AAAAAAAAAAA/oSlKM7nhrKs/s88-c-k-no-mo-rj-c0xffffff/photo.jpg",
  views: "33M",
  time:'3 years ago'
},
{
  name: "Gabrielle Bernstein on How to Fear Into Faith with Lewis Howes",
  image: "i.ytimg.com/vi/l_XADHUIzsM/maxresdefault.jpg",
  avatar: "https://yt3.ggpht.com/-DPFWwMVfXWU/AAAAAAAAAAI/AAAAAAAAAAA/jcHsPDV4oNQ/s88-c-k-no-mo-rj-c0xffffff/photo.jpg",
  youtuber: "Lewis Howes",
  views: "16k",
  time:'6 days ago'
},
{
  name: "*FREE* Childish Gambino - [ Pink Toes sample ] Type Beat 2016",
  image: "i.ytimg.com/vi/0Wa2krPqB7E/hqdefault.jpg",
  youtuber: "Nor'Ledges",
  avatar: "https://yt3.ggpht.com/-COeslpjHnLA/AAAAAAAAAAI/AAAAAAAAAAA/dKBBhyjxnI0/s68-c-k-no-mo-rj-c0xffffff/photo.jpg",
  views: "43k",
  time:'4 months ago'
},
{
  name: "*FREE* Childish Gambino x Chance The Rapper x Logic(Type Beat) 2016",
  image: "i.ytimg.com/vi/55reONWI1Is/maxresdefault.jpg",
  youtuber: "Nor'Ledges",
  avatar: "https://yt3.ggpht.com/-COeslpjHnLA/AAAAAAAAAAI/AAAAAAAAAAA/dKBBhyjxnI0/s68-c-k-no-mo-rj-c0xffffff/photo.jpg",
  views: "3k",
  time:'4 months ago'
},
{
  name: "I May Have Cried After Making This Video...",
  image: "i.ytimg.com/vi/y2IdJBZOejI/maxresdefault.jpg",
  youtuber: "Philip Defranco",
  avatar: "https://yt3.ggpht.com/-nPmtKfa70lE/AAAAAAAAAAI/AAAAAAAAAAA/E66oeUI2kFw/s68-c-k-no-mo-rj-c0xffffff/photo.jpg",
  views: "3k",
  time:'4 months ago'
},{
  name: "Up & Up",
  image: "i.ytimg.com/vi/BPNTC7uZYrI/maxresdefault.jpg",
  youtuber: "Coldplay Official",
  avatar: "https://yt3.ggpht.com/-5E9R-kUK4H0/AAAAAAAAAAI/AAAAAAAAAAA/8RWanSWSVOI/s68-c-k-no-mo-rj-c0xffffff/photo.jpg",
  views: "90M",
  time:'5 months ago'
},
{
  name: "Google and NASA's Quantum Artificial Intelligence Lab",
  image: "i.ytimg.com/vi/CMdHDHEuOUE/maxresdefault.jpg",
  youtuber: "Google",
  avatar: "https://yt3.ggpht.com/-v0soe-ievYE/AAAAAAAAAAI/AAAAAAAAAAA/OixOH_h84Po/s68-c-k-no-mo-rj-c0xffffff/photo.jpg",
  views: "3M",
  time:'3 years ago'
},{
  name: "G-Eazy x Childish Gambino - Wildfire (Mix)",
  image: "i.ytimg.com/vi/txzWmc07LlU/maxresdefault.jpg",
  youtuber: "Promoting Sounds",
  avatar: "https://yt3.ggpht.com/-6njQqd-zE6U/AAAAAAAAAAI/AAAAAAAAAAA/dfX0y_hkmbI/s68-c-k-no-mo-rj-c0xffffff/photo.jpg",
  views: "30k",
  time:'2 weeks Ago'
},{
  name: "KYLE - KING WAVY (ft. G-Eazy)",
  image: "i.ytimg.com/vi/gCsWtQkiD74/maxresdefault.jpg",
  youtuber: "Promoting Sounds",
  avatar: "https://yt3.ggpht.com/-6njQqd-zE6U/AAAAAAAAAAI/AAAAAAAAAAA/dfX0y_hkmbI/s68-c-k-no-mo-rj-c0xffffff/photo.jpg",
  views: "30k",
  time:'1 year ago'
},{
  name: "EXPLORING HAUNTED PARIS CATACOMBS (GONE WRONG)",
  image: "i.ytimg.com/vi/mkvEqtAihB4/maxresdefault.jpg",
  youtuber: "Night Scape",
  avatar: "https://yt3.ggpht.com/-k18J0JfLjus/AAAAAAAAAAI/AAAAAAAAAAA/uZ3ab97WfWg/s68-c-k-no-mo-rj-c0xffffff/photo.jpg",
  views: "110k",
  time:'2 months ago'
},{
  name: "Showcase: Dragon Ballz Game [Open Source Code]",
  image: "i.ytimg.com/vi/NUwueUPJs7c/maxresdefault.jpg",
  youtuber: "Samuel Okoro",
  avatar: "https://yt3.ggpht.com/-QCc9TPlhySA/AAAAAAAAAAI/AAAAAAAAAAA/p43btU4kWT4/s68-c-k-no-mo-rj-c0xffffff/photo.jpg",
  views: "738",
  time:'3 days ago'
},{
  name: "HE DRANK THE MOONSHINE",
  image: "i.ytimg.com/vi/Rdd9DlA1sJQ/sddefault.jpg",
  youtuber: "Casey Neistat",
  avatar: "https://yt3.ggpht.com/-x2NNN2y49G0/AAAAAAAAAAI/AAAAAAAAAAA/RhwVaxMvqW8/s68-c-k-no-mo-rj-c0xffffff/photo.jpg",
  views: "1M",
  time:'5 months ago'
},

]
export default class Holder extends Component {
  constructor(props){
    super(props)

    this.state = {
      noVideo:true,//为false时 播放视频
    }
  }
  play(){
    if(this.state.noVideo){
      return(<View />)
    }else{
      return(<Play />)
    }
  }

  //子组件点击播放视频 通知父组件触发
  pressPlay(){
    if(!this.state.noVideo){
      this.setState({
        noVideo:true
      })
    }else{
      // this.setState({
      //   noVideo:false
      // })
    }
    setTimeout(() => {
      this.setState({
        noVideo:false
      })
    }, 100)
    // this.setState({
    //   noVideo:false
    // })
  }
  render() {
    console.log('holder主页---------')
    console.log(this.props.user)
    console.log('holder主页---------')
    return (
      <View style={{flex:1, backgroundColor:'#2b2b2b'}}>
      <StatusBar
        backgroundColor="blue"
        barStyle="light-content"
      />

      <Nav name="Home1" dark={false} />

      <ScrollableTabView 
        style={{flex:1,paddingBottom:55}}
        locked={true}//关闭滑动切换tab
        initialPage={0}
        scrollWithoutAnimation={true}//关闭动画效果
        renderTabBar={() => <FacebookTabBar />}
        tabBarBackgroundColor="#212121">
          <Home press = {() => this.pressPlay()} tabLabel="home" vid = {videos} />
          <Subscribe press = {() => this.pressPlay()} tabLabel="subject"  />
          <Trending tabLabel="whatshot" vid = {videos} />
          <Subs tabLabel="subscriptions" vids = {videos} subs = {subs} />
          <Profile navigator={this.props.navigator} user={this.props.user} tabLabel="person" />
      </ScrollableTabView>

      {this.play()}
      
      </View>
    );
  }

  // //获取数据
  // _fetchData(page){
  //   var pages=page
  //   if(page!==0){
  //     this.setState({
  //       isLoadingTail:true
  //     })
  //   }else{
  //     pages=1
  //     this.setState({
  //       isRefreshing:true,
  //     })
  //   }

  //   request.get(config.api.base+config.api.creations)
  //   .then((data) => {
  //     console.log(data)
  //     // if(data.code==0){
        
  //     // }
  //   })
  //   .catch((error) => {
  //     console.error(error);
      
  //   });
  // }



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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


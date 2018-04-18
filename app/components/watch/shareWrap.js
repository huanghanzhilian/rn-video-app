/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  AlertIOS
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob'
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import m3u8Parser from 'm3u8-parser';

var request=require('../../common/request')
var config=require('../../common/config');
var {height, width} = Dimensions.get('window');


export default class shareWrap extends Component {
  constructor(props){
    super(props)
    var row=this.props.data
    console.log(row)
    this.state={
      row:row,
      isLike:row.isLike,//点赞状态
      likeAmount:row.likeAmount,//点赞数
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.list} onPress={this._up.bind(this)}>
          <Icon
            name='thumbs-up'
            style={[styles.Icon,this.state.isLike?{color:'#e34849'}:null]}
            size={24}
          />
          <Text style={styles.text}>{this.state.likeAmount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.list}>
          <Icon
            name='share-2'
            style={styles.Icon}
            size={24}
          />
          <Text style={styles.text}>分享</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.list} onPress={this._download.bind(this)}>
          <Icon
            name='download'
            style={styles.Icon}
            size={24}
          />
          <Text style={styles.text}>缓存</Text>
        </TouchableOpacity>
      </View>
    );
  }
  downloadVideo(fromUrl, toFile){
    const activeDownloads = {};
    activeDownloads[toFile] = new Promise((resolve, reject) => {
        RNFetchBlob
            .config({path: toFile})
            .fetch('GET', fromUrl)
            .then(res => {
                if (Math.floor(res.respInfo.status / 100) !== 2) {
                    throw new Error('Failed to successfully download video');
                }
                //resolve(toFile);
                resolve(res);
            })
            .catch(err => {
                return deleteFile(toFile)
                  .then(() => reject(err));
            })
            .finally(() => {
                // cleanup
                delete activeDownloads[toFile];
            });
    });
    return activeDownloads[toFile];
  }
  async _download(){
    //const baseCacheDir = RNFetchBlob.fs.dirs.CacheDir + '/videocache';//隐藏目录
    var fs=RNFetchBlob.fs
    var path=RNFetchBlob.fs.dirs.DocumentDir
    var videocache=path+'/videocache'
    let isDir=await fs.isDir(videocache)
    if(!isDir){
      await fs.mkdir(videocache)
        .then(() => {console.log('创建 videocache 文件成功')})
        .catch((err) => {console.log('创建 videocache 文件失败')})
    }
    let dirs = videocache+'/ll.m3u8'
 
    
    

    var url='http://video.samuredwonder.com/5c79c7fd53acdbf1eb6d86875625c147=/lph25XsXld3iu178K-LFJVIM8qz7/0?e=1524132418&token=vcZj_ZMWMJ8gU759Lfsd8_A2jgriPXGS6tBJX1Ss:HZmS1Ch2mbtxaKroZSmjxH4A9gQ';
    var dirsRes=await this.downloadVideo(url,dirs)
    console.log(dirsRes)

    //得到m3u8内容
    var manifest = await dirsRes.text()
    console.log(manifest)

    //解析主体m3u8
    var parser = new m3u8Parser.Parser();
    parser.push(manifest);
    parser.end();
    var parsedManifest = parser.manifest;
    console.log(parsedManifest)

    //得到媒体源列表
    var segments=parsedManifest.segments
    console.log(segments)
    if(segments){
      this.walk(segments,videocache)
    }
    
  }
  async walk(segments,videocache){
    // var fs=RNFetchBlob.fs
    // var path=RNFetchBlob.fs.dirs.DocumentDir
    // var videocache=path+'/videocache'
    // let isDir=await fs.isDir(videocache)
    // if(!isDir){
    //   await fs.mkdir(videocache)
    //     .then(() => {console.log('创建 videocache 文件成功')})
    //     .catch((err) => {console.log('创建 videocache 文件失败')})
    // }
    let dirs = videocache+'/'+segments[0].uri
 
    
    

    var dirsRes=await this.downloadVideo('http://video.samuredwonder.com'+segments[0].uri,dirs)
    console.log(dirsRes)

    var manifest = await dirsRes.text()
    console.log(manifest)
    return
     segments.forEach(function(file){
      console.log(file)
       // var filePath=path.join(modelsPath,'/'+file)
       // var stat=fs.statSync(filePath)
       // if(stat.isFlie()){
       //   if(/(.*)\.(js|coffee)/.test(file)){
       //     require(filePath)
       //   }
       // }else if(stat.isDirectory()){
       //   walk(filePath)
       // }
     })
  }
  //点赞
  _up(){
    var isLike=!this.state.isLike
    var row=this.state.row
    var isLike
    if(!isLike){
      likeAmount=this.state.likeAmount-1
    }else{
      likeAmount=this.state.likeAmount+1
    }
    var url =config.api.base+config.api.videoLike

    //构建post form表单的数据
    var body={
      videoId:row.id
    }

    request.post(url,body)
      .then((data)=>{
        if(data.code==0){
          this.setState({
            isLike:isLike,
            likeAmount:likeAmount
          })
          if(!isLike){
            this.props.toast('取消点赞成功')
          }else{
            this.props.toast('点赞成功')
          }
        }
        else{
          AlertIOS.alert('点赞失败，稍后重试')
        }
      })
      //错误捕获
      .catch(function(err){
        console.log(err)
        AlertIOS.alert('点赞失败，稍后重试')
      })

  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    width:width,
    padding:8,
    backgroundColor:'#252525',
    flexDirection:'row',
    
  },
  list:{
    flex:1,
    height:40,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Icon:{
    color:'#c8c6c9',
    fontSize:18
  },
  text:{
    marginTop:8,
    color:'#c8c6c9',
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


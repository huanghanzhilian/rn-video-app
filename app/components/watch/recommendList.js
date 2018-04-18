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
  ListView,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


import {timeCycle,formatDuring,imageUrl} from '../../common/util'

var {height, width} = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class recommendList extends Component {
  constructor(props){
    super(props)
    this.state={
      dataSource: ds.cloneWithRows(this.props.data),
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>为你推荐</Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this.eachVid(rowData)}
          style={{marginTop:5}}
        />
      </View>
    );
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.data!==this.props.data){
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.data)
      })
    }
    //console.log(nextProps.data!==this.props.data)
  }

  eachVid(x){
    return(
      <TouchableOpacity onPress={()=>this.props.fetchData(x.id)}>
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
              <Text numberOfLines={1} style={styles.upName} >
                {x.user.name}
              </Text>
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
      
      </TouchableOpacity>)
  }
}

const styles = StyleSheet.create({
  container: {
    padding:8
    //flex: 1,
  },

  title:{
    color:'#525252'
  },

  /*列表样式s */
  item:{
    //height:300,
    width:width,
    backgroundColor:'#212121',
    borderBottomWidth:1,
    borderColor:'#383838',
    flexDirection:'row',
    paddingTop:4,
    paddingBottom:4,
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


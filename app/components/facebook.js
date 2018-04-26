import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';



var width=Dimensions.get('window').width//获取屏幕宽度
var height=Dimensions.get('window').height


const FacebookTabBar = React.createClass({
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
    //console.log(this.props)
    return <View style={[styles.tabs, this.props.style, ]}>
      {this.props.tabs.map((tab, i) => {
        return <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
          <Icon
            name={tab}
            size={24}
            color={this.props.activeTab === i ? '#e34849' : '#828282'}
            ref={(icon) => { this.tabIcons[i] = icon; }}
          />
          {
            tab=='home'
            ?<Text style={[styles.icontxte,this.props.activeTab !== i?null:styles.icontxtea]}>首页</Text>
            :null
          }
          {
            tab=='subject'
            ?<Text style={[styles.icontxte,this.props.activeTab !== i?null:styles.icontxtea]}>订阅</Text>
            :null
          }
          {
            tab=='whatshot'
            ?<Text style={[styles.icontxte,this.props.activeTab !== i?null:styles.icontxtea]}>我的</Text>
            :null
          }
          {
            tab=='subscriptions'
            ?<Text style={[styles.icontxte,this.props.activeTab !== i?null:styles.icontxtea]}>我的</Text>
            :null
          }
          {
            tab=='person'
            ?<Text style={[styles.icontxte,this.props.activeTab !== i?null:styles.icontxtea]}>我的</Text>
            :null
          }
        </TouchableOpacity>;
      })}
    </View>;
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    backgroundColor:'#212121',
  },
  tabs: {
    height: 55,
    flexDirection: 'row',
    paddingTop: 5,
    //borderWidth: 1,
    borderTopWidth: 1,
    //backgroundColor:'#dd5057',
    backgroundColor:'#212121',
    borderTopColor: '#383838',
    position:'absolute',
    left:0,
    bottom:0,
    width:width,
  },
  icontxte:{
    color:'#828282',
    fontSize:14
  },
  icontxtea:{
    color:'#e34849'
  }
});

export default FacebookTabBar;
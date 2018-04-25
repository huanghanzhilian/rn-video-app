/*
* @Author: huanghanzhilian
* @Date:   2018-04-24 17:05:56
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-25 09:44:40
*/
import React, {Component} from 'react';
import {
    BackAndroid,
    Platform,
} from 'react-native';

export default class BaseComponent extends Component {

    constructor(props) {
        super(props);
    }
    componentWillMount() {
        if (Platform.OS === 'android') {

            BackAndroid.addEventListener("back", this.onBackClicked);
        }else {

        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener("back", this.onBackClicked);
        }else {
            this.propstManger.addLengeData(this.props.navigator.getCurrentRoutes().length);
        }
    }

    //返回 ;//return  true 表示返回上一页  false  表示跳出RN
    onBackClicked = () => { // 默认 表示跳出RN
        return false;
    }

    /*
     //复制此方法到 继承该组件的地方即可 

     //BACK物理按键监听
     onBackClicked = () => {
         const {navigator} = this.props;
         if (navigator && navigator.getCurrentRoutes().length > 1) {
             navigator.pop();
             return true;//true 表示返回上一页
         }
         return false; // 默认false  表示跳出RN
     }
     */

}

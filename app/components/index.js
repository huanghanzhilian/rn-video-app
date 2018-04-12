/*
* @Author: huanghanzhilian
* @Date:   2018-04-12 11:27:08
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-12 11:31:16
*/
import React, { Component } from 'react';


// 引用外部文件
import { Provider } from 'react-redux';
import Root from './root';
import configureStore from '../redux/store/store';

// 调用 store 文件中的 mainReducer常量中保存的方法
const store = configureStore();

export default class Index extends Component {
    render() {
    	//console.log(store.getState('text'))
        return(
            // 第一层包装,为了让 main 能够拿到 store
            <Provider store={store}>
                <Root />
            </Provider>
        )
    }
}
/**
 * Created by yeshaojian on 2017/4/22.
 */

import Reducer from '../reducer';
import { createStore } from 'redux';

export default () => {
	let initState = { num: 0,text:"哈哈哈"};
    // 根据 reducer 初始化 store
    const store = createStore(Reducer,initState);

    return store;
}
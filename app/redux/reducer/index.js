/*
* @Author: macintoshhd
* @Date:   2018-04-11 23:37:16
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-12 11:49:48
*/
import { combineReducers } from 'redux'  
import reduceNum from './reduceNum'  
import reduceText from './reduceText'  
import reduceUser from './reducerUser'  
  
const todoApp = combineReducers({  
  num:reduceNum,  
  text:reduceText,
  userInfo:reduceUser
})  
  
export default todoApp  

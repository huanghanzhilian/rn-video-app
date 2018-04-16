/*
* @Author: macintoshhd
* @Date:   2018-04-11 23:37:16
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-16 13:12:13
*/
import { combineReducers } from 'redux'  
import reduceNum from './reduceNum'  
import reduceText from './reduceText'  
import reduceUser from './reducerUser' 
import video from './video'  
  
const todoApp = combineReducers({  
  num:reduceNum,  
  text:reduceText,
  userInfo:reduceUser,
  videoInfo:video
})  
  
export default todoApp  

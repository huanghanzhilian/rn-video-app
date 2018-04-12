/*
* @Author: macintoshhd
* @Date:   2018-04-11 23:34:31
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-12 11:50:35
*/
export const addTodo = (num) => {  
  return {  
    type: 'INCREMENT',  
    num: num,  
  }  
}  
  
export const decTodo = (num) => {  
  return {  
    type: 'DECREMENT',  
    num: num,  
  }  
}  
  
export const updateText = (text) => {  
  return {  
    type: 'TEXT_UPDATE',  
    text: text,  
  }  
} 

//用户信息
export const setUserInfo = (userInfo) => {  
  return {  
    type: 'SET_USER',  
    userInfo: userInfo,  
  }  
} 
/*
* @Author: huanghanzhilian
* @Date:   2018-04-12 11:39:32
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-12 11:51:18
*/
var initUser=null
const reducerUser = (state=initUser, action) => {  
  switch (action.type) {  
    case 'SET_USER':  
      return action.userInfo   
    default:  
      return state//返回原来的state  
  }  
}  
  
export default reducerUser
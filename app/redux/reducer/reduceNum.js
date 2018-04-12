/*
* @Author: macintoshhd
* @Date:   2018-04-11 23:35:34
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-12 11:41:07
*/
const todo1 = (state=0, action) => {  
  switch (action.type) {  
    case 'INCREMENT':  
      return state + 1  
    case 'DECREMENT':  
      return state - 1  
    default:  
      return state//返回原来的state  
  }  
}  
  
export default todo1
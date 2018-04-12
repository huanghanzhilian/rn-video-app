/*
* @Author: macintoshhd
* @Date:   2018-04-11 23:35:51
* @Last Modified by:   macintoshhd
* @Last Modified time: 2018-04-11 23:36:40
*/
const todo = (state="", action) => {  
  
  switch (action.type) {  
    case 'TEXT_UPDATE':  
    //新的state  
      return  action.text   
    default:  
      //返回原来的state  
      return state  
  }  
}  
  
export default todo 
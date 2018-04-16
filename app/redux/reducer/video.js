/*
* @Author: huanghanzhilian
* @Date:   2018-04-16 13:07:49
* @Last Modified by:   huanghanzhilian
* @Last Modified time: 2018-04-16 13:10:32
*/
const toVideo = (state={open:false,id:0}, action) => {  
  
  switch (action.type) {  
    case 'GO_VIDEO':  
    //新的state  
      return  action.videoInfo   
    default:  
      //返回原来的state  
      return state  
  }  
}  
  
export default toVideo 
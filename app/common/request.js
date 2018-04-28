'use strict'

var queryString=require('query-string');//对参数进行拼接
var _=require('lodash')//对象替换获取继承
var Mock=require('mockjs')
var config=require('./config');
import axios from 'axios'
import qs from 'qs'


var request={}


request.get=function(url,params,type){
	if(params){
		url+='?'+queryString.stringify(params)
	}

	return fetch(url)
		.then((response) => response.json())
		.then((response) => Mock.mock(response))
}


request.XMLget=function(url){
	return new Promise(function(resolve,reject){
  	var request = new XMLHttpRequest();
		request.onreadystatechange = (e) => {
		  if (request.readyState !== 4) {
		    return;
		  }
		  if (request.status === 200) {
		  	resolve(request.responseText)
		  } else {
		    reject(request.responseText)
		  }
		};
		request.open('GET', url);
		request.send(); 
  })

}

  
request.post=function(url,body){
	//let formData = new FormData();  
	// var key
	// for(key in body){
	// 	formData.append(key,body[key]); 
	// }
	// for (var s in body) {
	// 	formData.append(s.toString(), body[s].toString());
	// }
	// console.log(formData)

	var options=_.extend(config.header,{
		body:JSON.stringify(body)
		//body:formData
		//body:qs.stringify(body)
	})
	//console.log(options)
	return fetch(url,options)
		.then((response) => response.json())
		.then((responseJson) => Mock.mock(responseJson))
}

/*request.post=function(url,body){
	return new Promise((resolve, reject) => {
		body.ll=2
    console.log(qs.stringify(body))
    // body=JSON.stringify(body)
    // console.log(body)

    axios.post(url, qs.stringify(body))
    .then(res => {
      resolve(res)
    }).catch(error => {
    	console.log(error)
      reject(error)
    })
  })


	// return fetch(url,options)
	// 	.then((response) => response.json())
	// 	.then((responseJson) => Mock.mock(responseJson))
}*/


module.exports=request
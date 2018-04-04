'use strict'

module.exports={
	header:{
		method:'POST',
		headers:{
			'Accept': 'application/json',
    	'Content-Type': 'application/json'
		}
	},
	api:{
		//base:'http://192.168.0.103:1234/',
		//base:'http://localhost:1234/',
		base:'http://rapapi.org/mockjs/32939/',
		//base:'http://localhost:3006/',
		//base:'http://127.0.0.1:3006/',
		//base:'http://192.168.0.6:3006/',
		creations:'api/mobile/common/index/videos',//首页数据列表
		videoinfo:'api/play/video',//播放视频相关信息
		videourl:'api/mobile/play/url',//通过id获取视频
	},
	
}
'use strict'

module.exports={
	header:{
		method:'POST',
		headers:{
			'Accept': 'application/json',
    		 'Content-Type': 'application/json'
    		//'Content-Type': 'application/x-www-form-urlencoded'
		}
	},
	api:{
		//base:'http://192.168.0.103:1234/',
		//base:'http://localhost:1234/',
		//base:'http://rapapi.org/mockjs/32939/',
		//base:'http://m.samuredwonder.com/',
		base:'http://localhost:3006/',
		//base:'http://127.0.0.1:3006/',
		//base:'http://192.168.0.102:3006/',
		userinfo:'api/user/info',//查看用户信息
		creations:'api/mobile/common/index/videos',//首页数据列表
		getSubscription:'api/mobile/subscription/video/list',//订阅数据列表
		videoinfo:'api/play/video',//播放视频相关信息
		videourl:'api/mobile/play/url',//通过id获取视频
		gologin:'api/user/login',//登录
		isexistser:'api/user/isexists',//判断用户是否存在
		getVerifycode:'api/user/send/verifycode',//获取修改密码的验证码
		setPassword:'api/user/reset/password',//重置密码
		getHistory:'api/history/list',//历史记录接口
		getCollect:'api/like/video/list',//订过的视频
		getCollectAlbum:'api/collection/playlist',//收藏过得专辑

		getNotifications:'api/notice/new',//系统通知列表

		getUpuserinfo:'api/channel/info',//专辑主播信息
		getChannelvideos:'api/channel/videos',//专辑主播信息-视频
		getChannelalbums:'api/channel/albums',//专辑主播信息-专辑
		setSwitch:'api/subscription/switch',//订阅主播频道

		getSearch:'api/search/all',//搜索接口
		videoLike:'api/like/video/switch',//视频点赞接口

		getBorderlands:'api/filter/borderlands',//Borderlands列表
		getTagborderlands:'api/dictionary/type/video/borderlands',//获取tag数据

		getInformation:'api/filter/information',//资讯列表
		getTaginformation:'api/dictionary/type/video/information',//获取tag数据

		getMovie:'api/filter/film',
		getMovieType:'api/dictionary/type/video/film',//获取tag数据
		getMovieYears:'api/dictionary/type/years/film',
		getMovieCountry:'api/dictionary/type/country',


		getSeries:'api/filter/series',//剧集列表页
		getTypeseries:'api/dictionary/type/series',
		getTypeyearsseries:'api/dictionary/type/years/series',


		getProductList:'api/product/list',//支付列表接口
	},
	
}
'use strict'



var utils={}
utils.timeCycle=function(time){
	var result = '';
  var second = 1000;
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - (time * 1000);
  if (diffValue < 0) {
    return;
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  var secondC = diffValue / second;
  if (monthC >= 1) {
    result = "" + parseInt(monthC) + "个月前";
  } else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else
    result = "" + parseInt(secondC) + "秒前";
  return result;
}

// 时间转换
utils.formatDuring = function(mss) {
  mss = mss * 1000;
  var days = parseInt(mss / (1000 * 60 * 60 * 24));
  var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = (parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))) > 9 ? (parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))) : '0' + (parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)));
  var seconds = ((mss % (1000 * 60)) / 1000) > 9 ? (mss % (1000 * 60)) / 1000 : '0' + (mss % (1000 * 60)) / 1000;
  if (!mss) {
    return '0:00';
  } else {
    return (hours ? hours + ":" : "") + (minutes ? minutes + ":" : "") + (seconds ? seconds + "" : "");
  }
  //return days+"天"+hours+"小时"+minutes+"分钟"+seconds+"秒";
  //return (days ? days + "天" : "") + (hours ? hours + "小时" : "") + (minutes ? minutes + "分钟" : "") + (seconds ? seconds + "秒" : "");
  //return (days ? days + ":" : "") + (hours ? hours + ":" : "") + (minutes ? minutes + ":" : "") + (seconds ? seconds + "" : "");
};


module.exports=utils
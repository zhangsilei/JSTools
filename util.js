/****************************************************
 *
 * 
 * 常用的工具方法，所有代码都基于原生JS
 *
 *  
 ***************************************************/


///////////////////////////   Cookie操作   ///////////////////////////

/**
 * 写入Cookie   
 * @param {String} cname  Cookie的key
 * @param {String} cvalue Cookie的value
 * @param {String} days   Cookie的存活天数
 */
function setCookie(cname, cvalue, days) {
	var date = new Date();
	date.setDate(date.getDate() + days);
	var exdate = "; expires=" + date.toGMTString();
	document.cookie = cname + "=" + escape(cvalue) + exdate;
}

/**
 * 读取Cookie
 * @param  {String} cname Cookie的key
 * @return {String} Cookie的value
 */
function getCookie(cname) {
	var cvalue = "";
	var cookies = document.cookie;
	if (cookies.length > 0) { // 有cookie
		var search = cname + "=";
		var start = cookies.indexOf(search);
		if (start != -1) { // 有名字为cname的cookie
			start += search.length;
			var end = cookies.indexOf(";", start);
			if (end == -1) {
				end = cookies.length;
			}
			cvalue = unescape(cookies.substring(start, end));
		}
	}
	return cvalue;
}


///////////////////////////   Ajax操作   ///////////////////////////

var XMLHttpReq;
/**
 * 初始化XMLHttpRequest对象
 */
function initXMLHttpRequest() {
	try {
		XMLHttpReq = new ActiveXObject('Msxml2.XMLHTTP'); // 高版本IE
	} catch (e) {
		try {
			XMLHttpReq = new ActiveXObject('Microsoft.XMLHTTP'); // 低版本IE
		} catch (e) {
			XMLHttpReq = new XMLHttpRequest();
		}
	}
}
/**
 * 发送Ajax请求
 * @param  {String} url  请求地址，若有参数直接加在后面
 * @param  {String} type 请求类型，POST/GET
 */
function sendAjaxRequest(url, type) {
	initXMLHttpRequest();
	XMLHttpReq.open(type, url, true);
	XMLHttpReq.onreadystatechange = function() {
		handleAjaxResponse();
	};
	XMLHttpReq.send();
}
/**
 * 响应过程处理
 */
function handleAjaxResponse() {
	if (XMLHttpReq.readyState == 4) { // 成功拿到服务端响应信息
		if (XMLHttpReq.status == 200) { // 客户端请求成功
			var respText = XMLHttpReq.responseText;
			console.log(respText);
		}
	}
}


///////////////////////////   终端相关操作   ///////////////////////////

/**
 * 判断终端的类型
 * invoke : browser.versions.webKit
 * @type {boolean} 选定终端类型的布尔值
 */
var browser = {
	versions: function() {
		var u = navigator.userAgent;
		return {
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
			iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
		};
	}(),
	language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

/**   
 * 检测浏览器类型
 * @param {String} browserStr 浏览器标志字符串    
 * @return {boolean}      
 */
function browserType(browserStr) {
	return (navigator.userAgent.indexOf(browserStr) != -1) ? true : false;
}

/**
 * 检查浏览器是否支持placeholder
 * @return {Boolean} 是否支持
 */
function hasPlaceholderCheck() {
	return 'placeholder' in document.createElement('input');
}


///////////////////////////   百度地图定位   ///////////////////////////

/**
 * 获取当前所在城市   
 * 调用此方法需要在页面中引入百度地图API
 * API链接：http://api.map.baidu.com/api?v=1.2"
 */
var getLocation = function() {
	var options = {
		enableHighAccuracy: true,
		maximumAge: 1000
	}
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
	} else {
		alert("您的浏览器不支持定位");
	}
}

function onSuccess(position) {
	var longitude = position.coords.longitude; // 经度      
	var latitude = position.coords.latitude; // 纬度 
	// 生成坐标点   
	var point = new BMap.Point(longitude, latitude);
	new BMap.Geocoder().getLocation(point, function(rs) {
		var addComp = rs.addressComponents;
		// session.getLocation = 'success';
		// session.setItem('curCity', addComp.city);
		alert('定位成功:' + addComp.city);
	})
}

function onError(error) {
	switch (error.code) {
		case 1:
		case 2:
		case 3:
		case 4:
			// session.getLocation = 'fali';
			// session.setItem('curCity', '定位失败');
			alert('定位失败');
			break;
	}
}


///////////////////////////   Tools   ///////////////////////////

/**   
 * 过滤两端空格
 * @param {String} str 要过滤的原字符串    
 * @return {String} 过滤后的字符串   
 */
function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 获取项目在服务器上的绝对路径
 * @return {String} 项目的绝对路径
 */
function getContextPath() {
	var contextPath = location.pathname;
	var start = 0,
		end = 0,
		count = 0;
	for (c in contextPath) {
		if (contextPath[c] == "/") {
			if (count == 1) {
				end = c;
			}
			count++;
			continue;
		}
	}
	contextPath = contextPath.substring(start, end);
	return location.protocol + "//" + location.host + contextPath;
}

/**
 * 获取请求url的参数
 * @param {String} name URL后缀的参数名
 */
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
	// if(r!=null)return r[2]; return null; 
}

/**    
 * 正则表达式验证数据合法性   
 */
function validate() {
	var test1 = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;     // 只有中文、数字、字母和下划线，且位置不限
	var test2 = /^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;     // 验证手机号
	var test3 = /^\d{4}$/;     // 四位数字验证码  
	var test4 = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/     // 邮箱
}

/**
 * 设置移动端触摸事件优先
 * 不可取的方案，会有点透。
 * 使用开源库fastclick可以解决300ms延迟
 * @return {Event} 
 */
function clickEvent() {
	return ('ontouchend' in document.documentElement) ? 'touchend' : 'click';
}


///////////////////////////   其他   ///////////////////////////

/**
 * 根据子节点向上找祖先节点（基于jQuery，后续会整理到jQuery工具类中）
 * @param {Element} child 子节点    
 * @param {Number} anceNum 向上找祖先节点的层数      
 * @return {Element} 祖先节点  
 */
function childFindAnce(child, anceNum) {
	var result = child;
	for (var i = 0; i < anceNum; i++) {
		result = result.parent();
	}
	return result;
}
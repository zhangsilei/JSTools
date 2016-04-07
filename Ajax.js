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

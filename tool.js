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

/**
 * 阻止事件冒泡
 * @param {Event} e 事件
 */
function stopPropagation(e) {
  e = e || window.event;
  if(e.stopPropagation) {    //W3C阻止冒泡方法
    e.stopPropagation();
  } else {
    e.cancelBubble = true;    //IE阻止冒泡方法
  }
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
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
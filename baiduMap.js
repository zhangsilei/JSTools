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

/**
 * 基于jQuery的CRUD表格类（类似Java的创建方式，非控件）缺点：Controller层和View层耦合度太高，若想改变表格内容必须改动该源码。 
 * 注：原有行的按钮使用DOM2级事件绑定，新增行的按钮使用DOM0级事件绑定。创建对象时自动初始化了所有监听事件。     
 * @param {Elemen} tablediv 表格的父容器                    
 * @param {Array} titles 初始化时的表格标题   
 * @param {String} url 请求后台数据的地址  
 * @param {String} method 请求的方法
 * @param {Object} [userdata] 前台需要传递的参数
 * @param {String} datakey 表格数据的key
 * @param {Array} columns 要获取的字段名
 * @param {String} delurl 删除数据的接口
 * @param {String} updateurl 更新数据的接口 
 * @param {String} addurl 增加新数据的接口
 */      
var DataTable = function(tablediv, titles, url, method, userdata, datakey, columns, delurl, updateurl, addurl){
	var _this = this;      
	var tableEle; 
	
	/*
	 *	一个表格应当包含的属性：表格的标题、表格的内容、表格的事件按钮（按钮组）。
	 */

	// 定义表格和所有按钮
	_this.tits;     // 标题html
	_this.tds;     // 数据行html
	_this.addBtns;
	_this.delbBtns; 
	_this.modBtns;       
                 
	/**
	 * 初始化表格，并提交请求。
	 */               
	DataTable.prototype.init = function(){                            
		// 初始化表格＋标题   
		_this.tits = '';
		var i = 0,
			len = titles.length;
		for ( ; i < len; i++) {              
			_this.tits += '<td>' + titles[i] + '</td>';               
		}                    
		tablediv.append(           
			'<input id="search" type="text"/><button id="searchBtn">搜索</button>' +    
			'<table cellpadding="0" cellspacing="0"><thead><tr>' + _this.tits + '<td>操作</td></tr></thead><tbody></tbody></table>'  
		)       
		// 提交请求
		jQuery.ajax({
			async: true,
			url: url,
			type: method,
			data: userdata,     
			success: function(data) {
				console.log('后台返回的数据：' + data);
				parseData(data); 
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert('请求失败！请求状态码：' + XMLHttpRequest.status + '，响应状态码：' + XMLHttpRequest.readyState
					+ '，错误信息：' + textStatus);
			}
		})
		tableEle = tablediv.find('table');     // 初始化table节点        
	}        
	_this.init();     // 必须先初始化表格！！！    看看能不能把方法写在下面
	 
	/** 
	 * 解析后台数据
	 * @param {String/JSON} data 原始后台数据
	 */
	function parseData(data) { 
		if (data) {    
			if (typeof data != 'string'){
				data = JSON.stringify(data);
			}
			data = data.replace(/\"/g, '')     // 去双引号
			var start, 
				end, 
				list,
			 	single = new Array();     // 每行数据
			data = data.substring(data.indexOf(datakey) + datakey.length, data.length);     // 截取datakey之后的字符串
			start = data.indexOf('[');
			end = data.indexOf(']');
			data = data.substring(start, end + 1)     // 截取datakey后面的第一个数组，即datavalue
			if (data == '[]') {     // 空数据
				return;
			}
			if (start != -1 && end != -1) {     // datavlue是集合
				data = data.replace('[', '').replace(']', '');     // 去中括号  
				data = data.substring(1, data.length-1)     // 去最左最右的大括号
							.split('},{');     // 去“},{”，将每条数据抽出 
				list = new Array();
				// 根据参数中的columns去拿数据中的value
				for (i in data) {   
					for (j in columns) { 
						start = data[i].indexOf(columns[j]) + columns[j].length + 1;
						// 截掉前面的字符，以便匹配剩下的字符后面是否有逗号（判断是否为最后一个value）
						var tempData = data[i].substring(start, data[i].length);     
						end = (tempData.indexOf(',') != -1) ? tempData.indexOf(',') : tempData.length;
						single.push(tempData.substring(0, end)); 
					}  
					list.push(single);  
					single = new Array();     // 每次取完一条记录都要重置数组，以便存储下面的记录 
				}
				initData(list);
			} else {     // datavalue是单条数据
				start = data.indexOf('{');
				end = data.indexOf('}');
				data = data.substring(1, data.length-1)     // 去最左最右的大括号
				// 根据参数中的columns去拿数据中的value    
				for (i in columns){ 
					start = data.indexOf(columns[i]) + columns[i].length + 1; 
					// 截掉前面的字符，以便匹配剩下的字符后面是否有逗号（判断是否为最后一个value）
					var tempData = data.substring(start, data.length);
					end = (tempData.indexOf(',') != -1) ? tempData.indexOf(',') : tempData.length; 
					single.push(tempData.substring(0, end));   
				}
				initData(single); 
			}
			// 手动GC
			single = null; 
			list = null;
		} else {     
			alert.log('后台数据为null！');
		}    
	} 
	
	/**
	 * 将解析好的数据显示在表格中
	 * @param {Array} data 解析之后的后台数据
	 */   
	function initData(data) {
		if (data[0] instanceof Array) {     // data是二维数组（集合）
			for (i in data) {
				for (j in data[i]) {
					_this.tds += '<td>' + data[i][j] + '</td>';  
				} 
				tableEle.find('tbody').append(     // 初始化数据 
					'<tr>' + _this.tds + '<td><button>增</button><button>删</button><button>改</button></td></tr>'              
				)  
				_this.tds = '';     // 每条数据添加完毕后需重置tds 
			}
		} else {     // data是一维数组（单条数据）
			for (i in data) {
				_this.tds += '<td>' + data[i] + '</td>'; 
			}
			tableEle.find('tbody').append( 
				'<tr>' + _this.tds + '<td><button>增</button><button>删</button><button>改</button></td></tr>' 
			)
		}
		
		// 初始化按钮
		_this.addBtns = tableEle.find('button:contains("增")');     // 初始化时的所有“增”按钮（不含新增的按钮）
		_this.delBtns = tableEle.find('button:contains("删")');     // ...“删”...
		_this.modBtns = tableEle.find('button:contains("改")');     // ...“改”...
		
		// 激活按钮 
		_this.addData(_this.oneRow); 
		_this.delData();    
		_this.modData();  

		// 激活搜索
		_this.searchTxt($('tr'));
	}
    
	var newTds = null;     // 新增行的单元格数量     
	for(var i = 0; i < titles.length; i++){        
		newTds += '<td><input type="text"/></td>';         
	}                
	_this.oneRow = '<tr>' + newTds +            
		'<td>' +
		'<button data-new="true" onclick="DataTable.prototype.addData($(this))">增</button>' +              
		'<button data-new="true" onclick="DataTable.prototype.delData($(this))">删</button>' +          
		'<button data-new="true" onclick="DataTable.prototype.modData($(this))">确定</button>' +
		'</td></tr>';     // 新增行的html结构
 
	// 通过判断传入参数的类型或数量来实现方法重载         
	// 增加一行             
	DataTable.prototype.addData = function(rowOrBtn){
		if(typeof rowOrBtn == 'string'){     // 原有的“增”按钮进行增加行操作 
			_this.addBtns.each(function(){  
				$(this).click(function(){  
					childFindAnce($(this), 2).after(rowOrBtn);             
				})                           
			})       
		}else if(typeof rowOrBtn == 'object'){     // 新增行的“增”按钮进行增加行操作          
			childFindAnce(rowOrBtn, 2).after(_this.oneRow);            
		}         
	};                    
    
	// 删除当前行     
	DataTable.prototype.delData = function(){          
		if(arguments.length == 0){     // 原有的“删”按钮进行删除行操作 
			_this.delBtns.each(function(){           
				$(this).click(function(){  
					if(confirm('确定要删除？')){
						// 前端删除
						childFindAnce($(this), 2).remove();
						// 后台删除
						del($(this));
					}
				})
			})
		}else if((arguments.length == 1) && (typeof arguments[0] == 'object')){     // 新增行的“删”按钮进行删除行操作 
			childFindAnce(arguments[0], 2).remove();      
			// 后台删除
			del(arguments[0]);
		} 
		
		function del(ele) {
			var parameters = '',
				i = 0,
				len = columns.length;
			for ( ; i < len; i++) {
				parameters += columns[i] + '=' + childFindAnce(ele, 2).find('td').eq(i).html() + '&';
			}
			parameters = parameters.substring(0, parameters.length-1);
			jQuery.ajax({
				url: delurl + '?' + encodeURI(encodeURI(parameters)),
				type: 'POST',
				success: function(data) {
					console.log('删除成功！');
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert('请求失败！请求状态码：' + XMLHttpRequest.status + '，响应状态码：' + XMLHttpRequest.readyState
					+ '，错误信息：' + textStatus);
			}
			})
		}
	};     
     
	// 修改当前行    
	DataTable.prototype.modData = function(){          
		if(arguments.length == 0){     // 原有的“改”按钮进修改行操作       
			_this.modBtns.each(function(){                
		  		$(this).click(function(){          
		  			_this.dataAction($(this), updateurl);
		  		})               
			})	
		}else if((arguments.length == 1) && (typeof arguments[0] == 'object')){     // 新增行的“改”按钮进修改行操作  
			// 根据data-new判断是调用新增还是更新
			if (arguments[0].data('new')) {
				_this.dataAction(arguments[0], addurl);
				arguments[0].data('new', false);
			} else {
				_this.dataAction(arguments[0], updateurl);
			}
		}    
	};      
          
	// 增加空数据不添加数据行 debug !! 

	// 修改、保存数据 
	DataTable.prototype.dataAction = function(btn, url){
		var currentRow = childFindAnce(btn, 2),
			values = new Array(),      
			tds = currentRow.find('td').not(currentRow.find('td').last());
		// 修改数据    
		if(btn.html() == '改'){
			btn.html('确定'); 
			for(i in tds){         
				values.push(tds[i].innerHTML);
			}     
			tds.empty().append('<input type="text"/>');
			currentRow.find('input').each(function(i){   
				$(this).attr('value', values[i]);    
			})
			values = null;      
			return;   
		}
		// 保存数据
		if(btn.html() == '确定'){
			btn.html('改');
			var inputs = currentRow.find('input');
			for(i in inputs){     
				values.push(inputs[i].value);  
			}
			tds.empty().each(function(i){
				$(this).html(values[i]);   
			})
			values = null;
			// 后台保存修改
  			var parameters = '',
  				i = 0,
  				len = columns.length;
  			for ( ; i < len; i++) {
  				parameters += columns[i] + '=' + currentRow.find('td').eq(i).html() + '&';
  			}
  			parameters = parameters.substring(0, parameters.length-1);
  			jQuery.ajax({
  				url: url + '?' + encodeURI(encodeURI(parameters)),
  				type: 'POST',
  				success: function(data) {
  					console.log('修改成功！');
  				},
  				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert('请求失败！请求状态码：' + XMLHttpRequest.status + '，响应状态码：' + XMLHttpRequest.readyState
						+ '，错误信息：' + textStatus);
				}
  			})
			return;  
		}
	}

	// 搜索文本   
	DataTable.prototype.searchTxt = function(trs){   
		var search = $('#search'), hasTxt = false;      
		// 遍历所有数据行进行查找   
		$('#searchBtn').click(function(){     
			// 未输入字符串时显示所有数据      
			if ($.trim(search.val()) == '') trs.fadeIn(200);        
			var dataTr = trs.not(trs.first()), 
				dataTd = null;     // 所有数据行    
			dataTr.each(function(){ 
				dataTd = $(this).find('td').not($(this).find('td').last());     // 每个数据行中的所有数据单元格
				dataTd.each(function(){
					if($(this).html().indexOf($.trim(search.val())) != -1 ){     // 匹配到了检索内容的数据行
						if($.trim(search.val()) != ''){
							$(this).css('background', 'yellow');     
						}  
						hasTxt = true;     
					}      
				})  
				!hasTxt ? $(this).fadeOut(200) : hasTxt = false;       
			}) 
		})       
	}  
 
    // 根据当前元素查找祖先元素，ansc为向上层级数   
	function childFindAnce(child, ansc){  
		var result = child;   
		for(var i = 0; i < ansc; i++){       
			result = result.parent(); 
		}      
		return result;
	}
 
}

 


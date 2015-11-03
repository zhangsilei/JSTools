/**
 * 基于jquery的CRUD表格类（类似Java的创建方式，非控件） 
 * 原有行的按钮使用DOM2级事件绑定，新增行的按钮使用DOM0级事件绑定。   
 * {Elemen} tablediv 表格外层需要套上DIV，且要加上class='dataTable'               
 * {Number} rowNum 初始化时的行数     
 * {Number} colNum 初始化时的列数   
 */       
var DataTable = function(tablediv, rowNum, colNum){                
	var _this = this;     
	this.html = '<input type="text"/><button>搜索</button>' +         
		'<table cellpadding="0" cellspacing="0"><thead><tr><td>title</td><td>操作</td></tr></thead>' +      
		'<tbody><tr><td>content</td><td><button>增</button><button>删</button><button>改</button></td></tbody></table>';     // 默认的html结构
	this.tableEle = null;     // tablediv下的table节点
       
	// Table初始化
	DataTable.prototype.init = function(){          
		if(checkInitLegal(tablediv, rowNum, colNum)){     // 传参合法                 
			tablediv.append(_this.html);     // 初始化默认的html结构         
			tableEle = tablediv.find('table');     
			// 初始化几行   
			for(var i = 1; i < rowNum; i++){   
				tableEle.append('<tr><td>content</td><td><button>增</button><button>删</button><button>改</button></td></tr>')    
			}         
			// 初始化几列  
			tableEle.find('tr').each(function(){             
				for(var i = 1; i < colNum; i++){                  
					$(this).find('td').last().before('<td>content</td>');   
				}     
			})   
		}  
	}       
	_this.init();     // 自动初始化   
 
  var newTds = null;     // 新增行的单元格数量   
  for(var i = 0; i < colNum; i++){    
  	newTds += '<td><input type="text"/></td>';        
  }            

	this.oneRow = '<tr>' + newTds +          
		'<td><button onclick="DataTable.prototype.addData($(this));">增</button>' +              
		'<button onclick="DataTable.prototype.delData($(this))">删</button>' +          
		'<button onclick="DataTable.prototype.modData($(this))">确定</button></td></tr>';     // 新增行的html结构  
	this.addBtns = tableEle.find('button:contains("增")');     // 初始化时的所有“增”按钮（不含新增的按钮） 
	this.delBtns = tableEle.find('button:contains("删")');     // ...“删”...       
	this.modBtns = tableEle.find('button:contains("改")');     // ...“改”...  
    
	// 判断传入参数的类型或数量来实现方法重载     
	// 增加一行          
	DataTable.prototype.addData = function(rowOrBtn){               
		if(typeof rowOrBtn == 'string'){     // 原有的“增”按钮进行增加行操作                         
			_this.addBtns.each(function(){                                       
				$(this).click(function(){                                  
					childFindAnce($(this), 2).before(rowOrBtn);                                                      
				})                   
			})       
		}else if(typeof rowOrBtn == 'object'){     // 新增行的“增”按钮进行增加行操作          
			childFindAnce(rowOrBtn, 2).before(_this.oneRow);         
		}       
	};              
 
	// 删除当前行     
	DataTable.prototype.delData = function(){         
		if(arguments.length == 0){     // 原有的“删”按钮进行删除行操作  
			_this.delBtns.each(function(){       
				$(this).click(function(){  
					childFindAnce($(this), 2).remove();                
				})
			})
		}else if((arguments.length == 1) && (typeof arguments[0] == 'object')){     // 新增行的“删”按钮进行删除行操作 
			childFindAnce(arguments[0], 2).remove();    
		} 
	};    
    
	// 修改当前行   
	DataTable.prototype.modData = function(){         
		if(arguments.length == 0){     // 原有的“改”按钮进修改行操作       
			_this.modBtns.each(function(){                
	  		$(this).click(function(){          
	  			_this.dataAction($(this)); 
	  		})               
	  	})	
		}else if((arguments.length == 1) && (typeof arguments[0] == 'object')){     // 新增行的“改”按钮进修改行操作 
			_this.dataAction(arguments[0]);
		}    
	};      
         
	// 修改、保存数据 
	DataTable.prototype.dataAction = function(btn){
		var currentRow = childFindAnce(btn, 2); 
		var values = new Array();    
		var tds = currentRow.find('td').not(currentRow.find('td').last());
		// 修改数据    
		if(btn.html() == '改'){
			btn.html('确定'); 
			for(i in tds){      
				values.push(tds[i].innerHTML);
			}   
			tds.empty().append('<input type="text" />');
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
			return;  
		}
	}

  // 根据当前元素查找祖先元素，ansc为向上层级数   
	function childFindAnce(child, ansc){  
		var result = child;   
		for(var i = 0; i < ansc; i++){      
			result = result.parent();
		}   
		return result;
	}
 
	// 检测初始化参数是否添加正确
	// arg1, arg2, arg3 是DataTable的初始化参数  
	function checkInitLegal(arg1, arg2, arg3){   
		var legal = true;     // 默认合法    
		if(arguments.length != 3){  
			console.log('参数的个数错误！' + arguments.length);
			legal = false;
		}else if(typeof arg1 != 'object'){     
			console.log('第一个参数必须是object类型！（最好是DIV）');        
			legal = false;
		}else if(typeof arg2 != 'number'){
			console.log('第二个参数必须是number类型！');
			legal = false;
		}else if(typeof arg3 != 'number'){     
			console.log('第三个参数必须是number类型！');
			legal = false;
		}else if(arg2 < 0 || arg3 < 0){
			console.log('行列数必须大于零！');    
			legal = false;
		}
		return legal;
	}

	// 初始化时即绑定按钮事件 
	_this.addData(_this.oneRow);
	_this.delData();
	_this.modData();
}




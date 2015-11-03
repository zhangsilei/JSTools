$(function(){
	new Table($('table'));   
})            
    
// 初始化时可以选择创建几行几列的表格   add

/**
 * 基于JS的CRUD表格类（类似Java的创建方式，非控件） 
 * 原有行的按钮使用DOM2级事件绑定，新增行的按钮使用DOM0级事件绑定。   
 * {Element} tableEle 表格实例（初始化时必须已存在html结构）             
 */   
var Table = function(tableEle){            
	var _this = this;
	var rowHtml = '<tr><td><input type="text"/></td>' +   
		'<td><input type="text"/></td>' +          
		'<td><input type="text"/></td>' +  
		'<td><input type="text"/></td>' +
		'<td><button onclick="Table.prototype.addData($(this));">增</button>' +     
		'<button onclick="Table.prototype.delData($(this))">删</button>' +      
		'<button onclick="Table.prototype.modData($(this))">确定</button></td></tr>';

	this.oneRow = rowHtml;     // 每行的html结构
	this.addBtns = tableEle.find('button:contains("增")');     // 初始化时的所有“增”按钮（不含新增的按钮）
	this.delBtns = tableEle.find('button:contains("删")');     // 初始化时的所有“删”按钮（不含新增的按钮）    
	this.modBtns = tableEle.find('button:contains("改")');     // 初始化时的所有“改”按钮（不含新增的按钮）

	// 判断传入参数的类型或数量来实现方法重载  
	// 增加一行        
	Table.prototype.addData = function(rowOrBtn){            
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
	Table.prototype.delData = function(){    
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
	Table.prototype.modData = function(){         
		if(arguments.length == 0){     // 原有的“改”按钮进行修改操作       
			_this.modBtns.each(function(){         
	  		$(this).click(function(){     
	  			dataAction($(this)); 
	  		})               
	  	})	
		}else if((arguments.length == 1) && (typeof arguments[0] == 'object')){     // 新增行的“改”按钮进行修改操作 
			dataAction(arguments[0]);
		} 
	};      
       
	// 修改、保存数据 
	function dataAction(btn){
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

	// 初始化时即绑定按钮事件 
	_this.addData(_this.oneRow);
	_this.delData();
	_this.modData();
}




/**
 * 基于jQuery的CRUD表格类（类似Java的创建方式，非控件）缺点：Controller层和View层耦合度太高，若想改变表格内容必须改动该源码。 
 * 注：原有行的按钮使用DOM2级事件绑定，新增行的按钮使用DOM0级事件绑定。创建对象时自动初始化了所有监听事件。     
 * @param {Elemen} tablediv 表格的父容器                     
 * @param {Array} titles 初始化时的表格标题    
 * @param {String} url 请求后台数据的地址   
 * @param {String} method 请求的方法  
 * @param {Object} [userdata] 前台需要传递的参数（可选） 
 * @param {Array} columns 要获取的字段名 
 * @param {boolean} ifAsync 是否异步（使用AJAX） 
 */                           
var DataTable = function(tablediv, titles, url, method, userdata, columns, ifAsync){    
  var _this = this;      
  var tableEle;  
  /* 
   * 表格容器所包含的属性：表格的所有按钮、表格的标题、表格的内容。
   * 不使用$而用jQuery代替，防止与其他包冲突
  */

  // 定义表格和所有按钮
  _this.tits;
  _this.tds;
  _this.addBtns;
  _this.delbBtns; 
  _this.modBtns;       
                 
  /**
   * 初始化表格，并提交请求。
   */               
  DataTable.prototype.init = function(){                            
    // 初始化表格＋标题   
    _this.tits = '', i = 0;          
    for ( ; i < titles.length; i++) {              
      _this.tits += '<td>' + titles[i] + '</td>';               
    }                    
    tablediv.append(           
      '<input id="search" type="text"/><button id="searchBtn">搜索</button>' +    
      '<table cellpadding="0" cellspacing="0"><thead><tr>' + _this.tits + '<td>操作</td></tr></thead><tbody></tbody></table>'  
    )       
    // 提交请求
    if (ifAsync) {     // AJAX
      jQuery.ajax({
        url: url,
        type: method,
        data: userdata,
        success: function(data) { parseData(data); },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          alert('请求失败！请求状态码：' + XMLHttpRequest.status + '，响应状态码：' + XMLHttpRequest.readyState + '，错误信息：' + textStatus);
        }
      })
    } else {     // POST/GET
      if (method == 'post' || method == 'POST') {         
        jQuery.post(url, userdata, function(data) { parseData(data); })  
      } else if (method == 'get' || method == 'GET') {   
        jQuery.get(url, userdata, function(data) { parseData(data); })  
      }
    }
    tableEle = tablediv.find('table');     // 初始化table节点         
  }        
  _this.init();     // 必须先初始化表格！！！ 

  /** 
   * 解析后台数据
   * @param {String/JSON} data 原始后台数据
   */
  function parseData(data) {
    if (data) {      
      var single = new Array();     // 单一记录
      var list;     // 所有记录 
      if (typeof data != 'object') data = JSON.parse(data);
      if (data.length > 1) {     // 拿到的是集合 
        data = JSON.stringify(data);
        list = new Array(); 
        data = data.replace('[', '').replace(']', '')     // 去中括号  
                .substring(0, data.length)     // 去大括号
                // .replace(/\"/g, '')     // 去双引号 
                // .split('},{');     // 去“},{”，将每条数据抽出 
        console.log(data)

        // 根据参数中的columns去拿数据中的value  
        for (i in data) {   
          for (j in columns) { 
            var start = data[i].indexOf(columns[j]) + columns[j].length + 1;
            var end;
            var tempData = data[i].substring(start, data[i].length);     // 截掉前面的字符，以便匹配剩下的字符后面是否有逗号（判断是否为最后一个value）
            end = (tempData.indexOf(',') != -1) ? tempData.indexOf(',') : tempData.length;
            single.push(tempData.substring(0, end)); 
          }  
          list.push(single);  
          single = new Array();     // 每次取完一条记录都要重置数组，以便存储下面的记录 
        }
        initData(list); 
      } else {     // 拿到的是一条记录
        data = JSON.stringify(data)
                .substring(1, data.length-1)     // 去大括号
                .replace(/\"/g, '');     // 去双引号
        // 根据参数中的columns去拿数据中的value    
        for (i in columns){ 
          var start = data.indexOf(columns[i]) + columns[i].length + 1; 
          var end;
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
      console.log('请求失败！');
    }   
  } 
  
  /**
   * 将解析好的数据显示在表格中
   * @param {Array} data 解析完毕的后台数据
   */   
  function initData(data) {
    // 判断data是二维数组（集合）还是一维数组（单条数据）
    if (data[0] instanceof Array) {     // 二维
      for (i in data) {
        for (j in data[i]) {
          _this.tds += '<td>' + data[i][j] + '</td>';  
        } 
        tableEle.find('tbody').append(     // 初始化数据 
          '<tr>' + _this.tds + '<td><button>增</button><button>删</button><button>改</button></td></tr>'              
        )  
        _this.tds = '';     // 每条数据添加完毕后需重置tds 
      }
    } else {     // 一维
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
    '<td><button onclick="DataTable.prototype.addData($(this));">增</button>' +              
    '<button onclick="DataTable.prototype.delData($(this))">删</button>' +          
    '<button onclick="DataTable.prototype.modData($(this))">确定</button></td></tr>';     // 新增行的html结构
 
  // 通过判断传入参数的类型或数量来实现方法重载         
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
          if(confirm('确定要删除？')){
            childFindAnce($(this), 2).remove(); 
          }
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
          
  // 增加空数据不添加数据行 debug !! 

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
      // $.post(addUrl, /* newData, */ function(data){
      //  // Todo...判断插入数据是否成功
      //  console.log(data);
      // })
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
      var dataTr = trs.not(trs.first()), dataTd = null;     // 所有数据行    
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




## NavMenu Plugin

#### 一、插件说明
1. NavMenu是一个基于jQuery的轻量级菜单插件，可以根据喜好进行个性化的UI定制。  

2. 参数说明  
  - 一级菜单参数示例
    - firstFontSize: '16px',  
    - firstFontColor: '#fff',  
    - firstBgColor: '#0E90D2',  
    - firstHoverFontColor: '#fff',  
    - firstHoverBgColor: '#0C79B1',

  - 二级菜单参数示例
    - secondFontSize: '16px',  
    - secondFontColor: '#fff',  
    - secondBgColor: '#0E90D2',  
    - secondHoverFontColor: '#fff',  
    - secondHoverBgColor: '#0C79B1',

  - 菜单宽度（除去自身内容的宽度之外，附加的横向宽度。一二级菜单相同）  
    itemWidth: 20,

  - 菜单间隙（仅限一级菜单）  
    itemMargin: 1,

  - 默认主题  
  theme: 'blue'     // 包含：blue、dark

3. [效果展示](http://dreamon324.github.io/JSLibs/NavMenu/demo.html)

#### 二、使用说明
1. 获取 NavMenu
- [直接下载NavMenu.js](https://raw.githubusercontent.com/DreamOn324/JavaScriptLibs/master/NavMenu/src/NavMenu.js)

2. 引入 NavMenu 样式 ：
  ```html
  <link rel="stylesheet" href="path/to/NavMenu.css"/>
  ```
  
3. 在 jQuery 之后引入 NavMenu 插件 ：
  ```html
  <script src="path/to/jquery.min.js"></script>
  <script src="path/to/NavMenu.min.js"></script>
  ```
  
4. 初始化 NavMenu ：
  ```js
  $(function() {
    $('.nav-menu').NavMenu();
  });
  ```

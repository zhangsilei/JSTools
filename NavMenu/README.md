# NavMenu Plugin

** 插件说明 **

- NavMenu是一个基于jQuery的轻量级菜单插件，可以根据喜好进行个性化的UI定制。

- 参数说明 ： 

  一级菜单参数 ：<br>
    firstFontSize: '16px',<br>
    firstFontColor: '#fff',<br>
    firstBgColor: '#0E90D2',<br>
    firstHoverFontColor: '#fff',<br>
    firstHoverBgColor: '#0C79B1',

  二级菜单参数 ：<br>
    secondFontSize: '16px',<br>
    secondFontColor: '#fff',<br>
    secondBgColor: '#0E90D2',<br>
    secondHoverFontColor: '#fff',<br>
    secondHoverBgColor: '#0C79B1',

  菜单宽度（除去自身内容的宽度之外，附加的横向宽度。一二级菜单相同）：<br>
    itemWidth: 20,

  菜单间隙（仅限一级菜单）：<br>
    itemMargin: 1,

  默认主题 ：
  theme: 'blue'     // 包含：blue、dark

- [使用示例](http://amazeui.github.io/datatables/docs/demo.html)

** 使用说明：**

1. 获取 NavMenu

  - [直接下载](https://github.com/amazeui/datatables/archive/master.zip)

2. 引入 NavMenu 样式 ：

  <link rel="stylesheet" href="path/to/NavMenu.css"/>

3. 在 jQuery 之后引入 NavMenu 插件 ：

  <script src="path/to/jquery.min.js"></script>
  <script src="path/to/NavMenu.min.js"></script>

4. 初始化 NavMenu:

  $(function() {
    $('.nav-menu').NavMenu();
  });



// 拦截所有的ajax请求
// option 参数，获取所有的配置参数
$.ajaxPrefilter(function (option) { 
    alert(option.url);
    option.url = 'http://ajax.frontend.itheima.net' + option.url;
    alert(option.url)
})
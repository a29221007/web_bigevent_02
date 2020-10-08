

// 拦截所有的ajax请求
// option 参数，获取所有的配置参数
$.ajaxPrefilter(function (option) { 
    // 1拼接对应环境的服务器地址
    option.url = 'http://ajax.frontend.itheima.net' + option.url;
    // 2对需要权限的接口配置头信息
    if (option.url.indexOf('/my/') !== -1) { 
        option.headers = {
            Authorization:localStorage.getItem('token') || ''
        }
    }

    // 3 拦截所有响应，判断身份认证信息
    option.complete = function (res) { 
        console.log(res);
        var obj = res.responseJSON;
        if (obj.status === 1 && obj.message === '身份认证失败！') { 
            // 1 清空本地token
            localStorage.removeItem('token')
            // 2 强制跳转到登录页面
            location.href = '/login.html'
        }
    }

    
})
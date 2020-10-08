// 入口函数
$(function () { 
    // 1 获取用户信息
    getUserInfo()

    // 退出功能
    $('#btnLoginout').on('click', function () { 
        // 框架提供的询问框 
        layer.confirm('是否确定退出?', {icon: 3, title:'提示'}, function(index){
            // 1 清空本地token
            localStorage.removeItem('token');
            //2 页面跳转
            location.href = '/login.html';
            // 3 关闭询问框
            layer.close(index);
        });
    })
})

// 获取用户信息封装在入口函数之外
// 原因 ：后面其他的页面要调用
function getUserInfo() { 
    // 发送ajax请求
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        // 优化请求头信息 , 配置到了ajaxPrefilter函数中
        // headers: {
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success: function (res) { 
            //console.log(res);
            if (res.status !== 0) { 
                return layui.layer.msg(res.message)
            }
            // 请求成功
            // 渲染用户头像信息
            renderAvatar(res.data)
        },

        // 优化，配置到ajaxPrefilter函数中
        // complete: function (res) { 
        //     console.log(res);
        //     var obj = res.responseJSON;
        //     if (obj.status === 1 && obj.message === '身份认证失败！') { 
        //         // 1 清空本地token
        //         localStorage.removeItem('token')
        //         // 2 强制跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 封装渲染用户头像信息的函数
function renderAvatar(user) { 
    // 1 用户名（昵称优先，没有用用户名）
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 2 头像信息
    if (user.user_pic !== null) {
        // 有头像
        $('.layui-nav-img').show().attr('src', user.user_pic)
        $('.user-avatar').hide()
    } else { 
        // 没有头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.user-avatar').show().html(first)
    }
} 
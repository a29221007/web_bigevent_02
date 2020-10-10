$(function () { 

    //1 自定义用户昵称验证规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度在1~6个字符！'
            }
        }
    });

    // 2 用户渲染
    initUserInfo();
     // 导出layer
    var layer = layui.layer;
    //封装函数
    function initUserInfo() { 
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg(res.message);
                }
                // 成功后渲染
                form.val('formUserInfo',res.data)
            }
        })
    }

    // 3 重置
    $('#btnReset').on('click', function (e) { 
        //阻止默认重置
        e.preventDefault();
        //重新用户渲染
        initUserInfo();
    })

    // 4 修改用户信息
    $('.layui-form').on('submit', function (e) { 
        //阻止默认提交行为
        e.preventDefault();
        //发送ajax请求
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg(res.message);
                }
                // 成功
                layer.msg(res.message)
                // 调用父框架的全局方法
                window.parent.getUserInfo()
            }

        })
    })
})
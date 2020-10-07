$(function () { 
    // 1绑定 ‘去注册’ 事件
    $('#link_reg').on('click', function () { 
        $('.login_box').hide();
        $('.reg_box').show();
    })


    // 2绑定 ‘去登录’ 事件
    $('#link_login').click(function () { 
        $('.login_box').show();
        $('.reg_box').hide();
    })

    // 3从 layui 中获取 form 对象
    var form = layui.form;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义一个叫pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须在6到12位之间，且不能出现空格'],
        //判断两次输入的密码是否一致
        repwd: function (value) { 
            //通过形参value拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次判断
            // 如果判断失败，则返回一个提示消息
            var pwd = $('#form_reg [name=password]').val();
            if (pwd !== value) { 
                return '两次输入的密码不一致'
            }
        }
    })


    // 4 注册功能
    var layer = layui.layer
    $('#form_reg').submit(function (e) { 
        //阻止表单默认行为
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg_box [name=username]').val(),
                password: $('.reg_box [name=password]').val()
            },
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                // 模拟点击事件
                $('#link_login').click()
                // 重置表单
                $('#form_reg')[0].reset()
            }
        })
    })

    // 5 登录功能
    $('#form_login').on('submit', function (e) { 
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                // token 存储到本地
                localStorage.setItem('token', res.token);
                // 页面跳转
                location.href = '/index.html'
            }
        })
    })
})
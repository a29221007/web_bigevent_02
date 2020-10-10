$(function () {
    // 1 自定义表单的校验规则
    var form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samepwd: function (value) { 
            if (value === $('[name=oldPwd]').val()) { 
                return '新旧密码不能一致！'
            }
        },
        repwd: function (value) { 
            if (value !== $('[name=newPwd]').val()) { 
                return '两次输入的密码不一致'
            }
        }
    })

    // 2 修改密码的表单提交事件
    $('.layui-form').on('submit', function (e) { 
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data:$(this).serialize(),
            success: function (res) { 
                if (res.status !== 0) { 
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                // 原生js 的 reset()重置表单的方法
                $('.layui-form')[0].reset()
            }
        })
    })
})
$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    //2 绑定上传按钮，触发上传文件域
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    var layer = layui.layer
    //3 更换裁剪区的图片
    $('#file').on('change', function (e) {
        console.log(e);
        // 通过事件对象e拿到更换头像的图片的数组集合
        var files = e.target.files;
        // 判断数组长度
        if (files.length === 0) {
            return layer.msg('请选择头像！')
        }
        // 选择头像成功后
        //1 拿到用户选择的文件
        var file = e.target.files[0]
        //2 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        //3 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //4 上传头像
    $('#btnUplode').on('click', function () {
        // 4.1 将裁剪后的图片，输出为 base64 格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        
        // 4.2 发送ajax请求
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg('更新头像失败！')
                }
                layer.msg(res.message)
                //重新渲染头像
                window.parent.getUserInfo()
            }
        })
        
    })
})
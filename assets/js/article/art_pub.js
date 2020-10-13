$(function () {
    var form = layui.form;
    var layer = layui.layer
    initCata()
    // 1 封装调用分类名称的函数
    function initCata() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlstr = template('tpl-cata', res)
                $('[name=cate_id]').html(htmlstr)
                //重新渲染一下
                form.render()
            }
        })
    }

    // 2 富文本编辑
    // 初始化富文本编辑器
    initEditor()

    // 3 实现基本裁剪效果：
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 4 点击选择封面图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 5 更换封面图片
    $('#coverFile').on('change', function (e) {
        console.log(e);
        var files = e.target.files
        if (files.length === 0) {
            return layer.msg('请选择图片')
        }
        var file = files[0]
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 6设置状态
    var state = '已发布'
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    // 7 添加文章
    $('#form-pub').on('submit', function (e) {
        //console.log(e.target);
        e.preventDefault();
        var fd = new FormData(this)
        fd.append('state', state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // 发送ajax请求，要在toBlob（）函数里面！！！！
                //console.log(...fd);
                publistArticle(fd)

            })
    })

    //封装，添加文章的方法
    function publistArticle(fd) { 
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            // FormData 类型数据ajax提交，需要设置两个false
            contentType: false,
            processData: false,
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg(res.message)
                }
                layer.msg('发表文章成功')

                //优化，
                //location.href = '/article/art_list.html'
                // 模拟点击行为，跳转
                setTimeout(function () { 
                    window.parent.document.querySelector('#art_list').click();
                },1500)
            }
        })
    }

})
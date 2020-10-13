$(function () {
    // 调用获取列表函数
    initArtCataList()

    var layer = layui.layer
    // 1 定义封装一个获取分类列表的函数
    function initArtCataList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return 
                }
                
                //获取成功以后调用template函数
                var htmlstr = template('tpl-art-cata', res)
                //渲染到页面上
                $('tbody').html(htmlstr)
            }
        })
    }

    // 2 添加文章分类
    $('#btnAdd').on('click', function () {
        // 利用layui框架显示弹出层
        addindex = layer.open({
            type:1,
            title: '添加文章分类',
            area: ['500px', '300px'],
            content: $('#dialog-add').html()
        });
    })

    // 3 提交添加（事件委托）
    var addindex = null;
    $('body').on('submit', '#form-add', function (e) { 
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg('新增文章分类失败！')
                }
                
                //关闭弹出层
                layer.close(addindex)
                //重新获取分类
                initArtCataList()
                
                
            }
        })
    })

    // 4 修改文章分类
    var editindex = null;
    
    $('tbody').on('click', '.btn-edit', function () { 
        // 4.1显示弹出层
        editindex = layer.open({
            type:1,
            title: '修改文章分类',
            area: ['500px', '300px'],
            content: $('#dialog-edit').html()
        });
        //4.2 获取点击的编辑按钮当前的分类列表数据
        var id = $(this).attr('data-id');
        //console.log(id);
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) { 
                layui.form.val('form-edit',res.data)
            }
        })
    })

    // 4.3 提交修改后的文章分类
    $('body').on('submit', '#form-edit', function (e) { 
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg('提交失败！')
                }
                //重新渲染页面
                initArtCataList()
                layer.msg('类别更新成功！')
                layer.close(editindex)
            }
        })
    })

    // 5 删除分类
    $('tbody').on('click', '.btn-delete', function () {
        //5.1 首先获取当前点击的id值
        var id = $(this).attr('data-id')
        //5.2 弹出询问框
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                type: 'GET',
                url:'/my/article/deletecate/' + id,
                
                success: function(res) {
                    if (res.status !== 0) { 
                        return layer.msg('删除失败！')
                    }
                    initArtCataList()
                    layer.msg('删除成功！')
                    layer.close(index);
                } 
                
            })
            
          });
    })
})
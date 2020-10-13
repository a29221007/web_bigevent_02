$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    // 定义事间过滤器
    template.defaults.imports.dateFormat = function (dtstr) {
        var dt = new Date(dtstr)

        var y = dt.getFullYear()
        var m = dt.getMonth() + 1
        m = m > 9 ? m : '0' + m
        var d = dt.getDate()
        d = d > 9 ? d : '0' + d

        var hh = dt.getHours()
        hh = hh > 9 ? hh : '0' + hh
        var mm = dt.getMinutes()
        mm = mm > 9 ? mm : '0' + mm
        var ss = dt.getSeconds()
        ss = ss > 9 ? ss : '0' + ss
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }



    // 定义请求的参数 q
    var q = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示多少条数据
        cate_id: '',// 分类的id
        state: '', // 文章的状态，可选值有：已发布、草稿	
    }

    // 1 定义请求文章列表的函数
    getArtList()

    function getArtList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return
                }
                // 调用模板引擎函数
                var htmlstr = template('art_list', res)
                // 渲染数据到表格区域
                $('tbody').html(htmlstr)
                // 渲染完文章列表就开始渲染分页
                renderPage(res.total)
            }
        })
    }

    //2 获取文章分类列表，获取成功后，渲染到下拉菜单中
    initCata();
    //封装 initCata()函数
    function initCata() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 成功后，调用模板引擎函数
                var htmlstr = template('tpl-cata', res)
                $('[name=cate_id]').html(htmlstr)
                form.render()
            }
        })
    }

    // 3筛选功能

    $('#form-seach').on('submit', function (e) {
        e.preventDefault();
        // 获取请求的参数q
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        //赋值
        q.cate_id = cate_id
        q.state = state

        //调用获取文章列表函数
        getArtList()
    })


    // 4 分页功能
    function renderPage(num) {
        laypage.render({
            elem: 'page',//注意，这里的 test1 是 ID，不用加 # 号
            count: num,//数据总数，从服务端得到
            limit: q.pagesize, // 每页显示多少条数据
            curr: q.pagenum,// 起始页
            //分页模块设置，显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //切换分页时，就会触发jump回调函数
            //执行laypage.render函数也会触发jump函数，这是第一次触发
            jump: function (obj, first) {
                // obj是一个对象，里面包含当前分页的所有选项值
                // first 则是判断函数是否为首次加载
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 直接调用getArtList() 这个函数，就会出现死循环
                //console.log(11);

                if (!first) {
                    getArtList()
                }
            }
        });
    }

    // 5 根据文章的id删除文章
    $('tbody').on('click', '.btn-delete', function () {
        // 首先要获取当前文章的ID值
        var id = $(this).attr('data-id')
        // 弹出询问框
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) { 
                    if (res.status !== 0) { 
                        return layer.msg(res.message)
                    }
                    // 成功后，重新渲染文章列表
                    // 判断页面中有几个删除按钮，以及当前在第几个分页上
                    if ($('.btn-delete').length === 1 && q.pagenum > 1) { 
                        q.pagenum--
                    }
                    getArtList()
                }
            })
            layer.close(index);
        });
    })
})
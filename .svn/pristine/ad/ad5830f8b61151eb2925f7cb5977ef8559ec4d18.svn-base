//include jquery-1.7.js
//include hexun.home.common.js
/**
* @class 和讯家园 博客
* @singleton
* @createTime 2012-12-25
* @updateTime 
* @note 
* @version 1.0
*/


// 写博客 → 博客输入框聚焦
hexun.home.blogFocus = (function () {
    var defaults = {
        inputID: "hxjy_blog_tit",       // 输入框
        normalClass: "wt_main-tit",     // 默认
        focusClass: "wt_main-titFocus", // 获得焦点
        successClass: "wt_main-titSuccess",// 成功
        errorClass: "wt_main-titError", // 错误
        callback: null,
        limitWordNumber: 0              // 字数限制
    };
    var initialize = function () {
        var elem = $("#" + defaults.inputID), ret = true,
        oParent = $("#" + defaults.inputID + "_parent");
        elem.focus(function () {
            oParent.removeClass(defaults.errorClass).removeClass(defaults.successClass).addClass(defaults.focusClass);
        }).blur(function () {
            oParent.removeClass(defaults.focusClass);
            defaults.callback && (ret = defaults.callback.call(this, oParent));
            if (this.value.empty().length !== 0) {
                if (ret) {
                    oParent.addClass(defaults.successClass);
                } else {
                    oParent.addClass(defaults.errorClass);
                }
            }
        });
        // 字数限制
        if (defaults.limitWordNumber > 0) {
            elem.limit(defaults.limitWordNumber);
        }
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 写博客 → 文章分类
hexun.home.blogClassify = (function () {
    var defaults = {
        triggerID: "hxjy_blog_Classify_trigger",//触发器ID
        panelID: "hxjy_blog_Classify_list",// 文章分类提示面板ID
        selecteID: "hxjy_blog_Classify_list_selected",//选中显示ID
        addID: "hxjy_blog_Classify_add",//新增新分类ID
        highClass: "wt_select1-List-now",//触发高亮class
        state: 0, //状态：0：写博客→文章文类，1：博客管理→全部日志分类（上面） 2：博客管理→全部日志分类（下面）      
        callback: $.noop //回调函数
    };
    var initialize = function () {
        // 绑定事件
        bindEvent();
    };
    function bindEvent() {
        var oTrigger = $("#" + defaults.triggerID),// 选择器DOM
            oSelected = $("#" + defaults.selecteID),// 选中显示DOM
            oAdd = $("#" + defaults.addID),//添加新分类 DOM
            oPanel = $("#" + defaults.panelID),//文章分类提示面板 DOM
            oAddInput = oAdd.find("input"),//添加新分类 DOM
        aLi = oPanel.find("li"), state;
        // 触发器
        oTrigger.click(function () {
            // 解绑document上的关闭面板事件
            $(document).unbind("click", hideClassifyList);
            // 检测面板是否隐藏
            if (oPanel.is(':hidden')) {
                // 展示面板
                oPanel.show();
                // 给document上绑定关闭面板事件
                setTimeout(function () { $(document).bind("click", hideClassifyList); }, 50);
            } else {
                // 隐藏面板
                oPanel.hide();
            }
        })
        // 隐藏面板
        function hideClassifyList() { oPanel.hide(); }
        // 列表触发事件
        aLi.click(function (e) {
            // 显示选中项
            oSelected.html(this.children[0].innerHTML);
            state = defaults.state;
            //状态：0 (写博客→文章文类)
            if (state == 0) {
                // 隐藏新增输入框
                oAdd.hide();
                if (this.index === aLi.length - 1) {
                    oAdd.show();
                    // 聚焦
                    oAddInput.val('').blur().focus();
                    // 阻止a标签默认动作
                    e.preventDefault();
                }
                // 状态：1(博客管理→全部日志分类（上面))
            } else if (state == 1) {
                // 传入当前选中的对象
                defaults.callback(this.children[0]);
            }
        }).each(function () {
            // 触发,显示高亮
            $(this).high(defaults.highClass);
        });
        // 新增触发事件
        oAddInput.length != 0 && oAddInput.prompt(oAddInput.prev());
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 写博客 → 自动获取标签
hexun.home.blogAutoLabel = (function () {
    var defaults = {
        autoID: "hxjy_blog_auto_label",//自动获取标签ID
        panelID: "hxjy_blog_label",////自动获取标签输入框ID
        titleID: "hxjy_blog_tit",  //标题ID
        contentID: "hxjy_blog_content",//文本框ID
        url: "data/data-blogAutoLabel01.js" //数据URL
    };
    var initialize = function () {
        bindEvent();
    };
    function bindEvent() {
        var oAutoLabel = $("#" + defaults.autoID);
        oAutoLabel.click(function () {
            //容错处理
            //1.检测标题
            if (document.getElementById(defaults.titleID).value.length === 0) {
                hexun.home.alert().init({ txt: "请先输入文章标题" });
                //2.检测文本框
            } else if (document.getElementById(defaults.titleID).value.length === 0) {
                hexun.home.alert().init({ txt: "请先输入文章内容" });
            } else {
                loadData();
            }
            return false;
        });

    };
    function loadData() {
        var oPanel = $("#" + defaults.panelID);
        Jser.ajax({
            url: defaults.url,
            dataType: "json",
            type: "GET",
            success: function (data) {
                if (data.status == 1) {
                    oPanel.val(data.label);
                }
            },
            error: function () {

            }

        })

    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 写博客 → 已有标签
hexun.home.blogHasLabel = (function () {

    var defaults = {
        hasLabel: "hxjy_blog_labels",
        inputID: "hxjy_blog_label",
        moreClass: " wt_mian-tag_warningmy",
        panelID: "hxjy_blog_labels_more",
        url: "data/data-blogHasLabel01.js"
    };
    var initialize = function () {
        bindEvent();
    };
    function bindEvent() {
        var oHasLabel = $("#" + defaults.hasLabel),
            oInput = $("#" + defaults.inputID),
            oPanel = $("#" + defaults.panelID),
            $aA = oHasLabel.find("a"),
            len = $aA.length,
            reg = '',
            oClose = oHasLabel.find("span").eq(-1);
        // 点击已有标签
        $aA.click(function () {
            if (this.index < len - 1) {
                insertVal.call(this)
            } else if (this.index === len - 1) {
                //更多
                oMore = $(this);
                if (oPanel.is(":hidden")) {
                    oMore.addClass(defaults.moreClass);
                    //加载已有标签
                    loadData();
                } else {
                    hidePanel();
                }
            }
            return false;
        });
        // 更多面板→标签 点击事件
        oPanel.find("a").live("click", function () {
            insertVal.call(this);
            return false;
        });
        // 插入标签
        function insertVal() {
            var val = " " + oInput.val() + " ",
                   insert = this.innerHTML;
            reg = new RegExp("\\s" + insert + "\\s");
            if (!reg.test(val)) {
                val = $.trim(val + insert);
                oInput.val(val).change();
            }
        }
        // 关闭更多面板j→按钮（绑定事件）
        oClose.click(hidePanel);
        // 关闭 更多面板
        function hidePanel() {
            oClose.hide();
            oMore.removeClass(defaults.moreClass);
            oPanel.hide();
        }
    };
    // 加载已有标签
    function loadData() {
        var oPanel = $("#" + defaults.panelID),
        oClose = $("#" + defaults.hasLabel).find("span").eq(-1);
        Jser.ajax({
            url: defaults.url,
            dataType: "json",
            type: "GET",
            success: function (data) {
                if (data.status == 1) {
                    var i = 0, label = data.label, len = label.length, aHTML = [];
                    for (; i < len; i++) {
                        aHTML.push('<a href="#">' + label[i] + '</a> ');
                    }
                    oPanel.html(aHTML.join("")).show();
                    oClose.show();
                }
            },
            error: function () {

            }
        });
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 写博客 → 更多选项
hexun.home.blogMoreSelected = (function () {
    var defaults = {
        moreID: "hxjy_blog_more_selected01",
        panelID: "hxjy_blog_more_box01",
        upClass: "wt_narrow0",
        downClass: "wt_narrow1",
        height: "485px"
    };
    var initialize = function () {
        bindEvent();
    };
    function bindEvent() {
        var oMore = $("#" + defaults.moreID),
            oPanel = $("#" + defaults.panelID);
        oMore.toggle(function () {
            oPanel.show().animate({ height: defaults.height, opacity: "1" }, "normal", "swing", function () {
                oPanel.css("height", "auto");
            });
            oMore.removeClass(defaults.downClass);
            return false;
        }, function () {
            oMore.addClass(defaults.downClass);
            oPanel.animate({ height: "0px", opacity: "0" }, "normal", "swing", function () {
                oPanel.hide();
            });
            return false;
        })
    };
    function loadData() {

    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 博客管理 → 文章管理
hexun.home.blogArticleManage = (function () {
    var defaults = {
        allID: "hxjy_blog_manage_all", //全选ID
        delectID: "hxjy_blog_manage_delect",//删除ID
        moveID: "hxjy_blog_manage_move",//移动ID
        panelID: "hxjy_blog_manage_table",//文章列表展示ID
        pageID: "hxjy_page",//分页ID
        triggerID: ["hxjy_blog_Classify_trigger", "hxjy_blog_Classify_trigger02"],//分类触发器ID1 分类触发器ID2
        classifyPanelID: ["hxjy_blog_Classify_list", "hxjy_blog_Classify_list02"],//分类面板ID1 分类面板ID2
        selecteID: ["hxjy_blog_Classify_list_selected", "hxjy_blog_Classify_list_selected02"],//分类选中项ID1 分类选中项ID2
        delURL: "data/data01.js",//删除URL
        moveURL: "data/data-ArticleManage-move01.js",//移动URL
        recommendURL: "data/data-ArticleManage-recommend01.js",//推荐→展示圈子 URL
        recommendURL02: "data/data-ArticleManage-recommend02.js",//推荐→选中圈子→确定 URL
        panelURL: "data/data-classify-list01.js"//数据URL


    };
    var initialize = function () {
        // 博客→ 文章分类 上       
        hexun.home.blogClassify().init({ triggerID: defaults.triggerID[0], panelID: defaults.classifyPanelID[0], selecteID: defaults.selecteID[0], state: 1, callback: loadData });

        // 博客→ 文章分类 下
        hexun.home.blogClassify().init({ triggerID: defaults.triggerID[1], panelID: defaults.classifyPanelID[1], selecteID: defaults.selecteID[1], state: 2 });

        // 绑定事件
        bindEvent();

        // 分页
        hexun.home.page().init();
    };
    function bindEvent() {
        var oAll = $("#" + defaults.allID),//全选
            oDelect = $("#" + defaults.delectID),//删除
            oMove = $("#" + defaults.moveID),//移动
            oPanel = $("#" + defaults.panelID),//面板
            aCheckbox, oSelected;
        //全选
        oAll.click(function () {
            oPanel.find("input").attr("checked", this.checked);
        });
        //删除
        oDelect.click(function () {
            aCheckbox = oPanel.find("input:checked");
            if (aCheckbox.length !== 0) {
                hexun.home.confirm().init({
                    txt: "确定删除所选", sure: function () {
                        Jser.ajax({
                            url: defaults.delURL,
                            dataType: "json",
                            type: "GET",
                            success: function (data) {
                                if (data.status == 1) {
                                    aCheckbox.each(function () {
                                        $(this.parentNode.parentNode).remove();
                                    });
                                }
                            }
                        });
                    }
                });
            } else {
                hexun.home.alert().init({ txt: "请选择要删除文章！" });
            }
            return false;
        });
        //移动到
        oMove.click(function () {
            aCheckbox = oPanel.find("input:checked");
            oSelected = $("#" + defaults.selecteID[1]);
            // 请选择要转移的目标日志分类。
            if (oSelected.html() === "请选择移动到日志分类") {
                hexun.home.alert().init({ txt: "请选择要移动的日志分类！" });
                return false;
            }
            if (aCheckbox.length !== 0) {
                hexun.home.confirm().init({
                    txt: "确认转移类别吗？",
                    sure: function () {
                        Jser.ajax({
                            url: defaults.moveURL,
                            dataType: "json",
                            type: "GET",
                            success: function (data) {
                                if (data.status == 1) {
                                    aCheckbox.each(function () {
                                        $(this).parent().parent().remove();
                                    });
                                }
                            }
                        });
                    }
                });
            } else {
                hexun.home.alert().init({ txt: "请选择要移动文章！" });
            }
            return false;
        });
        //推荐
        oPanel.find(".hxjy_btn_recommend").live("click", function () {
            Jser.ajax({
                url: defaults.recommendURL, //推荐地址
                dataType: "json",
                type: "GET",
                success: function (data) {
                    if (data.status == 1) {
                        var aHTML = [], group = data.group;
                        // HTML 碎片 
                        aHTML.push('<p>请选择要将文章推荐到哪些圈子里去：<br />');
                        aHTML.push('(注意: 如果该文章已经被您或其他圈子成员推荐到您所选择的圈子，则本次操作无效。)');
                        aHTML.push('</p>');
                        len = group.length || 0;
                        // 检测是否存在圈子
                        if (len > 0) {
                            // 选择圈子
                            aHTML.push('<ul class="pop_ul">');
                            var i = 0;
                            for (; i < len; i++) {
                                aHTML.push('<li><label><input name="" type="checkbox" value="' + group[i] + '">&nbsp;' + group[i] + '</laber></li>');
                            }
                            aHTML.push('</ul>');
                            aHTML.push('<div class="clear"></div>');
                            hexun.home.confirm().init({
                                html: aHTML.join(""),
                                addClass: "w516",
                                sure: function (elem) {
                                    var oUl = $(this.oAlert).find("ul"),
                                    aCheck = oUl.find("input:checked");
                                    // 检测是否选中圈子
                                    if (oUl.length > 0 && aCheck.length > 0) {
                                        var url = defaults.recommendURL02, ret = [];
                                        url = (url.indexOf('?') != -1) ? (url + '&') : (url + '?');
                                        aCheck.each(function () {
                                            ret.push(this.value);
                                        });
                                        url = url + "type=" + ret.join(",");
                                        // 发送数据
                                        Jser.ajax({
                                            url: url,
                                            dataType: "json",
                                            type: "GET",
                                            success: function (data) {
                                                if (data.status == 1) { }
                                            },
                                            error: function (data) { }
                                        });
                                    }
                                }
                            });
                        } else {
                            // 提示加入圈子
                            aHTML.push('<p class="pop_P">抱歉，您还没有朋友圈，现在加入<strong><a href="#">朋友圈</a></strong>。</p>');
                            hexun.home.alert().init({
                                html: aHTML.join(""),
                                addClass: "w516"
                            });
                        }
                    }
                },
                error: function () {

                }
            });
            return false;
        });

    };
    // 加载 所选择的全部日志文类
    function loadData(elem) {
        var oPanel = $("#" + defaults.panelID), aHtml = [];
        Jser.ajax({
            url: defaults.panelURL + "?tit=" + elem.innerHTML,
            dataType: "json",
            type: "GET",
            success: function (data) {
                if (data.status == 1) {
                    aHtml.push('<thead>');
                    aHtml.push('<tr>');
                    aHtml.push('<th width="59%" scope="col">标  题</th>');
                    aHtml.push('<th width="26%" scope="col">保存时间</th>');
                    aHtml.push('<th width="15%" scope="col">操  作</th>');
                    aHtml.push('</tr>');
                    aHtml.push('</thead>');
                    aHtml.push('<tbody>');
                    var i = 0, tit = data.tit, len = data.tit.length, t;
                    for (; i < len; i++) {
                        t = tit[i];
                        aHtml.push('<tr>');
                        aHtml.push('<td><input name="" type="checkbox" value="" /> <a href="' + t[1] + '" class="a_black">' + t[0] + '</a></td>');
                        aHtml.push('<td align="center">' + t[2] + '</td>');
                        aHtml.push('<td align="center"><a href="#" class="a_btn_grey">修改</a> <a href="#" class="a_btn_grey hxjy_btn_recommend">推荐</a></td>');
                        aHtml.push('</tr>');
                    }
                    aHtml.push('</tbody>');
                    oPanel.html(aHtml.join(""));
                    hexun.home.page().init({
                        page: 4,// 总页数
                        now: 1 //当前页数
                    });
                }
            },
            error: function () {

            }

        })

    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 博客管理 → 文章草稿
hexun.home.blogArticleDraft = (function () {
    var defaults = {
        allID: "hxjy_blog_manage_all", //全选ID
        delectID: "hxjy_blog_manage_delect",//删除ID
        panelID: "hxjy_blog_manage_table",//文章列表展示ID    
        delURL: "data/data01.js"//删除URL
    };
    var initialize = function () {
        bindEvent();
        // 分页
        hexun.home.page().init();
    };
    function bindEvent() {
        var oAll = $("#" + defaults.allID),
          oDelect = $("#" + defaults.delectID),
          oPanel = $("#" + defaults.panelID),
         aCheckbox;//选中项
        //全选
        oAll.click(function () {
            oPanel.find("input").attr("checked", this.checked);
        });
        //删除
        oDelect.click(function () {
            aCheckbox = oPanel.find("input:checked");
            if (aCheckbox.length !== 0) {
                hexun.home.confirm().init({
                    txt: "确定删除所选", sure: function () {
                        Jser.ajax({
                            url: defaults.delURL,
                            dataType: "json",
                            type: "GET",
                            success: function (data) {
                                if (data.status == 1) {
                                    aCheckbox.each(function () {
                                        $(this).parent().parent().remove();
                                    });
                                }
                            }
                        });
                    }
                });
            } else {
                hexun.home.alert().init({ txt: "请选择要删除文章！" });
            }
            return false;
        });
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    };
});

// 博客管理 → 分类管理
hexun.home.blogClassifyManage = (function () {
    var defaults = {
        panelID: "hxjy_blog_manage_table",      // 数据面板
        addPanelID: "hxjy_blog_add_Classify",   // 添加分类
        addID: "hxjy_blog_add_Classify_btn",     // 增加分类ID
        url: "data/data01.js"//增加分类URL

    };
    var initialize = function () {
        bindEvent();
        // 分页
        hexun.home.page().init();
    };
    function bindEvent() {
        var addPanel = $("#" + defaults.addPanelID),// 增加分类面板
            oPanel = $("#" + defaults.panelID),// 数据面板
            oAdd = $("#" + defaults.addID),//增加分类
        oInput = addPanel.find("input"),// 输入框
        val, aHTML = [], isRepeat = false;

        //文本提示
        oInput.prompt(addPanel.find("span")).limit(40);
        //增加分类
        oAdd.click(function () {
            val = oInput.val();
            if (val.empty().length > 0) {
                oPanel.find("span").each(function () {
                    if ($(this).text() == val) {
                        isRepeat = true;
                    }
                });
                if (isRepeat) {
                    hexun.home.alert().init({
                        txt: "已存在该类别!"
                    });
                    isRepeat = false;
                    return false;
                }
                Jser.ajax({
                    url: defaults.url,
                    dataType: "json",
                    type: "GET",
                    success: function (data) {
                        if (data.status == 1) {
                            aHTML = [];
                            aHTML.push('<tr>');
                            aHTML.push('<td>');
                            aHTML.push('<span>' + val + '</span>');
                            aHTML.push('</td>');
                            aHTML.push('<td align="center">');
                            aHTML.push('<a href="#" class="a_btn_grey">修改</a><a href="#" class="a_btn_grey ml5">删除</a>');
                            aHTML.push('</td>');
                            aHTML.push('</tr>');
                            oPanel.append(aHTML.join(""));
                            hexun.home.alert().init({
                                txt: "增加分类成功!"
                            });
                        }

                    },
                    error: function () { }

                });
            } else {
                hexun.home.alert().init({
                    txt: "请输入分类名称"
                });
            }


            return false;
        });
        // 修改
        oPanel.find("a:even").live("click", function () {
            var self = this,
            oSpan = $(self.parentNode.parentNode).find("span")
            val = oSpan.text();
            hexun.home.alert().init({
                tit: "修改分类名称",
                html: '<p>请输入新的分类名称：<input name="" type="text" class="inp w121" value="' + val + '" /></p>',
                addClass: "w324",
                sure: function (elem) {
                    // 修改分类名称
                    var oInput = this.context.find("input"), val02 = oInput.val();
                    // 检测修改的分类名称是否相同
                    if (val != val02) {
                        // 检测是否重复
                        oPanel.find("span").each(function () {
                            if ($(this).text() == val02) {
                                isRepeat = true;
                            }
                        });
                        if (isRepeat) {
                            hexun.home.alert().init({
                                txt: "已存在该类别!"
                            });
                            isRepeat = false;
                            return false;
                        }
                        // 发送修改的数据
                        Jser.ajax({
                            url: defaults.url,
                            dataType: "json",
                            type: "GET",
                            success: function (data) {
                                if (data.status == 1) {
                                    oSpan.text(val02);
                                }
                            },
                            error: function () { }
                        })
                    }
                }
            });
            return false;
        })
        // 删除
        oPanel.find("a:odd").live("click", function () {
            var self = this;
            hexun.home.confirm().init({
                txt: "删除分类将使改分类下的文章状态变为未分类，确定要删除吗？",
                addClass: "w324",
                sure: function (elem) {
                    //  删除
                    $(self.parentNode.parentNode).remove();
                }
            });
            return false;
        })
    };

    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 博客管理 → 置顶管理
hexun.home.blogStickManage = (function () {

    var defaults = {
        panelID: "hxjy_blog_manage_table",//文章标题列表展示ID
        allID: "hxjy_blog_manage_all",//全选ID
        revocationID: "hxjy_blog_manage_revocation",//撤销
        url: "data/data01.js"// 撤销URL
    };
    var initialize = function () {
        bindEvent();
        hexun.home.page().init();
    };
    function bindEvent() {
        var oAll = $("#" + defaults.allID),
        oRevocation = $("#" + defaults.revocationID),
        oPanel = $("#" + defaults.panelID),
        aCheckbox;//选中项
        //全选
        oAll.click(function () {
            oPanel.find("input").attr("checked", this.checked);
        });
        //撤销
        oRevocation.click(function () {
            aCheckbox = oPanel.find("input:checked");
            if (aCheckbox.length !== 0) {
                hexun.home.confirm().init({
                    txt: "您确定要取消置顶吗", sure: function () {
                        Jser.ajax({
                            url: defaults.url,
                            dataType: "json",
                            type: "GET",
                            success: function (data) {
                                if (data.status == 1) {
                                    aCheckbox.each(function () {
                                        $(this).parent().parent().remove();
                                    });
                                    hexun.home.alert().init({ txt: "取消置顶成功！" });
                                }
                            }
                        });
                    }
                });
            } else {
                hexun.home.alert().init({ txt: "请选择要取消置顶的文章！" });
            }
            return false;
        });
        oPanel.find('.a_btn_grey').click(function () {
            var self = this;
            hexun.home.confirm().init({
                txt: "您确定要取消置顶吗", sure: function () {
                    Jser.ajax({
                        url: defaults.url,
                        dataType: "json",
                        type: "GET",
                        success: function (data) {
                            if (data.status == 1) {
                                $(self).parent().parent().remove();
                                hexun.home.alert().init({ txt: "取消置顶成功！" });
                            }
                        }
                    });
                }
            });

            return false;
        })
    };
    function loadData() {

    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 博客管理 → 文章回收站
hexun.home.blogRecycle = (function () {
    var defaults = {
        allID: "hxjy_blog_manage_all",
        panelID: "hxjy_blog_manage_table",
        recycleID: "hxjy_blog_manage_recycle",
        url: "data/data01.js"
    };
    var initialize = function () {
        bindEvent();
        hexun.home.page().init();
    };
    function bindEvent() {
        var oAll = $("#" + defaults.allID),
            oPanel = $("#" + defaults.panelID),
            oRecycle = $("#" + defaults.recycleID), aCheckbox;
        //全选
        oAll.click(function () {
            oPanel.find("input").attr("checked", this.checked);
        });
        //全部修复
        oRecycle.click(function () {
            aCheckbox = oPanel.find("input:checked");
            if (aCheckbox.length !== 0) {
                hexun.home.confirm().init({
                    txt: "您确定要全部恢复吗", sure: function () {
                        Jser.ajax({
                            url: defaults.url,
                            dataType: "json",
                            type: "GET",
                            success: function (data) {
                                if (data.status == 1) {
                                    aCheckbox.each(function () {
                                        $(this.parentNode.parentNode).remove();
                                    });
                                    hexun.home.alert().init({ txt: "文章恢复成功！" });
                                }
                            }
                        });
                    }
                });
            } else {
                hexun.home.alert().init({ txt: "请选择要恢复的文章！" });
            }
            return false;
        });
        //修复
        oPanel.find(".a_btn_grey").click(function () {
            var self = this;
            hexun.home.confirm().init({
                txt: "您确定要恢复吗", sure: function () {
                    Jser.ajax({
                        url: defaults.url,
                        dataType: "json",
                        type: "GET",
                        success: function (data) {
                            if (data.status == 1) {
                                $(self).parent().parent().remove();
                                hexun.home.alert().init({ txt: "文章恢复成功！" });
                            }
                        }
                    });
                }
            });
            return false;
        })
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 博客管理 → 评论审核
hexun.home.blogCommentAudit = (function () {
    var defaults = {
        auditID: "hxjy_blog_comment_audit",
        panelID: "hxjy_blog_comment_audit_panel",
        saveID: "hxjy_blog_comment_audit_save_Btn",
        setID: "hxjy_blog_comment_audit_set_Btn",
        setPanelID: "hxjy_blog_comment_audit_set_panel",
        listPanelID: "hxjy_blog_comment_audit_list_panel",
        subURL: "data/data01.js"
    };
    var initialize = function () {
        bindEvent();
        hexun.home.page().init();
    };
    function bindEvent() {
        var oAudit = $("#" + defaults.auditID),
            oPanel = $("#" + defaults.panelID),
            aBtn = oAudit.find("a"), index,
            oSet = $("#" + defaults.setID),
            oSetPanel = $("#" + defaults.setPanelID),
            oListPanel = $("#" + defaults.listPanelID),
            oSave = $("#" + defaults.saveID), oCheckbox, url;
        // 按钮
        aBtn.click(function () {
            index = this.index;
            switch (index) {
                case 0://提交
                    submitFn();
                    break;
                case 1: //全部通过
                    loadData(true, "全部通过");
                    break;
                case 2://全部删除
                    loadData(false, "全部删除");
                    break;
                default:

            }
            return false;
        });
        //审核设置
        oSet.click(function () {
            oSetPanel.show();
            oListPanel.hide();
            return false;
        });
        //保存设置
        oSave.click(function () {
            oCheckbox = oSetPanel.find("input:checked");
            url = defaults.subURL + "?type=" + oCheckbox.val();
            Jser.ajax({
                url: url,
                dataType: "json",
                type: "GET",
                success: function (data) {
                    if (data.status == 1) {
                        oSetPanel.hide();
                        oListPanel.show();
                        hexun.home.alert().init({ txt: "保存设置成功！" });
                    }
                },
                error: {}
            });
            return false;
        });
    };
    //提交
    function submitFn() {
        var oPanel = $("#" + defaults.panelID), oParent,
        aCheckbox = oPanel.find("input:checked");
        if (aCheckbox.length !== 0) {
            Jser.ajax({
                url: defaults.subURL,
                dataType: "json",
                type: "GET",
                success: function (data) {
                    if (data.status == 1) {
                        aCheckbox.each(function () {
                            oParent = $(this.parentNode.parentNode.parentNode.parentNode.parentNode);
                            if (oParent.prev().length == 0) { oParent.next().hasClass("gray_line") && oParent.next().remove(); } else { oParent.prev().remove(); }//删除虚线
                            //oParent.animate({ "opacity": 0, "height": 0 }, 500, function () {
                            oParent.remove();
                            //})
                        });
                        hexun.home.alert().init({ txt: "操作成功，已提交！" });
                    }
                },
                error: {}
            });
        } else {
            hexun.home.alert().init({ txt: "请选择要提交的评论！" });
        }
    };
    function loadData(isBool, txt) {
        var oPanel = $("#" + defaults.panelID);
        hexun.home.confirm().init({
            txt: "确定" + txt + "么？",
            sure: function () {
                Jser.ajax({
                    url: defaults.subURL,
                    dataType: "json",
                    type: "GET",
                    success: function (data) {
                        if (data.status == 1) {
                            oPanel.remove();
                            hexun.home.alert().init({ txt: "操作成功！已" + txt + "！" });
                        }
                    },
                    error: {}
                });
            }
        })
        return false;
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 设置中心→基本设置
hexun.home.setupBasic = (function () {
    var defaults = {
        panelID: "hxjy_blog_setup_panel", //基本设置面板ID
        saveID: "hxjy_blog_setup_panel_save",// 基本设置 保存ID
        url: "data/data01.js",// 提交数据URL
	    focusClass:'addfocus'
    };
    var initialize = function () {
        bindEvent();
    };
    function bindEvent() {
        var oPanel = $("#" + defaults.panelID),
            oSave = $("#" + defaults.saveID), val,oParent;
        //分类
        hexun.home.blogClassify().init();

        oPanel.find("input:text").blur(function () {
	        oParent = $(this.parentNode.parentNode);
	        oParent.removeClass(defaults.focusClass)
            val = this.value * 1;
            if (isNaN(val) || val == 0) {
                this.value = 1;
            } else if (val > 100) {
                this.value = 100;
            }
        }).bind('focus',function(){
		        oParent = $(this.parentNode.parentNode);
		        oParent.addClass(defaults.focusClass)
	        })
        //保存
        oSave.click(function () {
            Jser.ajax({
                url: defaults.url,
                dataType: "json",
                type: "GET",
                success: function (data) {
                    if (data.status == 1) {
                        hexun.home.alert().init({ txt: "操作成功，已保存！" });
                    }
                },
                error: {}
            });
            return false;
        });
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 设置中心→选择模板
hexun.home.setupTemplete = (function () {
    var defaults = {
        panelID: "hxjy_blog_templete_panel",//模板面板ID
        selectID: "hxjy_blog_templete_select",// 模板选择ID
        menuID: "hxjy_blog_templete_menu",// 模板菜单ID
        recoverID: "hxjy_setup_recover",// 恢复
        url: "data/data-blogSetupTemplete01.js",//面板展示URL 
        selectURL: "data/data01.js",//选中URL
        recoverURL: "data/data01.js",//恢复URL
        type: 1,//类型：0:和讯or 1:网友
        sort: "pop"//pop:人气 or time:时间
    };
    var initialize = function () {
        bindEvent();
        hexun.home.page().init();
    };
    function bindEvent() {
        var oMenu = $("#" + defaults.menuID),//菜单
            oSelected = $("#" + defaults.selectID),//排序
            oPanel = $("#" + defaults.panelID),//面板
            oRecover = $("#" + defaults.recoverID),//恢复
            aLi = oMenu.find("li"), index;// 选择

        // 模板类型
        aLi.click(function () {
            this.className += " on";
            index = this.index;
            aLi.eq(1 - index).removeClass("on");
            defaults.type = index;
            loadData();
            return false;
        });
        // 排序
        oSelected.change(function () {
            defaults.sort = oSelected.val();
            loadData();
        });
        //选择
        oPanel.find("a.com_btns1:even").live("click", function () {
            var self = this;
            // 选中数据
            if (!/on/.test(this.className)) {
                hexun.home.confirm().init({
                    txt: "确定选择该模板么？",
                    sure: function () {
                        //去掉 上一个选中的 高亮
                        oPanel.find("li.bs_c_tp_areaListItemNow").removeClass("bs_c_tp_areaListItemNow").find("a.on").removeClass("on").text("选择");
                        Jser.ajax({
                            url: defaults.selectURL,//
                            dataType: "json",
                            type: "GET",
                            success: function (data) {
                                if (data.status == 1) {
                                    $(self).parents("li").addClass("bs_c_tp_areaListItemNow");
                                    self.className += " on";
                                    self.innerHTML = "当&nbsp;前";
                                }
                            },
                            error: function () { }
                        });
                    }
                });
            }
            return false;
        });
        //修复
        oRecover.click(function () {
            hexun.home.confirm().init({
                txt: "确定恢复初始化模板么？",
                sure: function () {
                    Jser.ajax({
                        url: defaults.recoverURL,
                        dataType: "json",
                        type: "GET",
                        success: function (data) {

                        },
                        error: function () { }
                    });
                }
            });
            return false;
        })

    };
    function loadData() {
        var oPanel = $("#" + defaults.panelID), // 模板面板
         ret = [], url, type = defaults.type;
        url = defaults.url + "?type=" + type + "&sort=" + defaults.sort;
        Jser.ajax({
            url: url,
            dataType: "json",
            type: "GET",
            success: function (data) {
                if (data.status == 1) {
                    var i = 0, html, len = data.html.length;
                    for (; i < len; i++) {
                        html = data.html[i];
                        if (html.now == 1) {
                            ret.push('<li class="bs_c_tp_areaListItem bs_c_tp_areaListItemNow">');
                        } else {
                            ret.push('<li class="bs_c_tp_areaListItem">');
                        }
                        ret.push('<div class="bs_c_tp_areaListItem-imgbox pr">');
                        ret.push('<div class="bs_c_tp_areaListItem-img">');
                        ret.push('<img src="' + html.img + '">');
                        ret.push('</div>');
                        ret.push('<div class="bs_c_tp_areaListItem-shadow"></div>');
                        ret.push('<div class="bs_c_tp_areaListItem-bd"></div>');
                        ret.push('</div>');
                        ret.push('<div class="s_c_tp_areaListItemBtns pt20 tc">');
                        if (html.now == 1) {
                            ret.push('<a class="com_btns1 on" href="">当&nbsp;前</a>');
                        } else {
                            ret.push('<a class="com_btns1" href="">选&nbsp;择</a>');
                        }
                        ret.push('&nbsp;&nbsp;<a class="com_btns1" target="_blank" href="' + html.preview + '">预&nbsp;览</a>');
                        ret.push('</div>');
                        if (type) {
                            ret.push('<p class="s_c_tp_areaListItemText color_45">');
                            ret.push('共享人：<a href="' + html.portal + '">' + html.name + '</a><br>');
                            ret.push('人　气：' + html.pop + '人');
                            ret.push('</p>');
                        }
                        ret.push('</li>');
                    }
                    oPanel.html(ret.join(""));
                    var page = data.page;
                    hexun.home.page().init({
                        page: page.page,
                        now: page.now,
                        url: page.pageURL
                    });

                }
            },
            error: {}
        });
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 设置中心→自定义模板
hexun.home.setupAutoTemplete = (function () {
    var defaults = {
        panelID: "hxjy_setupAutoArea",//显示面板
        menuID: "hxjy_blog_setupAuto_menu",//自定义菜单
	    focusClassName:'addfocus',
	    setHeightID:'setHeight'
    };
    var initialize = function () {
        bindEvent();
    };
    function bindEvent() {
        var oPanel = $("#" + defaults.panelID),
            oMenu = $("#" + defaults.menuID), aLi = oMenu.find("li"), cacheIndex = 0, cacheLi = aLi.get(0),
            children = oPanel.children(),
	        osetHeight = $('#' + defaults.setHeightID),
	        oParent,
        reg = /\s*on$/;
	    // 设置高度 添加焦点效果
	    osetHeight.focus(function(){
		    oParent = $(this.parentNode.parentNode);
		    oParent.addClass(defaults.focusClassName);
	    }).blur(function(){
			    oParent = $(this.parentNode.parentNode);
			    oParent.removeClass(defaults.focusClassName);
		    });

        //自定义菜单
        aLi.click(function () {
            cacheLi.className = cacheLi.className.replace(reg, '');
            cacheLi = this;
            this.className += " on";
            children.eq(cacheIndex).hide();
            children.eq(this.index).show();
            cacheIndex = this.index;
        });

        //回到默认值
        oPanel.find("a.com_btns2:odd").click(function () {
            var self = this;
            hexun.home.confirm().init({
                txt: "确定要恢复默认效果吗？",
                sure: function () {
                    location.href = self.href;
                }
            });
            return false;
        });
        //<input type="file" class="bs_s_tpfiles">
        // 浏览
        oPanel.find("a.com_btns1").click(function () {
            var ret = [];
            ret.push('<p>上传的文件类型为(JPG/GIF/PNG),大小不能超过200K。</p>');
            ret.push('<div class="clearfix mt20">');
            ret.push('<input type="text" class="bs_s_tpInput1 fl w204">');
            ret.push('<div class="bs_s_tpfile fl pr ml10 pt3">');
            ret.push('<a href="" class="com_btns1">浏览</a>');
            ret.push('<input type="file" class="bs_s_tpfiles">');
            ret.push('</div>');
            ret.push('</div>');
            hexun.home.confirm().init({
                addClass: "w356",
                txt: ret.join(""),
                sure: function () {

                }
            });
            return false;
        });

    };
    function loadData() {

    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 设置中心→自定义CSS
hexun.home.setupAutoCSS = (function () {
    var defaults = {
        panelID: "hxjy_setup_auto_css_panel",
        url: "data/data01.js"
    };
    var initialize = function () {
        bindEvent();
    };
    function bindEvent() {
        var oPanel = $("#" + defaults.panelID);
        //回到默认值
        oPanel.find("a.com_btns2:last").click(function () {
            var self = this;
            hexun.home.confirm().init({
                txt: "确定要恢复默认值吗？",
                sure: function () {
                    location.href = self.href;
                }
            });
            return false;
        });
        //保存
        oPanel.find("a.a_btn").click(function () {
            var self = this;
            hexun.home.confirm().init({
                txt: "确定保存当前样式吗？",
                sure: function () {
                    Jser.ajax({
                        url: defaults.url,
                        dataType: "json",
                        type: "GET",
                        success: function (data) {
                            if (data.status == 1) {
                            }
                        },
                        error: {}
                    });
                }
            });
            return false;
        });
    };
    function loadData() {

    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 设置中心→自定义HTML
hexun.home.setupAutoHTML = (function () {
    var defaults = {
        menuID: "hxjy_setupAutoHtml_menu",//菜单
        panelID: "hxjy_setupAutoHtml_panel",//面板
        flashURL: "data/data01.js",
		focusClass:'addfocus'
    };
    var initialize = function () {
        bindEvent();
    };
    function bindEvent() {
        var oMenu = $("#" + defaults.menuID),
            oPanel = $("#" + defaults.panelID),
            oTextarea = oPanel.find("textarea"),
	        oinput = oPanel.find('.bs_s_htmlinput1'),
            reg = /^http(?:s?):\/\/.+/, $Txt;
	    // 获得焦点
	    oinput.focus(function(){
			oParent = $(this.parentNode.parentNode);
		    oParent.addClass('addfocus');
	    })
	    oinput.blur(function(){
		    oParent = $(this.parentNode.parentNode);
		    oParent.removeClass('addfocus');
	    })
        oMenu.find("a").click(function () {
            switch (this.index) {
                case 0://flash选择
                    loadData();
                    break;
                case 1://flash
                    hexun.home.confirm().init({
                        addClass: "w380",
                        html: '<p>Flash来源</p><div class="bs_s_htmlInput2"><input type="text" value=""></div>',
                        callback: function (elem) {
                            $Txt = $(elem).find("input");
                            $Txt.focus().val("http://");

                        },
                        sure: function () {
                            if (!reg.test($Txt.val())) {
                                hexun.home.alert().init({
                                    txt: "请输入正确的网络地址!"
                                });
                            }
                        }
                    });
                    break;
                case 2://real
                    hexun.home.confirm().init({
                        addClass: "w380",
                        txt: '<p>媒体文件来源</p><div class="bs_s_htmlInput2"><input type="text"></div>',
                        callback: function (elem) {
                            $Txt = $(elem).find("input");
                            $Txt.focus().val("http://");
                        },
                        sure: function () {
                            if (!reg.test($Txt.val())) {
                                hexun.home.alert().init({
                                    txt: "请输入正确的网络地址!"
                                });
                            }
                        }
                    });
                    break;
                case 3://wmv
                    hexun.home.confirm().init({
                        addClass: "w380",
                        html: '<p>媒体文件来源</p><div class="bs_s_htmlInput2"><input type="text"></div>',
                        callback: function (elem) {
                            $Txt = $(elem).find("input");
                            $Txt.focus().val("http://");
                        },
                        sure: function () {
                            if (!reg.test($Txt.val())) {
                                hexun.home.alert().init({
                                    txt: "请输入正确的网络地址!"
                                });
                            }
                        }
                    });
                    break;
                case 4://换行
                    oTextarea.text(oTextarea.text() + "<br/>");
                    break;
                default:

            }

            return false;
        });
    };
    // Flash 选择
    function loadData() {
        var ret = [];
        Jser.ajax({
            url: defaults.flashURL,
            dataType: "json",
            type: "GET",
            success: function (data) {
                if (data.status == 1) {
                    var ret = [], i = 0, j = 0, len = 43, mlen = Math.ceil(len / 21), ilen;
                    //分页 3行每行7个。
                    for (; j < mlen; j++) {
                        if (j === 0) {
                            ret.push('<ul class="bs_s_htmltcList clearfix">');
                        } else {
                            ret.push('<ul class="bs_s_htmltcList clearfix hide">');
                        }
                        ilen = Math.min(len, 21 * (j + 1));
                        for (; i < ilen  ; i++) {
                            ret.push('<li>');
                            ret.push('<a href="#"><img src="images/temp3.png" alt=""></a>');
                            ret.push('<div class="bs_s_htmltcList-name lh20"><a href="#">蜻蜓' + i + '</a></div>');
                            ret.push('<div><a href="#" class="com_btns4">预览</a></div>');
                            ret.push('</li>');
                        }
                        ret.push('</ul>');
                    }
                    ret.push('<div class="selfHtml_page clearfix">');
                    ret.push('<div class="selfHtml_pageBox fl">');
                    ret.push('<div class="selfHtml_pageBoxIn fl">');
                    for (j = 1; j <= mlen; j++) {
                        if (j === 1) {
                            ret.push('<a href="#" class="on">' + j + '</a>');
                        } else {
                            ret.push('<a href="#">' + j + '</a>');
                        }
                    }
                    ret.push('</div>');
                    ret.push('</div>');
                    ret.push('</div>');
                    hexun.home.confirm().init({
                        addClass: "w610",
                        html: ret.join(""),
                        isBtn: false,
                        callback: function (elem) {
                            //点击li 触发事件
                            var $elem = $(elem),
                                aUl = $elem.find("ul"),
                                cacheIndex = 0,
                                aPage = $elem.find("div.selfHtml_page a");
                            $elem.find("li").click(function () {

                                return false;
                            });
                            aPage.click(function () {
                                aPage.eq(cacheIndex).removeClass("on");
                                this.className = "on";
                                aUl.eq(cacheIndex).hide();
                                cacheIndex = this.index
                                aUl.eq(cacheIndex).show();
                                return false;
                            })
                        },
                        sure: function () {

                        }
                    });
                }
            },
            error: {}
        });
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 标签管理→显示设置
hexun.home.labelManageDisplay = (function () {
    var defaults = {
        numID: "hxjy_labelManageDisplay_num",//显示个数ID
        lableListID: "hxjy_labelManageDisplay_label_list",//自定义标签显示
        addID: "hxjy_labelManageDisplay_addlabel",//添加自定义标签
        hasLabelID: "hxjy_blog_labels",//选择已有标签
        hasLabelPanelID: "hxjy_blog_labels_more",//已有标签面板
        hasLabelPromptID: "hxjy_blog_labels_prompt",//选择已有标签→提示
        hasLabelURL: "data/data-blogHasLabel01.js",
        moreClass: "wt_mian-tag_warningmy",
        delURL: "data/data01.js",//删除自定义标签
        AddURL: "data/data01.js", //添加自定义标签
	    focusClassName:'addfocus', // 添加类
		tagInputID:'addTag'
    };
    var initialize = function () {
        bindEvent();
    };
    function bindEvent() {
        var oLableList = $("#" + defaults.lableListID),
            oAdd = $("#" + defaults.addID),
            oHasLabel = $("#" + defaults.hasLabelID),
            oHasLabelPanel = $("#" + defaults.hasLabelPanelID),
            oHasLabelPrompt = $("#" + defaults.hasLabelPromptID),
	        otag = $("#" + defaults.tagInputID),
	        oParent;
	    //  标签 焦点效果
	    otag.focus(function(){
			oParent = $(this.parentNode.parentNode);
		    oParent.addClass(defaults.focusClassName);
	    })
	    otag.blur(function(){
		    oParent = $(this.parentNode.parentNode);
		    oParent.removeClass(defaults.focusClassName);
	    })

        // 验证 显示个数
        hexun.home.blogFocus().init({
            inputID: defaults.numID, focusClass: "control_group_focus", callback: function () {
                var reg = /^\d+$/, val = this.value;
                if (reg.test(val)) {
                    if (val > 20) {
                        val = 20;
                    }
                } else {
                    val = 10;
                }
                this.value = val;
            }
        });
        // 自定义标签显示 hover 效果
        oLableList.find("li").live("mouseover", function () {
            this.className = "tags_text_hover";
        });
        oLableList.find("li").live("mouseout", function () {
            this.className = "";
        });

        // 自定义标签显示 删除
        oLableList.find("a").live("click", function () {
            var self = this;
            hexun.home.confirm().init({
                txt: "确定删除该自定义标签吗？",
                sure: function () {
                    //删除URL
                    Jser.ajax({
                        url: defaults.delURL,
                        dataType: "json",
                        type: "GET",
                        success: function (data) {
                            if (data.status == 1) {
                                $(self.parentNode).remove();
                            }
                        },
                        error: {}
                    });
                }
            });
            return false;
        });

        // 添加自定义标签 添加
        oAdd.click(function () {
            this.val = $(this).prev().val();
            insertVal.call(this);
            return false;
        });
        //选择已有标签：
        var oClose = oHasLabel.find("span").eq(-1), oMore, $aA = oHasLabel.find("a"), len = $aA.length;
        $aA.click(function () {
            if (this.index < len - 1) {
                this.val = this.innerHTML;
                insertVal.call(this)
            } else if (this.index === len - 1) {
                //更多
                oMore = $(this);
                if (oHasLabelPanel.is(":hidden")) {
                    oMore.addClass(defaults.moreClass);
                    //加载已有标签
                    loadData();
                } else {
                    hidePanel();
                }
            }
            return false;

        });

        // 更多面板→标签 点击事件
        oHasLabelPanel.find("a").live("click", function () {
            this.val = this.innerHTML;
            insertVal.call(this);
            return false;
        });
        // 插入标签
        function insertVal() {
            var val = this.val;
            //检测为空状态
            if (val.empty() == "") {
                return false;
            }
            // 检测是否重复
            oLableList.find("li").each(function () {
                if ($.trim(val) == $.trim($(this).text())) {
                    hexun.home.alert().init({
                        txt: ("抱歉，已存在<strong style='color:#990000'>" + val + "</strong>标签")
                    });
                    val = "";
                }
            });
            // 检测是否为空
            if (val.empty() != "") {
                hexun.home.confirm().init({
                    txt: ("确定添加<strong style='color:#990000'>" + val + "</strong>为自定义标签吗？"),
                    sure: function () {
                        //添加URL
                        Jser.ajax({
                            url: defaults.AddURL,
                            dataType: "json",
                            type: "GET",
                            success: function (data) {
                                if (data.status == 1) {
                                    var oLi = document.createElement('li');
                                    oLi.innerHTML = '<a href="#" class="tags_delete_btn"></a>' + val;
                                    oLableList.get(0).appendChild(oLi);
                                    hexun.home.alert().init({
                                        txt: "添加标签成功!"
                                    });
                                }
                            },
                            error: {}
                        });
                    }
                });
            }
        }
        // 关闭更多面板→按钮（绑定事件）
        oClose.click(hidePanel);
        // 关闭 更多面板
        function hidePanel() {
            oClose.hide();
            oMore.removeClass(defaults.moreClass);
            oHasLabelPanel.hide();
            oHasLabelPrompt.show();
        }

    };
    function loadData() {
        var oPanel = $("#" + defaults.hasLabelPanelID),
         oClose = $("#" + defaults.hasLabelID).find("span").eq(-1),
         oHasLabelPrompt = $("#" + defaults.hasLabelPromptID);
        Jser.ajax({
            url: defaults.hasLabelURL,
            dataType: "json",
            type: "GET",
            success: function (data) {
                if (data.status == 1) {
                    var i = 0, label = data.label, len = label.length, ret = [];
                    for (; i < len; i++) {
                        ret.push('<a href="#">' + label[i] + '</a> ');
                    }
                    oPanel.html(ret.join("")).show();
                    oClose.show();
                    oHasLabelPrompt.hide();
                }
            },
            error: function () {

            }
        });
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 标签管理→修改标签
hexun.home.labelManageMod = (function () {
    var defaults = {
        addID: "hxjy_labelManageMod_addlabel", //添加
        panelID: "hxjy_labelManageMod_panel",// 面板
        AddURL: "data/data01.js",//添加自定义标签
        sureURL: "data/data01.js", //确定修改博客标签
        delURL: "data/data01.js", //删除博客标签
	    focusClassName:'addfocus', // 添加类
	    tagInputID:'addTag'
    };
    var initialize = function () {
        bindEvent();
    };
    function bindEvent() {
        var oAdd = $("#" + defaults.addID),
            oPanel = $("#" + defaults.panelID),
	        otag = $("#" + defaults.tagInputID),
	        oParent;
	    //  标签 焦点效果
	    otag.focus(function(){
		    oParent = $(this.parentNode.parentNode);
		    oParent.addClass(defaults.focusClassName);
	    })
	    otag.blur(function(){
		    oParent = $(this.parentNode.parentNode);
		    oParent.removeClass(defaults.focusClassName);
	    })
        //增加标签
        oAdd.click(function () {
            var val = oAdd.prev().val(), ret = [];
            //检测为空状态
            if (val.empty() == "") {
                return false;
            }
            // 检测重复状态
            oPanel.find("input").each(function () {
                if ($.trim(val) == $.trim(this.value)) {
                    hexun.home.alert().init({
                        txt: ("抱歉，已存在 <strong style='color:#990000'>" + val + "</strong> 标签")
                    });
                    val = "";
                }
            });
            if (val.empty() != "") {
                hexun.home.confirm().init({
                    txt: ("确定添加 <strong style='color:#990000'>" + val + "</strong> 为自定义标签吗？"),
                    sure: function () {
                        //添加URL
                        Jser.ajax({
                            url: defaults.AddURL,
                            dataType: "json",
                            type: "GET",
                            success: function (data) {
                                if (data.status == 1) {
                                    ret.push('<tr>');
                                    ret.push('<td>');
                                    ret.push('<input name="" type="text" value="' + val + '" disabled=""></td>');
                                    ret.push('<td align="center">0</td>');
                                    ret.push('<td align="center">');
                                    ret.push('<a href="#" class="a_btn_grey">修改</a>');
                                    ret.push('<a href="#" class="a_btn_grey">删除</a>');
                                    ret.push('</td>');
                                    ret.push('</tr>');
                                    oPanel.append(ret.join(""));
                                    hexun.home.alert().init({
                                        txt: "添加标签成功!"
                                    });
                                }
                            },
                            error: {}
                        });
                    }
                });
            }
            return false;
        });
        //修改/确定
        oPanel.find("a:even").live("click", function () {
            var oTxt = $(this.parentNode.parentNode).find("input");
            //修改
            if (!oTxt.hasClass("input_focus")) {
                this.innerHTML = "确定";
                oTxt.removeAttr("disabled");
                oTxt.addClass("input_focus").focus().val(oTxt.val());
                this.className = "a_btn_blue";
            } else {
                // 确定
                oTxt.removeClass("input_focus");
                oTxt.attr("disabled", "disabled");
                this.innerHTML = "修改";
                this.className = "a_btn_grey";
                Jser.ajax({
                    url: defaults.sureURL,
                    dataType: "json",
                    type: "GET",
                    success: function (data) {
                        if (data.status == 1) {
                            hexun.home.alert().init({
                                txt: "修改标签成功！"
                            });
                        }
                    },
                    error: {}
                });
            }
            return false;
        });
        //删除
        oPanel.find("a:odd").live("click", function () {
            var self = this;
            hexun.home.confirm().init({
                txt: "确定要删除该标签吗？",
                sure: function () {
                    Jser.ajax({
                        url: defaults.delURL,
                        dataType: "json",
                        type: "GET",
                        success: function (data) {
                            if (data.status == 1) {
                                $(self.parentNode.parentNode).remove();
                            }
                        },
                        error: {}
                    });
                }
            });
            return false;
        });
    };
    function loadData() {
        Jser.ajax({
            url: defaults.url,
            dataType: "json",
            type: "GET",
            success: function (data) {
                if (data.status == 1) {

                }
            },
            error: {}
        });
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});










//include jquery-1.7.js
//include hexun.home.common.js
/**
* @class 和讯家园 和讯相册
* @singleton
* @createTime 2013-1-11
* @updateTime 
* @note 
* @version 1.0
*/

// 和讯相册→相册预览
hexun.home.albumPreview = (function () {
    var defaults = {
        panelID: "hxjy_scrollBar",
        manualID: "hxjy_scrollBar_manual"
    };
    var initialize = function () {
        bindEvent();
        //回到顶部
        hexun.home.toTop().init();
    };
    function bindEvent() {
        //滚动分页
        hexun.home.scrollBars().init({
            url: "data/data-albumPreview01.js",
            fHeight: 30,
            panelID: defaults.panelID,
            manualID: defaults.manualID,
            doDataHtml: doDataHtml
        });
    };
    //拼接HTML
    function doDataHtml(data) {
        var oPanel = $("#" + defaults.panelID), ret = [],
        result;
        for (var i = 0, len = data.result.length; i < len; i++) {
            result = data.result[i];
            ret.push('<li>');
            ret.push('<a href="' + result[0] + '">');
            ret.push('<img src="' + result[1] + '" alt="' + result[2] + '"/>');
            ret.push('</a>');
            ret.push('<p>');
            ret.push('<a href="' + result[0] + '">' + result[2] + '</a>');
            ret.push('</p>');
            ret.push('</li>');
        }
        oPanel.append(ret.join(""));
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 和讯相册→图片展示
hexun.home.albumView = (function () {
    var defaults = {
        commentAreaID: "hxjy_album_commentArea",//评论框
        commentBtnID: "hxjy_album_commentBtn",//评论按钮
        commentListID: "hxjy_album_commList",//评论列表
        smileyID: "hxjy_album_Smiley", //插入表情
        smileyPanelID: "hxjy_album_SmileyPanel", //表情面板
        pageID: "hxjy_page",//分页ID
        commentURL: "data/data01.js",//评论URL
        commentPageURL: "data/data01.js"//评论分页URL
    };
    var initialize = function () {
        bindEvent();
        //分页
        hexun.home.page().init({ state: "ajax", page: $("#" + defaults.pageID).find("ul a").length, now: 1, callback: loadData });
    };
    function bindEvent() {
        //图片滑动
        var slide = new Slide(),
            oCommentArea = $("#" + defaults.commentAreaID),
            oCommentBtn = $("#" + defaults.commentBtnID),
            oCommentList = $("#" + defaults.commentListID),
            oSmiley = $("#" + defaults.smileyID),
            oPanel = $("#" + defaults.smileyPanelID);
        //评论文本输入框效果
        oCommentArea.prompt(oCommentArea.prev(), "areaBox_focus").TextAreaExpander(50, 100, function (h) {
            this.parentNode.style.height = h + 10 + "px";
        });
        //评论按钮
        oCommentBtn.click(function () {
            var val = oCommentArea.val();
            if (val.empty() === "") { return false; }
            Jser.ajax({
                url: defaults.commentURL,
                dataType: "json",
                type: "GET", //后端同学改为POST方式
                success: function (data) {
                    if (data.status == 1) {
                        var ret = [];
                        ret.push('<li class="clearfix">');
                        ret.push('<div class="albumCon-cmI fl">');
                        ret.push('<a href="#"><img src="images/temp6.png" alt=""></a>');
                        ret.push('</div>');
                        ret.push('<div class="albumCon-cmText fl lh24">');
                        ret.push('<a href="#">至尊宝</a>发表了评论：<a class="stda2" href="#">你好你好你好</a>');
                        ret.push('<p>' + val + '<span>（1秒钟前）</span></p>');
                        ret.push('</div>');
                        ret.push('<div class="albumCon-cmTime fr">');
                        ret.push('<span class="color_b9">9月14日 14:20</span>');
                        ret.push('<br />');
                        ret.push('<a href="javascript:void(0);" class="album_reply">回复</a>');
                        ret.push('</div>');
                        ret.push('</li>');
                        oCommentList.prepend(ret.join(""));
                    }
                    oCommentArea.val("");
                },
                error: {}
            });
        });
        //表情
        oSmiley.click(function () {
            if (oPanel.is(':hidden')) {
                oPanel.show();
            } else {
                oPanel.hide();
            }
            return false;
        });
        // 单个表情
        var reg = /\[.+\]/
        oPanel.find("a").click(function () {
            oCommentArea.val(oCommentArea.val() + this.getAttribute("title").match(reg)[0]).change();
            oPanel.hide();
        });
        //回复 (hover效果)
        oCommentList.find("li").live({ mouseenter: function () { $(this).find("a.album_reply").show(); }, mouseleave: function () { $(this).find("a.album_reply").hide(); } });
        //回复 点击事件
        oCommentList.find("a.album_reply").live("click", function () {
            oCommentArea.focus().val("回复@aa:").change();
            return false;
        });

    };
    //分页加载数据
    function loadData(index) {
        var oCommentList = $("#" + defaults.commentListID);
        Jser.ajax({
            url: defaults.commentPageURL + "?pageType=" + index,
            dataType: "json",
            type: "GET",
            success: function (data) {
                if (data.status == 1) {
                    var ret = [], i = 0, oPanel = $("#" + defaults.panelID);
                    for (; i < 1; i++) {
                        ret.push('<li class="clearfix">');
                        ret.push('<div class="albumCon-cmI fl">');
                        ret.push('<a href="#"><img src="images/temp6.png" alt=""></a>');
                        ret.push('</div>');
                        ret.push('<div class="albumCon-cmText fl lh24">');
                        ret.push('<a href="#">至尊宝</a>发表了评论：<a class="stda2" href="#">你好你好你好</a>');
                        ret.push('<p>测试了<span>（1秒钟前）</span></p>');
                        ret.push('</div>');
                        ret.push('<div class="albumCon-cmTime fr">');
                        ret.push('<span class="color_b9">9月14日 14:20</span>');
                        ret.push('<br />');
                        ret.push('<a href="javascript:void(0);" class="album_reply">回复</a>');
                        ret.push('</div>');
                        ret.push('</li>');
                    }
                    oCommentList.html(ret.join(""));
                    hexun.home.page().init({ state: "ajax", page: data.page || 5, now: data.now || 2, callback: loadData });
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

// 和讯相册→相册管理
hexun.home.albumManage = (function () {
    var defaults = {
        nameID: "hxjy_album_name",
        describeID: "hxjy_album_describe",
        panelID: "hxjy_album_panel",
        allID: "hxjy_album_all",
        delectID: "hxjy_album_delect",
        pageID: "hxjy_page",
        delURL: "data/data01.js",
        url: "data/data-albumManage.js"
    };
    var initialize = function () {
        bindEvent();
    };
    function bindEvent() {
        var oName = $("#" + defaults.nameID),
            oDescribe = $("#" + defaults.describeID),
            oPanel = $("#" + defaults.panelID),
            oAll = $("#" + defaults.allID),
            oDelect = $("#" + defaults.delectID), aCheckbox;
        //专辑名称：
        oName.prompt(oName.prev(), "inputBox_focus");
        //专题描述：
        oDescribe.prompt(oDescribe.prev(), "areaBox_focus").TextAreaExpander(75, 1000, function (h) {
            this.parentNode.style.height = h + 10 + "px";
        });
        //面板特效
        //请输入相册描述
        oPanel.find("textarea").live("focus", function () {
            if (/请输入相册描述/.test(this.value)) {
                this.value = "";
            };
            $(this.parentNode.parentNode).addClass("inputFocus2");
        }).live("blur", function () {
            if (this.value.empty() == "") {
                this.value = " 请输入相册描述";
            }
            $(this.parentNode.parentNode).removeClass("inputFocus2");

        }).each(function () { $(this).TextAreaExpander(40, 80); });
        // 请输入标签
        oPanel.find("input[type='text']").live("focus", function () {
            if (/请输入标签/.test(this.value)) {
                this.value = "";
            };
            $(this.parentNode.parentNode.parentNode).addClass("inputFocus1");
        }).live("blur", function () {
            if (this.value.empty() == "") {
                this.value = "请输入标签，多个标签用空格分隔";
            }
            $(this.parentNode.parentNode.parentNode).removeClass("inputFocus1");
        });
        // 全选
        oAll.click(function () {
            oPanel.find("input[type='checkbox']").attr("checked", this.checked);
        });
        // 删除
        oDelect.click(function () {
            aCheckbox = oPanel.find("input:checked");
            if (aCheckbox.length !== 0) {
                hexun.home.confirm().init({
                    txt: "确定要删除选中照片吗？", sure: function () {
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
                hexun.home.alert().init({ txt: "请选择要删除的照片！" });
            }
            return false;
        });
        // 分页        
        hexun.home.page().init({ state: "ajax", page: $("#" + defaults.pageID).find("ul a").length, now: 1, callback: loadData });
    };
    //显示数据
    function loadData(index) {
        Jser.ajax({
            url: defaults.url + "?pageType=" + index,
            dataType: "json",
            type: "GET",
            success: function (data) {
                if (data.status == 1) {
                    var ret = [], i = 0, img = data.img, len = img.length, oPanel = $("#" + defaults.panelID);
                    for (; i < len; i++) {
                        ret.push('<div class="albumsMagDesArea fl pb50 mr30">');
                        ret.push('<label class="fl mt30 mr10">')
                        ret.push('<input type="checkbox"></label>')
                        ret.push('<span class="fl">')
                        ret.push('<img src="' + img[i] + '" alt="" />')
                        ret.push('</span>');
                        ret.push('<div class="fr">')
                        ret.push('<textarea class="albumsMag-textarea1" maxlength="1000">&nbsp;请输入相册描述</textarea>')
                        ret.push('<div class="pt8">')
                        ret.push('<label class="albumsMag-label2">标签：</label><input type="text" class="albumsMag-input2" value="请输入标签，多个标签用空格分隔" maxlength="100" />')
                        ret.push('</div>')
                        ret.push('</div>')
                        ret.push('</div>')
                    }
                    oPanel.html(ret.join(""));

                    hexun.home.page().init({ state: "ajax", page: data.page, now: data.now, callback: loadData });
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

// 和讯相册→批量上传
hexun.home.albumUpFile = (function () {
    // 参数
    var defaults = {
        panelID: "hxjy_album_panel",//上传 专辑面板
        nameID: "hxjy_album_name",//专辑名称
        briefID: "hxjy_album_brief",//专辑简介
        labelID: "hxjy_album_label",//添加标签
        oldNameID: "hxjy_album_name_old", //现有专辑名称
        oldLabelID: "hxjy_album_label02",
        tabID: "hxjy_album_tab"// 上传表单 面板

    };
    // 初始化
    var initialize = function () {
        bindEvent();
    };
    //绑定函数
    function bindEvent() {
        var oPanel = $("#" + defaults.panelID),
            oName = $("#" + defaults.nameID),
            oBrief = $("#" + defaults.briefID),
            oLabel = $("#" + defaults.labelID),
            oOldName = $("#" + defaults.oldNameID),
            oOldLabel = $("#" + defaults.oldLabelID);
        // 上传到新专辑、上传到现有专辑
        oPanel.find("input:radio").click(function () {
            if (this.index == 0) {
                oPanel.removeClass("albumup-choice1").addClass("albumup-choice");
            } else {
                oPanel.removeClass("albumup-choice").addClass("albumup-choice1");
            }
        });
        // 新专辑名称：
        oName.prompt(oName.prev(), "inputBox_focus");
        // 新专辑简介
        oBrief.prompt(oBrief.prev(), "areaBox_focus").TextAreaExpander(74, 100, function (n) {
            this.parentNode.style.height = n + 8 + "px";
        });
        // 新添加标签
        oLabel.prompt(oLabel.prev(), "inputBox_focus");
        // 新已有标签
        hexun.home.blogHasLabel().init({
            hasLabel: "hxjy_blog_labels",
            inputID: "hxjy_album_label",
            moreClass: "wt_mian-tag_warningmy",
            panelID: "hxjy_blog_labels_more"
        });
        // 旧
        oOldName.prompt(oOldName.prev(), "inputBox_focus");
        // 旧添加标签
        oOldLabel.prompt(oOldLabel.prev(), "inputBox_focus");
        // 新已有标签
        hexun.home.blogHasLabel().init({
            hasLabel: "hxjy_blog_labels02",
            inputID: "hxjy_album_label02",
            moreClass: "wt_mian-tag_warningmy",
            panelID: "hxjy_blog_labels_more02"
        });

    };
    // 加载数据
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



// 滑动图片
Class("Slide", null, {
    Slide: function (options) {
        $.extend(this.options, options || {});
        this.init();
    },
    options: {
        soliderID: "hxjy_smallPicListBox",
        smallPicID: "hxjy_smallPicList",
        smallPrevID: "hxjy_btnSmallBoxLeft",
        smallNextID: "hxjy_btnSmallBoxRight",
        scrollBarID: "hxjy_scrollBar",
        barID: "hxjy_ScroLine"

    },
    iSmallIndex: 0,//缩略图下标
    ibars2: 0,
    iRatio: 0,
    startX: 0,
    startoDivLeft: 0,
    amount: 5,//显示区域内缩略图可显示图片个数
    SmallPicWidth: 100,
    timer: null,//缩略图计时器
    init: function () {
        var options = this.options,
        //缩略图 
        oSolider = $("#" + options.soliderID),
        oSmallPic = $("#" + options.smallPicID),
        aBtn = oSmallPic.find("li"), count,
        oScrollBar = $("#" + options.scrollBarID),
        oBar = $("#" + options.barID);
        this.SmallPicWidth = aBtn[0].offsetWidth;
        // 计算缩略图总长度
        count = this.SmallPicWidth * aBtn.length;
        // 设置缩略图长度
        oSmallPic.width(count);
        // 计算滚动差值
        this.ibars2 = oScrollBar.width() - oBar.width();
        // 计算比率
        this.iRatio = this.ibars2 / (count - oSolider.width());
        this.bindEvent();
    },
    bindEvent: function () {
        var Me = this, options = this.options,
         //缩略图 
        oSmallPic = $("#" + options.smallPicID),
        oUl = oSmallPic[0],
        // 缩略图 切换
        oSmallPrev = $("#" + options.smallPrevID),
        oSmallNext = $("#" + options.smallNextID),
        // 滚动条
        oScrollBar = $("#" + options.scrollBar),
        oBar = $("#" + options.barID),
        aBtn = oSmallPic.find("li"),
        length = aBtn.length;
        // 获取链接 图标下标
        var _index = location.href.match(/(\d+).html/);
        if ($.isArray(_index)) {
            gotoSmall(_index[1] - 1);
        }
        //小图 上一张
        oSmallPrev.click(function () {
            gotoSmall(Me.iSmallIndex - 1);
            return false;
        });
        //小图 下一张
        oSmallNext.click(function () {
            gotoSmall(Me.iSmallIndex + 1);
            return false;
        });
        //滚动条
        oBar.mousedown(function (e) {
            var e = e || window.event,
            self = this;
            Me.startX = e.clientX;
            Me.startoDivLeft = self.offsetLeft;
            if (self.setCapture) { //IE下设置鼠标捕获
                self.onmousemove = doDarg;
                self.onmouseup = stopDarg;
                self.setCapture();
            } else { //事件监听
                document.addEventListener("mousemove", doDarg, true);
                document.addEventListener("mouseup", stopDarg, true);
            }
            function doDarg(e) {
                var e = e || window.event;
                var l = e.clientX - Me.startX + Me.startoDivLeft;
                if (l <= 5)  /* 防止超出滚动区域，距离为5时默认为0，吸引效果 */ {
                    l = 0;
                }
                else if (l >= Me.ibars2 - 5) {
                    l = Me.ibars2;
                }
                if (Me.timer) {
                    clearInterval(Me.timer);
                    Me.timer = null;
                }
                oUl.style.left = -Math.ceil(l / Me.iRatio) + "px";

                self.style.left = l + "px";
            };
            function stopDarg() {
                if (self.releaseCapture) {
                    self.onmousemove = doDarg;
                    self.onmouseup = stopDarg;
                    self.releaseCapture();  //取消事件捕获
                }
                else {//取消事件监听
                    document.removeEventListener("mousemove", doDarg, true);
                    document.removeEventListener("mouseup", stopDarg, true);
                }
                self.onmousemove = null;
                self.onmouseup = null;
            };
        });
        // 计算缩略图滚动位置
        function gotoSmall(index) {
            if (index >= 0 && index < length) {
                aBtn.each(function () {
                    if (this.index == index) {
                        this.className = "selected";
                    } else {
                        this.className = "";
                    }
                });
                Me.iSmallIndex = index;
            }
            if (index < 0) {
                index = 0;
            } else if (index > length - Me.amount) {
                index = length - Me.amount;
            }
            startMove(-index * Me.SmallPicWidth);
        }
        function startMove(iTarget) {
            if (Me.timer) {
                clearInterval(Me.timer);
                Me.timer = null;
            }
            Me.timer = setInterval(function () {
                doMove02(iTarget);
            }, 30);
        };
        var iSpeed;
        function doMove02(iTarget) {
            //速度先快后慢
            iSpeed = (iTarget - oUl.offsetLeft) / 5;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            if (oUl.offsetLeft == iTarget) {
                if (Me.timer) {
                    clearInterval(Me.timer);
                    Me.timer = null;
                }
            } else {
                //缩略图运动
                oUl.style.left = oUl.offsetLeft + iSpeed + 'px';
                oBar[0].style.left = -Math.floor(oUl.offsetLeft * Me.iRatio) + "px";
            }
        };
    }
}, {});

hexun.home.moban = (function () {

    var defaults = {

    };
    var initialize = function () {
        bindEvent();
    };
    function bindEvent() {

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











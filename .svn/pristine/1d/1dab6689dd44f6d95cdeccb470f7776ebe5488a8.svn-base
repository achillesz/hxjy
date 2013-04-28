//include jquery-1.7.js
//include hexun.home.common.js
/**
* @class 和讯家园 其他(他的主页)
* @singleton
* @createTime 2013-1-24
* @updateTime 
* @note 
* @version 1.0
*/

// 个人门户→我/他的主页
hexun.home.homepage = (function () {

    var defaults = {
        state: "me",
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
        var oPanel = $("#" + defaults.panelID), ret = [], state = defaults.state;
        if (state === "me") {
            for (var i = 0, len = 1; i < len; i++) {
	            ret.push('<div class="feed-box feed-box2">');
                ret.push('<div class="feed-wrap clearfix">');
                ret.push('<div class="fl">');
                ret.push(' <a href="#">');
                ret.push('  <img src="images/temp15.png" alt=""></a>');
                ret.push('</div>');
                ret.push('<div class="fr ml15 w606">');
                ret.push(' <div class="feed-hd">');
                ret.push(' <span class="feed-time">3分钟前</span> <span class="feed-state">');
                ret.push('  <img src="images/blank.gif" class="feed-pic-icon" />上传了照片</span>');
                ret.push(' </div>');
                ret.push(' <h4 class="feed-title fh"><a href="#">那些年，我?一起追的股票</a></h4>');
                ret.push(' <div class="feed-img-box">');
                ret.push('  <a href="#">');
                ret.push('  <img src="images/temp5.png" /></a> <a href="#">');
                ret.push('  <img src="images/temp5.png" /></a> <a href="#">');
                ret.push('   <img src="images/temp5.png" /></a> <a href="#">');
                ret.push('     <img src="images/temp5.png" /></a>');
                ret.push(' </div>');
                ret.push(' <div class="clearfix mt-4 pb10">');
                ret.push('   <div class="fr lh20"><a href="#" class="a_9c">全部照片(18)</a></div>');
                ret.push(' </div>');
                ret.push(' <p class="feed-text">缩量十字星，令市场悬疑再起！ - 缩量十字星，令市场悬疑再起！ 当萎缩低迷的成交量、"阴包阳"的K线组合型态、以及短期5日线的失守等等诸多弱市特征汇集于昨日的市场盘面走势时...缩量十字星，令市场悬疑再起！ - 缩量十字星，令市场悬疑再起！ 当萎缩低迷的成交量、"阴包阳"的K线组合型态、以及短期5日线的失守等等诸多弱市特征汇集于昨日的市场盘面走势时...- 缩量十字星，令市场悬疑再起！ 当萎缩低迷的成交量"阴包阳"...</p>');
                ret.push(' <div class="fr lh20"><a href="#" class="a_9c">继续阅读</a></div>');
                ret.push('  <div class="clear"></div>');
                ret.push('  <div class="feed-btm"><a href="#" class="a_9c fr">评论(100)</a><span><strong>标签：</strong><a href="#" class="a_70">财经</a>、<a href="#" class="a_70">股票</a></span></div>     ');
                ret.push(' </div>');
                ret.push('</div>');
	            ret.push('</div>');
            }
        } else if (state === "ta") {
            for (var i = 0, len = 1; i < len; i++) {
                ret.push('<div class="feed-box">');
                ret.push('<div class="feed-wrap clearfix">');
                ret.push(' <div class="feed-hd">');
                ret.push('<span class="feed-time">3分钟前</span> <span class="feed-state">');
                ret.push('<img src="images/blank.gif" class="feed-pic-icon" />发表了文章</span>');
                ret.push('</div>');
                ret.push(' <h4 class="feed-title fh"><a href="#">那些年，我?一起追的股票</a></h4>');
                ret.push('<p class="feed-text">缩量十字星，令市场悬疑再起！ - 缩量十字星，令市场悬疑再起！ 当萎缩低迷的成交量、"阴包阳"的K线组合型态、以及短期5日线的失守等等诸多弱市特征汇集于昨日的市场盘面走势时...缩量十字星，令市场悬疑再起！ - 缩量十字星，令市场悬疑再起！ 当萎缩低迷的成交量、"阴包阳"的K线组合型态、以及短期5日线的失守等等诸多弱市特征汇集于昨日的市场盘面走势时...- 缩量十字星，令市场悬疑再起！ 当萎缩低迷的成交量"阴包阳"...</p>');
                ret.push('<div class="fr lh20"><a href="#" class="a_9c">继续阅读</a></div>');
                ret.push('<div class="clear"></div>');
                ret.push('<div class="feed-btm"><a href="#" class="a_9c fr">评论(100)</a><span><strong>标签：</strong><a href="#" class="a_70">财经</a>、<a href="#" class="a_70">股票</a></span></div>');
                ret.push('</div>');
                ret.push('</div>');
            }
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

// 个人门户→关注/粉丝
hexun.home.AttentionFans = (function () {

    var defaults = {
        panelID: "hxjy_follow_panel",//粉丝面板
        url: "data/data01.js",
        state: "attention" // 状态： 1.attention 关注 2.fans 粉丝  (默认为关注)
    };
    var initialize = function () {
        bindEvent();
        //分页
        hexun.home.page().init();
    };
    function bindEvent() {
        var oPanel = $("#" + defaults.panelID), state = defaults.state, oNum = $("#hxjy_fansNum");
        //关注列表hover 效果,      
        oPanel.find("dl.fans_dl").hover(function () {
            $(this).find('.cancel_follow').css("display", "inline-block")
        }, function () {
            $(this).find('.cancel_follow').hide();
        });
        //求关注
        oPanel.find(".beg_follow").live("click", function () {
            Jser.ajax({
                url: defaults.url,
                dataType: "json",
                type: "GET",
                success: function (data) {
                    if (data.status == 1) {
                        hexun.home.alert().init({ txt: "求关注成功！<br/>您的请求将以私信的方式给对方发出。请耐心等待对方确认。" })
                    }
                },
                error: {}
            });
            return false;
        });
        //加关注
        oPanel.find(".add_follow").live("click", function () {
            var oParent = $(this.parentNode), name = this.getAttribute("title").replace("加关注:", "");
            Jser.ajax({
                url: defaults.url,
                dataType: "json",
                type: "GET",
                success: function (data) {
                    if (data.status == 1) {
                        oParent.html('<span class="e-follow"><em></em>相互关注</span> <a href="#" class="cancel_follow" title="取消关注:' + name + '" style="display: none;"><em></em>取消关注</a>');
                        if (state !== "search") oNum.text(oNum.text() * 1 + 1);
                        hexun.home.alert().init({ txt: "关注成功！" });
                    }
                },
                error: {}
            });
            return false;
        });

        //取消关注
        oPanel.find(".cancel_follow").live("click", function () {
            var self = this, oParent, name = this.getAttribute("title").replace("取消关注:", "");
            hexun.home.confirm().init({
                txt: ("确定不再关注<span style='color:#990000'>" + name + "<span>？"),
                sure: function () {
                    Jser.ajax({
                        url: defaults.url,
                        dataType: "json",
                        type: "GET",
                        success: function (data) {
                            if (data.status == 1) {
                                if (state === "attention" || state === "search") {
                                    oParent = $(self.parentNode.parentNode.parentNode);
                                    oParent.animate({
                                        "height": "0px",
                                        "opacity": 0
                                    }, 500, function () {
                                        oParent.remove();
                                        if (state !== "search") oNum.text(oNum.text() - 1);
                                    });
                                } else if (state === "fans") {
                                    oParent = $(self.parentNode);
                                    oParent.html('<a href="#" class="add_follow" title="加关注:' + name + '"><em class="add"></em>加关注</a>');
                                    if (state !== "search") oNum.text(oNum.text() - 1);
                                }
                                hexun.home.alert().init({ txt: "取消关注成功！" });
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

// 应用平台→已安装应用
hexun.home.hasWebApp = (function () {

    var defaults = {
        panelID: "hxjy_webApp_panel",
        url: 'data/data-appDel.js'
    };
    var initialize = function () {
        bindEvent();
    };
    function bindEvent() {
        var oPanel = $("#" + defaults.panelID),
	        oNone1,
	        oNone2;
        oPanel.find("li").hover(function () {
            this.className += " appListsItemOn";
        }, function () {
            this.className = this.className.replace("appListsItemOn", '');
        });
        oPanel.find(".appUse").live('click', function () {
            var oParent = $(this.parentNode);
            Jser.ajax({
                url: defaults.url,
                dataType: "json",
                type: "GET",
                success: function (data) {
                    if (data.status == 1) {
                        hexun.home.alert().init({
                            txt: '您已成功使用该模块！',
                            sure: function () {
                                oParent.html('<span class="com_btns77">正在使用</span><a href="#" class="com_btns8 appDel">卸&nbsp;载</a>')
                            }
                        });
                    }
                },
                error: {}
            });
            return false;
        })
        oPanel.find(".appDel").live('click', function () {
            var oParent = $(this.parentNode);
            hexun.home.alert().init({
                txt: '确定要卸载该模块么？',
                state: 'confirm',
                sure: function () {
                    Jser.ajax({
                        url: defaults.url,
                        dataType: "json",
                        type: "GET",
                        success: function (data) {
                            if (data.status == 1) {
                                oParent.html('<a class="com_btns7 appUse" href="#">立即使用</a>');
                                hexun.home.alert().init({
                                    txt: '卸载成功！'
                                });
                            }
                        },
                        error: {}
                    });
                }
            });
            return false;
        });
        oPanel.find(".appUp").click(function () {
            var self = this;
            Jser.ajax({
                url: defaults.url,
                dataType: "json",
                type: "GET",
                success: function (data) {
                    if (data.status == 1) {
                        oNone1.style.display = '';
                        oNone2.style.display = '';
                        var oLi = $(self).parents('li');
                        oLi.prev().before(oLi);
                        resetFN();
                        oLi.removeClass("appListsItemOn");
                    }
                },
                error: {}
            });
            return false;
        });
        oPanel.find(".appDown").click(function () {
            var self = this;
            Jser.ajax({
                url: defaults.url,
                dataType: "json",
                type: "GET",
                success: function (data) {
                    if (data.status == 1) {
                        oNone1.style.display = 'block';
                        oNone2.style.display = 'block';
                        var oLi = $(self).parents('li');
                        oLi.next().after(oLi);
                        resetFN();
                        oLi.removeClass("appListsItemOn");
                    }

                },
                error: {}
            });
            return false;
        });
        function resetFN() {
            oNone1 = oPanel.find('li:first .appUp')[0];
            oNone2 = oPanel.find('li:last .appDown')[0];
            oNone1.style.display = "none";
            oNone2.style.display = "none";
        }
        resetFN();
    };

    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});











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











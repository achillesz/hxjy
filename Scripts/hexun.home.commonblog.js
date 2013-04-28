/// <reference path="jquery-1.7.1-vsdoc.js" />
/**
* @class 和讯家园
* @singleton
* @createTime 2012-12-20
* @updateTime
* @note
* @version 1.0
*/
var hexun = window.hexun || {};
hexun.home = hexun.home || {};

/**
* @class 创建类
* @singleton
* @createTime 2012-08-28
* @updateTime
* @note
* @version 1.0
*/

/**
扩展javascript String 对像
*/
jQuery.extend(String.prototype,
    {
        /**
        格式化字符串
        <pre>
        <code>
        var str = '今天在日本{0}发生了{1}级大{2},中{0}北京都可以感觉到{2}';
        var newStr = str.format('国', 10, '地震');
        //返回: newStr='今天在日本国发生了10级大地震,中国北京都可以感觉到地震';
        </code>
        </pre>
        * @param {String} argu1 (Optional) 可选参数 要替换的字符串
        * @param {String} argu2.. (Optional) 可选参数 要替换的字符串
        * @return {String} 返回格式化后的字符串
        */
        format: function () {
            var i = 0, val = this, len = arguments.length;
            for (; i < len; i++)
                val = val.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
            return val;
        },
        /**
        获取字符串长度,大于一个字节的算两个长度
        * @return {Number}
        */
        byteLength: function () {
            var j = 0;
            for (var i = 0, len = this.length; i < len; i++) {
                if (this.charCodeAt(i) > 255)
                    j += 2;
                else
                    j++;
            }
            return j;
        },
        /**清空字符串中所有空白*/
        empty: function () {
            return this.replace(/\s+/g, '');
        },
        /**
        截断过长的字符串
        * @param {Number} length 要从字符串的什么位置截断
        * @param {String} rep (Optional) 可选参数 截断后要替换的字串默认为"..."
        * @return {String} 返回新字符串
        */
        streamlining: function (length, rep) {
            if (this.byteLength() > length) {
                var i = this.split('');
                rep = typeof rep !== "undefined" ? rep : '...';
                length -= rep.byteLength();
                for (var j = 0, len = 0, e, ret = ''; (e = i[j]); j++) {
                    len += e.charCodeAt(0) > 255 ? 2 : 1;
                    if (length < len) {
                        return ret + rep;
                    } else {
                        ret += e;
                    }
                }
            }
            else {
                return this;
            }
        }
    });
/**
* jQuery 扩展
*/
/**
字数限制扩展,直接将文本截断
* @param {Number} limit    字数限制
* @param {String} selector 提示文本
* @param {Object} options  参数设置  isAutoLimit {Boolean} :是否自动截断默认截断  num {Number}：预警提示分界线
*/
jQuery.fn.extend({
    limit: function (limit, selector, options) {
        var interval,
            limit = limit * 1,
            options = jQuery.extend({ isAutoLimit: true, num: 0 }, options || {}),
            self = jQuery(this);
        if (!this.focused) {
            this.focused = true;
            self.focus(function () {
                interval = window.setInterval(substring, 100);
            }).blur(function () {
                clearInterval(interval);
                substring();
            });
        }
        substring();
        function substring() {
            var length = self.val().length;
            // 判断是否需要截断文本
            if (length > limit && options.isAutoLimit) {
                self.val(self.val().substring(0, limit));
                length = limit;
                if (typeof selector === "function") {
                    selector.caller(self.get(0));
                }
            }
            if (typeof selector === "string") {
                var elem = jQuery(selector), count = limit - length;
                // 预警显示
                elem[options.num > length ? "hide" : "show"]();
                elem.html((count < 0) ? "已经超过<em style='color:#DA0000'>" + count * -1 + "</em>字" : "还可以输入<em>" + count + "</em>字");
            }
        };
        return this;
    }
});

/*
本文框自动调整高度扩展
* @param {Number} minHeight    最小宽度
* @param {Number} maxHeight    最大宽度
*/
jQuery.fn.extend({
    TextAreaExpander: function (minHeight, maxHeight, callback) {

        var hCheck = !(jQuery.browser.msie || jQuery.browser.opera), interval, element;

        // resize a textarea
        function ResizeTextarea() {

            // event or initialize element?

            var e = element;

            // find content length and box width
            var vlen = e.value.length, ewidth = e.offsetWidth;
            if (vlen != e.valLength || ewidth != e.boxWidth) {

                if (hCheck && (vlen < e.valLength || ewidth != e.boxWidth)) e.style.height = "0px";
                var h = Math.max(e.expandMin, Math.min(e.scrollHeight, e.expandMax));
                e.style.overflow = (e.scrollHeight > h ? "auto" : "hidden");
                e.style.height = h + "px";
                e.valLength = vlen;
                e.boxWidth = ewidth;
                callback && callback.call(e, h);
            }

            return true;
        };

        // initialize
        this.each(function () {
            // is a textarea?
            if (this.nodeName.toLowerCase() != "textarea") return;

            // set height restrictions
            var p = this.className.match(/expand(\d+)\-*(\d+)*/i);
            this.expandMin = minHeight || (p ? parseInt('0' + p[1], 10) : 0);
            this.expandMax = maxHeight || (p ? parseInt('0' + p[2], 10) : 99999);
            element = this;
            // initial resize
            ResizeTextarea();

            // zero vertical padding and add events
            if (!this.Initialized) {
                this.Initialized = true;
                jQuery(this).css("padding-top", 0).css("padding-bottom", 0);
                //低版本的兼容
                if (jQuery.browser.msie && jQuery.browser.version < 9) {
                    jQuery(this).focus(function () {
                        interval = window.setInterval(ResizeTextarea, 100);
                    });
                    jQuery(this).blur(function () {
                        clearInterval(interval);
                        ResizeTextarea();
                    });
                } else {
                    jQuery(this).bind("propertychange", ResizeTextarea)
                    jQuery(this).bind("input", ResizeTextarea);
                }

            }
        });
        return this;
    }
});

/*
触摸高亮
* @param {string} arguments[0]  高亮className
* @param {string} arguments[1]  不可高亮的className
*/
jQuery.fn.extend({
    high: function () {
        var arg = arguments, reg = new RegExp('\\s*' + arg[0] + ''), self = jQuery(this);
        self.live('hover', function () {
            if (arg.length === 2 && typeof arg[1] === "string" && self.hasClass(arg[1])) {
                return false;
            }
            if (self.hasClass(arg[0])) {
                this.className = this.className.replace(reg, '');
            } else {
                this.className = " " + arg[0];
            }
        });
    }
})

/*
搜索提示
* @param {Object} elem 提示层 DOM Element元素
*/
jQuery.fn.extend({
    prompt: function (elem) {
        if (jQuery(this).val() !== '') {
            elem.hide();
        };

        if (!(jQuery.nodeName(this.get(0), "input") || jQuery.nodeName(this.get(0), "textarea"))) {
            return false;
        }
        if (typeof elem === "undefined") {
            throw "请传入提示元素.";
        }
        var self = this, elem = jQuery(elem), fClass = arguments[1];

        function blurFn() {
            if (this.value.length === 0) {
                elem.show();
            }
            if (typeof fClass === "string") {
                jQuery(this.parentNode).removeClass(fClass);
            }
        };
        function focusFn() {
            if (jQuery(this).val().empty() == "") {
                return false;
            }
            elem.hide();
            if (typeof fClass === "string") {
                jQuery(this.parentNode).addClass(fClass);
            }
        };
        function focusFn02() {
            if (typeof fClass === "string") {
                jQuery(this.parentNode).addClass(fClass);
            }
        };
        self.bind('blur', blurFn).bind('input', focusFn).bind('propertychange', focusFn).bind('change', focusFn).bind("focus", focusFn02);
        jQuery(function () {

        })
        return this;
    }
});

// 公共方法

// 和讯家园 → 返回顶部
hexun.home.toTop = (function () {
    var defaults = {
        elemID: "hxjy_gotop", //返回ID
        footID: "hxjy_footer"   //页脚ID
    };
    var initialize = function () {
        jQuery(window).bind('scroll', toGetTop);
        function toGetTop() {
            var oFoot = jQuery("#" + defaults.footID), elemID = defaults.elemID;
            // 超过一屏 显示返回顶部
            if ((window.pageYOffset || document.documentElement.scrollTop) >= (window.innerHeight || document.documentElement.offsetHeight)) {
                !document.getElementById(elemID) && oFoot.before('<a href="#Top" class="gotop" id=' + elemID + ' onclick="window.scrollTo(0, 0);jQuery(this).remove();return false;"></a>');
            } else {
                document.getElementById(elemID) && jQuery("#" + elemID).remove();
            }
        }
    };
    return {
        init: function (options) {
            jQuery.extend(defaults, options || {});
            initialize();
        }
    }
});

// 个人门户→固定导航条
hexun.home.navBar = (function () {
    var defaults = {
        searchID: "hxjy_navbar_search_inp",     // 搜索用户ID
        newsID: "hxjy_navbar_info_news",        // 消息ID
        informID: "hxjy_navbar_info_inform",    // 通知ID
        accountID: "hxjy_navbar_info_account",  // 账号ID
        newsUrl: "",         // 消息地址
        informUrl: "",     // 通知地址
        cacheClassName: "navbar_info_cur",      // 未hover之前，className
        hoverClassName: "navbar_info_hover",    // hover中，className
        times: 10000                             // 刷新频率 1分钟一次
    };
    var initialize = function () {
        //绑定事件
        bindEvent();
    };
    function bindEvent() {
        var jQuerySearch = jQuery("#" + defaults.searchID), //搜索DOM
           times = defaults.times, //消息，通知刷新频率
           oInform = jQuery("#" + defaults.informID), //通知DOM
        oInformIcon = oInform.find(".navbar_info_num"), //通知的ICON
        cacheClassName = defaults.cacheClassName,
        hoverClassName = defaults.hoverClassName;
        // 搜索提示     
        jQuerySearch.prompt(jQuerySearch.prev()); //搜索错误 暂时注释**********************
        // 消息
        loadData(jQuery("#" + defaults.newsID).find(".navbar_info_num"), defaults.newsUrl, times, "news");
        // 通知
        loadData(oInformIcon, defaults.informUrl, times, "inform");
        // 通知
//        oInform.hover(function () {
//            //检测是否存在通知
//            if (oInformIcon.text() * 1 > 0) {
//                this.className += ' ' + hoverClassName;
//            }
//        }, function () {
//            this.className = cacheClassName;
//        })
        //账号
        jQuery("#" + defaults.accountID).hover(function () {
            this.className = hoverClassName;
        }, function () {
            this.className = cacheClassName;
        })

    }
    /*
    加载数据
    *   elem:   ICON对象
    *   url:    数据地址
    *   time：  刷新频率
    *   type:   数据类型news:消息  inform：通知
    */
    function loadData(elem, url, time, type) {
        //alert(url);
        // 检测封装的对象是否存在
        if (elem.length === 0) {
            return false;
        }
        AjaxLoadData(elem, url, time, type);
        setInterval(function () {
            AjaxLoadData(elem, url, time, type);
        }, time);
    };
    function AjaxLoadData(elem, url, time, type) {
        jQuery.ajax({
            type: "post",
            async: false,
            url: url,
            dataType: "jsonp",
            jsonp: "callback",
            success: function (json) {
                // 检测封装的对象是否存在
                if (elem.length === 0) {
                    return false;
                }
                // 检测数据状态，为1表示正常，其他错误
                if (json.status == 1) {
                    json = json.result;
                    // 小ICON图标 显示个数                        
                    if (json.num != 0) {
                        // 获取个数  
                        elem.addClass("vshow").html(json.num > 99 ? 99 : json.num);
                    } else {
                        elem.addClass("vhide").html(0);
                    }
                }
            },
            error: function () {
                //alert("未知错误");
            }
        });
    };
    return {
        init: function (options) {
            jQuery.extend(defaults, options || {});
            initialize();
        }
    }
});

function fillHead(uid) {
    var url = 'http://hexun.com/newhome/Common/UserCommonHead/' + uid;
    ajaxSubmit(url, 1, uid);
}

function fillUserInfor(uid) {
    var url = 'http://hexun.com/newhome/Common/UserInfro/' + uid;
    ajaxSubmit(url, 2, uid);

}

//1是通用头 2是通用用户信息
function ajaxSubmit(url, type, uid) {
    jQuery.ajax({
        type: "post",
        async: false,
        url: url,
        dataType: "jsonp",
        jsonp: "callback",
        success: function (json) {
            var tagurl = "http://hexun.com/" + uid + "/default.html";
            if (type == 2) {
                jQuery("#userName").html(json.result.userName).attr("href", tagurl);
                jQuery("#userHeadImg").attr("src", json.result.userHeadImg == null ? "http://logo2.tool.hexun.com/11eae2b-96.jpg" : json.result.userHeadImg);
                jQuery("#userHeadImg").parent().attr("href", tagurl);
                jQuery("#userSex").html(json.result.userSex);
                jQuery("#userAdd").html(json.result.userAdd);
                jQuery("#userIntro").html(json.result.userIntro);

                jQuery("#userActive").html(json.result.userActive);
                jQuery("#userFans").html(json.result.userFans);

            }
            else if (type == 1) {
                jQuery("#userMiniName").html(json.result.userName);
                jQuery("#userMiniHeadImg").attr("src", (json.result.userHeadImg == null ? "http://logo2.tool.hexun.com/11eae2b-96.jpg" : json.result.userHeadImg));
                jQuery("#userMiniHeadImg").parent().attr("href", tagurl);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert(XMLHttpRequest.status);
            //alert(XMLHttpRequest.readyState);
            //alert(textStatus);
        }
    });
}

// 社区登陆窗口
hexun.home.login = (function () {
    var defaults = {
        logBoxId: 'logBox',  // 登陆框
        loginInputClass: 'loginInput', // 登陆文本框类
        focusClass: 'log_focus',
        errorClass: 'log_error'
    };
    var initialize = function () {
        var jQueryeleBox = jQuery('#' + defaults.logBoxId),
            jQueryeleInputs = jQueryeleBox.find('.' + defaults.loginInputClass),
            f = defaults.focusClass;
        jQuery(function () {
            jQueryeleInputs.each(function () {
                if (jQuery(this).val() != '') {
                    jQuery(this).prev().hide();
                }
            })
        });
        // 用户名t事件
        jQueryeleInputs.eq(0).focus(function () {
            jQuery(this.parentNode.parentNode).addClass(f);
            jQuery(this).prev().hide();
            //jQuery(this.parentNode).next().hide();
        });
        jQueryeleInputs.eq(0).blur(function () {
            var p = jQuery(this.parentNode.parentNode);
            p.removeClass(f);
            if (this.value == '') {
                jQuery(this).prev().show();
            }

        });
        // 密码事件
        jQueryeleInputs.eq(1).focus(function () {
            jQuery(this.parentNode.parentNode).addClass(f);
            jQuery(this).prev().hide();
        });
        jQueryeleInputs.eq(1).blur(function () {
            var p = jQuery(this.parentNode.parentNode);
            p.removeClass(f);
            if (this.value == '') {
                jQuery(this).prev().show();
            }
        });


    };
    return {
        init: function (options) {
            jQuery.extend(defaults, options || {});
            return initialize();
        }
    };
} ());
// 登陆触发
hexun.home.vokeLogin = (function () {

    var defaults = {
        logBtn: 'loginInter',
        logBox: 'logBox',
        gourl: ''
    };
    var initialize = function () {
        var oBtn = jQuery('#' + defaults.logBtn),
            cl = oBtn.offset().left,
            ct = oBtn.offset().top,
            w = oBtn.outerWidth(),
            h = oBtn.outerHeight(),
            w1,
            x,
            y;
        oBtn.toggle(function () {
            oBox = jQuery('#' + defaults.logBox);
            jQuery(this).addClass('loginBtn2');
            oBox.show();
            doHtml();
            hexun.home.login.init();
            w1 = oBox.outerWidth();
            x = cl + w - w1;
            y = ct + h;
            oBox.css('left', x + 'px');
            oBox.css('top', y + 'px');

        }, function () {
            jQuery(this).removeClass('loginBtn2');
            jQuery('#' + defaults.logBox).html('');
            jQuery('#' + defaults.logBox).hide();
        });

    };
    function doHtml() {
        var oBox = jQuery('#' + defaults.logBox), ret = [];
        ret.push(' <form style="margin: 0px;" action="https://reg.hexun.com/login.aspx" method="post" id="LoninBoxForm" name="LoninBoxForm">');
        ret.push(' <div class="clearfix pt20 pl20">');
        ret.push('<div class="fl log_input log_w1 pr"> <span class="tishi">请输入用户名</span><input id="username1" name="username1" type="text" class="loginInput" /></div>');
        ret.push('<div class="isRight fl mt5 ml10"></div>');
        ret.push('</div>');
        ret.push('  <div class="clearfix pt20 pl20">');
        ret.push('  <div class="log_input log_w1 pr fl"><em class="tishi"> 请输入密码</em><input id="password" name="password" type="password" class="loginInput" /></div>');
        ret.push('  <div class="isRight fl mt5 ml10"></div>');
        ret.push('    </div>');
        ret.push(' <div class="clearfix pl20 pt15"><a href="javascript:void(0)" id="hx_login_btn" class="a_btn fl">&nbsp;登&nbsp;录&nbsp;</a>');
        var nowurl = window.location.href;
        ret.push(' <input type="hidden" value="" id="username" name="username"><input type="hidden" value="' + nowurl + '" id="gourl" name="gourl">');
        ret.push('  <div class="fr pr40 pt3">');
        ret.push('      <label class="fl mr10 color_45"> <input id="LoginStateAuto" name="LoginStateAuto" checked="checked" class="remb" value="1" type="checkbox"/> 记住我</label><a href="http://reg.hexun.com/GetPasswordPre.aspx">忘记密码</a>');
        ret.push(' </div>');
        ret.push(' </div>');
        ret.push('     <div class="other_login clearfix">');
        ret.push('  <span class="ml20 mr10">其他登录方式</span>');
        ret.push('<a href=\'https://reg.hexun.com/bindqq.aspx?gourl='+defaults.gourl+'\' class="logQq"></a>');
        ret.push(' <a href=\'https://reg.hexun.com/bindsina.aspx?gourl=' + defaults.gourl + '\' class="logSina"></a>');
        ret.push('     <a href=\'https://reg.hexun.com/bindmsn.aspx?gourl=' + defaults.gourl + '\' class="logMsn"></a>');
        ret.push('    <a href=\'https://reg.hexun.com/bindbaidu.aspx?gourl=' + defaults.gourl + '\' class="logBaidu"></a>');
        ret.push('      <a href=\'https://reg.hexun.com/bindtencent.aspx?gourl=' + defaults.gourl + '\' class="logTw"></a>');
        ret.push(' </div>');
        ret.push(' </form>');
        oBox.html(ret.join(''));

        jQuery("#hx_login_btn").click(function () {
            var username = jQuery.trim(jQuery("#username1").val());
            var password = jQuery.trim(jQuery("#password").val());
            if (username == "") {
                alert("用户名不能为空");
                return;
            }
            if (password == "") {
                alert("密码不能为空");
                return;
            }
            jQuery("#username").val(escape(username));
            jQuery("#username1").val("");
            jQuery("#LoninBoxForm").submit();
        });
        jQuery("#password").keydown(function (e) {
            var Ev = window.event || e;
            var key = Ev.keyCode || Ev.which;
            if (key == 13) {
                jQuery("#hx_login_btn").click();
            }
        });
    }
    return {
        init: function (options) {
            jQuery.extend(defaults, options || {});
            initialize();
        }
    }
});

hexun.home.FileUserInfo = function () {
    var defaults = {
        uid: "0",
        loginUid: "0",
        urlhost: "http://hexun.com/newhome",
        gourl: ""
    };
    var initialize = function () {
        var uid = defaults.uid;
        var loginUid = defaults.loginUid;
        var urlhost = defaults.urlhost;
        if (parseInt(uid) == 0 || parseInt(uid) == parseInt(loginUid)) {
            uid = loginUid;
            jQuery("#btnWriteBlog").attr("href", "http://post.blog.hexun.com/" + loginUid + "/newpostblog.aspx");
            jQuery("#btnUploadImg").attr("href", "http://" + loginUid + ".photo.hexun.com");
            jQuery("#btnWriteWeibo").attr("href", "http://t.hexun.com/" + loginUid + "/default.html");
            jQuery("#userActiveUrl").attr("href", "" + urlhost + "/user/followers/");
            jQuery("#userFansUrl").attr("href", "" + urlhost + "/user/fans/");
        } else {
            jQuery("#userActiveUrl").attr("href", "" + urlhost + "/user/" + uid + "/followers");
            jQuery("#userFansUrl").attr("href", "" + urlhost + "/user/" + uid + "/fans/");
        }
        //hexun.home.public.init({ loginUserId: loginUid, userId: uid });
        //这里也是隐藏代码
        hexun.home.navBar().init({ "newsUrl": "" + urlhost + "/common/userMessageCount", "informUrl": "" + urlhost + "/common/userMessageActice" });
        //填充用户信息
        fillUserInfor(uid);
        //填充通用头
        jQuery("#hx_home_login").hide();
        jQuery("#hx_home_unlogin").hide();
        if (parseInt(loginUid) == 0) {
            var homeurl = "http://hexun.com/" + uid + "/default.html";
            jQuery(".container .navbar_logo").attr("href", homeurl);
            jQuery(jQuery(".container .navbar_pro_name").find("a")[0]).attr("href", homeurl);

            jQuery("#hx_home_login").hide();
            jQuery("#hx_home_unlogin").show();
            jQuery(jQuery("#hx_home_unlogin").find("a")[0]).attr("href", "https://reg.hexun.com/regname.aspx?gourl=" + escape(window.location.href));

            // 个人门户→登陆
            hexun.home.vokeLogin().init({ gourl: defaults.gourl });

        } else {
            jQuery("#hx_home_login").show();
            jQuery("#hx_home_unlogin").hide();
            //可以不用写用户ID。直接从Common login里获取Uid
            fillHead(uid);
            //填充URL
            jQuery("#headPencli").attr("href", "http://post.blog.hexun.com/" + loginUid + "/newpostblog.aspx");
            // 添加铅笔效果
            jQuery("#headPencli").hover(function () {
                jQuery(this).prev().toggleClass('navbar_write_blogHover');
            });
            jQuery("#btnUserSet").attr("href", "" + urlhost + "/set/userinfo");
            var homeurl = "http://hexun.com/" + loginUid + "/default.html";
            jQuery("#userMiniName").attr("href", homeurl);
            jQuery(".container .navbar_logo").attr("href", homeurl);
            jQuery(jQuery(".container .navbar_pro_name").find("a")[0]).attr("href", homeurl);

            jQuery(jQuery("#hxjy_navbar_info_account .dropdown-menu").find("a")[1]).attr("href", "http://utility.tool.hexun.com/quit.aspx?gourl=" + escape(window.location.href));
        }
    };
    return {
        init: function (options) {
            jQuery.extend(defaults, options || {});
            initialize();
        }
    };
};

jQuery(".navbar_search_btn").click(function () {
    var username = jQuery("#hxjy_navbar_search_inp").val();
    if (!jQuery("#hx_home_unlogin").is(":hidden")) {
        jQuery('#loginInter').click();
    } else {
        window.location.href = "http://hexun.com/newhome/search?username=" + escape(username);
    }
});
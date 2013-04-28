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

(function (window) {
    function empty(string) { //去除空格
        return string.replace(/\s*/g, '');
    }
    window.Jser = {
        /**
        声明类型
        *@param {String} name          类名
        *@param {Object} base          基类(需要继承的父类)
        *@param {Object} members       非静态成员(javascript键值对)
        *@param {Object} staticMembers 静态成员(javascript键值对) 
        *@return {Object} 声明的类       
        */
        Class: function (name, base, members, staticMembers) {
            var names = empty(name).split('.'); // 字符串去空格，分割成字符串数组
            var klassName = names.pop();        // 删除并返回数组的最后一个元素
            var klass = members && members[klassName] ? eval('(function(){ return function(){ return this.' + klassName + '.apply(this, arguments);}})()') : eval('(function(){ return function(){}})()');
            var prototype = klass.prototype;    // klass → 匿名函数function(){this.klassName.apply(this,arguments);}  获取klass的原型对象
            klass.name__ = name;                // 静态属性 klass的name__为 类名
            klass.base__ = [];                  // 静态属性 klass的base__为 基类 （可以继承多个基类,所以为数组）
            if (base) {
                klass.base__ = klass.base__.concat(base.base__);    // 若基类存在 则合并继承的基类
                klass.base__.push(base);                            // 将基类也添加到基类数组中
                $.extend(prototype, base.prototype);               // 继承基类的原型
            }
            for (var i in members) {
                var j = members[i];
                if (typeof j == "function") {
                    j.belongs = klass;
                    var o = prototype[i]        // o:继承来自基类的方法 i:方法名
                    if (o && o.belongs) {
                        prototype[o.belongs.name__.replace(/\./g, '$') + '$' + i] = o;
                    }
                }
                prototype[i] = j;
            }
            klass.fn = prototype;               // 静态属性 klass的fn为 klass的原型对象
            $.extend(klass, staticMembers);    // 扩展klass的属性
            var _this = window;
            while (e = names.shift())           // 删除，并返回第一个元素的值 e:命名空间的名称，没有则为全局对象window
                _this = _this[e] || (_this[e] = {});
            if (_this[klassName])               // 判断类型是否重复定义
                throw Jser.Error(name + ' 类型重复定义'); // 抛出错误
            _this[klassName] = klass;
            if (klass[klassName])               // 执行初始化的类
                klass[klassName]();
            return klass;                       //返回当前类
        },
        /**
      发送ajax请求
      */
        ajax: function (params) {
            var params = $.extend({
                type: 'GET', url: '', dataType: 'text', data: null, open: Jser.noop, success: Jser.noop, callbreak: null, error: null, callbleak: null, asyn: true
            }, params);
            var url = params.url;
            url = (url.indexOf('?') != -1) ? (url + '&') : (url + '?') + (new Date()).getTime(); // 判断url是否存在?,若不存在则加?,存在则加& 
            params.url = url;
            var xhr = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
            var callbreak = function () {
                if (params.callbreak)
                    params.callbreak(xhr);
                else {
                    if (xhr.readyState == 4) {
                        var status = xhr.status;
                        if (status == 200 || status == 304) {
                            var text = xhr.responseText,
                             ret,
                             xml;
                            if (params.dataType == 'xml') {
                                var isXml = /^ *<\?xml/i.test(text);
                                xml = isXml ? xhr.responseXml || xhr.responseXML : null;
                                if (xml) {
                                    if (xml.parseError.errorCode != 0)
                                        throw Jser.Error('解析XML错误 ' + params.url + ' , 标签  ' + parseError.srcText + '  ' + parseError.reason);
                                }
                                else
                                    throw Jser.Error('解析XML错误 ' + params.url);
                            }
                            xhr.abort(); //中断请求
                            if (params.dataType == 'json') {
                                try {
                                    ret = eval('(' + text + ')');
                                }
                                catch (e_) {
                                    throw Jser.Error('解析JSON数据错误')
                                }
                            } else if (params.dataType == 'xml') {
                                ret = xml;
                            } else
                                ret = text;
                            params.success && params.success(ret);
                            return ret;
                        }
                        else {
                            var text = xhr.responseText;
                            xhr.abort();

                            if (params.error) {
                                params.error($.extend({
                                    message: text, status: status
                                }, params))
                            }
                            else
                                throw Jser.Error(status + 'Error \n' + text);
                        }
                    }
                }
            }
            params.asyn && (xhr.onreadystatechange = callbreak);
            xhr.open(params.type, params.url, params.asyn);
            params.open(xhr);
            xhr.send(params.data);
            return params.asyn || callbreak();
        },
        noop: function () {
        },
        /**
        创建一个异常对像
        * @param {String} msg 创建异常对像所需的字符串
        * @return {Error}
        * @static
        */
        Error: function (msg) {
            return new Error(msg);
        }
    }
    window.Class = Jser.Class;
})(window);

/**
扩展javascript String 对像
*/
$.extend(String.prototype,
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
                        for (var j = 0, len = 0, e, ret = ''; (e = i[j]) ; j++) {
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
$.fn.extend({
    limit: function (limit, selector, options) {
        var interval,
        limit = limit * 1,
        options = $.extend({ isAutoLimit: true, num: 0 }, options || {}),
        self = $(this);
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
                var elem = $(selector), count = limit - length;
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
$.fn.extend({
    TextAreaExpander: function (minHeight, maxHeight, callback) {

        var hCheck = !($.browser.msie || $.browser.opera), interval, element;

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
                $(this).css("padding-top", 0).css("padding-bottom", 0);
                //低版本的兼容
                if ($.browser.msie && $.browser.version < 9) {
                    $(this).focus(function () {
                        interval = window.setInterval(ResizeTextarea, 100);
                    });
                    $(this).blur(function () {
                        clearInterval(interval);
                        ResizeTextarea();
                    });
                } else {
                    $(this).bind("propertychange", ResizeTextarea)
                    $(this).bind("input", ResizeTextarea);
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
$.fn.extend({
    high: function () {
        var arg = arguments, reg = new RegExp('\\s*' + arg[0] + ''), self = $(this);
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
$.fn.extend({
    prompt: function (elem) {
            if($(this).val() !== ''){
                elem.hide();
            };

        if (!($.nodeName(this.get(0), "input") || $.nodeName(this.get(0), "textarea"))) {
            return false;
        }
        if (typeof elem === "undefined") {
            throw "请传入提示元素.";
        }
        var self = this, elem = $(elem), fClass = arguments[1];

        function blurFn() {
            if (this.value.length === 0) {
                elem.show();
            }
            if (typeof fClass === "string") {
                $(this.parentNode).removeClass(fClass);
            }
        };
        function focusFn() {
            if ($(this).val().empty() == "") {
                return false;
            }
            elem.hide();
            if (typeof fClass === "string") {
                $(this.parentNode).addClass(fClass);
            }
        };
        function focusFn02() {
            if (typeof fClass === "string") {
                $(this.parentNode).addClass(fClass);
            }
        };
        self.bind('blur', blurFn).bind('input', focusFn).bind('propertychange', focusFn).bind('change', focusFn).bind("focus", focusFn02);
        $(function(){

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
        $(window).bind('scroll', toGetTop);
        function toGetTop() {
            var oFoot = $("#" + defaults.footID), elemID = defaults.elemID;
            // 超过一屏 显示返回顶部
            if ((window.pageYOffset || document.documentElement.scrollTop) >= (window.innerHeight || document.documentElement.offsetHeight)) {
                !document.getElementById(elemID) && oFoot.before('<a href="#Top" class="gotop" id=' + elemID + ' onclick="window.scrollTo(0, 0);$(this).remove();return false;"></a>');
            } else {
                document.getElementById(elemID) && $("#" + elemID).remove();
            }
        }
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
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
        newsUrl: "data/data-news01.js",         // 消息地址
        informUrl: "data/data-inform01.js",     // 通知地址
        cacheClassName: "navbar_info_cur",      // 未hover之前，className
        hoverClassName: "navbar_info_hover",    // hover中，className
        times: 10000                             // 刷新频率 1分钟一次
    };
    var initialize = function () {
        //绑定事件
        bindEvent();
    };
    function bindEvent() {
        var $Search = $("#" + defaults.searchID),//搜索DOM
           times = defaults.times,//消息，通知刷新频率
           oInform = $("#" + defaults.informID);//通知DOM
        oInformIcon = oInform.find(".navbar_info_num"),//通知的ICON
        cacheClassName = defaults.cacheClassName,
        hoverClassName = defaults.hoverClassName;
        // 搜索提示     
        $Search.prompt($Search.prev());
        // 消息
        loadData($("#" + defaults.newsID).find(".navbar_info_num"), defaults.newsUrl, times, "news");
        // 通知
        loadData(oInformIcon, defaults.informUrl, times, "inform");
        // 通知
        oInform.hover(function () {
            //检测是否存在通知
            if (oInformIcon.text() * 1 > 0) {
                this.className += ' ' + hoverClassName;
            }
        }, function () {
            this.className = cacheClassName;
        })
        //账号
        $("#" + defaults.accountID).hover(function () {
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
        // 检测封装的对象是否存在
        if (elem.length === 0) {
            return false;
        }
        setInterval(function () {
            Jser.ajax({
                url: url,
                dataType: "json",
                type: "GET",
                success: function (data) {
                    // 检测封装的对象是否存在
                    if (elem.length === 0) {
                        return false;
                    }
                    // 检测数据状态，为1表示正常，其他错误
                    if (data.status == 1) {
                        // 小ICON图标 显示个数                        
                        if (data.num != 0) {
                            // 获取个数  
                            elem.addClass("vshow").html(data.num > 99 ? 99 : data.num);
                        } else {
                            elem.addClass("vhide").html(0);
                        }
                        // 数据类型
                        if (type === "inform") {
                            var oUl = elem.next(),
                                html = data.html, i,
                                length = html.length,
                                ret = [];
                            for (i = 0; i < length; i++) {
                                // html[i][1]：地址  html[i][0]：内容
                                ret.push('<li><a href="' + html[i][1] + '">' + html[i][0] + '</a></li>');
                            }
                            oUl.html(ret.join(""));
                        }
                    }
                },
                error: function (data) {

                }
            });
        }, time);
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 个人门户→导航条效果
hexun.home.banner = (function () {
    var defaults = {
        showID: "hxjy_subnav_show", //开启面板ID
        closeID: "hxjy_subnav_close", //关闭面板ID
        parelID: "hxjy_subnav_parel"//面板ID
    };
    var initialize = function () {
        var oShow = $("#" + defaults.showID),//展示DOM
            oParel = $("#" + defaults.parelID),//面板DOM
            oClose = $("#" + defaults.closeID);//关闭DOM
	    //图片悬浮
	    oParel.find('.subnav_icon a img').hover(function(){
		    var src = this.src,
			    end = src.lastIndexOf('.'),
			    src1 = src.substring(0,end) + 1,
		        src2 = src.substring(end);
		        this.src = src1 + src2;
	    },function(){
		    var src = this.src,
			    end = src.lastIndexOf('.'),
			    src1 = src.substring(0,end-1),
			    src2 = src.substring(end);
		    this.src = src1 + src2;
	    })
        // 展示banner
        oShow.click(function () {
            this.style.display = "none";
            oParel.show().animate({ height: "100px", opacity: "1" });
            return false;
        });
        // 关闭banner
        oClose.click(function () {
            oParel.animate({ height: "0px", opacity: "0" }, "normal", "swing", function () {
                oParel.hide();
                oShow.show();
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


// 个人门户→自定义导航条图片
hexun.home.bannerPic = (function () {
    var defaults = {
        btnID: 'hxjy_bannerBtn', // 导航条 图片 按钮ID
        pageID: 'hxjy_page',
        url: 'data/data-personalcoverChange.js',
        pageUrl: ""
    };
    var initialize = function () {
        bindEvent();
    };
    function bindEvent() {
        var oBtn = $('#' + defaults.btnID); // 导航条 图片 按钮
        // 开启 个性化设置
        oBtn.click(function () {
            loadData();
            return false;
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
                    var i = 0, img = data.img, len = img.length, ret = [], imgData, page = data.page, guid, cacheSrc;
                    cacheSrc = $("#" + defaults.btnID).prev().attr("src");
                    ret.push('<ul class="pop_window_sec">');
                    ret.push('<li><a href="#">推荐封面</a></li>');
                    ret.push('<li><a href="#" class="a_4e">自定义</a></li>');
                    ret.push('</ul>');
                    ret.push('<ul id="hxjy_banner_list" class="banner_list">');
                    for (; i < len; i++) {
                        imgData = img[i];
                        if (!!imgData[2]) {
                            ret.push('<li class="cover_select">');
                        } else {
                            ret.push('<li>');
                        }
                        ret.push('<img src="' + imgData[0] + '" />');
                        ret.push('<div class="cover_icon"></div>')
                        ret.push('<div class="cover_title">' + imgData[1] + '</div>');
                        ret.push('</li>')
                    }
                    ret.push('</ul>');
                    ret.push('<div class="pr20 pb20 clearfix">');
                    ret.push('<div class="pagination" id="hxjy_page_banner">');
                    ret.push('</div>');
                    ret.push('</div>');
                    hexun.home.confirm().init({
                        addClass: "w556",
                        tit: "个性化设置",
                        sureTxt: "保&nbsp;存",
                        html: ret.join(""),
                        isBg: false,
                        sure: function () {
                            Jser.ajax({
                                url: defaults.url + "?pic=" + guid,
                                dataType: "json",
                                type: "GET",
                                success: function (data) {
                                    if (data.status == 1) {
                                        alert(1)
                                    }
                                }
                            })
                        },
                        cancel: function () {
                            $("#" + defaults.btnID).prev().attr("src", cacheSrc);
                        },
                        close: function () {
                            $("#" + defaults.btnID).prev().attr("src", cacheSrc);
                        },
                        callback: function () {
                            // 添加分页
                            var Me = this;
                            hexun.home.page().init({
                                state: "ajax",
                                url: page.pageUrl,
                                page: page.page,
                                now: page.now,
                                panelID: "hxjy_page_banner",
                                callback: function (index) {
                                    Jser.ajax({
                                        url: (defaults.url + "?page=" + index),
                                        dataType: "json",
                                        type: "GET",
                                        success: function (data) {
                                            if (data.status == 1) {
                                                Me.closeAlert();
                                                loadData();
                                            }
                                        }
                                    });
                                }
                            });
                            //绑定事件                           
                            $("#hxjy_banner_list").find("li").live("click", function () {
                                $("#hxjy_banner_list").find("li").each(function () {
                                    this.className = "";
                                });
                                this.className = "cover_select";
                                var src = $(this.getElementsByTagName('img')[0]).attr("src").split(".jpg")[0] + "big.jpg";
                                $("#" + defaults.btnID).prev().attr("src", src);
                                guid = src;
                            });
                            // 推荐封面
                            $(Me.oAlert).find('ul.pop_window_sec a:last').click(function () {
                                Me.closeAlert();
                                var ret = [];
                                ret.push('<ul class="pop_window_sec">');
                                ret.push('<li><a href="#" class="a_4e">推荐封面</a></li>');
                                ret.push('<li><a href="#">自定义</a></li>');
                                ret.push('</ul>');
                                ret.push('<div class="flashBox">');
                                ret.push('<iframe src="flash_banner_pic_iframe.html" width="556" height="425" frameborder="0"></iframe>')
                                ret.push('</div>')
                                ret.push('<div class="pr20 pb20 clearfix">');
                                ret.push('<div class="pagination" id="hxjy_page_banner">');
                                ret.push('</div>');
                                ret.push('</div>');
                                hexun.home.confirm().init({
                                    isBtn: false,
                                    isBg: false,
                                    addClass: "w556",
                                    tit: "个性化设置",
                                    html: ret.join(""),
                                    callback: function () {
                                        var Me02 = this;
                                        $(Me02.oAlert).find('ul.pop_window_sec a:first').click(function () {
                                            Me02.closeAlert();
                                            loadData();
                                            return false;
                                        });
                                    }
                                });
                                return false;
                            })


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

// 和讯家园 → 弹出框
hexun.home.alert = (function () {
    var defaults = {
        txt: "",
        html: "",
        addClass: "",
        callback: $.noop,
        isBtn: true,
        isBg: true,
        state: "alert" //alert:警告消息框 confirm:确认消息框       
    };
    var initialize = function () {
        var alert01 = new Alert(defaults);
        return alert01;
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            return initialize();
        }
    }
});

// 和讯家园 → 弹出框
hexun.home.confirm = (function () {
    var defaults = {
        txt: "",
        html: "",
        addClass: "",
        callback: $.noop,
        isBtn: true,
        isBg: true,
        state: "confirm" //alert:警告消息框 confirm:确认消息框 
    };
    var initialize = function () {
        var confirm01 = new Alert(defaults);
        return confirm01;
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            return initialize();
        }
    }
});

// 和讯家园 → 分页
hexun.home.page = (function () {
    var defaults = {
        page: null,// 总页数
        now: null, //当前页数
        panelID: "hxjy_page", //面板ID
        noClass: "page_btn_no",//禁止class
        hoverClass: "page_btn_hover",//高亮class
        norClass: "page_btn",//默认Class
        selClass: "a_cur_page",// 选中页数
        url: location.href, //跳转的地址
        state: "url",//状态 ajax: 不刷新页面  url 刷新页面
        callback: $.noop //ajax状态下的 回调函数
    };
    var initialize = function () {
        var oPage = $("#" + defaults.panelID),//分页
            oA = oPage.find(".cur_page").eq(0),//分页 hover
            oUl = oPage.find("ul").eq(0);//分页列表        
        oA.hover(function () {
            oUl.show();
        }, function () {
            oUl.hide();
        });
        if (defaults.page) {
            var page02 = new Page(defaults);
            return page02;
        }
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            return initialize();
        }
    }
});


// 和讯家园 → 分页
hexun.home.scrollBars = (function () {
    var defaults = {

    };
    var initialize = function () {
        var scrollBar01 = new scrollBars(defaults);
        return scrollBar01;

    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            return initialize();
        }
    }
});

// 和讯家园 → 滚动分页
//滚动分页
Class('scrollBars', null, {
    //创建类
    scrollBars: function (options) {
        var options = $.extend(this.options, options || {});
        options.count = $.makeArray(options.count);
        options.url = $.makeArray(options.url);
        scrollBars.rethis = this;
        this.bindEvent();
        this.init();
    },
    height: 0,
    isScroll: true, //是否继续滚动，由数据返回得知
    options: {                           // 选择器
        firstAction: true,
        pageSize: 10,
        fHeight: 100,                    // 计算底部高度
        index: 0,                        // 滚动分页的下标
        max: 3,                          // 默认滚动加载数据次数
        isManual: true,                  // 是否开启手动滚动
        panelID: 'hxjy_scrollBar',       // 显示数据面板ID
        manualID: "hxjy_scrollBar_manual", // 查看更多ID
        count: [0],                      // 计算滚动次数
        url: [],                         // 数据地址
        callback: $.noop,                // 回调函数
        doDataHtml: $.noop              // 将数据拼接为HTML
    },
    //初始化
    init: function () {
        this.updateScene();             // 更新场景
    },
    //绑定事件
    bindEvent: function () {
        var options = this.options, Me = this;
        if (options.firstAction) {
            Me.loadData();  
        }
        //绑定滚动事件      
        $(window).scroll(this.doScroll);
        // 检测是否需要手动滚动
        if (options.isManual) {
            var oManual = $('#' + options.manualID);
            oManual.click(function () {
                Me.loadData();
            });
        }
    },
    //滚动
    doScroll: function () {
        var Me = scrollBars.rethis, options = Me.options;
        // 检测是否超过默认滚动次数
        if (options.count[options.index] < options.max) {
            // 检测是否 滚动条是否到达底部          
            if (Me.scrollTop() >= Me.height) {
                // 加载数据
                Me.loadData();
            }
        } else {
            // 超过默认滚动次数
            $(window).unbind('scroll', Me.doScroll);    // 解除绑定滚动事件
            // 检测是否需要手动滚动
            if (options.isManual) {
                var oManual = $('#' + options.manualID);
                // 检测是否需要继续分页
                if (Me.isScroll) {
                    oManual.show().html("<span clas='clearfix'><em></em>查看更多</span>");
                } else {
                    oManual.hide();
                }

            }
        }
    },
    //加载数据
    loadData: function () {
        var Me = this, options = Me.options, count = options.count[options.index], max = options.max,
            oManual = $('#' + options.manualID), pageIndex, url;
        if (count < max) { // 加载数据过程中 解除绑定滚动事件        
            $(window).unbind('scroll', Me.doScroll);
        }
        if (options.isManual && Me.isScroll) {
            oManual.html("<span clas='clearfix'>内容正在努力加载中...</span>")
        }
        url = options.url[options.index];
        pageIndex = url.indexOf('?') != -1 ? '&' + 'pageIndex=' + count : '?pageIndex=' + count;
        url = options.url[options.index] + pageIndex;
        Jser.ajax({
            url: url,
            dataType: "json",
            type: "GET",
            success: function (data) {
                //如果不为1，则阻止进程。
                if (data.status != 1) { return false; }
                if (data.result.length === 0) {
                    Me.isScroll = false;
                    alert("亲，没有更多内容了");
                    Me.updateScene();
                    return;
                }
                // 自定义的 后端给出是否还需要继续分页
                if (data.result.length < options.pageSize) {
                    Me.isScroll = false;
                }
                options.doDataHtml.call(Me, data);
                options.count[options.index]++;
                if (count < max && Me.isScroll) {  // 加载数据结束,重新绑定事件
                    $(window).scroll(Me.doScroll);
                }
                Me.updateScene();           // 更新场景 
            }
        });
    },
    // 更新场景
    updateScene: function () {
        //计算高度
        var options = this.options;
        this.height = this.heightFn();
        options.callback && options.callback();
        // 检测是否需要手动滚动
        if (options.isManual) {
            var oManual = $('#' + options.manualID);
            // 检测是否需要继续分页
            if (this.isScroll) {
                oManual.show().html("<span clas='clearfix'><em></em>查看更多</span>");
            } else {
                oManual.hide();
            }
        }
    },
    //计算屏幕高度
    heightFn: function () {
        // 计算页面高度:document.body.scrollHeight || document.documentElement.scrollHeight
        return (document.body.scrollHeight || document.documentElement.scrollHeight) - this.options.fHeight;
    },
    //计算滚动条滚动距离
    scrollTop: function () {
        return (window.pageYOffset || document.documentElement.scrollTop) + (window.innerHeight || document.documentElement.offsetHeight)
    }
}, {
    rethis: ''
});

// 弹出类
Class('Alert', null, {
    Alert: function (options) {
        $.extend(this, options);
        this.sure = options.sure || $.noop;
        this.cancel = options.cancel || $.noop;
        this.close = options.close || $.noop;
        this.creatAlert();
    },
    creatAlert: function () {
        var Me = this;
        //检测背景层是否存在
        var oBg;
        oBg = $("body").children(".layer");
        if (!oBg.length) {
            // 创建背景层
            oBg = document.createElement("div");
            document.body.appendChild(oBg);
            oBg.className = "layer";
        } else {
            oBg = oBg.get(0);
        }
        Me.oBg = oBg;
        // 创建弹出层
        var oAlert = document.createElement("div"), aHTML = [];
        if(Me.state == 'userUp'){
            aHTML.push('<span class="close" id=\"close\"></span><div class="grade1"><span>');
            aHTML.push(Me.txt +'</span><a href="#" class="btn">一键升级</a></div>');
        }
        else{
        // tit:标题, 关闭按钮
        aHTML.push('<h2><span class="left">' + (Me.tit || "") + '</span><a href="#" class="close_btn"></a></h2>');
        // 文本输入       
        // 判断是否需要居中显示
        var txt = Me.txt || Me.html, reg = /^(?:[^#<]*<[\w\W]+>)[^>]*$/, isTXT = !reg.test(txt);//检测是否包含HTML
        // 检测是否为纯文本且文字少于27个
        if (txt.length < 27 && isTXT) {
            aHTML.push('<p class="pop_con tc">' + txt + '</p>');
        } else {
            aHTML.push('<div class="pop_con">' + txt + '</div>');
        }
        if (!!Me.isBtn) {
            aHTML.push('<div class="pop_btn">');
            // 确定
            aHTML.push('<a class="btn btnSure">' + (Me.sureTxt || "确&nbsp;定") + '</a>');
            // 取消
            if (Me.state === "confirm") {
                aHTML.push('<a class="btn btnCancel">取&nbsp;消</a>');
            }
            aHTML.push(' </div>');
        }
        }
        oAlert.innerHTML = aHTML.join("");
        // 插入到body中
        document.body.appendChild(oAlert);
        Me.oAlert = oAlert;
        var $oAlert = $(oAlert);
        //内容 $(DOM Element)
        Me.context = $oAlert.find(".pop_con");
        // 确定按钮
        Me.oSure = $oAlert.find(".btnSure");
        // 取消按钮
        Me.oCancel = $oAlert.find(".btnCancel");
        // 关闭按钮
        Me.oClose = $oAlert.find(".close_btn");
        // 关闭按钮2
        Me.oClose2 = $oAlert.find(".close");
        // 添加className
        oAlert.className = "pop_window " + Me.addClass;

        //调整弹出框位置
        Me.onResize();
        Me.bindEvent();
        Me.callback && Me.callback.call(Me, Me.oAlert);
    },
    bindEvent: function () {
        var Me = this;
        Me.iTimer = null;
        // 确认
        this.oSure.click(function () {
            var ret;
            Me.isBg = true;
            ret = Me.sure.call(Me, Me.oSure);//回调函数            
            if (ret !== false) {
                Me.closeAlert();//关闭
            }
            return false;
        });
        // 取消 
        this.oCancel.click(function () {
            var ret;
            Me.isBg = true;
            ret = Me.cancel.call(Me, Me.oSure);//回调函数            
            if (ret !== false) {
                Me.closeAlert();//关闭
            }
            return false;

        });
        // 关闭   
        this.oClose.click(function () {
            var ret;
            Me.isBg = true;
            ret = Me.close.call(Me, Me.oSure);//回调函数            
            if (ret !== false) {
                Me.closeAlert();//关闭
            }
            return false;
        });
        // 关闭2
        // 关闭
        this.oClose2.click(function () {
            var ret;
            Me.isBg = true;
            ret = Me.close.call(Me, Me.oSure);//回调函数
            if (ret !== false) {
                Me.closeAlert();//关闭
            }
            return false;
        });
        if (Me.state === "alert") {
            Me.timer || (Me.timer = 3000);
            setTimeout(function () { if (Me.iTimer != null) { Me.closeAlert.call(Me) } }, Me.timer);
        }

        //窗口发生改变，触发onResize函数 调整弹出框
        $(window).bind("resize", this.onResize);
    },
    onResize: function () {
        oAlert = this.oAlert;
        oAlert.style.left = (parseInt(document.documentElement.clientWidth || document.body.clientWidth)) / 2 + (document.documentElement.scrollLeft || document.body.scrollLeft) - oAlert.offsetWidth / 2 + "px";
        oAlert.style.top = (parseInt(document.documentElement.clientHeight || document.body.clientHeight)) / 2 + (document.documentElement.scrollTop || document.body.scrollTop) - oAlert.offsetHeight / 2 + "px";
    },
    closeAlert: function () {
        var Me = this;
        Me.iTimer = null;
        if (Me.isBg) {
            document.body.removeChild(Me.oBg); //删除节点   
        }
        document.body.removeChild(Me.oAlert); //删除节点
        return false;
    }
}, {});
// 分页类
Class('Page', null, {
    Page: function (options) {
        $.extend(this, options);
        Page.rethis = this;
        this.init();
    },
    init: function () {
        var aHTML = [], now = this.now, norClass = this.norClass, noClass = this.noClass, page = this.page, i, state = this.state, url = this.url;
        if (state === "url") {
            //临时用的URL、 后端请重新给出URL
            var reg = /pageType=.+[\?|&]?/;
            url = (url.indexOf('?') != -1) ? (url + '&') : (url + '?');
            // 删除原有pageType参数
            url.replace(reg, "");
            // 上一页
            aHTML.push('<a href="' + (now > 1 ? (url + "pageType=" + (now - 1)) : "javascript:;") + '" class="' + (now > 1 ? norClass : noClass) + '" >上一页</a>');
            // 页码
            aHTML.push('<span class="cur_page">');
            // 当前页
            aHTML.push('<a href="#">第&nbsp;' + now + '&nbsp;页&nbsp;</a><em></em>');
            aHTML.push('<div class="page_dropdown">')
            // 页列表
            aHTML.push('<ul class="hide">');
            for (i = page; i > 0; i--) {
                aHTML.push('<li><a href="' + (i !== now ? (url + "pageType=" + i) : "javascript:;") + '" class="' + (i === now ? this.selClass : "") + '">第&nbsp;' + i + '&nbsp;页</a></li>');
            }
            aHTML.push('</ul>');
            aHTML.push('</div>');
            aHTML.push('</span>');
            // 下一页
            aHTML.push('<a href="' + (now < page ? (url + "pageType=" + (now + 1)) : "javascript:;") + '" class="' + (now < page ? norClass : noClass) + '" >下一页</a>');
        } else if (state === "ajax") {
            // 上一页
            aHTML.push('<a href="javascript:;" class="' + (now > 1 ? norClass : noClass) + '" >上一页</a>');
            // 页码
            aHTML.push('<span class="cur_page">');
            // 当前页
            aHTML.push('<a href="#">第&nbsp;' + now + '&nbsp;页&nbsp;</a><em></em>');
            // 页列表
            aHTML.push('<ul class="page_dropdown hide">');
            for (i = page; i > 0; i--) {
                aHTML.push('<li><a href="javascript:;" class="' + (i === now ? this.selClass : "") + '">第&nbsp;' + i + '&nbsp;页</a></li>');
            }
            aHTML.push('</ul>');
            aHTML.push('</span>');
            // 下一页
            aHTML.push('<a href="javascript:;" class="' + (now < page ? norClass : noClass) + '" >下一页</a>');
        }
        $("#" + this.panelID).html(aHTML.join(""));
        this.bindEvent();
    },
    bindEvent: function () {
        var oPanel = $("#" + this.panelID),
        oA = oPanel.find(".cur_page").eq(0),
        oUl = oPanel.find("ul").eq(0),
        state = this.state;
        oA.hover(function () {
            oUl.show();
        }, function () {
            oUl.hide();
        });
        if (state === "ajax") {
            var aBtn = oPanel.find("a"), callback = this.callback, now = this.now, page = this.page;
            aBtn.eq(0).click(function () {
                if (now > 1) {
                    callback.call(this, now - 1);
                }
                return false;
            });
            aBtn.eq(-1).click(function () {
                if (now <= page) {
                    callback.call(this, now + 1);
                }
                return false;
            });
            aBtn.eq(1).click(function () {
                return false;
            });
            var aPageBtn = oUl.find("a");
            var len = aPageBtn.length;
            aPageBtn.click(function () {
                if ((len - this.index) != now) {
                    callback.call(this, len - this.index);
                }

            });
        }

    }
}, {
    rethis: ''
});

// 拖拽
Class('Drag', null, {
    Drag: function (options) {
        $.extend(this, options);
        Drag.rethis = this;
        this.init();
    },
    init: function () {
        this.ele.css('cursor','move');
        
		this.oEle=this.ele[0];
		this.bindEvent();
    },
    bindEvent: function () {
         //this.ele.bind('mousedown',this.downFn);
		var _this=this;
		
		this.oEle.onmousedown=function(e){
			_this.startDrag(e);
		}

		this.doDrag=function(e){
			_this.doDrags(e);
		};

		this.stopDrag=function(e){
			_this.stopDrags(e);
		}
    },
	startDrag:function(ev){
		var e=window.event || ev;
		var obj=this;
        this.disX = e.clientX + getScrollOffsets().x - this.box[0].offsetLeft;
        this.disY = e.clientY + getScrollOffsets().y - this.box[0].offsetTop;
		
		if(this.oEle.setCapture){
			this.oEle.setCapture();
			this.oEle.onmousemove=function (e){
				obj.doDrag(e);
			};
			
			this.oEle.onmouseup=function (e){
				obj.stopDrag(e);
			};
		}
		else{
			document.addEventListener('mousemove', this.doDrag, true);
			document.addEventListener('mouseup', this.stopDrag, true);
			window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
		}
	},
	doDrags:function(ev){
		var e= window.event||ev;
        this.x = e.clientX + getScrollOffsets().x - this.disX;
        this.y = e.clientY + getScrollOffsets().y - this.disY;
        this.box[0].style.left = this.x + 'px';
        this.box[0].style.top = this.y + 'px';		
	},
	stopDrags:function(e){
		if(this.oEle.releaseCapture){
			this.oEle.releaseCapture();
			this.oEle.onmousemove=null;
			this.oEle.onmouseup=null;
		}
		else{
			document.removeEventListener('mousemove',this.doDrag, true);
			document.removeEventListener('mouseup',this.stopDrag, true);
		}
	}
}, {
    rethis: ''
});


// 以一个对象的x和y属
// 性返回滚动条的偏移量
function getScrollOffsets(w){
    w = w || window;
    //除了IE8以及更早的版本以外，其他浏览器都能用
    if(w.pageXOffset != null){
        return {x:w.pageXOffset,y:w.pageYOffset};
    }
    //对标准模式的IE（或任何浏览器）
    var d = w.document;
    if(document.compatMode == "CSS1Compat"){
        return {x:d.documentElement.scrollLeft,y:d.documentElement.scrollTop}
    }
    //对怪异模式下的浏览器
    return {x:d.body.scrollLeft, y:d.body.scrollTop};
}

hexun.home.moban = (function () {

    var defaults = {

    };
    var initialize = function () {


    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});
// 添加铅笔效果
$("#headPencli").hover(function(){
    $(this).prev().toggleClass('navbar_write_blogHover');
});
// 社区登陆窗口
hexun.home.login = (function(){
    var defaults = {
        logBoxId:'logBox',  // 登陆框
        loginInputClass:'loginInput', // 登陆文本框类
        focusClass:'log_focus',
        errorClass:'log_error'
    };
    var initialize = function(){
        var $eleBox = $('#' + defaults.logBoxId),
            $eleInputs = $eleBox.find('.' + defaults.loginInputClass),
            comVad = /[^a-z0-9A-Z]/, //常规校验
            e = defaults.errorClass,
            f = defaults.focusClass;
        $(function(){
            $eleInputs.each(function(){
                if($(this).val() != ''){
                    $(this).prev().hide();
                }
            })
        });
        // 用户名t事件
        $eleInputs.eq(0).focus(function(){
            $(this.parentNode.parentNode).addClass(f).removeClass(e);
            $(this).prev().html('');
            //$(this.parentNode).next().hide();
        });
        $eleInputs.eq(0).blur(function(){
            var can = comVad.test(this.value),
                p =   $(this.parentNode.parentNode);
            if(can || this.value == ''){
                p.addClass(e);
                $(this).val('');
                $(this).prev().html('用户名错误');
            }
            else{
                p.removeClass(f)
            }
            $(this.parentNode).next().show();
        });
        // 密码事件
        $eleInputs.eq(1).focus(function(){
            $(this.parentNode.parentNode).addClass(f).removeClass(e);
            $(this).prev().html('');
          //  $(this.parentNode).next().hide();
        });
        $eleInputs.eq(1).blur(function(){
            var can = comVad.test(this.value),
                p =   $(this.parentNode.parentNode);
            if(can || this.value == ''){
                p.addClass(e);
                $(this).val('');
                $(this).prev().html('密码错误');
            }
            else{
                p.removeClass(f)
            }
            $(this.parentNode).next().show();
        });


    };
    return {
        init: function(options){
            $.extend(defaults, options || {});
            return initialize();
        }
    };
}());
// 登陆触发
hexun.home.vokeLogin = (function () {

    var defaults = {
        logBtn:'loginInter',
        logBox:'logBox'
    };
    var initialize = function () {
        var oBtn = $('#' + defaults.logBtn),
            cl = oBtn.offset().left,
            ct = oBtn.offset().top,
            w = oBtn.outerWidth(),
            h = oBtn.outerHeight(),
            w1,
            x,
            y;
        oBtn.toggle(function(){
            oBox =   $('#' + defaults.logBox);
            $(this).addClass('loginBtn2');
            oBox.show();
            doHtml();
            hexun.home.login.init();
            w1 = oBox.outerWidth();
            x = cl + w - w1;
            y = ct + h;
            oBox.css('left',x + 'px');
            oBox.css('top',y + 'px');

        },function(){
            $(this).removeClass('loginBtn2');
            $('#' + defaults.logBox).html('');
            $('#' + defaults.logBox).hide();
        });

    };
    function doHtml(){
        var oBox = $('#' + defaults.logBox),ret = [];
        ret.push(' <div class="clearfix pt20 pl20">');
        ret.push('<div class="fl log_input log_w1 pr"> <span class="tishi">请输入用户名</span><input type="text" class="loginInput" /></div>');
        ret.push('<div class="isRight fl mt5 ml10"></div>');
        ret.push('</div>');
        ret.push('  <div class="clearfix pt20 pl20">');
        ret.push('  <div class="log_input log_w1 pr fl"><em class="tishi"> 请输入密码</em><input type="password" class="loginInput" /></div>');
        ret.push('  <div class="isRight fl mt5 ml10"></div>');
        ret.push('    </div>');
        ret.push(' <div class="clearfix pl20 pt15"><a href="#" class="a_btn fl">&nbsp;登&nbsp;录&nbsp;</a>');
        ret.push('  <div class="fr pr40 pt3">');
        ret.push('      <label class="fl mr10 color_45"> <input class="remb" type="checkbox"/> 记住我</label><a href="#">忘记密码</a>');
        ret.push(' </div>');
        ret.push(' </div>');
        ret.push('     <div class="other_login clearfix">');
        ret.push('  <span class="ml20 mr10">其他登录方式</span>');
        ret.push('<a href="#" class="logQq"></a>');
        ret.push(' <a href="#" class="logSina"></a>');
        ret.push('     <a href="#" class="logMsn"></a>');
        ret.push('    <a href="#" class="logBaidu"></a>');
        ret.push('      <a href="#" class="logTw"></a>');
        ret.push(' </div>');
        oBox.html(ret.join(''));
    }
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});






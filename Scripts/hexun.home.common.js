/// <reference path="jquery-1.7.1-vsdoc.js" />
/**
* @class ��Ѷ��԰
* @singleton
* @createTime 2012-12-20
* @updateTime 
* @note 
* @version 1.0
*/
var hexun = window.hexun || {};
hexun.home = hexun.home || {};

/**
* @class ������
* @singleton
* @createTime 2012-08-28
* @updateTime 
* @note 
* @version 1.0
*/

(function (window) {
    function empty(string) { //ȥ���ո�
        return string.replace(/\s*/g, '');
    }
    window.Jser = {
        /**
        ��������
        *@param {String} name          ����
        *@param {Object} base          ����(��Ҫ�̳еĸ���)
        *@param {Object} members       �Ǿ�̬��Ա(javascript��ֵ��)
        *@param {Object} staticMembers ��̬��Ա(javascript��ֵ��) 
        *@return {Object} ��������       
        */
        Class: function (name, base, members, staticMembers) {
            var names = empty(name).split('.'); // �ַ���ȥ�ո񣬷ָ���ַ�������
            var klassName = names.pop();        // ɾ����������������һ��Ԫ��
            var klass = members && members[klassName] ? eval('(function(){ return function(){ return this.' + klassName + '.apply(this, arguments);}})()') : eval('(function(){ return function(){}})()');
            var prototype = klass.prototype;    // klass �� ��������function(){this.klassName.apply(this,arguments);}  ��ȡklass��ԭ�Ͷ���
            klass.name__ = name;                // ��̬���� klass��name__Ϊ ����
            klass.base__ = [];                  // ��̬���� klass��base__Ϊ ���� �����Լ̳ж������,����Ϊ���飩
            if (base) {
                klass.base__ = klass.base__.concat(base.base__);    // ��������� ��ϲ��̳еĻ���
                klass.base__.push(base);                            // ������Ҳ��ӵ�����������
                $.extend(prototype, base.prototype);               // �̳л����ԭ��
            }
            for (var i in members) {
                var j = members[i];
                if (typeof j == "function") {
                    j.belongs = klass;
                    var o = prototype[i]        // o:�̳����Ի���ķ��� i:������
                    if (o && o.belongs) {
                        prototype[o.belongs.name__.replace(/\./g, '$') + '$' + i] = o;
                    }
                }
                prototype[i] = j;
            }
            klass.fn = prototype;               // ��̬���� klass��fnΪ klass��ԭ�Ͷ���
            $.extend(klass, staticMembers);    // ��չklass������
            var _this = window;
            while (e = names.shift())           // ɾ���������ص�һ��Ԫ�ص�ֵ e:�����ռ�����ƣ�û����Ϊȫ�ֶ���window
                _this = _this[e] || (_this[e] = {});
            if (_this[klassName])               // �ж������Ƿ��ظ�����
                throw Jser.Error(name + ' �����ظ�����'); // �׳�����
            _this[klassName] = klass;
            if (klass[klassName])               // ִ�г�ʼ������
                klass[klassName]();
            return klass;                       //���ص�ǰ��
        },
        /**
      ����ajax����
      */
        ajax: function (params) {
            var params = $.extend({
                type: 'GET', url: '', dataType: 'text', data: null, open: Jser.noop, success: Jser.noop, callbreak: null, error: null, callbleak: null, asyn: true
            }, params);
            var url = params.url;
            url = (url.indexOf('?') != -1) ? (url + '&') : (url + '?') + (new Date()).getTime(); // �ж�url�Ƿ����?,�����������?,�������& 
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
                                        throw Jser.Error('����XML���� ' + params.url + ' , ��ǩ  ' + parseError.srcText + '  ' + parseError.reason);
                                }
                                else
                                    throw Jser.Error('����XML���� ' + params.url);
                            }
                            xhr.abort(); //�ж�����
                            if (params.dataType == 'json') {
                                try {
                                    ret = eval('(' + text + ')');
                                }
                                catch (e_) {
                                    throw Jser.Error('����JSON���ݴ���')
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
        ����һ���쳣����
        * @param {String} msg �����쳣����������ַ���
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
��չjavascript String ����
*/
$.extend(String.prototype,
            {
                /**
                ��ʽ���ַ���
                <pre>
                    <code>
                        var str = '�������ձ�{0}������{1}����{2},��{0}���������Ըо���{2}';
                        var newStr = str.format('��', 10, '����'); 
                        //����: newStr='�������ձ���������10�������,�й����������Ըо�������';
                    </code>
                </pre>
                * @param {String} argu1 (Optional) ��ѡ���� Ҫ�滻���ַ���
                * @param {String} argu2.. (Optional) ��ѡ���� Ҫ�滻���ַ���
                * @return {String} ���ظ�ʽ������ַ���
                */
                format: function () {
                    var i = 0, val = this, len = arguments.length;
                    for (; i < len; i++)
                        val = val.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
                    return val;
                },
                /**
                ��ȡ�ַ�������,����һ���ֽڵ�����������
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
                /**����ַ��������пհ�*/
                empty: function () {
                    return this.replace(/\s+/g, '');
                },
                /**
                �ضϹ������ַ���
                * @param {Number} length Ҫ���ַ�����ʲôλ�ýض�
                * @param {String} rep (Optional) ��ѡ���� �ضϺ�Ҫ�滻���ִ�Ĭ��Ϊ"..."
                * @return {String} �������ַ���
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
* jQuery ��չ
*/
/**
����������չ,ֱ�ӽ��ı��ض�
* @param {Number} limit    ��������
* @param {String} selector ��ʾ�ı�
* @param {Object} options  ��������  isAutoLimit {Boolean} :�Ƿ��Զ��ض�Ĭ�Ͻض�  num {Number}��Ԥ����ʾ�ֽ���
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
            // �ж��Ƿ���Ҫ�ض��ı�
            if (length > limit && options.isAutoLimit) {
                self.val(self.val().substring(0, limit));
                length = limit;
                if (typeof selector === "function") {
                    selector.caller(self.get(0));
                }
            }
            if (typeof selector === "string") {
                var elem = $(selector), count = limit - length;
                // Ԥ����ʾ
                elem[options.num > length ? "hide" : "show"]();
                elem.html((count < 0) ? "�Ѿ�����<em style='color:#DA0000'>" + count * -1 + "</em>��" : "����������<em>" + count + "</em>��");
            }
        };
        return this;
    }
});

/*
���Ŀ��Զ������߶���չ
* @param {Number} minHeight    ��С���
* @param {Number} maxHeight    �����
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
                //�Ͱ汾�ļ���
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
��������
* @param {string} arguments[0]  ����className
* @param {string} arguments[1]  ���ɸ�����className
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
������ʾ
* @param {Object} elem ��ʾ�� DOM ElementԪ��
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
            throw "�봫����ʾԪ��.";
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

// ��������

// ��Ѷ��԰ �� ���ض���
hexun.home.toTop = (function () {
    var defaults = {
        elemID: "hxjy_gotop", //����ID
        footID: "hxjy_footer"   //ҳ��ID
    };
    var initialize = function () {
        $(window).bind('scroll', toGetTop);
        function toGetTop() {
            var oFoot = $("#" + defaults.footID), elemID = defaults.elemID;
            // ����һ�� ��ʾ���ض���
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

// �����Ż����̶�������
hexun.home.navBar = (function () {
    var defaults = {
        searchID: "hxjy_navbar_search_inp",     // �����û�ID
        newsID: "hxjy_navbar_info_news",        // ��ϢID
        informID: "hxjy_navbar_info_inform",    // ֪ͨID
        accountID: "hxjy_navbar_info_account",  // �˺�ID
        newsUrl: "data/data-news01.js",         // ��Ϣ��ַ
        informUrl: "data/data-inform01.js",     // ֪ͨ��ַ
        cacheClassName: "navbar_info_cur",      // δhover֮ǰ��className
        hoverClassName: "navbar_info_hover",    // hover�У�className
        times: 10000                             // ˢ��Ƶ�� 1����һ��
    };
    var initialize = function () {
        //���¼�
        bindEvent();
    };
    function bindEvent() {
        var $Search = $("#" + defaults.searchID),//����DOM
           times = defaults.times,//��Ϣ��֪ͨˢ��Ƶ��
           oInform = $("#" + defaults.informID);//֪ͨDOM
        oInformIcon = oInform.find(".navbar_info_num"),//֪ͨ��ICON
        cacheClassName = defaults.cacheClassName,
        hoverClassName = defaults.hoverClassName;
        // ������ʾ     
        $Search.prompt($Search.prev());
        // ��Ϣ
        loadData($("#" + defaults.newsID).find(".navbar_info_num"), defaults.newsUrl, times, "news");
        // ֪ͨ
        loadData(oInformIcon, defaults.informUrl, times, "inform");
        // ֪ͨ
        oInform.hover(function () {
            //����Ƿ����֪ͨ
            if (oInformIcon.text() * 1 > 0) {
                this.className += ' ' + hoverClassName;
            }
        }, function () {
            this.className = cacheClassName;
        })
        //�˺�
        $("#" + defaults.accountID).hover(function () {
            this.className = hoverClassName;
        }, function () {
            this.className = cacheClassName;
        })

    }
    /*
    ��������
    *   elem:   ICON����
    *   url:    ���ݵ�ַ
    *   time��  ˢ��Ƶ��
    *   type:   ��������news:��Ϣ  inform��֪ͨ
    */
    function loadData(elem, url, time, type) {
        // ����װ�Ķ����Ƿ����
        if (elem.length === 0) {
            return false;
        }
        setInterval(function () {
            Jser.ajax({
                url: url,
                dataType: "json",
                type: "GET",
                success: function (data) {
                    // ����װ�Ķ����Ƿ����
                    if (elem.length === 0) {
                        return false;
                    }
                    // �������״̬��Ϊ1��ʾ��������������
                    if (data.status == 1) {
                        // СICONͼ�� ��ʾ����                        
                        if (data.num != 0) {
                            // ��ȡ����  
                            elem.addClass("vshow").html(data.num > 99 ? 99 : data.num);
                        } else {
                            elem.addClass("vhide").html(0);
                        }
                        // ��������
                        if (type === "inform") {
                            var oUl = elem.next(),
                                html = data.html, i,
                                length = html.length,
                                ret = [];
                            for (i = 0; i < length; i++) {
                                // html[i][1]����ַ  html[i][0]������
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

// �����Ż���������Ч��
hexun.home.banner = (function () {
    var defaults = {
        showID: "hxjy_subnav_show", //�������ID
        closeID: "hxjy_subnav_close", //�ر����ID
        parelID: "hxjy_subnav_parel"//���ID
    };
    var initialize = function () {
        var oShow = $("#" + defaults.showID),//չʾDOM
            oParel = $("#" + defaults.parelID),//���DOM
            oClose = $("#" + defaults.closeID);//�ر�DOM
	    //ͼƬ����
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
        // չʾbanner
        oShow.click(function () {
            this.style.display = "none";
            oParel.show().animate({ height: "100px", opacity: "1" });
            return false;
        });
        // �ر�banner
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


// �����Ż����Զ��嵼����ͼƬ
hexun.home.bannerPic = (function () {
    var defaults = {
        btnID: 'hxjy_bannerBtn', // ������ ͼƬ ��ťID
        pageID: 'hxjy_page',
        url: 'data/data-personalcoverChange.js',
        pageUrl: ""
    };
    var initialize = function () {
        bindEvent();
    };
    function bindEvent() {
        var oBtn = $('#' + defaults.btnID); // ������ ͼƬ ��ť
        // ���� ���Ի�����
        oBtn.click(function () {
            loadData();
            return false;
        });
    };
    // ��������
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
                    ret.push('<li><a href="#">�Ƽ�����</a></li>');
                    ret.push('<li><a href="#" class="a_4e">�Զ���</a></li>');
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
                        tit: "���Ի�����",
                        sureTxt: "��&nbsp;��",
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
                            // ��ӷ�ҳ
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
                            //���¼�                           
                            $("#hxjy_banner_list").find("li").live("click", function () {
                                $("#hxjy_banner_list").find("li").each(function () {
                                    this.className = "";
                                });
                                this.className = "cover_select";
                                var src = $(this.getElementsByTagName('img')[0]).attr("src").split(".jpg")[0] + "big.jpg";
                                $("#" + defaults.btnID).prev().attr("src", src);
                                guid = src;
                            });
                            // �Ƽ�����
                            $(Me.oAlert).find('ul.pop_window_sec a:last').click(function () {
                                Me.closeAlert();
                                var ret = [];
                                ret.push('<ul class="pop_window_sec">');
                                ret.push('<li><a href="#" class="a_4e">�Ƽ�����</a></li>');
                                ret.push('<li><a href="#">�Զ���</a></li>');
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
                                    tit: "���Ի�����",
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

// ��Ѷ��԰ �� ������
hexun.home.alert = (function () {
    var defaults = {
        txt: "",
        html: "",
        addClass: "",
        callback: $.noop,
        isBtn: true,
        isBg: true,
        state: "alert" //alert:������Ϣ�� confirm:ȷ����Ϣ��       
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

// ��Ѷ��԰ �� ������
hexun.home.confirm = (function () {
    var defaults = {
        txt: "",
        html: "",
        addClass: "",
        callback: $.noop,
        isBtn: true,
        isBg: true,
        state: "confirm" //alert:������Ϣ�� confirm:ȷ����Ϣ�� 
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

// ��Ѷ��԰ �� ��ҳ
hexun.home.page = (function () {
    var defaults = {
        page: null,// ��ҳ��
        now: null, //��ǰҳ��
        panelID: "hxjy_page", //���ID
        noClass: "page_btn_no",//��ֹclass
        hoverClass: "page_btn_hover",//����class
        norClass: "page_btn",//Ĭ��Class
        selClass: "a_cur_page",// ѡ��ҳ��
        url: location.href, //��ת�ĵ�ַ
        state: "url",//״̬ ajax: ��ˢ��ҳ��  url ˢ��ҳ��
        callback: $.noop //ajax״̬�µ� �ص�����
    };
    var initialize = function () {
        var oPage = $("#" + defaults.panelID),//��ҳ
            oA = oPage.find(".cur_page").eq(0),//��ҳ hover
            oUl = oPage.find("ul").eq(0);//��ҳ�б�        
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


// ��Ѷ��԰ �� ��ҳ
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

// ��Ѷ��԰ �� ������ҳ
//������ҳ
Class('scrollBars', null, {
    //������
    scrollBars: function (options) {
        var options = $.extend(this.options, options || {});
        options.count = $.makeArray(options.count);
        options.url = $.makeArray(options.url);
        scrollBars.rethis = this;
        this.bindEvent();
        this.init();
    },
    height: 0,
    isScroll: true, //�Ƿ���������������ݷ��ص�֪
    options: {                           // ѡ����
        firstAction: true,
        pageSize: 10,
        fHeight: 100,                    // ����ײ��߶�
        index: 0,                        // ������ҳ���±�
        max: 3,                          // Ĭ�Ϲ����������ݴ���
        isManual: true,                  // �Ƿ����ֶ�����
        panelID: 'hxjy_scrollBar',       // ��ʾ�������ID
        manualID: "hxjy_scrollBar_manual", // �鿴����ID
        count: [0],                      // �����������
        url: [],                         // ���ݵ�ַ
        callback: $.noop,                // �ص�����
        doDataHtml: $.noop              // ������ƴ��ΪHTML
    },
    //��ʼ��
    init: function () {
        this.updateScene();             // ���³���
    },
    //���¼�
    bindEvent: function () {
        var options = this.options, Me = this;
        if (options.firstAction) {
            Me.loadData();  
        }
        //�󶨹����¼�      
        $(window).scroll(this.doScroll);
        // ����Ƿ���Ҫ�ֶ�����
        if (options.isManual) {
            var oManual = $('#' + options.manualID);
            oManual.click(function () {
                Me.loadData();
            });
        }
    },
    //����
    doScroll: function () {
        var Me = scrollBars.rethis, options = Me.options;
        // ����Ƿ񳬹�Ĭ�Ϲ�������
        if (options.count[options.index] < options.max) {
            // ����Ƿ� �������Ƿ񵽴�ײ�          
            if (Me.scrollTop() >= Me.height) {
                // ��������
                Me.loadData();
            }
        } else {
            // ����Ĭ�Ϲ�������
            $(window).unbind('scroll', Me.doScroll);    // ����󶨹����¼�
            // ����Ƿ���Ҫ�ֶ�����
            if (options.isManual) {
                var oManual = $('#' + options.manualID);
                // ����Ƿ���Ҫ������ҳ
                if (Me.isScroll) {
                    oManual.show().html("<span clas='clearfix'><em></em>�鿴����</span>");
                } else {
                    oManual.hide();
                }

            }
        }
    },
    //��������
    loadData: function () {
        var Me = this, options = Me.options, count = options.count[options.index], max = options.max,
            oManual = $('#' + options.manualID), pageIndex, url;
        if (count < max) { // �������ݹ����� ����󶨹����¼�        
            $(window).unbind('scroll', Me.doScroll);
        }
        if (options.isManual && Me.isScroll) {
            oManual.html("<span clas='clearfix'>��������Ŭ��������...</span>")
        }
        url = options.url[options.index];
        pageIndex = url.indexOf('?') != -1 ? '&' + 'pageIndex=' + count : '?pageIndex=' + count;
        url = options.url[options.index] + pageIndex;
        Jser.ajax({
            url: url,
            dataType: "json",
            type: "GET",
            success: function (data) {
                //�����Ϊ1������ֹ���̡�
                if (data.status != 1) { return false; }
                if (data.result.length === 0) {
                    Me.isScroll = false;
                    alert("�ף�û�и���������");
                    Me.updateScene();
                    return;
                }
                // �Զ���� ��˸����Ƿ���Ҫ������ҳ
                if (data.result.length < options.pageSize) {
                    Me.isScroll = false;
                }
                options.doDataHtml.call(Me, data);
                options.count[options.index]++;
                if (count < max && Me.isScroll) {  // �������ݽ���,���°��¼�
                    $(window).scroll(Me.doScroll);
                }
                Me.updateScene();           // ���³��� 
            }
        });
    },
    // ���³���
    updateScene: function () {
        //����߶�
        var options = this.options;
        this.height = this.heightFn();
        options.callback && options.callback();
        // ����Ƿ���Ҫ�ֶ�����
        if (options.isManual) {
            var oManual = $('#' + options.manualID);
            // ����Ƿ���Ҫ������ҳ
            if (this.isScroll) {
                oManual.show().html("<span clas='clearfix'><em></em>�鿴����</span>");
            } else {
                oManual.hide();
            }
        }
    },
    //������Ļ�߶�
    heightFn: function () {
        // ����ҳ��߶�:document.body.scrollHeight || document.documentElement.scrollHeight
        return (document.body.scrollHeight || document.documentElement.scrollHeight) - this.options.fHeight;
    },
    //�����������������
    scrollTop: function () {
        return (window.pageYOffset || document.documentElement.scrollTop) + (window.innerHeight || document.documentElement.offsetHeight)
    }
}, {
    rethis: ''
});

// ������
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
        //��ⱳ�����Ƿ����
        var oBg;
        oBg = $("body").children(".layer");
        if (!oBg.length) {
            // ����������
            oBg = document.createElement("div");
            document.body.appendChild(oBg);
            oBg.className = "layer";
        } else {
            oBg = oBg.get(0);
        }
        Me.oBg = oBg;
        // ����������
        var oAlert = document.createElement("div"), aHTML = [];
        if(Me.state == 'userUp'){
            aHTML.push('<span class="close" id=\"close\"></span><div class="grade1"><span>');
            aHTML.push(Me.txt +'</span><a href="#" class="btn">һ������</a></div>');
        }
        else{
        // tit:����, �رհ�ť
        aHTML.push('<h2><span class="left">' + (Me.tit || "") + '</span><a href="#" class="close_btn"></a></h2>');
        // �ı�����       
        // �ж��Ƿ���Ҫ������ʾ
        var txt = Me.txt || Me.html, reg = /^(?:[^#<]*<[\w\W]+>)[^>]*$/, isTXT = !reg.test(txt);//����Ƿ����HTML
        // ����Ƿ�Ϊ���ı�����������27��
        if (txt.length < 27 && isTXT) {
            aHTML.push('<p class="pop_con tc">' + txt + '</p>');
        } else {
            aHTML.push('<div class="pop_con">' + txt + '</div>');
        }
        if (!!Me.isBtn) {
            aHTML.push('<div class="pop_btn">');
            // ȷ��
            aHTML.push('<a class="btn btnSure">' + (Me.sureTxt || "ȷ&nbsp;��") + '</a>');
            // ȡ��
            if (Me.state === "confirm") {
                aHTML.push('<a class="btn btnCancel">ȡ&nbsp;��</a>');
            }
            aHTML.push(' </div>');
        }
        }
        oAlert.innerHTML = aHTML.join("");
        // ���뵽body��
        document.body.appendChild(oAlert);
        Me.oAlert = oAlert;
        var $oAlert = $(oAlert);
        //���� $(DOM Element)
        Me.context = $oAlert.find(".pop_con");
        // ȷ����ť
        Me.oSure = $oAlert.find(".btnSure");
        // ȡ����ť
        Me.oCancel = $oAlert.find(".btnCancel");
        // �رհ�ť
        Me.oClose = $oAlert.find(".close_btn");
        // �رհ�ť2
        Me.oClose2 = $oAlert.find(".close");
        // ���className
        oAlert.className = "pop_window " + Me.addClass;

        //����������λ��
        Me.onResize();
        Me.bindEvent();
        Me.callback && Me.callback.call(Me, Me.oAlert);
    },
    bindEvent: function () {
        var Me = this;
        Me.iTimer = null;
        // ȷ��
        this.oSure.click(function () {
            var ret;
            Me.isBg = true;
            ret = Me.sure.call(Me, Me.oSure);//�ص�����            
            if (ret !== false) {
                Me.closeAlert();//�ر�
            }
            return false;
        });
        // ȡ�� 
        this.oCancel.click(function () {
            var ret;
            Me.isBg = true;
            ret = Me.cancel.call(Me, Me.oSure);//�ص�����            
            if (ret !== false) {
                Me.closeAlert();//�ر�
            }
            return false;

        });
        // �ر�   
        this.oClose.click(function () {
            var ret;
            Me.isBg = true;
            ret = Me.close.call(Me, Me.oSure);//�ص�����            
            if (ret !== false) {
                Me.closeAlert();//�ر�
            }
            return false;
        });
        // �ر�2
        // �ر�
        this.oClose2.click(function () {
            var ret;
            Me.isBg = true;
            ret = Me.close.call(Me, Me.oSure);//�ص�����
            if (ret !== false) {
                Me.closeAlert();//�ر�
            }
            return false;
        });
        if (Me.state === "alert") {
            Me.timer || (Me.timer = 3000);
            setTimeout(function () { if (Me.iTimer != null) { Me.closeAlert.call(Me) } }, Me.timer);
        }

        //���ڷ����ı䣬����onResize���� ����������
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
            document.body.removeChild(Me.oBg); //ɾ���ڵ�   
        }
        document.body.removeChild(Me.oAlert); //ɾ���ڵ�
        return false;
    }
}, {});
// ��ҳ��
Class('Page', null, {
    Page: function (options) {
        $.extend(this, options);
        Page.rethis = this;
        this.init();
    },
    init: function () {
        var aHTML = [], now = this.now, norClass = this.norClass, noClass = this.noClass, page = this.page, i, state = this.state, url = this.url;
        if (state === "url") {
            //��ʱ�õ�URL�� ��������¸���URL
            var reg = /pageType=.+[\?|&]?/;
            url = (url.indexOf('?') != -1) ? (url + '&') : (url + '?');
            // ɾ��ԭ��pageType����
            url.replace(reg, "");
            // ��һҳ
            aHTML.push('<a href="' + (now > 1 ? (url + "pageType=" + (now - 1)) : "javascript:;") + '" class="' + (now > 1 ? norClass : noClass) + '" >��һҳ</a>');
            // ҳ��
            aHTML.push('<span class="cur_page">');
            // ��ǰҳ
            aHTML.push('<a href="#">��&nbsp;' + now + '&nbsp;ҳ&nbsp;</a><em></em>');
            aHTML.push('<div class="page_dropdown">')
            // ҳ�б�
            aHTML.push('<ul class="hide">');
            for (i = page; i > 0; i--) {
                aHTML.push('<li><a href="' + (i !== now ? (url + "pageType=" + i) : "javascript:;") + '" class="' + (i === now ? this.selClass : "") + '">��&nbsp;' + i + '&nbsp;ҳ</a></li>');
            }
            aHTML.push('</ul>');
            aHTML.push('</div>');
            aHTML.push('</span>');
            // ��һҳ
            aHTML.push('<a href="' + (now < page ? (url + "pageType=" + (now + 1)) : "javascript:;") + '" class="' + (now < page ? norClass : noClass) + '" >��һҳ</a>');
        } else if (state === "ajax") {
            // ��һҳ
            aHTML.push('<a href="javascript:;" class="' + (now > 1 ? norClass : noClass) + '" >��һҳ</a>');
            // ҳ��
            aHTML.push('<span class="cur_page">');
            // ��ǰҳ
            aHTML.push('<a href="#">��&nbsp;' + now + '&nbsp;ҳ&nbsp;</a><em></em>');
            // ҳ�б�
            aHTML.push('<ul class="page_dropdown hide">');
            for (i = page; i > 0; i--) {
                aHTML.push('<li><a href="javascript:;" class="' + (i === now ? this.selClass : "") + '">��&nbsp;' + i + '&nbsp;ҳ</a></li>');
            }
            aHTML.push('</ul>');
            aHTML.push('</span>');
            // ��һҳ
            aHTML.push('<a href="javascript:;" class="' + (now < page ? norClass : noClass) + '" >��һҳ</a>');
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

// ��ק
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


// ��һ�������x��y��
// �Է��ع�������ƫ����
function getScrollOffsets(w){
    w = w || window;
    //����IE8�Լ�����İ汾���⣬���������������
    if(w.pageXOffset != null){
        return {x:w.pageXOffset,y:w.pageYOffset};
    }
    //�Ա�׼ģʽ��IE�����κ��������
    var d = w.document;
    if(document.compatMode == "CSS1Compat"){
        return {x:d.documentElement.scrollLeft,y:d.documentElement.scrollTop}
    }
    //�Թ���ģʽ�µ������
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
// ���Ǧ��Ч��
$("#headPencli").hover(function(){
    $(this).prev().toggleClass('navbar_write_blogHover');
});
// ������½����
hexun.home.login = (function(){
    var defaults = {
        logBoxId:'logBox',  // ��½��
        loginInputClass:'loginInput', // ��½�ı�����
        focusClass:'log_focus',
        errorClass:'log_error'
    };
    var initialize = function(){
        var $eleBox = $('#' + defaults.logBoxId),
            $eleInputs = $eleBox.find('.' + defaults.loginInputClass),
            comVad = /[^a-z0-9A-Z]/, //����У��
            e = defaults.errorClass,
            f = defaults.focusClass;
        $(function(){
            $eleInputs.each(function(){
                if($(this).val() != ''){
                    $(this).prev().hide();
                }
            })
        });
        // �û���t�¼�
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
                $(this).prev().html('�û�������');
            }
            else{
                p.removeClass(f)
            }
            $(this.parentNode).next().show();
        });
        // �����¼�
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
                $(this).prev().html('�������');
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
// ��½����
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
        ret.push('<div class="fl log_input log_w1 pr"> <span class="tishi">�������û���</span><input type="text" class="loginInput" /></div>');
        ret.push('<div class="isRight fl mt5 ml10"></div>');
        ret.push('</div>');
        ret.push('  <div class="clearfix pt20 pl20">');
        ret.push('  <div class="log_input log_w1 pr fl"><em class="tishi"> ����������</em><input type="password" class="loginInput" /></div>');
        ret.push('  <div class="isRight fl mt5 ml10"></div>');
        ret.push('    </div>');
        ret.push(' <div class="clearfix pl20 pt15"><a href="#" class="a_btn fl">&nbsp;��&nbsp;¼&nbsp;</a>');
        ret.push('  <div class="fr pr40 pt3">');
        ret.push('      <label class="fl mr10 color_45"> <input class="remb" type="checkbox"/> ��ס��</label><a href="#">��������</a>');
        ret.push(' </div>');
        ret.push(' </div>');
        ret.push('     <div class="other_login clearfix">');
        ret.push('  <span class="ml20 mr10">������¼��ʽ</span>');
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






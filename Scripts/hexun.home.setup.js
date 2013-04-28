/**
 * Created with JetBrains WebStorm.
 * User: zy
 * Date: 13-1-21
 * Time: 上午9:03
 * 和讯家园设置中心页面
 */

//设置中心→个性域名
hexun.home.setupDomain = (function () {
    var defaults = {
        domainID: "sc-domainInput1",
        focusClassName: "sc-domainFocus",
        errorsClassName: 'sc-domainError',
        rightClassName: 'sc-domainSucces'
    };
    function initialize() {
        bindEvent();
    };
    function bindEvent() {
        var oDomain = $("#" + defaults.domainID),
	    parent = oDomain.parent(),
        val, reg = /[^a-zA-Z0-9]/;//域名判断是否合法
        oDomain.bind('focus', function () {

            parent.removeClass(defaults.rightClassName + ' ' + defaults.errorsClassName).addClass(defaults.focusClassName);

        }).bind('blur', function () {
            val = this.value;
            if (val.length > 3 && val.length < 100 && !reg.test(val)) {
                parent.removeClass(defaults.focusClassName + ' ' + defaults.rightClassName + " " + defaults.errorsClassName).addClass(defaults.rightClassName);
            } else {
                parent.removeClass(defaults.focusClassName + ' ' + defaults.rightClassName + " " + defaults.errorsClassName).addClass(defaults.errorsClassName);
            }
        });
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    };
});
// 设置中心→个人资料
hexun.home.setupPersonalData = (function () {
    var defaults = {
        nicknameID: "hxjy_setup_nicknameID", // 昵称ID
        emailID: "hxjy_setup_email",// 邮箱ID
        msnID: "hxjy_setup_msn",// MSN ID
        qqID: "hxjy_setup_qq",// QQ ID
        focusClassName: "inputFocus", // 高亮class name
        rightClassName: "vRight",// 正确class name
        errorClassName: "vError",// 失败class name
        nicknameUrl: "data/data-setcenterMess.js", // 昵称请求地址
        authenticateId: "authenticate", // 申请深证按钮ID
        panelID: "pop_window", // 申请面板ID
        textarea2Id: "authenticatearea", // 第二个文本区域
        textarea1Id: "sc-messTextarea", // 第一个文本区域
        layerID: "layer1", // 遮罩层ID
        inputPanel: "sc-messTC", // input包含框
        focusClassName1: "sc-messTCinput1Focus", // 高亮class name
        rightClassName1: "sc-messTCinput1Success",// 正确class name
        errorClassName1: "sc-messTCinput1Error",// 失败class name
        focusTextareaClassName: 'sc-messTCtextareaFocus',
        close1: 'hxjy-setup-tc1-close'
    };
    var initialize = function () {
        // 绑定事件
        bindEvent();
    };
    function bindEvent() {
        var oNickname = $("#" + defaults.nicknameID),// 昵称 $（DOM）
	        oEmail = $("#" + defaults.emailID),// 邮箱 $(DOM)
            oMsn = $("#" + defaults.msnID),// MSN $(DOM)
            oQQ = $("#" + defaults.qqID),// QQ $(DOM)
		    regEmail = /^(?:\w+\.?)*\w+@(?:\w+\.?)*\w+$/,// email检测
		    regQq = /\D/,// 常规检测非数字
	        regNormal = /\W/,// 常规检测非ascii字符
            reg1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/,// 身份证验证15位
	        reg2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])(\d{3})(\d|[X]|[x])$/,// 身份证验证18位
            oauthenticate = $("#" + defaults.authenticateId), // 申请认证
		    opanel = $("#" + defaults.panelID), // 认证内容面板
		    olayer = $("#" + defaults.layerID), // 遮罩层
	        osubmit = opanel.find('a.a_btn'),
	        r = defaults.rightClassName,
	        e = defaults.errorClassName,
	        f = defaults.focusClassName,
	        r1 = defaults.rightClassName1,
	        e1 = defaults.errorClassName1,
	        f1 = defaults.focusClassName1,
	        tf1 = defaults.focusTextareaClassName,
	        oParent;
        oNickname.get(0).url = defaults.nicknameUrl; //昵称地址存为DOM的属性
        // 聚焦、离焦方法(带请求校验)
        oNickname.focus(focusFn).blur(blurFn); // 昵称绑定事件
        oEmail.focus(focusFn).blur(blurFnEmail); // email绑定事件
        oMsn.focus(focusFn).blur(blurFnEmail); // msn绑定事件
        oQQ.focus(focusFn).blur(blurFnQq);  // qq绑定事件
        $("#" + defaults.inputPanel + ' .sc-messTCinput1').each(blurFNTc); //弹出层绑定事件
        $("#" + defaults.textarea2Id).focus(function () {
            var oParent = $(this.parentNode.parentNode);
            oParent.addClass(tf1);

        }).blur(function () {
            var oParent = $(this.parentNode.parentNode);
            oParent.removeClass(tf1)
        })//弹出层textarea绑定事件
        $("#" + defaults.textarea1Id).focus(function () {
            var oParent = $(this.parentNode.parentNode);
            oParent.addClass(f);
        }).blur(function () {
            var oParent = $(this.parentNode.parentNode);
            oParent.removeClass(f);
        });//textarea绑定事件

        //获得焦点的绑定事件
        function focusFn() {
            // 高亮
            oParent = $(this.parentNode.parentNode);
            oParent.removeClass(r + ' ' + e).addClass(f);
        };
        // 昵称发送请求函数
        function blurFn() {
            oParent = $(this.parentNode.parentNode);
            if (this.value.length == 0 || regNormal.test(this.value)) {
                oParent.removeClass(r + ' ' + f).addClass(e);
                return;
            }
            // 数据检测
            loadData.call(this);
        };
        // email校验
        function blurFnEmail() {
            oParent = $(this.parentNode.parentNode);
            if (!regEmail.test(this.value)) {
                oParent.removeClass(f + ' ' + r).addClass(e);
            } else {
                oParent.removeClass(f + ' ' + e).addClass(r);
            }
        }
        // qq校验
        function blurFnQq() {
            oParent = $(this.parentNode.parentNode);
            if (this.value.length == 0 || regQq.test(this.value)) {
                oParent.removeClass(f + ' ' + r).addClass(e);
            } else {
                oParent.removeClass(f + ' ' + e).addClass(r);
            }
        }
        // 弹出层校验
        function blurFNTc(a, b) {
            // 添加焦点事件
            $(this).focus(function () {
                oParent = $(this.parentNode.parentNode);
                oParent.removeClass(r1 + ' ' + e1).addClass(f1);
            })
            // 第四个为身份证校验
            if (a == 3) {
                $(b).blur(function () {
                    oParent = $(this.parentNode.parentNode);
                    if (!reg1.test(this.value) && !reg2.test(this.value)) {
                        oParent.removeClass(f1 + ' ' + r1).addClass(e1);
                        return;
                    }
                    else {
                        oParent.removeClass(f1 + ' ' + e1).addClass(r1);
                    }
                });
            }
                // 失去焦点事件，普通合法校验
            else {
                $(this).blur(function () {
                    oParent = $(b.parentNode.parentNode);
                    if (b.value.length == 0 || regNormal.test(this.value)) {
                        oParent.removeClass(r1 + ' ' + f1).addClass(e1);
                    }
                    else {
                        oParent.removeClass(f1 + ' ' + e1).addClass(r1);
                    }
                });
            }


        }
        // 打开申请面板
        oauthenticate.click(function () {
            opanel.css('left', (document.documentElement.clientWidth || document.body.clientWidth) / 2 - opanel.width() / 2 + (document.documentElement.scrollLeft || document.body.scrollLeft))
            opanel.css('top', (document.documentElement.clientHeight || document.body.clientHeight) / 2 - opanel.height() / 2 + (document.documentElement.scrollTop || document.body.scrollTop))
            olayer.show();
            opanel.show('slowly');
            return false;
        });
        // 关闭申请面板
        $("#" + defaults.close1).click(function () {
            olayer.hide();
            opanel.hide('slowly');
            return false;
        })
        // 提交申请
        osubmit.click(function () {
            olayer.hide();
            opanel.hide();
            alert("您的申请已经提交，请耐心等待。");            
            return false;
        })

    };
    // 数据请求函数
    function loadData() {
        var url = this.url, id = this.id, that = this;
        url += (url.indexOf('?') != -1 ? "&" : "?") + "theMess=" + id;
        document.title = url;
        Jser.ajax({
            url: url,
            dataType: "json",
            type: "GET",
            success: function (data) {
                var oParent = $(that.parentNode.parentNode),
		            f = defaults.focusClassName,
		            r = defaults.rightClassName,
		            e = defaults.errorClassName;
                if (data.status == 1) {
                    oParent.removeClass(f + ' ' + e).addClass(r);
                }
                else {
                    oParent.removeClass(f + ' ' + r).addClass(e);
                }
            },
            error: {
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
// 设置中心→账号安全
hexun.home.accountSafe = (function () {
    var defaults = {
        accountPassId: 'sc-accountPass',
        focusClassName: 'inputFocus',
        rightClassName: 'vRight',
        errorClassName: 'vError',
        accountEmail1Id: 'hxjy-sc-account-email1',
        accountEmailNewId: 'hxjy-sc-account-emailnew',
        accountEmailNewPassId: 'hxjy-sc-account-emailnewPass',
        accountMobile1Pannel: "hxyj-sc-account-mobile1Panel"
    };
    var initialize = function () {
        // 绑定事件
        bindEvent();
    };
    function bindEvent() {
        var oPannel = $('#' + defaults.accountPassId),
			oPannelInput = oPannel.find('input.sc-messInput1'),
			oinputSpan = oPannel.find('span.sc-inputSpan01'),
			oAccountEmail1 = $('#' + defaults.accountEmail1Id),
			oAccountEmailnew = $('#' + defaults.accountEmailNewId),
			oAccountEmailnewPass = $('#' + defaults.accountEmailNewPassId),
			oAccountMobile1 = $('#' + defaults.accountMobile1Pannel),
			r = defaults.rightClassName,
			f = defaults.focusClassName,
			e = defaults.errorClassName,
			reg1 = /\W/,
			regEmail = /^(?:\w+\.?)*\w+@(?:\w+\.?)*\w+$/,// email检测
			regTel = /^1[3|5|4|8][0-9]\d{8}$/,
			regPass = /^(([A-Z])+|([a-z]+)|(\d+))$/,// pass检测 祖母数字组合，且长度至少为6位数
			pass1,
			pass2,
			oParent1 = $(oPannelInput[1]).parent().parent(),
			oParent2 = $(oPannelInput[2]).parent().parent(),
			oParent;
        oPannelInput.each(fn1);
        function fn1(index, elem) {
            if (0 == index) {
                $(elem).focus(focusFN);
                $(elem).bind('blur', function () {
                    oParent = $(this.parentNode.parentNode);
                    if (this.value.length == 0 || regPass.test(this.value)) {
                        oParent.removeClass(r + ' ' + f).addClass(e);
                    }
                    else {
                        oParent.removeClass(e + ' ' + f).addClass(r);
                    }
                });
            }
            else if (1 == index) {
                $(elem).prompt(oinputSpan.get(0));
                $(elem).focus(focusFN);
                $(elem).bind('blur', blurFN1);
            }
            else if (2 == index) {
                $(elem).focus(focusFN);
                $(elem).bind('blur', blurFN1)
            }
            else { }
        }
        function focusFN() {
            oParent = $(this.parentNode.parentNode);
            oParent.removeClass(r + ' ' + e).addClass(f);
        }
        function blurFN1() {
            oParent = $(this.parentNode.parentNode);
            pass1 = oPannelInput[1].value;
            pass2 = oPannelInput[2].value;
            if (pass1.length > 5 && pass1 == pass2 && !regPass.test(pass1) && !regPass.test(pass2)) {
                oParent1.removeClass(f + ' ' + e).addClass(r);
                oParent2.removeClass(f + ' ' + e).addClass(r);
            }
            else if (pass1.length > 5 && pass2.length == 0 && !regPass.test(pass1)) {
                oParent1.removeClass(f + ' ' + e).addClass(r);
                oParent.removeClass(f);
            }
            else if (pass2.length > 5 && pass1.length == 0 && !regPass.test(pass2)) {
                oParent2.removeClass(f + ' ' + e).addClass(r);
                oParent.removeClass(f);
            }
            else {
                oParent.removeClass(f + ' ' + r).addClass(e);
            }
        }
        //邮箱绑定校验
        oAccountEmail1.focus(focusFN).blur(blurEmail);
        oAccountEmailnew.focus(focusFN).blur(blurEmail);
        oAccountEmailnewPass.focus(focusFN).blur(function () {
            oParent = $(this.parentNode.parentNode);
            if (this.value.length < 6 || regPass.test(this.value)) {
                oParent.removeClass(r + ' ' + f).addClass(e);
            }
            else {
                oParent.removeClass(f + ' ' + e).addClass(r);
            }
        });
        oAccountMobile1.find('input.sc-messInput1').focus(focusFN).blur(function () {
            oParent = $(this.parentNode.parentNode);
            if (regTel.test(this.value)) {
                oParent.removeClass(f + ' ' + e).addClass(r);
            }
            else {
                oParent.removeClass(r + ' ' + f).addClass(e);
            }
        });
        oAccountMobile1.find('.a_btn:last').bind('click', function () {
            var checked = oAccountMobile1.find('input[type=checkbox]').is(":checked");
            var rightVer = oAccountMobile1.find('input.sc-messInput1').parent().parent().hasClass(r);
            if (!checked) {
                $(this).parent().prev().prev().show();
            }
            else {
                $(this).parent().prev().prev().hide();
            }
            if (!rightVer) {
                oAccountMobile1.find('input.sc-messInput1')[0].focus();
            }
            else {
                //提交表单
            }
            return false;
        })
        oAccountMobile1.find('input[type=checkbox]').parent().click(function () {
            var a = $(this).find('input').is(':checked');
            if (a) {
                $(this).parent().prev().hide();
            }
        })
        function blurEmail() {
            oParent = $(this.parentNode.parentNode);
            if (regEmail.test(this.value)) {
                oParent.removeClass(f + ' ' + e).addClass(r);
            }
            else {
                oParent.removeClass(r + ' ' + f).addClass(e);
            }
        }

    };
    // 数据请求函数
    function loadData() {
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// 设置中心 → 消息
hexun.home.setupNews = (function () {
    var defaults = {
        panelID: "hxjy_setupNews_panel",// 消息面板
        sentID: "hxjy_setupNews_sent",//发消息
        url: "data/data01.js",
        validateURL: "data/data01.js", //验证码URL
        validateCodeURL: "data/data01.js", //验证验证码URL,
        sendMessPanel:"message-send", // 发送消息面板
        url1:"data/data02.js"
    };
    var initialize = function () {
        bindEvent();
        hexun.home.page().init();
    };
    function bindEvent() {
        var oPanel = $("#" + defaults.panelID),
            oSent = $("#" + defaults.sentID),
            oSendId = $("#" + defaults.sendMessPanel),
            oTextArea = oSendId.find('textarea'),
            oToName = oSendId.find('.messToName'),
            oSendBtn = oSendId.find('.add_btn_pink'),
            oSpaninfo = oSendId.find('.messageTextArea span');
        //  绑定消息框
            oTextArea.bind('focus',function(){$(this).addClass('textarea1');if(this.value !=''){
                oSpaninfo.hide();
            }}).bind('blur',function(){
                    $(this).removeClass('textarea1');
                    if(this.value ==''){
                        oSpaninfo.show();
                    }
                }).bind('input',function(){oSpaninfo.hide();}).bind('propertychange',function(){oSpaninfo.hide();});
        oSendBtn.click(messView);
            function messView(){
                var url =  defaults.url1;
                var val = escape(oTextArea.val());
                url += url.indexOf('?') != -1 ? "value=" + val : "?value=" + val;
                Jser.ajax({
                    url:url,
                    dataType:"json",
                    type:"GET",
                    success: function(data){
                        if(data.status == 1){
                            doMessHtml(data)
                        }

                    }

                })
                return false;
            }
        function doMessHtml(data){
            /*
            * <dl class="message_dl clearfix">
             <dt><a href="#">
             <img alt="" src="images/temp6.png"></a> </dt>
             <dd>
             <p><a href="#">那些年我们追的股票：</a>悬疑再起！ - 缩量十字星，令市场悬疑再起！ 当萎缩低迷的成交量、"阴包阳"的K线组合型态、以及短期5日线的失守等等诸多弱市特征汇集于昨日的市场盘面走势时...缩量十字星，令市场悬疑再起！ - 缩量十字星，令市场悬疑再起！ 当萎缩低迷的成交量、"阴包阳"的K线组合型态、以及短期5日线的失守等等诸多弱市特征汇集于昨日的市场盘面走势时...- 缩量十字星，令市场悬疑再起！ 当萎缩低迷的成交量"阴包阳"</p>
             <div class="message_dd_bt"><span><a title="回复:那些年我们追的股票" class="a_9c setupNews_reply" href="#">回复</a> 丨 <a class="a_9c setupNews_del" href="#">删除</a></span> 21分钟前</div>
             </dd>
             </dl>
             */

            var i= 0,oHtml,ret =[],data =data.results,len = data.length;
            if(len >= 1){
            for(;i<len;i++){
                ret.push('<dl class="message_dl clearfix">');
                ret.push('<dt><a href="'+ data[i]["linkImg"] +'">');
                ret.push('<img alt="');
                ret.push(data[i]["alt"]);
                ret.push('"');
                ret.push(' src="');
                ret.push(data[i]["head"]);
                ret.push('"></a> </dt>');
                ret.push('<dd><p><a href="');
                ret.push(data[i]["linkImg"]);
                ret.push('">');
                ret.push(data[i]['name']);
                ret.push('</a>');
                ret.push(data[i]["text"]);
                ret.push('</p>');
                ret.push('<div class="message_dd_bt"><span><a title="');
                ret.push('data[i]["name"]');
                ret.push('" class="a_9c setupNews_reply" href="#">回复</a>');
                ret.push(' 丨 <a class="a_9c setupNews_del" href="#">删除</a></span> ');
                ret.push(data[i]["time"])
                ret.push('分钟前</div>');
                ret.push('</dd></dl>');
            }
            oHtml = ret.join('');
            oPanel.prepend(oHtml);
            }
        }



        //删除
        oPanel.find("a.setupNews_del").live("click", function () {
            var self = this, oParent;
            hexun.home.confirm().init({
                txt: "确定要删除这条消息吗？",
                sure: function () {
                    Jser.ajax({
                        url: defaults.url,
                        dataType: "json",
                        type: "GET",
                        success: function (data) {
                            if (data.status == 1) {
                                oParent = $(self.parentNode.parentNode.parentNode.parentNode);
                                oParent.animate({
                                    "height": "0px",
                                    "opacity": 0
                                }, 500, function () {
                                    oParent.remove();
                                });
                            }
                        },
                        error: {}
                    });

                }
            });
            return false;
        });
        //回复
        oPanel.find("a.setupNews_reply").live("click", function () {
            msg({ name: this.getAttribute("title").split("回复:")[1] });
            return false;
        });
        //发消息
        oSent.click(function () {
            msg();
            return false;
        });
    };
    function msg(options) {
        var ret = [], options = options || {};
        ret.push('<div class="clearfix">');
        ret.push('<label class="sc-sendMessLabel1 fl">收件人：</label>');
        ret.push('<div class="sc-sendMessInput1Box fl pr">');
        if (!options.name) {
            ret.push('<input type="text" class="sc-messInput1" maxlength="100" />');
        } else {
            debugger
            ret.push('<input type="text" class="sc-messInput1" maxlength="100" value=' + options.name + ' disabled="disabled" />');
        }
        ret.push('</div>');
        ret.push('</div>');
        ret.push('<div class="mt30 clearfix">');
        ret.push('<div>');
        ret.push('<label class="sc-sendMessLabel1 fl">内　容：</label>');
        ret.push('<div class="sc-sendMessInput1Box fl">');
        ret.push('<textarea class="sc-sendMessArea">请输入您要发送的内容</textarea>');
        ret.push('</div>');
        ret.push('</div>');
        ret.push('</div>');
        ret.push('<div class="mt30">');
        ret.push('<div class="clearfix">');
        ret.push('<label class="sc-sendMessLabel1 fl">验证码：</label>');
        ret.push('<div class="sc-sendMessInput2Box fl">');
        ret.push('<input type="text" class="sc-messInput1" />');
        ret.push('</div>');
        ret.push('<div class="sc-sendMessVeryImg ml10 fl pr">');
        ret.push('<img src="http://message.hexun.com/VCodePic.aspx?userid=19015870&pp=49824346" alt="" />');
        ret.push('</div>');
        ret.push('<a href="#" class="fl ml10 sc-sendMessVeryView">点击查看验证码</a>');
        ret.push('</div>');
        ret.push('<div class="clearfix sc-sendMessVeryWarning">请根据上图中的字符输入验证码</div>');
        ret.push('</div>');
        hexun.home.alert().init({
            txt: ret.join(""),
            tit: "发送消息",
            addClass: "w558",
            sureTxt: "&nbsp;发&nbsp;送&nbsp;",
            sure: function () { //发送
                var self = this, $Alert = $(this.oAlert), cont, validate,
                    aInput = $Alert.find('input.sc-messInput1'),
                 name = aInput.eq(0).val();
                //收件人
                if (name.empty() == "") {
                    alert("没有填写收件人");
                    return false;
                }
                //内容
                cont = $Alert.find('textarea.sc-sendMessArea').val();
                if (cont.empty() == "" || cont == "请输入您要发送的内容") {
                    alert("没有填写内容");
                    return false;
                }
                //验证码
                validate = aInput.eq(-1).val();
                // 验证码验证
                Jser.ajax({
                    url: (defaults.validateCodeURL + "?validate=" + validate),
                    dataType: "json",
                    type: "GET",
                    success: function (data) {
                        // 验证码验证成功，发送数据
                        if (data.status == 1) {
                            Jser.ajax({
                                url: defaults.url,
                                dataType: "json",
                                type: "GET",
                                success: function (data) {
                                    if (data.status == 1) {
                                        self.closeAlert();//关闭对话框
                                    }
                                },
                                error: {}
                            });
                        }
                    },
                    error: {}
                });
                return false;
            },
            callback: function (elem) {
                var $elem = $(elem), oParent, cacheVal,$tit = $elem.find('h2');
                //收件人、验证码
                $elem.find('input.sc-messInput1').focus(function () {
                    oParent = null;
                    oParent = this.parentNode.parentNode;
                    oParent.className += " inputFocus";
                }).blur(function () {
                    oParent.className = oParent.className.replace(/(\s+inputFocus)+/, "");
                    if (this.index == 1) {
                        //验证码
                        if (this.value.length != 4) {
                            oParent.className += " inputError";
                        } else {
                            //ajax  检测验证码是否正确
                            Jser.ajax({
                                url: defaults.url,
                                dataType: "json",
                                type: "GET",
                                success: function (data) {
                                    if (data.status != 1) {
                                        oParent.className += " inputError";
                                    }
                                },
                                error: {}
                            });
                        }
                    }

                });
                //内容
                $elem.find('textarea.sc-sendMessArea').focus(function () {
                    oParent = null;
                    oParent = this.parentNode.parentNode;
                    oParent.className += " inputFocus";
                    cacheVal || (cacheVal = this.value);
                    if (this.value == cacheVal) {
                        this.value = "";
                    }
                }).blur(function () {
                    oParent.className = "";
                    if (this.value.empty() == "") {
                        this.value = cacheVal;
                    }
                });
                //验证码
                var oDiv = $elem.find("div.sc-sendMessVeryImg")
                oDiv.click(validateFn);
                $elem.find("a.sc-sendMessVeryView").click(validateFn);
                function validateFn() {
                    Jser.ajax({
                        url: defaults.validateURL,
                        dataType: "json",
                        type: "GET",
                        success: function (data) {
                            if (data.status == 1) {
                                oDiv.find("img").attr("src", "http://message.hexun.com/VCodePic.aspx?userid=19015870&pp=49824346");
                            }
                        },
                        error: {}
                    });

                    return false;
                }
                // 添加拖拽
                new Drag({box:$elem,ele:$tit,x:0,y:0,disX:0,disY:0});
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

// 设置中心 → 通知
hexun.home.setupInform = (function () {
    var defaults = {
        panelID: "hxjy_setupInform_panel",//面板
        delectID: "hxjy_setupInform_delect",//删除ID
        allID: "hxjy_setupInform_all",//全选
        delURL: "data/data01.js"

    };
    var initialize = function () {
        bindEvent();
        hexun.home.page().init();
    };
    function bindEvent() {
        var oPanel = $("#" + defaults.panelID),//面板
            oAll = $("#" + defaults.allID),//全选
            oDelect = $("#" + defaults.delectID),//删除
            aCheckbox;

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
                hexun.home.alert().init({ txt: "请选择要删除的通知！" });
            }
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
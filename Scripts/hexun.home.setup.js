/**
 * Created with JetBrains WebStorm.
 * User: zy
 * Date: 13-1-21
 * Time: ����9:03
 * ��Ѷ��԰��������ҳ��
 */

//�������ġ���������
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
        val, reg = /[^a-zA-Z0-9]/;//�����ж��Ƿ�Ϸ�
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
// �������ġ���������
hexun.home.setupPersonalData = (function () {
    var defaults = {
        nicknameID: "hxjy_setup_nicknameID", // �ǳ�ID
        emailID: "hxjy_setup_email",// ����ID
        msnID: "hxjy_setup_msn",// MSN ID
        qqID: "hxjy_setup_qq",// QQ ID
        focusClassName: "inputFocus", // ����class name
        rightClassName: "vRight",// ��ȷclass name
        errorClassName: "vError",// ʧ��class name
        nicknameUrl: "data/data-setcenterMess.js", // �ǳ������ַ
        authenticateId: "authenticate", // ������֤��ťID
        panelID: "pop_window", // �������ID
        textarea2Id: "authenticatearea", // �ڶ����ı�����
        textarea1Id: "sc-messTextarea", // ��һ���ı�����
        layerID: "layer1", // ���ֲ�ID
        inputPanel: "sc-messTC", // input������
        focusClassName1: "sc-messTCinput1Focus", // ����class name
        rightClassName1: "sc-messTCinput1Success",// ��ȷclass name
        errorClassName1: "sc-messTCinput1Error",// ʧ��class name
        focusTextareaClassName: 'sc-messTCtextareaFocus',
        close1: 'hxjy-setup-tc1-close'
    };
    var initialize = function () {
        // ���¼�
        bindEvent();
    };
    function bindEvent() {
        var oNickname = $("#" + defaults.nicknameID),// �ǳ� $��DOM��
	        oEmail = $("#" + defaults.emailID),// ���� $(DOM)
            oMsn = $("#" + defaults.msnID),// MSN $(DOM)
            oQQ = $("#" + defaults.qqID),// QQ $(DOM)
		    regEmail = /^(?:\w+\.?)*\w+@(?:\w+\.?)*\w+$/,// email���
		    regQq = /\D/,// �����������
	        regNormal = /\W/,// �������ascii�ַ�
            reg1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/,// ����֤��֤15λ
	        reg2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])(\d{3})(\d|[X]|[x])$/,// ����֤��֤18λ
            oauthenticate = $("#" + defaults.authenticateId), // ������֤
		    opanel = $("#" + defaults.panelID), // ��֤�������
		    olayer = $("#" + defaults.layerID), // ���ֲ�
	        osubmit = opanel.find('a.a_btn'),
	        r = defaults.rightClassName,
	        e = defaults.errorClassName,
	        f = defaults.focusClassName,
	        r1 = defaults.rightClassName1,
	        e1 = defaults.errorClassName1,
	        f1 = defaults.focusClassName1,
	        tf1 = defaults.focusTextareaClassName,
	        oParent;
        oNickname.get(0).url = defaults.nicknameUrl; //�ǳƵ�ַ��ΪDOM������
        // �۽����뽹����(������У��)
        oNickname.focus(focusFn).blur(blurFn); // �ǳư��¼�
        oEmail.focus(focusFn).blur(blurFnEmail); // email���¼�
        oMsn.focus(focusFn).blur(blurFnEmail); // msn���¼�
        oQQ.focus(focusFn).blur(blurFnQq);  // qq���¼�
        $("#" + defaults.inputPanel + ' .sc-messTCinput1').each(blurFNTc); //��������¼�
        $("#" + defaults.textarea2Id).focus(function () {
            var oParent = $(this.parentNode.parentNode);
            oParent.addClass(tf1);

        }).blur(function () {
            var oParent = $(this.parentNode.parentNode);
            oParent.removeClass(tf1)
        })//������textarea���¼�
        $("#" + defaults.textarea1Id).focus(function () {
            var oParent = $(this.parentNode.parentNode);
            oParent.addClass(f);
        }).blur(function () {
            var oParent = $(this.parentNode.parentNode);
            oParent.removeClass(f);
        });//textarea���¼�

        //��ý���İ��¼�
        function focusFn() {
            // ����
            oParent = $(this.parentNode.parentNode);
            oParent.removeClass(r + ' ' + e).addClass(f);
        };
        // �ǳƷ���������
        function blurFn() {
            oParent = $(this.parentNode.parentNode);
            if (this.value.length == 0 || regNormal.test(this.value)) {
                oParent.removeClass(r + ' ' + f).addClass(e);
                return;
            }
            // ���ݼ��
            loadData.call(this);
        };
        // emailУ��
        function blurFnEmail() {
            oParent = $(this.parentNode.parentNode);
            if (!regEmail.test(this.value)) {
                oParent.removeClass(f + ' ' + r).addClass(e);
            } else {
                oParent.removeClass(f + ' ' + e).addClass(r);
            }
        }
        // qqУ��
        function blurFnQq() {
            oParent = $(this.parentNode.parentNode);
            if (this.value.length == 0 || regQq.test(this.value)) {
                oParent.removeClass(f + ' ' + r).addClass(e);
            } else {
                oParent.removeClass(f + ' ' + e).addClass(r);
            }
        }
        // ������У��
        function blurFNTc(a, b) {
            // ���ӽ����¼�
            $(this).focus(function () {
                oParent = $(this.parentNode.parentNode);
                oParent.removeClass(r1 + ' ' + e1).addClass(f1);
            })
            // ���ĸ�Ϊ����֤У��
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
                // ʧȥ�����¼�����ͨ�Ϸ�У��
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
        // ���������
        oauthenticate.click(function () {
            opanel.css('left', (document.documentElement.clientWidth || document.body.clientWidth) / 2 - opanel.width() / 2 + (document.documentElement.scrollLeft || document.body.scrollLeft))
            opanel.css('top', (document.documentElement.clientHeight || document.body.clientHeight) / 2 - opanel.height() / 2 + (document.documentElement.scrollTop || document.body.scrollTop))
            olayer.show();
            opanel.show('slowly');
            return false;
        });
        // �ر��������
        $("#" + defaults.close1).click(function () {
            olayer.hide();
            opanel.hide('slowly');
            return false;
        })
        // �ύ����
        osubmit.click(function () {
            olayer.hide();
            opanel.hide();
            alert("���������Ѿ��ύ�������ĵȴ���");            
            return false;
        })

    };
    // ����������
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
// �������ġ��˺Ű�ȫ
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
        // ���¼�
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
			regEmail = /^(?:\w+\.?)*\w+@(?:\w+\.?)*\w+$/,// email���
			regTel = /^1[3|5|4|8][0-9]\d{8}$/,
			regPass = /^(([A-Z])+|([a-z]+)|(\d+))$/,// pass��� ��ĸ������ϣ��ҳ�������Ϊ6λ��
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
        //�����У��
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
                //�ύ����
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
    // ����������
    function loadData() {
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// �������� �� ��Ϣ
hexun.home.setupNews = (function () {
    var defaults = {
        panelID: "hxjy_setupNews_panel",// ��Ϣ���
        sentID: "hxjy_setupNews_sent",//����Ϣ
        url: "data/data01.js",
        validateURL: "data/data01.js", //��֤��URL
        validateCodeURL: "data/data01.js", //��֤��֤��URL,
        sendMessPanel:"message-send", // ������Ϣ���
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
        //  ����Ϣ��
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
             <p><a href="#">��Щ������׷�Ĺ�Ʊ��</a>�������� - ����ʮ���ǣ����г��������� ��ή�����Եĳɽ�����"������"��K�������̬���Լ�����5���ߵ�ʧ�صȵ�������������㼯�����յ��г���������ʱ...����ʮ���ǣ����г��������� - ����ʮ���ǣ����г��������� ��ή�����Եĳɽ�����"������"��K�������̬���Լ�����5���ߵ�ʧ�صȵ�������������㼯�����յ��г���������ʱ...- ����ʮ���ǣ����г��������� ��ή�����Եĳɽ���"������"</p>
             <div class="message_dd_bt"><span><a title="�ظ�:��Щ������׷�Ĺ�Ʊ" class="a_9c setupNews_reply" href="#">�ظ�</a> ح <a class="a_9c setupNews_del" href="#">ɾ��</a></span> 21����ǰ</div>
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
                ret.push('" class="a_9c setupNews_reply" href="#">�ظ�</a>');
                ret.push(' ح <a class="a_9c setupNews_del" href="#">ɾ��</a></span> ');
                ret.push(data[i]["time"])
                ret.push('����ǰ</div>');
                ret.push('</dd></dl>');
            }
            oHtml = ret.join('');
            oPanel.prepend(oHtml);
            }
        }



        //ɾ��
        oPanel.find("a.setupNews_del").live("click", function () {
            var self = this, oParent;
            hexun.home.confirm().init({
                txt: "ȷ��Ҫɾ��������Ϣ��",
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
        //�ظ�
        oPanel.find("a.setupNews_reply").live("click", function () {
            msg({ name: this.getAttribute("title").split("�ظ�:")[1] });
            return false;
        });
        //����Ϣ
        oSent.click(function () {
            msg();
            return false;
        });
    };
    function msg(options) {
        var ret = [], options = options || {};
        ret.push('<div class="clearfix">');
        ret.push('<label class="sc-sendMessLabel1 fl">�ռ��ˣ�</label>');
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
        ret.push('<label class="sc-sendMessLabel1 fl">�ڡ��ݣ�</label>');
        ret.push('<div class="sc-sendMessInput1Box fl">');
        ret.push('<textarea class="sc-sendMessArea">��������Ҫ���͵�����</textarea>');
        ret.push('</div>');
        ret.push('</div>');
        ret.push('</div>');
        ret.push('<div class="mt30">');
        ret.push('<div class="clearfix">');
        ret.push('<label class="sc-sendMessLabel1 fl">��֤�룺</label>');
        ret.push('<div class="sc-sendMessInput2Box fl">');
        ret.push('<input type="text" class="sc-messInput1" />');
        ret.push('</div>');
        ret.push('<div class="sc-sendMessVeryImg ml10 fl pr">');
        ret.push('<img src="http://message.hexun.com/VCodePic.aspx?userid=19015870&pp=49824346" alt="" />');
        ret.push('</div>');
        ret.push('<a href="#" class="fl ml10 sc-sendMessVeryView">����鿴��֤��</a>');
        ret.push('</div>');
        ret.push('<div class="clearfix sc-sendMessVeryWarning">�������ͼ�е��ַ�������֤��</div>');
        ret.push('</div>');
        hexun.home.alert().init({
            txt: ret.join(""),
            tit: "������Ϣ",
            addClass: "w558",
            sureTxt: "&nbsp;��&nbsp;��&nbsp;",
            sure: function () { //����
                var self = this, $Alert = $(this.oAlert), cont, validate,
                    aInput = $Alert.find('input.sc-messInput1'),
                 name = aInput.eq(0).val();
                //�ռ���
                if (name.empty() == "") {
                    alert("û����д�ռ���");
                    return false;
                }
                //����
                cont = $Alert.find('textarea.sc-sendMessArea').val();
                if (cont.empty() == "" || cont == "��������Ҫ���͵�����") {
                    alert("û����д����");
                    return false;
                }
                //��֤��
                validate = aInput.eq(-1).val();
                // ��֤����֤
                Jser.ajax({
                    url: (defaults.validateCodeURL + "?validate=" + validate),
                    dataType: "json",
                    type: "GET",
                    success: function (data) {
                        // ��֤����֤�ɹ�����������
                        if (data.status == 1) {
                            Jser.ajax({
                                url: defaults.url,
                                dataType: "json",
                                type: "GET",
                                success: function (data) {
                                    if (data.status == 1) {
                                        self.closeAlert();//�رնԻ���
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
                //�ռ��ˡ���֤��
                $elem.find('input.sc-messInput1').focus(function () {
                    oParent = null;
                    oParent = this.parentNode.parentNode;
                    oParent.className += " inputFocus";
                }).blur(function () {
                    oParent.className = oParent.className.replace(/(\s+inputFocus)+/, "");
                    if (this.index == 1) {
                        //��֤��
                        if (this.value.length != 4) {
                            oParent.className += " inputError";
                        } else {
                            //ajax  �����֤���Ƿ���ȷ
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
                //����
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
                //��֤��
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
                // ������ק
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

// �������� �� ֪ͨ
hexun.home.setupInform = (function () {
    var defaults = {
        panelID: "hxjy_setupInform_panel",//���
        delectID: "hxjy_setupInform_delect",//ɾ��ID
        allID: "hxjy_setupInform_all",//ȫѡ
        delURL: "data/data01.js"

    };
    var initialize = function () {
        bindEvent();
        hexun.home.page().init();
    };
    function bindEvent() {
        var oPanel = $("#" + defaults.panelID),//���
            oAll = $("#" + defaults.allID),//ȫѡ
            oDelect = $("#" + defaults.delectID),//ɾ��
            aCheckbox;

        //ȫѡ
        oAll.click(function () {
            oPanel.find("input").attr("checked", this.checked);
        });
        //ɾ��
        oDelect.click(function () {
            aCheckbox = oPanel.find("input:checked");
            if (aCheckbox.length !== 0) {
                hexun.home.confirm().init({
                    txt: "ȷ��ɾ����ѡ", sure: function () {
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
                hexun.home.alert().init({ txt: "��ѡ��Ҫɾ����֪ͨ��" });
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
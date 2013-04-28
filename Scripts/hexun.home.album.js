//include jquery-1.7.js
//include hexun.home.common.js
/**
* @class ��Ѷ��԰ ��Ѷ���
* @singleton
* @createTime 2013-1-11
* @updateTime 
* @note 
* @version 1.0
*/

// ��Ѷ�������Ԥ��
hexun.home.albumPreview = (function () {
    var defaults = {
        panelID: "hxjy_scrollBar",
        manualID: "hxjy_scrollBar_manual"
    };
    var initialize = function () {
        bindEvent();
        //�ص�����
        hexun.home.toTop().init();
    };
    function bindEvent() {
        //������ҳ
        hexun.home.scrollBars().init({
            url: "data/data-albumPreview01.js",
            fHeight: 30,
            panelID: defaults.panelID,
            manualID: defaults.manualID,
            doDataHtml: doDataHtml
        });
    };
    //ƴ��HTML
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

// ��Ѷ����ͼƬչʾ
hexun.home.albumView = (function () {
    var defaults = {
        commentAreaID: "hxjy_album_commentArea",//���ۿ�
        commentBtnID: "hxjy_album_commentBtn",//���۰�ť
        commentListID: "hxjy_album_commList",//�����б�
        smileyID: "hxjy_album_Smiley", //�������
        smileyPanelID: "hxjy_album_SmileyPanel", //�������
        pageID: "hxjy_page",//��ҳID
        commentURL: "data/data01.js",//����URL
        commentPageURL: "data/data01.js"//���۷�ҳURL
    };
    var initialize = function () {
        bindEvent();
        //��ҳ
        hexun.home.page().init({ state: "ajax", page: $("#" + defaults.pageID).find("ul a").length, now: 1, callback: loadData });
    };
    function bindEvent() {
        //ͼƬ����
        var slide = new Slide(),
            oCommentArea = $("#" + defaults.commentAreaID),
            oCommentBtn = $("#" + defaults.commentBtnID),
            oCommentList = $("#" + defaults.commentListID),
            oSmiley = $("#" + defaults.smileyID),
            oPanel = $("#" + defaults.smileyPanelID);
        //�����ı������Ч��
        oCommentArea.prompt(oCommentArea.prev(), "areaBox_focus").TextAreaExpander(50, 100, function (h) {
            this.parentNode.style.height = h + 10 + "px";
        });
        //���۰�ť
        oCommentBtn.click(function () {
            var val = oCommentArea.val();
            if (val.empty() === "") { return false; }
            Jser.ajax({
                url: defaults.commentURL,
                dataType: "json",
                type: "GET", //���ͬѧ��ΪPOST��ʽ
                success: function (data) {
                    if (data.status == 1) {
                        var ret = [];
                        ret.push('<li class="clearfix">');
                        ret.push('<div class="albumCon-cmI fl">');
                        ret.push('<a href="#"><img src="images/temp6.png" alt=""></a>');
                        ret.push('</div>');
                        ret.push('<div class="albumCon-cmText fl lh24">');
                        ret.push('<a href="#">����</a>���������ۣ�<a class="stda2" href="#">���������</a>');
                        ret.push('<p>' + val + '<span>��1����ǰ��</span></p>');
                        ret.push('</div>');
                        ret.push('<div class="albumCon-cmTime fr">');
                        ret.push('<span class="color_b9">9��14�� 14:20</span>');
                        ret.push('<br />');
                        ret.push('<a href="javascript:void(0);" class="album_reply">�ظ�</a>');
                        ret.push('</div>');
                        ret.push('</li>');
                        oCommentList.prepend(ret.join(""));
                    }
                    oCommentArea.val("");
                },
                error: {}
            });
        });
        //����
        oSmiley.click(function () {
            if (oPanel.is(':hidden')) {
                oPanel.show();
            } else {
                oPanel.hide();
            }
            return false;
        });
        // ��������
        var reg = /\[.+\]/
        oPanel.find("a").click(function () {
            oCommentArea.val(oCommentArea.val() + this.getAttribute("title").match(reg)[0]).change();
            oPanel.hide();
        });
        //�ظ� (hoverЧ��)
        oCommentList.find("li").live({ mouseenter: function () { $(this).find("a.album_reply").show(); }, mouseleave: function () { $(this).find("a.album_reply").hide(); } });
        //�ظ� ����¼�
        oCommentList.find("a.album_reply").live("click", function () {
            oCommentArea.focus().val("�ظ�@aa:").change();
            return false;
        });

    };
    //��ҳ��������
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
                        ret.push('<a href="#">����</a>���������ۣ�<a class="stda2" href="#">���������</a>');
                        ret.push('<p>������<span>��1����ǰ��</span></p>');
                        ret.push('</div>');
                        ret.push('<div class="albumCon-cmTime fr">');
                        ret.push('<span class="color_b9">9��14�� 14:20</span>');
                        ret.push('<br />');
                        ret.push('<a href="javascript:void(0);" class="album_reply">�ظ�</a>');
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

// ��Ѷ����������
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
        //ר�����ƣ�
        oName.prompt(oName.prev(), "inputBox_focus");
        //ר��������
        oDescribe.prompt(oDescribe.prev(), "areaBox_focus").TextAreaExpander(75, 1000, function (h) {
            this.parentNode.style.height = h + 10 + "px";
        });
        //�����Ч
        //�������������
        oPanel.find("textarea").live("focus", function () {
            if (/�������������/.test(this.value)) {
                this.value = "";
            };
            $(this.parentNode.parentNode).addClass("inputFocus2");
        }).live("blur", function () {
            if (this.value.empty() == "") {
                this.value = " �������������";
            }
            $(this.parentNode.parentNode).removeClass("inputFocus2");

        }).each(function () { $(this).TextAreaExpander(40, 80); });
        // �������ǩ
        oPanel.find("input[type='text']").live("focus", function () {
            if (/�������ǩ/.test(this.value)) {
                this.value = "";
            };
            $(this.parentNode.parentNode.parentNode).addClass("inputFocus1");
        }).live("blur", function () {
            if (this.value.empty() == "") {
                this.value = "�������ǩ�������ǩ�ÿո�ָ�";
            }
            $(this.parentNode.parentNode.parentNode).removeClass("inputFocus1");
        });
        // ȫѡ
        oAll.click(function () {
            oPanel.find("input[type='checkbox']").attr("checked", this.checked);
        });
        // ɾ��
        oDelect.click(function () {
            aCheckbox = oPanel.find("input:checked");
            if (aCheckbox.length !== 0) {
                hexun.home.confirm().init({
                    txt: "ȷ��Ҫɾ��ѡ����Ƭ��", sure: function () {
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
                hexun.home.alert().init({ txt: "��ѡ��Ҫɾ������Ƭ��" });
            }
            return false;
        });
        // ��ҳ        
        hexun.home.page().init({ state: "ajax", page: $("#" + defaults.pageID).find("ul a").length, now: 1, callback: loadData });
    };
    //��ʾ����
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
                        ret.push('<textarea class="albumsMag-textarea1" maxlength="1000">&nbsp;�������������</textarea>')
                        ret.push('<div class="pt8">')
                        ret.push('<label class="albumsMag-label2">��ǩ��</label><input type="text" class="albumsMag-input2" value="�������ǩ�������ǩ�ÿո�ָ�" maxlength="100" />')
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

// ��Ѷ���������ϴ�
hexun.home.albumUpFile = (function () {
    // ����
    var defaults = {
        panelID: "hxjy_album_panel",//�ϴ� ר�����
        nameID: "hxjy_album_name",//ר������
        briefID: "hxjy_album_brief",//ר�����
        labelID: "hxjy_album_label",//��ӱ�ǩ
        oldNameID: "hxjy_album_name_old", //����ר������
        oldLabelID: "hxjy_album_label02",
        tabID: "hxjy_album_tab"// �ϴ��� ���

    };
    // ��ʼ��
    var initialize = function () {
        bindEvent();
    };
    //�󶨺���
    function bindEvent() {
        var oPanel = $("#" + defaults.panelID),
            oName = $("#" + defaults.nameID),
            oBrief = $("#" + defaults.briefID),
            oLabel = $("#" + defaults.labelID),
            oOldName = $("#" + defaults.oldNameID),
            oOldLabel = $("#" + defaults.oldLabelID);
        // �ϴ�����ר�����ϴ�������ר��
        oPanel.find("input:radio").click(function () {
            if (this.index == 0) {
                oPanel.removeClass("albumup-choice1").addClass("albumup-choice");
            } else {
                oPanel.removeClass("albumup-choice").addClass("albumup-choice1");
            }
        });
        // ��ר�����ƣ�
        oName.prompt(oName.prev(), "inputBox_focus");
        // ��ר�����
        oBrief.prompt(oBrief.prev(), "areaBox_focus").TextAreaExpander(74, 100, function (n) {
            this.parentNode.style.height = n + 8 + "px";
        });
        // ����ӱ�ǩ
        oLabel.prompt(oLabel.prev(), "inputBox_focus");
        // �����б�ǩ
        hexun.home.blogHasLabel().init({
            hasLabel: "hxjy_blog_labels",
            inputID: "hxjy_album_label",
            moreClass: "wt_mian-tag_warningmy",
            panelID: "hxjy_blog_labels_more"
        });
        // ��
        oOldName.prompt(oOldName.prev(), "inputBox_focus");
        // ����ӱ�ǩ
        oOldLabel.prompt(oOldLabel.prev(), "inputBox_focus");
        // �����б�ǩ
        hexun.home.blogHasLabel().init({
            hasLabel: "hxjy_blog_labels02",
            inputID: "hxjy_album_label02",
            moreClass: "wt_mian-tag_warningmy",
            panelID: "hxjy_blog_labels_more02"
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



// ����ͼƬ
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
    iSmallIndex: 0,//����ͼ�±�
    ibars2: 0,
    iRatio: 0,
    startX: 0,
    startoDivLeft: 0,
    amount: 5,//��ʾ����������ͼ����ʾͼƬ����
    SmallPicWidth: 100,
    timer: null,//����ͼ��ʱ��
    init: function () {
        var options = this.options,
        //����ͼ 
        oSolider = $("#" + options.soliderID),
        oSmallPic = $("#" + options.smallPicID),
        aBtn = oSmallPic.find("li"), count,
        oScrollBar = $("#" + options.scrollBarID),
        oBar = $("#" + options.barID);
        this.SmallPicWidth = aBtn[0].offsetWidth;
        // ��������ͼ�ܳ���
        count = this.SmallPicWidth * aBtn.length;
        // ��������ͼ����
        oSmallPic.width(count);
        // ���������ֵ
        this.ibars2 = oScrollBar.width() - oBar.width();
        // �������
        this.iRatio = this.ibars2 / (count - oSolider.width());
        this.bindEvent();
    },
    bindEvent: function () {
        var Me = this, options = this.options,
         //����ͼ 
        oSmallPic = $("#" + options.smallPicID),
        oUl = oSmallPic[0],
        // ����ͼ �л�
        oSmallPrev = $("#" + options.smallPrevID),
        oSmallNext = $("#" + options.smallNextID),
        // ������
        oScrollBar = $("#" + options.scrollBar),
        oBar = $("#" + options.barID),
        aBtn = oSmallPic.find("li"),
        length = aBtn.length;
        // ��ȡ���� ͼ���±�
        var _index = location.href.match(/(\d+).html/);
        if ($.isArray(_index)) {
            gotoSmall(_index[1] - 1);
        }
        //Сͼ ��һ��
        oSmallPrev.click(function () {
            gotoSmall(Me.iSmallIndex - 1);
            return false;
        });
        //Сͼ ��һ��
        oSmallNext.click(function () {
            gotoSmall(Me.iSmallIndex + 1);
            return false;
        });
        //������
        oBar.mousedown(function (e) {
            var e = e || window.event,
            self = this;
            Me.startX = e.clientX;
            Me.startoDivLeft = self.offsetLeft;
            if (self.setCapture) { //IE��������겶��
                self.onmousemove = doDarg;
                self.onmouseup = stopDarg;
                self.setCapture();
            } else { //�¼�����
                document.addEventListener("mousemove", doDarg, true);
                document.addEventListener("mouseup", stopDarg, true);
            }
            function doDarg(e) {
                var e = e || window.event;
                var l = e.clientX - Me.startX + Me.startoDivLeft;
                if (l <= 5)  /* ��ֹ�����������򣬾���Ϊ5ʱĬ��Ϊ0������Ч�� */ {
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
                    self.releaseCapture();  //ȡ���¼�����
                }
                else {//ȡ���¼�����
                    document.removeEventListener("mousemove", doDarg, true);
                    document.removeEventListener("mouseup", stopDarg, true);
                }
                self.onmousemove = null;
                self.onmouseup = null;
            };
        });
        // ��������ͼ����λ��
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
            //�ٶ��ȿ����
            iSpeed = (iTarget - oUl.offsetLeft) / 5;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            if (oUl.offsetLeft == iTarget) {
                if (Me.timer) {
                    clearInterval(Me.timer);
                    Me.timer = null;
                }
            } else {
                //����ͼ�˶�
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











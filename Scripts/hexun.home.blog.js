//include jquery-1.7.js
//include hexun.home.common.js
/**
* @class ��Ѷ��԰ ����
* @singleton
* @createTime 2012-12-25
* @updateTime 
* @note 
* @version 1.0
*/


// д���� �� ���������۽�
hexun.home.blogFocus = (function () {
    var defaults = {
        inputID: "hxjy_blog_tit",       // �����
        normalClass: "wt_main-tit",     // Ĭ��
        focusClass: "wt_main-titFocus", // ��ý���
        successClass: "wt_main-titSuccess",// �ɹ�
        errorClass: "wt_main-titError", // ����
        callback: null,
        limitWordNumber: 0              // ��������
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
        // ��������
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

// д���� �� ���·���
hexun.home.blogClassify = (function () {
    var defaults = {
        triggerID: "hxjy_blog_Classify_trigger",//������ID
        panelID: "hxjy_blog_Classify_list",// ���·�����ʾ���ID
        selecteID: "hxjy_blog_Classify_list_selected",//ѡ����ʾID
        addID: "hxjy_blog_Classify_add",//�����·���ID
        highClass: "wt_select1-List-now",//��������class
        state: 0, //״̬��0��д���͡��������࣬1�����͹����ȫ����־���ࣨ���棩 2�����͹����ȫ����־���ࣨ���棩      
        callback: $.noop //�ص�����
    };
    var initialize = function () {
        // ���¼�
        bindEvent();
    };
    function bindEvent() {
        var oTrigger = $("#" + defaults.triggerID),// ѡ����DOM
            oSelected = $("#" + defaults.selecteID),// ѡ����ʾDOM
            oAdd = $("#" + defaults.addID),//����·��� DOM
            oPanel = $("#" + defaults.panelID),//���·�����ʾ��� DOM
            oAddInput = oAdd.find("input"),//����·��� DOM
        aLi = oPanel.find("li"), state;
        // ������
        oTrigger.click(function () {
            // ���document�ϵĹر�����¼�
            $(document).unbind("click", hideClassifyList);
            // �������Ƿ�����
            if (oPanel.is(':hidden')) {
                // չʾ���
                oPanel.show();
                // ��document�ϰ󶨹ر�����¼�
                setTimeout(function () { $(document).bind("click", hideClassifyList); }, 50);
            } else {
                // �������
                oPanel.hide();
            }
        })
        // �������
        function hideClassifyList() { oPanel.hide(); }
        // �б����¼�
        aLi.click(function (e) {
            // ��ʾѡ����
            oSelected.html(this.children[0].innerHTML);
            state = defaults.state;
            //״̬��0 (д���͡���������)
            if (state == 0) {
                // �������������
                oAdd.hide();
                if (this.index === aLi.length - 1) {
                    oAdd.show();
                    // �۽�
                    oAddInput.val('').blur().focus();
                    // ��ֹa��ǩĬ�϶���
                    e.preventDefault();
                }
                // ״̬��1(���͹����ȫ����־���ࣨ����))
            } else if (state == 1) {
                // ���뵱ǰѡ�еĶ���
                defaults.callback(this.children[0]);
            }
        }).each(function () {
            // ����,��ʾ����
            $(this).high(defaults.highClass);
        });
        // ���������¼�
        oAddInput.length != 0 && oAddInput.prompt(oAddInput.prev());
    };
    return {
        init: function (options) {
            $.extend(defaults, options || {});
            initialize();
        }
    }
});

// д���� �� �Զ���ȡ��ǩ
hexun.home.blogAutoLabel = (function () {
    var defaults = {
        autoID: "hxjy_blog_auto_label",//�Զ���ȡ��ǩID
        panelID: "hxjy_blog_label",////�Զ���ȡ��ǩ�����ID
        titleID: "hxjy_blog_tit",  //����ID
        contentID: "hxjy_blog_content",//�ı���ID
        url: "data/data-blogAutoLabel01.js" //����URL
    };
    var initialize = function () {
        bindEvent();
    };
    function bindEvent() {
        var oAutoLabel = $("#" + defaults.autoID);
        oAutoLabel.click(function () {
            //�ݴ���
            //1.������
            if (document.getElementById(defaults.titleID).value.length === 0) {
                hexun.home.alert().init({ txt: "�����������±���" });
                //2.����ı���
            } else if (document.getElementById(defaults.titleID).value.length === 0) {
                hexun.home.alert().init({ txt: "����������������" });
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

// д���� �� ���б�ǩ
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
        // ������б�ǩ
        $aA.click(function () {
            if (this.index < len - 1) {
                insertVal.call(this)
            } else if (this.index === len - 1) {
                //����
                oMore = $(this);
                if (oPanel.is(":hidden")) {
                    oMore.addClass(defaults.moreClass);
                    //�������б�ǩ
                    loadData();
                } else {
                    hidePanel();
                }
            }
            return false;
        });
        // ����������ǩ ����¼�
        oPanel.find("a").live("click", function () {
            insertVal.call(this);
            return false;
        });
        // �����ǩ
        function insertVal() {
            var val = " " + oInput.val() + " ",
                   insert = this.innerHTML;
            reg = new RegExp("\\s" + insert + "\\s");
            if (!reg.test(val)) {
                val = $.trim(val + insert);
                oInput.val(val).change();
            }
        }
        // �رո������j����ť�����¼���
        oClose.click(hidePanel);
        // �ر� �������
        function hidePanel() {
            oClose.hide();
            oMore.removeClass(defaults.moreClass);
            oPanel.hide();
        }
    };
    // �������б�ǩ
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

// д���� �� ����ѡ��
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

// ���͹��� �� ���¹���
hexun.home.blogArticleManage = (function () {
    var defaults = {
        allID: "hxjy_blog_manage_all", //ȫѡID
        delectID: "hxjy_blog_manage_delect",//ɾ��ID
        moveID: "hxjy_blog_manage_move",//�ƶ�ID
        panelID: "hxjy_blog_manage_table",//�����б�չʾID
        pageID: "hxjy_page",//��ҳID
        triggerID: ["hxjy_blog_Classify_trigger", "hxjy_blog_Classify_trigger02"],//���ഥ����ID1 ���ഥ����ID2
        classifyPanelID: ["hxjy_blog_Classify_list", "hxjy_blog_Classify_list02"],//�������ID1 �������ID2
        selecteID: ["hxjy_blog_Classify_list_selected", "hxjy_blog_Classify_list_selected02"],//����ѡ����ID1 ����ѡ����ID2
        delURL: "data/data01.js",//ɾ��URL
        moveURL: "data/data-ArticleManage-move01.js",//�ƶ�URL
        recommendURL: "data/data-ArticleManage-recommend01.js",//�Ƽ���չʾȦ�� URL
        recommendURL02: "data/data-ArticleManage-recommend02.js",//�Ƽ���ѡ��Ȧ�ӡ�ȷ�� URL
        panelURL: "data/data-classify-list01.js"//����URL


    };
    var initialize = function () {
        // ���͡� ���·��� ��       
        hexun.home.blogClassify().init({ triggerID: defaults.triggerID[0], panelID: defaults.classifyPanelID[0], selecteID: defaults.selecteID[0], state: 1, callback: loadData });

        // ���͡� ���·��� ��
        hexun.home.blogClassify().init({ triggerID: defaults.triggerID[1], panelID: defaults.classifyPanelID[1], selecteID: defaults.selecteID[1], state: 2 });

        // ���¼�
        bindEvent();

        // ��ҳ
        hexun.home.page().init();
    };
    function bindEvent() {
        var oAll = $("#" + defaults.allID),//ȫѡ
            oDelect = $("#" + defaults.delectID),//ɾ��
            oMove = $("#" + defaults.moveID),//�ƶ�
            oPanel = $("#" + defaults.panelID),//���
            aCheckbox, oSelected;
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
                hexun.home.alert().init({ txt: "��ѡ��Ҫɾ�����£�" });
            }
            return false;
        });
        //�ƶ���
        oMove.click(function () {
            aCheckbox = oPanel.find("input:checked");
            oSelected = $("#" + defaults.selecteID[1]);
            // ��ѡ��Ҫת�Ƶ�Ŀ����־���ࡣ
            if (oSelected.html() === "��ѡ���ƶ�����־����") {
                hexun.home.alert().init({ txt: "��ѡ��Ҫ�ƶ�����־���࣡" });
                return false;
            }
            if (aCheckbox.length !== 0) {
                hexun.home.confirm().init({
                    txt: "ȷ��ת�������",
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
                hexun.home.alert().init({ txt: "��ѡ��Ҫ�ƶ����£�" });
            }
            return false;
        });
        //�Ƽ�
        oPanel.find(".hxjy_btn_recommend").live("click", function () {
            Jser.ajax({
                url: defaults.recommendURL, //�Ƽ���ַ
                dataType: "json",
                type: "GET",
                success: function (data) {
                    if (data.status == 1) {
                        var aHTML = [], group = data.group;
                        // HTML ��Ƭ 
                        aHTML.push('<p>��ѡ��Ҫ�������Ƽ�����ЩȦ����ȥ��<br />');
                        aHTML.push('(ע��: ����������Ѿ�����������Ȧ�ӳ�Ա�Ƽ�������ѡ���Ȧ�ӣ��򱾴β�����Ч��)');
                        aHTML.push('</p>');
                        len = group.length || 0;
                        // ����Ƿ����Ȧ��
                        if (len > 0) {
                            // ѡ��Ȧ��
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
                                    // ����Ƿ�ѡ��Ȧ��
                                    if (oUl.length > 0 && aCheck.length > 0) {
                                        var url = defaults.recommendURL02, ret = [];
                                        url = (url.indexOf('?') != -1) ? (url + '&') : (url + '?');
                                        aCheck.each(function () {
                                            ret.push(this.value);
                                        });
                                        url = url + "type=" + ret.join(",");
                                        // ��������
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
                            // ��ʾ����Ȧ��
                            aHTML.push('<p class="pop_P">��Ǹ������û������Ȧ�����ڼ���<strong><a href="#">����Ȧ</a></strong>��</p>');
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
    // ���� ��ѡ���ȫ����־����
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
                    aHtml.push('<th width="59%" scope="col">��  ��</th>');
                    aHtml.push('<th width="26%" scope="col">����ʱ��</th>');
                    aHtml.push('<th width="15%" scope="col">��  ��</th>');
                    aHtml.push('</tr>');
                    aHtml.push('</thead>');
                    aHtml.push('<tbody>');
                    var i = 0, tit = data.tit, len = data.tit.length, t;
                    for (; i < len; i++) {
                        t = tit[i];
                        aHtml.push('<tr>');
                        aHtml.push('<td><input name="" type="checkbox" value="" /> <a href="' + t[1] + '" class="a_black">' + t[0] + '</a></td>');
                        aHtml.push('<td align="center">' + t[2] + '</td>');
                        aHtml.push('<td align="center"><a href="#" class="a_btn_grey">�޸�</a> <a href="#" class="a_btn_grey hxjy_btn_recommend">�Ƽ�</a></td>');
                        aHtml.push('</tr>');
                    }
                    aHtml.push('</tbody>');
                    oPanel.html(aHtml.join(""));
                    hexun.home.page().init({
                        page: 4,// ��ҳ��
                        now: 1 //��ǰҳ��
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

// ���͹��� �� ���²ݸ�
hexun.home.blogArticleDraft = (function () {
    var defaults = {
        allID: "hxjy_blog_manage_all", //ȫѡID
        delectID: "hxjy_blog_manage_delect",//ɾ��ID
        panelID: "hxjy_blog_manage_table",//�����б�չʾID    
        delURL: "data/data01.js"//ɾ��URL
    };
    var initialize = function () {
        bindEvent();
        // ��ҳ
        hexun.home.page().init();
    };
    function bindEvent() {
        var oAll = $("#" + defaults.allID),
          oDelect = $("#" + defaults.delectID),
          oPanel = $("#" + defaults.panelID),
         aCheckbox;//ѡ����
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
                                        $(this).parent().parent().remove();
                                    });
                                }
                            }
                        });
                    }
                });
            } else {
                hexun.home.alert().init({ txt: "��ѡ��Ҫɾ�����£�" });
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

// ���͹��� �� �������
hexun.home.blogClassifyManage = (function () {
    var defaults = {
        panelID: "hxjy_blog_manage_table",      // �������
        addPanelID: "hxjy_blog_add_Classify",   // ��ӷ���
        addID: "hxjy_blog_add_Classify_btn",     // ���ӷ���ID
        url: "data/data01.js"//���ӷ���URL

    };
    var initialize = function () {
        bindEvent();
        // ��ҳ
        hexun.home.page().init();
    };
    function bindEvent() {
        var addPanel = $("#" + defaults.addPanelID),// ���ӷ������
            oPanel = $("#" + defaults.panelID),// �������
            oAdd = $("#" + defaults.addID),//���ӷ���
        oInput = addPanel.find("input"),// �����
        val, aHTML = [], isRepeat = false;

        //�ı���ʾ
        oInput.prompt(addPanel.find("span")).limit(40);
        //���ӷ���
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
                        txt: "�Ѵ��ڸ����!"
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
                            aHTML.push('<a href="#" class="a_btn_grey">�޸�</a><a href="#" class="a_btn_grey ml5">ɾ��</a>');
                            aHTML.push('</td>');
                            aHTML.push('</tr>');
                            oPanel.append(aHTML.join(""));
                            hexun.home.alert().init({
                                txt: "���ӷ���ɹ�!"
                            });
                        }

                    },
                    error: function () { }

                });
            } else {
                hexun.home.alert().init({
                    txt: "�������������"
                });
            }


            return false;
        });
        // �޸�
        oPanel.find("a:even").live("click", function () {
            var self = this,
            oSpan = $(self.parentNode.parentNode).find("span")
            val = oSpan.text();
            hexun.home.alert().init({
                tit: "�޸ķ�������",
                html: '<p>�������µķ������ƣ�<input name="" type="text" class="inp w121" value="' + val + '" /></p>',
                addClass: "w324",
                sure: function (elem) {
                    // �޸ķ�������
                    var oInput = this.context.find("input"), val02 = oInput.val();
                    // ����޸ĵķ��������Ƿ���ͬ
                    if (val != val02) {
                        // ����Ƿ��ظ�
                        oPanel.find("span").each(function () {
                            if ($(this).text() == val02) {
                                isRepeat = true;
                            }
                        });
                        if (isRepeat) {
                            hexun.home.alert().init({
                                txt: "�Ѵ��ڸ����!"
                            });
                            isRepeat = false;
                            return false;
                        }
                        // �����޸ĵ�����
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
        // ɾ��
        oPanel.find("a:odd").live("click", function () {
            var self = this;
            hexun.home.confirm().init({
                txt: "ɾ�����ཫʹ�ķ����µ�����״̬��Ϊδ���࣬ȷ��Ҫɾ����",
                addClass: "w324",
                sure: function (elem) {
                    //  ɾ��
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

// ���͹��� �� �ö�����
hexun.home.blogStickManage = (function () {

    var defaults = {
        panelID: "hxjy_blog_manage_table",//���±����б�չʾID
        allID: "hxjy_blog_manage_all",//ȫѡID
        revocationID: "hxjy_blog_manage_revocation",//����
        url: "data/data01.js"// ����URL
    };
    var initialize = function () {
        bindEvent();
        hexun.home.page().init();
    };
    function bindEvent() {
        var oAll = $("#" + defaults.allID),
        oRevocation = $("#" + defaults.revocationID),
        oPanel = $("#" + defaults.panelID),
        aCheckbox;//ѡ����
        //ȫѡ
        oAll.click(function () {
            oPanel.find("input").attr("checked", this.checked);
        });
        //����
        oRevocation.click(function () {
            aCheckbox = oPanel.find("input:checked");
            if (aCheckbox.length !== 0) {
                hexun.home.confirm().init({
                    txt: "��ȷ��Ҫȡ���ö���", sure: function () {
                        Jser.ajax({
                            url: defaults.url,
                            dataType: "json",
                            type: "GET",
                            success: function (data) {
                                if (data.status == 1) {
                                    aCheckbox.each(function () {
                                        $(this).parent().parent().remove();
                                    });
                                    hexun.home.alert().init({ txt: "ȡ���ö��ɹ���" });
                                }
                            }
                        });
                    }
                });
            } else {
                hexun.home.alert().init({ txt: "��ѡ��Ҫȡ���ö������£�" });
            }
            return false;
        });
        oPanel.find('.a_btn_grey').click(function () {
            var self = this;
            hexun.home.confirm().init({
                txt: "��ȷ��Ҫȡ���ö���", sure: function () {
                    Jser.ajax({
                        url: defaults.url,
                        dataType: "json",
                        type: "GET",
                        success: function (data) {
                            if (data.status == 1) {
                                $(self).parent().parent().remove();
                                hexun.home.alert().init({ txt: "ȡ���ö��ɹ���" });
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

// ���͹��� �� ���»���վ
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
        //ȫѡ
        oAll.click(function () {
            oPanel.find("input").attr("checked", this.checked);
        });
        //ȫ���޸�
        oRecycle.click(function () {
            aCheckbox = oPanel.find("input:checked");
            if (aCheckbox.length !== 0) {
                hexun.home.confirm().init({
                    txt: "��ȷ��Ҫȫ���ָ���", sure: function () {
                        Jser.ajax({
                            url: defaults.url,
                            dataType: "json",
                            type: "GET",
                            success: function (data) {
                                if (data.status == 1) {
                                    aCheckbox.each(function () {
                                        $(this.parentNode.parentNode).remove();
                                    });
                                    hexun.home.alert().init({ txt: "���»ָ��ɹ���" });
                                }
                            }
                        });
                    }
                });
            } else {
                hexun.home.alert().init({ txt: "��ѡ��Ҫ�ָ������£�" });
            }
            return false;
        });
        //�޸�
        oPanel.find(".a_btn_grey").click(function () {
            var self = this;
            hexun.home.confirm().init({
                txt: "��ȷ��Ҫ�ָ���", sure: function () {
                    Jser.ajax({
                        url: defaults.url,
                        dataType: "json",
                        type: "GET",
                        success: function (data) {
                            if (data.status == 1) {
                                $(self).parent().parent().remove();
                                hexun.home.alert().init({ txt: "���»ָ��ɹ���" });
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

// ���͹��� �� �������
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
        // ��ť
        aBtn.click(function () {
            index = this.index;
            switch (index) {
                case 0://�ύ
                    submitFn();
                    break;
                case 1: //ȫ��ͨ��
                    loadData(true, "ȫ��ͨ��");
                    break;
                case 2://ȫ��ɾ��
                    loadData(false, "ȫ��ɾ��");
                    break;
                default:

            }
            return false;
        });
        //�������
        oSet.click(function () {
            oSetPanel.show();
            oListPanel.hide();
            return false;
        });
        //��������
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
                        hexun.home.alert().init({ txt: "�������óɹ���" });
                    }
                },
                error: {}
            });
            return false;
        });
    };
    //�ύ
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
                            if (oParent.prev().length == 0) { oParent.next().hasClass("gray_line") && oParent.next().remove(); } else { oParent.prev().remove(); }//ɾ������
                            //oParent.animate({ "opacity": 0, "height": 0 }, 500, function () {
                            oParent.remove();
                            //})
                        });
                        hexun.home.alert().init({ txt: "�����ɹ������ύ��" });
                    }
                },
                error: {}
            });
        } else {
            hexun.home.alert().init({ txt: "��ѡ��Ҫ�ύ�����ۣ�" });
        }
    };
    function loadData(isBool, txt) {
        var oPanel = $("#" + defaults.panelID);
        hexun.home.confirm().init({
            txt: "ȷ��" + txt + "ô��",
            sure: function () {
                Jser.ajax({
                    url: defaults.subURL,
                    dataType: "json",
                    type: "GET",
                    success: function (data) {
                        if (data.status == 1) {
                            oPanel.remove();
                            hexun.home.alert().init({ txt: "�����ɹ�����" + txt + "��" });
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

// �������ġ���������
hexun.home.setupBasic = (function () {
    var defaults = {
        panelID: "hxjy_blog_setup_panel", //�����������ID
        saveID: "hxjy_blog_setup_panel_save",// �������� ����ID
        url: "data/data01.js",// �ύ����URL
	    focusClass:'addfocus'
    };
    var initialize = function () {
        bindEvent();
    };
    function bindEvent() {
        var oPanel = $("#" + defaults.panelID),
            oSave = $("#" + defaults.saveID), val,oParent;
        //����
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
        //����
        oSave.click(function () {
            Jser.ajax({
                url: defaults.url,
                dataType: "json",
                type: "GET",
                success: function (data) {
                    if (data.status == 1) {
                        hexun.home.alert().init({ txt: "�����ɹ����ѱ��棡" });
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

// �������ġ�ѡ��ģ��
hexun.home.setupTemplete = (function () {
    var defaults = {
        panelID: "hxjy_blog_templete_panel",//ģ�����ID
        selectID: "hxjy_blog_templete_select",// ģ��ѡ��ID
        menuID: "hxjy_blog_templete_menu",// ģ��˵�ID
        recoverID: "hxjy_setup_recover",// �ָ�
        url: "data/data-blogSetupTemplete01.js",//���չʾURL 
        selectURL: "data/data01.js",//ѡ��URL
        recoverURL: "data/data01.js",//�ָ�URL
        type: 1,//���ͣ�0:��Ѷor 1:����
        sort: "pop"//pop:���� or time:ʱ��
    };
    var initialize = function () {
        bindEvent();
        hexun.home.page().init();
    };
    function bindEvent() {
        var oMenu = $("#" + defaults.menuID),//�˵�
            oSelected = $("#" + defaults.selectID),//����
            oPanel = $("#" + defaults.panelID),//���
            oRecover = $("#" + defaults.recoverID),//�ָ�
            aLi = oMenu.find("li"), index;// ѡ��

        // ģ������
        aLi.click(function () {
            this.className += " on";
            index = this.index;
            aLi.eq(1 - index).removeClass("on");
            defaults.type = index;
            loadData();
            return false;
        });
        // ����
        oSelected.change(function () {
            defaults.sort = oSelected.val();
            loadData();
        });
        //ѡ��
        oPanel.find("a.com_btns1:even").live("click", function () {
            var self = this;
            // ѡ������
            if (!/on/.test(this.className)) {
                hexun.home.confirm().init({
                    txt: "ȷ��ѡ���ģ��ô��",
                    sure: function () {
                        //ȥ�� ��һ��ѡ�е� ����
                        oPanel.find("li.bs_c_tp_areaListItemNow").removeClass("bs_c_tp_areaListItemNow").find("a.on").removeClass("on").text("ѡ��");
                        Jser.ajax({
                            url: defaults.selectURL,//
                            dataType: "json",
                            type: "GET",
                            success: function (data) {
                                if (data.status == 1) {
                                    $(self).parents("li").addClass("bs_c_tp_areaListItemNow");
                                    self.className += " on";
                                    self.innerHTML = "��&nbsp;ǰ";
                                }
                            },
                            error: function () { }
                        });
                    }
                });
            }
            return false;
        });
        //�޸�
        oRecover.click(function () {
            hexun.home.confirm().init({
                txt: "ȷ���ָ���ʼ��ģ��ô��",
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
        var oPanel = $("#" + defaults.panelID), // ģ�����
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
                            ret.push('<a class="com_btns1 on" href="">��&nbsp;ǰ</a>');
                        } else {
                            ret.push('<a class="com_btns1" href="">ѡ&nbsp;��</a>');
                        }
                        ret.push('&nbsp;&nbsp;<a class="com_btns1" target="_blank" href="' + html.preview + '">Ԥ&nbsp;��</a>');
                        ret.push('</div>');
                        if (type) {
                            ret.push('<p class="s_c_tp_areaListItemText color_45">');
                            ret.push('�����ˣ�<a href="' + html.portal + '">' + html.name + '</a><br>');
                            ret.push('�ˡ�����' + html.pop + '��');
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

// �������ġ��Զ���ģ��
hexun.home.setupAutoTemplete = (function () {
    var defaults = {
        panelID: "hxjy_setupAutoArea",//��ʾ���
        menuID: "hxjy_blog_setupAuto_menu",//�Զ���˵�
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
	    // ���ø߶� ��ӽ���Ч��
	    osetHeight.focus(function(){
		    oParent = $(this.parentNode.parentNode);
		    oParent.addClass(defaults.focusClassName);
	    }).blur(function(){
			    oParent = $(this.parentNode.parentNode);
			    oParent.removeClass(defaults.focusClassName);
		    });

        //�Զ���˵�
        aLi.click(function () {
            cacheLi.className = cacheLi.className.replace(reg, '');
            cacheLi = this;
            this.className += " on";
            children.eq(cacheIndex).hide();
            children.eq(this.index).show();
            cacheIndex = this.index;
        });

        //�ص�Ĭ��ֵ
        oPanel.find("a.com_btns2:odd").click(function () {
            var self = this;
            hexun.home.confirm().init({
                txt: "ȷ��Ҫ�ָ�Ĭ��Ч����",
                sure: function () {
                    location.href = self.href;
                }
            });
            return false;
        });
        //<input type="file" class="bs_s_tpfiles">
        // ���
        oPanel.find("a.com_btns1").click(function () {
            var ret = [];
            ret.push('<p>�ϴ����ļ�����Ϊ(JPG/GIF/PNG),��С���ܳ���200K��</p>');
            ret.push('<div class="clearfix mt20">');
            ret.push('<input type="text" class="bs_s_tpInput1 fl w204">');
            ret.push('<div class="bs_s_tpfile fl pr ml10 pt3">');
            ret.push('<a href="" class="com_btns1">���</a>');
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

// �������ġ��Զ���CSS
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
        //�ص�Ĭ��ֵ
        oPanel.find("a.com_btns2:last").click(function () {
            var self = this;
            hexun.home.confirm().init({
                txt: "ȷ��Ҫ�ָ�Ĭ��ֵ��",
                sure: function () {
                    location.href = self.href;
                }
            });
            return false;
        });
        //����
        oPanel.find("a.a_btn").click(function () {
            var self = this;
            hexun.home.confirm().init({
                txt: "ȷ�����浱ǰ��ʽ��",
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

// �������ġ��Զ���HTML
hexun.home.setupAutoHTML = (function () {
    var defaults = {
        menuID: "hxjy_setupAutoHtml_menu",//�˵�
        panelID: "hxjy_setupAutoHtml_panel",//���
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
	    // ��ý���
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
                case 0://flashѡ��
                    loadData();
                    break;
                case 1://flash
                    hexun.home.confirm().init({
                        addClass: "w380",
                        html: '<p>Flash��Դ</p><div class="bs_s_htmlInput2"><input type="text" value=""></div>',
                        callback: function (elem) {
                            $Txt = $(elem).find("input");
                            $Txt.focus().val("http://");

                        },
                        sure: function () {
                            if (!reg.test($Txt.val())) {
                                hexun.home.alert().init({
                                    txt: "��������ȷ�������ַ!"
                                });
                            }
                        }
                    });
                    break;
                case 2://real
                    hexun.home.confirm().init({
                        addClass: "w380",
                        txt: '<p>ý���ļ���Դ</p><div class="bs_s_htmlInput2"><input type="text"></div>',
                        callback: function (elem) {
                            $Txt = $(elem).find("input");
                            $Txt.focus().val("http://");
                        },
                        sure: function () {
                            if (!reg.test($Txt.val())) {
                                hexun.home.alert().init({
                                    txt: "��������ȷ�������ַ!"
                                });
                            }
                        }
                    });
                    break;
                case 3://wmv
                    hexun.home.confirm().init({
                        addClass: "w380",
                        html: '<p>ý���ļ���Դ</p><div class="bs_s_htmlInput2"><input type="text"></div>',
                        callback: function (elem) {
                            $Txt = $(elem).find("input");
                            $Txt.focus().val("http://");
                        },
                        sure: function () {
                            if (!reg.test($Txt.val())) {
                                hexun.home.alert().init({
                                    txt: "��������ȷ�������ַ!"
                                });
                            }
                        }
                    });
                    break;
                case 4://����
                    oTextarea.text(oTextarea.text() + "<br/>");
                    break;
                default:

            }

            return false;
        });
    };
    // Flash ѡ��
    function loadData() {
        var ret = [];
        Jser.ajax({
            url: defaults.flashURL,
            dataType: "json",
            type: "GET",
            success: function (data) {
                if (data.status == 1) {
                    var ret = [], i = 0, j = 0, len = 43, mlen = Math.ceil(len / 21), ilen;
                    //��ҳ 3��ÿ��7����
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
                            ret.push('<div class="bs_s_htmltcList-name lh20"><a href="#">����' + i + '</a></div>');
                            ret.push('<div><a href="#" class="com_btns4">Ԥ��</a></div>');
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
                            //���li �����¼�
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

// ��ǩ�������ʾ����
hexun.home.labelManageDisplay = (function () {
    var defaults = {
        numID: "hxjy_labelManageDisplay_num",//��ʾ����ID
        lableListID: "hxjy_labelManageDisplay_label_list",//�Զ����ǩ��ʾ
        addID: "hxjy_labelManageDisplay_addlabel",//����Զ����ǩ
        hasLabelID: "hxjy_blog_labels",//ѡ�����б�ǩ
        hasLabelPanelID: "hxjy_blog_labels_more",//���б�ǩ���
        hasLabelPromptID: "hxjy_blog_labels_prompt",//ѡ�����б�ǩ����ʾ
        hasLabelURL: "data/data-blogHasLabel01.js",
        moreClass: "wt_mian-tag_warningmy",
        delURL: "data/data01.js",//ɾ���Զ����ǩ
        AddURL: "data/data01.js", //����Զ����ǩ
	    focusClassName:'addfocus', // �����
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
	    //  ��ǩ ����Ч��
	    otag.focus(function(){
			oParent = $(this.parentNode.parentNode);
		    oParent.addClass(defaults.focusClassName);
	    })
	    otag.blur(function(){
		    oParent = $(this.parentNode.parentNode);
		    oParent.removeClass(defaults.focusClassName);
	    })

        // ��֤ ��ʾ����
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
        // �Զ����ǩ��ʾ hover Ч��
        oLableList.find("li").live("mouseover", function () {
            this.className = "tags_text_hover";
        });
        oLableList.find("li").live("mouseout", function () {
            this.className = "";
        });

        // �Զ����ǩ��ʾ ɾ��
        oLableList.find("a").live("click", function () {
            var self = this;
            hexun.home.confirm().init({
                txt: "ȷ��ɾ�����Զ����ǩ��",
                sure: function () {
                    //ɾ��URL
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

        // ����Զ����ǩ ���
        oAdd.click(function () {
            this.val = $(this).prev().val();
            insertVal.call(this);
            return false;
        });
        //ѡ�����б�ǩ��
        var oClose = oHasLabel.find("span").eq(-1), oMore, $aA = oHasLabel.find("a"), len = $aA.length;
        $aA.click(function () {
            if (this.index < len - 1) {
                this.val = this.innerHTML;
                insertVal.call(this)
            } else if (this.index === len - 1) {
                //����
                oMore = $(this);
                if (oHasLabelPanel.is(":hidden")) {
                    oMore.addClass(defaults.moreClass);
                    //�������б�ǩ
                    loadData();
                } else {
                    hidePanel();
                }
            }
            return false;

        });

        // ����������ǩ ����¼�
        oHasLabelPanel.find("a").live("click", function () {
            this.val = this.innerHTML;
            insertVal.call(this);
            return false;
        });
        // �����ǩ
        function insertVal() {
            var val = this.val;
            //���Ϊ��״̬
            if (val.empty() == "") {
                return false;
            }
            // ����Ƿ��ظ�
            oLableList.find("li").each(function () {
                if ($.trim(val) == $.trim($(this).text())) {
                    hexun.home.alert().init({
                        txt: ("��Ǹ���Ѵ���<strong style='color:#990000'>" + val + "</strong>��ǩ")
                    });
                    val = "";
                }
            });
            // ����Ƿ�Ϊ��
            if (val.empty() != "") {
                hexun.home.confirm().init({
                    txt: ("ȷ�����<strong style='color:#990000'>" + val + "</strong>Ϊ�Զ����ǩ��"),
                    sure: function () {
                        //���URL
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
                                        txt: "��ӱ�ǩ�ɹ�!"
                                    });
                                }
                            },
                            error: {}
                        });
                    }
                });
            }
        }
        // �رո���������ť�����¼���
        oClose.click(hidePanel);
        // �ر� �������
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

// ��ǩ������޸ı�ǩ
hexun.home.labelManageMod = (function () {
    var defaults = {
        addID: "hxjy_labelManageMod_addlabel", //���
        panelID: "hxjy_labelManageMod_panel",// ���
        AddURL: "data/data01.js",//����Զ����ǩ
        sureURL: "data/data01.js", //ȷ���޸Ĳ��ͱ�ǩ
        delURL: "data/data01.js", //ɾ�����ͱ�ǩ
	    focusClassName:'addfocus', // �����
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
	    //  ��ǩ ����Ч��
	    otag.focus(function(){
		    oParent = $(this.parentNode.parentNode);
		    oParent.addClass(defaults.focusClassName);
	    })
	    otag.blur(function(){
		    oParent = $(this.parentNode.parentNode);
		    oParent.removeClass(defaults.focusClassName);
	    })
        //���ӱ�ǩ
        oAdd.click(function () {
            var val = oAdd.prev().val(), ret = [];
            //���Ϊ��״̬
            if (val.empty() == "") {
                return false;
            }
            // ����ظ�״̬
            oPanel.find("input").each(function () {
                if ($.trim(val) == $.trim(this.value)) {
                    hexun.home.alert().init({
                        txt: ("��Ǹ���Ѵ��� <strong style='color:#990000'>" + val + "</strong> ��ǩ")
                    });
                    val = "";
                }
            });
            if (val.empty() != "") {
                hexun.home.confirm().init({
                    txt: ("ȷ����� <strong style='color:#990000'>" + val + "</strong> Ϊ�Զ����ǩ��"),
                    sure: function () {
                        //���URL
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
                                    ret.push('<a href="#" class="a_btn_grey">�޸�</a>');
                                    ret.push('<a href="#" class="a_btn_grey">ɾ��</a>');
                                    ret.push('</td>');
                                    ret.push('</tr>');
                                    oPanel.append(ret.join(""));
                                    hexun.home.alert().init({
                                        txt: "��ӱ�ǩ�ɹ�!"
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
        //�޸�/ȷ��
        oPanel.find("a:even").live("click", function () {
            var oTxt = $(this.parentNode.parentNode).find("input");
            //�޸�
            if (!oTxt.hasClass("input_focus")) {
                this.innerHTML = "ȷ��";
                oTxt.removeAttr("disabled");
                oTxt.addClass("input_focus").focus().val(oTxt.val());
                this.className = "a_btn_blue";
            } else {
                // ȷ��
                oTxt.removeClass("input_focus");
                oTxt.attr("disabled", "disabled");
                this.innerHTML = "�޸�";
                this.className = "a_btn_grey";
                Jser.ajax({
                    url: defaults.sureURL,
                    dataType: "json",
                    type: "GET",
                    success: function (data) {
                        if (data.status == 1) {
                            hexun.home.alert().init({
                                txt: "�޸ı�ǩ�ɹ���"
                            });
                        }
                    },
                    error: {}
                });
            }
            return false;
        });
        //ɾ��
        oPanel.find("a:odd").live("click", function () {
            var self = this;
            hexun.home.confirm().init({
                txt: "ȷ��Ҫɾ���ñ�ǩ��",
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










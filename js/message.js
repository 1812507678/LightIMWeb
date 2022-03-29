$(document).ready(function () {
    mui.previewImage();

    var app_content;
    app_content = new Vue({
        el: '#app_content',
        data: {
            messageList: [],
            pageStart: 0,
            isRefreshing: false,
            isDataLoadAll: false,
            isNotData: false,
            fromUserId: '',
            conversationId: '',
            conversation: '',
            inputText: '',
            outUserId: '', //外部用户id
            imUserId: '',  //当前用户im id
            otherImUserId: '',  ////对方用户im id
            otherOutUserId: '',  //
            isFromConversation: false, //是否来自会话列表

        },
        mounted: function () {

        },
        created: function () {
            this.isFromConversation = localStorage.getItem("isFromConversation");

            this.initUser();


            if (this.isFromConversation) {
                //从会话打开
                this.queryMessageList();
                this.startQueryMsgByTimer();
            } else {
                //直接打开，需要初始化SDK
                this.appKey = getQueryURLString("appKey");
                this.initSdk();
            }

        },
        methods: {
            //初始化SDK
            initSdk: function () {
                InitSdkUtil.init(this.appKey, this.outUserId, "3", this.otherOutUserId, function (imUserId, otherImUserId) {
                    console.log("======= im初始化成功，imUserId：" + imUserId, "对方otherImUserId:" + otherImUserId);
                    app_content.imUserId = imUserId;
                    app_content.otherImUserId = otherImUserId;

                    app_content.formatNickName();

                    app_content.queryMessageList();
                    app_content.startQueryMsgByTimer();
                });
            },
            initUser: function () {
                /*
                * 聊天信息获取方式
                * 1.从URL取
                * 2.从localstore取
                * */

                if (this.isFromConversation) {
                    this.imUserId = parseInt(localStorage.getItem("imUserId"));

                    this.conversation = JSON.parse(localStorage.getItem("conversation"));
                    this.conversationId = this.conversation.id;
                    var extra = JSON.parse(this.conversation.extra);
                    var fromNickname = extra.fromNickname;
                    var fromIconUrl = extra.fromIconUrl;
                    var toNickname = extra.toNickname;
                    var toIconUrl = extra.toIconUrl;
                    var fromUserId = extra.fromUserId;
                    var toUserId = extra.toUserId;

                    if (this.imUserId === fromUserId) {
                        this.curNickname = fromNickname;
                        this.curIconUrl = fromIconUrl;

                        this.otherImUserId = toUserId;
                        this.otherNickname = toNickname;
                        this.otherIconUrl = toIconUrl;

                    } else {
                        this.curNickname = toNickname;
                        this.curIconUrl = toIconUrl;

                        this.otherImUserId = fromUserId;
                        this.otherNickname = fromNickname;
                        this.otherIconUrl = fromIconUrl;
                    }

                    this.formatNickName();
                } else {
                    this.conversationId = getQueryURLString("conversationId");
                    this.outUserId = parseInt(getQueryURLString("fromUserId"));
                    this.otherOutUserId = parseInt(getQueryURLString("toUserId"));

                    this.curNickname = getURLValue("fromNickname");
                    this.curIconUrl = getQueryURLString("fromIconUrl");
                    this.otherNickname = getURLValue("toNickname");
                    this.otherIconUrl = getQueryURLString("toIconUrl");
                }


            },
            formatNickName: function () {
                if (isEmpty(this.curNickname)) {
                    this.curNickname = "用户" + this.imUserId;
                }
                if (isEmpty(this.otherNickname)) {
                    this.otherNickname = "用户" + this.otherImUserId;
                }
                window.document.title = this.otherNickname;
            },
            queryMessageList: function (isTimerQuery) {
                if (this.isDataLoadAll || this.isRefreshing) {
                    return
                }

                var param = {};
                param.userId = this.imUserId;
                param.otherUserId = this.otherImUserId;
                param.conversationId = this.conversationId;
                param.pageIndex = this.pageStart;
                param.pageSize = 15;
                if (!isEmpty(this.conversation)) {
                    param.conversationFromUserId = this.conversation.fromUserId;
                }

                this.isRefreshing = true;
                HttpUtil.sendPost(
                    param,
                    "CODE0005",
                    function (data) {
                        app_content.isRefreshing = false;
                        if (data.length < param.pageSize) {
                            app_content.isDataLoadAll = true; //没有更多数据了
                        } else {
                            app_content.pageStart++;
                        }

                        var resultList = app_content.messageList;

                        if (param.pageIndex === 0) {
                            resultList = data.reverse();  //数据倒序
                        } else if (data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                resultList.unshift(data[i]);  //从头插入
                            }
                        }

                        app_content.formatMsgList(resultList);
                        app_content.messageList = resultList;

                        if (param.pageIndex === 0) {
                            scrollToBottom();
                        } else if (data.length > 0) {
                            scrollTo(1500);
                        }

                    },
                    function (data) {
                        app_content.isRefreshing = false;
                        console.log("error:" + JSON.stringify(data));
                        //Bridge.toast("加载失败：" + JSON.stringify(data));
                    }, undefined, undefined, true
                );
            },
            loopQueryMessageList: function (isTimerQuery) {
                if (!UserUtil.getIMUserToken()) {
                    return;
                }

                if (this.isRefreshing) {
                    return
                }

                var param = {};
                param.userId = this.imUserId;
                param.otherUserId = this.otherImUserId;
                param.conversationId = this.conversationId;
                param.pageIndex = 0;
                param.pageSize = 15;
                if (!isEmpty(this.conversation)) {
                    param.conversationFromUserId = this.conversation.fromUserId;
                }

                HttpUtil.sendPost(
                    param,
                    "CODE0005",
                    function (data) {
                        data = app_content.duplicateRemoval(data);
                        data = data.reverse();

                        if (data.length > 0) {
                            //app_content.messageList = app_content.messageList.concat(data);
                            var resultList = app_content.messageList;
                            resultList = resultList.concat(data);
                            app_content.formatMsgList(resultList);
                            app_content.messageList = resultList;
                            if (judgeIsBottom()) {
                                scrollToBottom();  //滑动到底部
                            }
                        }
                    },
                    function (data) {
                        console.log("error:" + JSON.stringify(data));
                        //Bridge.toast("加载失败：" + JSON.stringify(data));
                    },
                    true, undefined, true
                );
            },
            formatList: function (list) {
                for (var i = 0; i < list.length; i++) {

                }
                return list;
            },
            duplicateRemoval: function (data) {
                var resultData = [];
                for (var i = 0; i < data.length; i++) {
                    var findResult = this.messageList.find(function (item) {
                        return data[i].id === item.id;
                    });
                    if (!findResult) {
                        resultData.push(data[i]);
                    }
                }
                return resultData;
            },
            loadMore: function () {
                this.queryMessageList();
            },
            refresh: function () {
                this.pageStart = 0;
                this.queryMessageList();
            },
            sendTextMsg: function () {
                if (isEmpty(this.inputText)) {
                    Bridge.toast("请输入内容");
                    return
                }

                this.sendMsg(1);
            },
            sendFileMsg: function (fileUrl, fileSmallUrl) {
                this.sendMsg(2, fileUrl, fileSmallUrl);
            },
            sendMsg: function (type, fileUrl, fileSmallUrl) {
                if (this.conversationSelectIndex < 0) {
                    Bridge.toast("未选中会话，请先在左侧点击会话列表");
                    return
                }

                var param = {};
                param.fromUserId = this.imUserId;
                param.toUserId = this.otherImUserId;
                param.fromOutUserId = this.outUserId;
                param.toOutUserId = this.otherOutUserId;
                param.type = type;
                param.text = this.inputText;
                param.extra = '';
                param.userInfoExtra = JSON.stringify(this.getUserInfoExtra());
                if (!isEmpty(this.conversation)) {
                    param.conversationFromUserId = this.conversation.fromUserId;
                }

                if (type === 2) {
                    //文件
                    param.fileUrl = fileUrl;
                    param.fileSmallUrl = fileSmallUrl;
                }

                HttpUtil.sendPost(
                    param,
                    "CODE0003",
                    function (data) {
                        //app_content.messageList.push({"fromUserId":app_content.fromUserId,"toUserId":app_content.toUserId,"text":app_content.inputText});
                        app_content.messageList.push(data);
                        app_content.inputText = '';
                        app_content.$forceUpdate();  //强制刷新UI
                        scrollToBottom();
                    },
                    function (data) {
                        app_content.isRefreshing = false;
                        console.log("error:" + JSON.stringify(data));
                        Bridge.toast("加载失败：" + JSON.stringify(data));
                    }, undefined, undefined, true
                );
            },
            getUserInfoExtra: function () {
                return {
                    fromUserId: this.imUserId,
                    fromNickname: this.curNickname,
                    fromIconUrl: this.curIconUrl,
                    toUserId: this.otherImUserId,
                    toNickname: this.otherNickname,
                    toIconUrl: this.otherIconUrl,
                    fromOutUserId:this.outUserId,
                    toOutUserId:this.otherOutUserId
                };
            },
            startQueryMsgByTimer: function () {
                if (ComConfig.MESSAGE_LOOPER_TIME > 0) {
                    setInterval(function () {
                        console.log("时间到:" + getNowFormatDate());
                        app_content.loopQueryMessageList(true);
                    }, ComConfig.MESSAGE_LOOPER_TIME);
                }
            },
            formatMsgList: function (list) {
                //判断是否要显示时间/日期：时间间隔大于5分钟会显示时间（同微信）
                var preItem;
                for (var i = 0; i < list.length; i++) {
                    if (i === 0) {
                        list[i].isShowTime = true;
                    } else {
                        list[i].isShowTime = FormatUtil.isShowMsgTime(preItem.timestamp, list[i].timestamp);
                    }
                    preItem = list[i];
                }
            },
            handleUploadFile: function (files) {
                if (files[0]) {
                    for (var i = 0; i < files.length; i++) {
                        var img = window.URL.createObjectURL(files[i]); // 将文件生成url
                        //上传服务器
                        HttpUtil.sendPostWithFile(files[i], {}, "CODE0002", function (data) {
                            console.log("data:" + JSON.stringify(data));
                            if (data.imgList_smaller) {
                                app_content.sendFileMsg(data.imgList[0], data.imgList_smaller[0]);
                            }
                        })
                    }
                }
            },
            uploadImgClick:function(){
                Bridge.uploadImage(1,function (responseData) {
                    console.log("responseData:"+responseData);
                    var res = JSON.parse(responseData);
                    if (res.imgList !== undefined) {
                        app_content.sendFileMsg(res.imgList[0], res.imgList_smaller[0]);
                    }
                });
            },
            textLongTouch: function (item) {
                //copyToClipboard("123");

            },

        },
        computed: {},
        watch: {
            // messageList: scrollToBottom()
        }


    });

    function scrollToBottom() {
        setTimeout(function () {
            $("html, body").animate({
                scrollTop: $('html, body').get(0).scrollHeight
            }, 1000); // 把滚动条顶部加上滚动条高度
        },100)

    }

    function scrollTo(height) {
        $("html, body").animate({
            scrollTop: height
        },0); // 把滚动条顶部加上滚动条高度
    }

    function judgeIsBottom(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight > scrollHeight-100){
            console.log("在底部");
            return true;
        }
        return false;
    }

    window.onscroll = function (){
        var marginBot = 0;
        if (document.documentElement.scrollTop){
            marginBot = document.documentElement.scrollHeight-(document.documentElement.scrollTop+document.body.scrollTop)-document.documentElement.clientHeight;
        } else {
            marginBot = document.body.scrollHeight-document.body.scrollTop- document.body.clientHeight;
        }
        if(marginBot<=0) {
            console.log("do something");
            if (document.documentElement.scrollTop === 0) {
                console.log("顶部");
                app_content.loadMore();
            }
            else {
                console.log("底部");
                //app_content.refresh();
            }
        }
    }

    var uploadImg = document.getElementById('uploadImg');
    uploadImg.onchange = function () {
        app_content.handleUploadFile(uploadImg.files)
    };

});


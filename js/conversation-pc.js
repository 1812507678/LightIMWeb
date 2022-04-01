$(document).ready(function () {
    mui.previewImage();


    var app_content = new Vue({
        el: '#app_content',
        data: {
            conversationList: [],
            pageStart:0,
            conversationIsRefreshing:false,
            conversationIsDataLoadAll:false,
            conversationIsNotData:false,
            outUserId:'', //外部用户id
            imUserId:'', //im用户id
            conversationSelectIndex:-1, //会话选中的index

            msgIsRefreshing:false,
            msgIsDataLoadAll:false,
            msgIsNotData:false,
            messageList: [],
            msgPageStart:0,
            fromUserId:'',
            conversation:'',
            inputText:'',
            otherNickname:'', //对方的用户名
            otherUserId:"", //对方的用户id
            otherSubNickname:"", //
            isQueryMsgByTimerRunning:false, //消息轮询器是否打开
            token:'', //访问令牌，初始化成功后返回
            onLine: navigator.onLine, //网络状态


        },
        mounted:function(){
            this.keyDown();
            window.addEventListener('online', this.updateOnlineStatus);
            window.addEventListener('offline', this.updateOnlineStatus);
        },
        created: function () {
            this.initView();
            this.outUserId = getQueryURLString("adminId");
            this.appKey = getQueryURLString("appKey");

            this.initSdk();

        },
        methods: {
            initView:function(){
              $(".left").height(window.screen.availHeight);
            },
            //初始化SDK
            initSdk:function(){
                InitSdkUtil.init(this.appKey,this.outUserId, "2","",function (imUserId) {
                    console.log("======= im初始化成功，imUserId："+imUserId);
                    app_content.imUserId = imUserId;
                    app_content.queryConversationList();
                    app_content.startConversationQueryTimer();
                });
            },
            queryConversationList: function () {
                var param = {};
                param.pageIndex = this.pageStart;
                param.pageSize = 15;

                HttpUtil.sendPost(
                    param,
                    "CODE0006",
                    function (data) {
                        app_content.conversationIsRefreshing = false;
                        if (data.length<param.pageSize){
                            if (param.pageIndex === 0 && data.length===0) {
                                app_content.conversationIsNotData = true; //没有数据了
                            }
                            else {
                                app_content.conversationIsDataLoadAll = true; //没有更多数据了
                            }
                        }
                        else {
                            app_content.pageStart++;
                        }

                        data = app_content.formatConversationList(data);

                        if (param.pageIndex === 0) {
                            app_content.conversationList = data;
                        }
                        else {
                            app_content.conversationList = app_content.conversationList.concat(data);
                        }
                    },
                    function (data) {
                        app_content.conversationIsRefreshing = false;
                        console.log("error:" + JSON.stringify(data));
                        //Bridge.toast("加载失败：" + JSON.stringify(data));
                    },undefined,undefined,true
                );
            },
            loopQueryConversationList: function () {
                if (!UserUtil.getIMUserToken()) {
                    return;
                }

                var param = {};
                param.pageIndex = 0;
                param.pageSize = 15;

                HttpUtil.sendPost(
                    param,
                    "CODE0006",
                    function (data) {
                        app_content.conversationIsRefreshing = false;
                        data = app_content.formatConversationList(data);
                        for (var i = 0; i < app_content.conversationList.length; i++) {
                            var findResult = data.find(function (item) {
                                return app_content.conversationList[i].id === item.id;
                            });
                            if (!findResult) {
                                data.push(app_content.conversationList[i]);
                            }
                        }
                        app_content.conversationList = data;
                    },
                    function (data) {
                        app_content.conversationIsRefreshing = false;
                        console.log("error:" + JSON.stringify(data));
                        //Bridge.toast("加载失败：" + JSON.stringify(data));
                    },true
                );
            },
            formatConversationList:function(list){
                for(var i=0; i<list.length; i++){
                    var extra = list[i].extra;
                    var extraObj = {};
                    if (!isEmpty(extra)) {
                        extraObj = JSON.parse(extra);
                    }
                    var nickname;
                    var iconUrl;
                    var unreadCount;
                    var otherUserId;
                    var otherOutUserId;
                    var subNickname;
                    if (parseInt(this.imUserId) === parseInt(extraObj.fromUserId)) {
                        nickname = isEmpty(extraObj.toNickname)?("用户"+list[i].toUserId):extraObj.toNickname;
                        iconUrl = extraObj.toIconUrl;
                        unreadCount = 0; //最后一条消息是自己发的，则未读数量肯定为0
                        otherUserId = extraObj.toUserId;
                        otherOutUserId = extraObj.toOutUserId;
                    }
                    else {
                        nickname = isEmpty(extraObj.fromNickname)?("用户"+list[i].fromUserId):extraObj.fromNickname;
                        iconUrl = extraObj.fromIconUrl;
                        //unreadCount = Math.max(list[i].toUnreadCount,list[i].fromUnreadCount);
                        otherUserId = extraObj.fromUserId;
                        otherOutUserId = extraObj.fromOutUserId;

                        if (list[i].fromUserId === this.imUserId) {
                            unreadCount = list[i].fromUnreadCount;
                        }
                        else {
                            unreadCount = list[i].toUnreadCount;
                        }
                    }

                    list[i].unreadCount = unreadCount;
                    list[i].nickname = nickname;
                    list[i].otherUserId = otherUserId;
                    list[i].otherOutUserId = otherOutUserId;

                    if(otherOutUserId){
                        subNickname = "（"+otherOutUserId+"）";
                    }
                    else {
                        subNickname = "（旧版"+otherUserId+"）";
                    }
                    list[i].subNickname = subNickname;
                }
                return list;
            },
            loadConversationMore:function() {
                this.queryConversationList();
            },
            onConversationItemClick:function (index) {
                this.conversationSelectIndex = index;  //改变选中的会话index
                this.conversation = this.conversationList[index];
                this.reChangeConversation();
            },
            startConversationQueryTimer:function () {
                if (ComConfig.CONVERSATION_LOOPER_TIME > 0) {
                    setInterval(function () {
                        console.log("会话轮询时间到:"+getNowFormatDate());
                        app_content.loopQueryConversationList(true);
                    },ComConfig.CONVERSATION_LOOPER_TIME);
                }
            },
            reChangeConversation:function () {
                //重置消息界面
                this.messageList = [];
                this.msgPageStart = 0;
                this.inputText = '';
                this.msgIsDataLoadAll = false;
                this.msgIsRefreshing = false;

                var extra = JSON.parse(this.conversation.extra);
                var fromNickname = extra.fromNickname;
                var fromIconUrl = extra.fromIconUrl;
                var toNickname = extra.toNickname;
                var toIconUrl = extra.toIconUrl;
                var fromUserId = parseInt(extra.fromUserId);
                var toUserId = parseInt(extra.toUserId);

                this.otherSubNickname = this.conversation.subNickname;

                if (this.imUserId === fromUserId) {
                    this.curNickname = fromNickname;
                    this.curIconUrl = fromIconUrl;

                    this.otherUserId = toUserId;
                    this.otherNickname = toNickname;
                    this.otherIconUrl = toIconUrl;
                }
                else {
                    this.curNickname = toNickname;
                    this.curIconUrl = toIconUrl;

                    this.otherUserId = fromUserId;
                    this.otherNickname = fromNickname;
                    this.otherIconUrl = fromIconUrl;
                }


                //window.document.title = this.otherNickname;

                this.queryMessageList();
                this.startMsgQueryTimer();

            },
            queryMessageList: function (isTimerQuery) {
                if (this.msgIsDataLoadAll || this.msgIsRefreshing) {
                    return
                }

                var param = {};
                param.otherUserId = this.otherUserId;
                param.conversationId = this.conversation.id;
                param.pageIndex = this.msgPageStart;
                param.pageSize = 20;
                param.conversationFromUserId = this.conversation.fromUserId;

                this.msgIsRefreshing = true;
                HttpUtil.sendPost(
                    param,
                    "CODE0005",
                    function (data) {
                        app_content.msgIsRefreshing = false;
                        if (data.length<param.pageSize){
                            if (param.pageIndex === 0 && data.length===0) {
                                app_content.msgIsNotData = true; //没有数据了
                            }
                            else {
                                app_content.msgIsDataLoadAll = true; //没有更多数据了
                            }
                        }
                        else {
                            app_content.msgPageStart++;
                        }

                        var resultList = app_content.messageList;

                        if (param.pageIndex === 0) {
                            resultList = data.reverse();  //数据倒序
                        }
                        else if (data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                resultList.unshift(data[i]);  //从头插入
                            }
                        }

                        app_content.formatMsgList(resultList);
                        app_content.messageList = resultList;

                        if (param.pageIndex === 0) {
                            scrollToMsgBottom();
                        }
                        else if (data.length > 0) {
                            scrollMsgTo(1500);
                        }
                    },
                    function (data) {
                        app_content.msgIsRefreshing = false;
                        console.log("error:" + JSON.stringify(data));
                        //Bridge.toast("加载失败：" + JSON.stringify(data));
                    },undefined,undefined,true
                );
            },
            loopQueryMessageList: function (isTimerQuery) {
                if (!UserUtil.getIMUserToken()) {
                    return;
                }

                if (this.msgIsRefreshing) {
                    return
                }

                var param = {};
                param.otherUserId = this.otherUserId;
                param.conversationId = this.conversation.id;
                param.pageIndex = 0;
                param.pageSize = 20;
                param.conversationFromUserId = this.conversationList[this.conversationSelectIndex].fromUserId;

                HttpUtil.sendPost(
                    param,
                    "CODE0005",
                    function (data) {
                        data = app_content.duplicateRemoval(data);
                        data = data.reverse();

                        if (data.length > 0) {
                            var resultList = app_content.messageList;
                            resultList = resultList.concat(data);
                            app_content.formatMsgList(resultList);
                            app_content.messageList = resultList;
                            if (judgeIsMsgBottom()) {
                                scrollToMsgBottom();  //滑动到底部
                            }
                        }
                    },
                    function (data) {
                        console.log("error:" + JSON.stringify(data));
                        //Bridge.toast("加载失败：" + JSON.stringify(data));
                    },
                    true,undefined,true
                );
            },
            duplicateRemoval :function(data){
                var resultData = [];
                for(var i=0; i<data.length; i++){
                    var findResult = this.messageList.find(function (item) {
                        return data[i].id === item.id;
                    });
                    if (!findResult && data[i].id) {
                        resultData.push(data[i]);
                    }
                }
                return resultData;
            },
            loadMsgMore:function() {
                this.queryMessageList();
            },
            refresh:function() {
                this.pageStart = 0;
                this.queryMessageList();
            },
            sendTextMsg:function () {
                if (isEmpty(this.inputText)) {
                    Bridge.toast("请输入内容");
                    return
                }

                this.sendMsg(1);
            },
            sendFileMsg:function (fileUrl,fileSmallUrl) {
                this.sendMsg(2,fileUrl,fileSmallUrl);
            },
            sendMsg:function (type,fileUrl,fileSmallUrl) {
                if (this.conversationSelectIndex<0) {
                    Bridge.toast("未选中会话，请先在左侧点击会话列表");
                    return
                }

                var param = {};
                param.fromUserId = this.imUserId;
                param.toUserId = this.otherUserId;
                param.type = type;
                param.text = this.inputText;
                param.extra = '';
                param.userInfoExtra = JSON.stringify(this.getUserInfoExtra());
                param.conversationFromUserId = this.conversation.fromUserId;

                if (type === 2) {
                    //文件
                    param.fileUrl = fileUrl;
                    param.fileSmallUrl = fileSmallUrl;
                }

                HttpUtil.sendPost(
                    param,
                    "CODE0003",
                    function (data) {
                        app_content.messageList.push(data);

                        if (param.type === 1) { //重置文本输入框
                            app_content.inputText = '';
                        }

                        app_content.$forceUpdate();  //强制刷新UI
                        scrollToMsgBottom();
                    },
                    function (data) {
                        app_content.msgIsRefreshing = false;
                        console.log("error:" + JSON.stringify(data));
                        Bridge.toast("发送失败：" + JSON.stringify(data));
                    },undefined,undefined,true
                );
            },
            getUserInfoExtra:function () {
                return {
                    fromUserId:this.imUserId,
                    fromNickname:this.curNickname,
                    fromIconUrl:this.curIconUrl,
                    toUserId:this.otherUserId,
                    toNickname:this.otherNickname,
                    toIconUrl:this.otherIconUrl,
                    fromOutUserId:this.outUserId,
                    toOutUserId:this.conversationList[this.conversationSelectIndex].otherOutUserId
                };
            },
            startMsgQueryTimer:function () {
                if (!this.isQueryMsgByTimerRunning) {
                    this.isQueryMsgByTimerRunning = true;

                    if (ComConfig.MESSAGE_LOOPER_TIME > 0) {
                        setInterval(function () {
                            console.log("消息轮询时间到:"+getNowFormatDate());
                            app_content.loopQueryMessageList(true);
                        },ComConfig.MESSAGE_LOOPER_TIME);
                    }
                }
            },
            formatMsgList:function(list){
                //判断是否要显示时间/日期：时间间隔大于5分钟会显示时间（同微信）
                var preItem ;
                for (var i = 0; i < list.length; i++) {
                    if (i === 0) {
                        list[i].isShowTime = true;
                    }
                    else {
                        list[i].isShowTime = FormatUtil.isShowMsgTime(preItem.timestamp,list[i].timestamp);
                    }
                    preItem = list[i];
                }
            },
            textLongTouch:function (item) {
                //copyToClipboard("123");

            },
            // 监听键盘
            keyDown() {
                document.onkeydown =  (e) => {
                    //事件对象兼容
                    let e1 = e || event || window.event || arguments.callee.caller.arguments[0]
                    //键盘按键判断:左箭头-37;上箭头-38；右箭头-39;下箭头-40
                    if (e1 && e1.keyCode === 38) {
                        // 按上箭头
                        if (app_content.conversationSelectIndex>0){
                            app_content.onConversationItemClick(app_content.conversationSelectIndex-1);
                        }
                    }
                    else if (e1 && e1.keyCode === 40) {
                        // 按下箭头
                        if (app_content.conversationSelectIndex<app_content.conversationList.length-1){
                            app_content.onConversationItemClick(app_content.conversationSelectIndex+1);
                        }
                    }
                }
            },
            handleUploadFile:function(files){
                if (files[0]) {
                    for (var i = 0; i < files.length; i++) {
                        var img = window.URL.createObjectURL(files[i]); // 将文件生成url
                        //上传服务器
                        HttpUtil.sendPostWithFile(files[i],{},"CODE0002",function (data) {
                            console.log("data:"+JSON.stringify(data));
                            if (data.imgList_smaller) {
                                app_content.sendFileMsg(data.imgList[0],data.imgList_smaller[0]);
                            }
                        })
                    }
                }
            },
            updateOnlineStatus:function(e) {
                const { type } = e;
                this.onLine = type === 'online';
            },

        },
        computed: {

        },
        watch: {
        }


    });

    //监听页面滑动到底部，加载更多
    /*$(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight === scrollHeight){
            if (!app_content.isRefreshing && !app_content.isDataLoadAll && !app_content.isNotData) {
                //到达底部加载更多列表
                app_content.isRefreshing = true;
                app_content.loadMore();
            }
        }
    });*/


    /*function scrollToMsgBottom() {
        $("html, body").animate({
            scrollTop: $('html, body').get(0).scrollHeight
        }, 1000); // 把滚动条顶部加上滚动条高度
    }*/

    function scrollToMsgBottom() {
        console.log("scrollToMsgBottom");
        //延迟100毫秒，等页面布局好
        setTimeout(function () {
            $("#itemMsg").animate({
                scrollTop: $('#itemMsg').get(0).scrollHeight
            }, 1000); // 把滚动条顶部加上滚动条高度
        },100)
    }

    function scrollMsgTo(height) {
        $("#itemMsg").animate({
            scrollTop: height
        },0); // 把滚动条顶部加上滚动条高度
    }

    function judgeIsMsgBottom(){
        var scrollTop = itemMsg.scrollTop;
        var scrollHeight =itemMsg.clientHeight;
        var windowHeight = itemMsg.scrollHeight;
        if(scrollTop + windowHeight > scrollHeight-100){
            console.log("在底部");
            return true;
        }
        return false;
    }

    var itemMsg = document.getElementById('itemMsg');
    itemMsg.onscroll = function(){
        var divScrollTop = itemMsg.scrollTop;
        var divClientHeight = itemMsg.clientHeight;
        var divScrollHeight = itemMsg.scrollHeight;
        if(divScrollTop + divClientHeight >= divScrollHeight-100){
            console.log('消息到底部了');
            //alert("到底部了");
        }
        if(divScrollTop === 0){
            console.log('消息到顶部了');
            //alert("到顶部了");
            if (!app_content.msgIsRefreshing && !app_content.msgIsDataLoadAll && !app_content.msgIsNotData) {
                //到达底部加载更多列表
                app_content.loadMsgMore();
            }
        }
    };

    var conversation = document.getElementById('conversation');
    conversation.onscroll = function(){
        var divScrollTop = conversation.scrollTop;
        var divClientHeight = conversation.clientHeight;
        var divScrollHeight = conversation.scrollHeight;
        if(divScrollTop + divClientHeight >= divScrollHeight){
            console.log('会话到底部了');
            //alert("到底部了");
            if (!app_content.conversationIsRefreshing && !app_content.conversationIsDataLoadAll && !app_content.conversationIsNotData) {
                //到达底部加载更多列表
                app_content.conversationIsRefreshing = true;
                app_content.loadConversationMore();
            }

        }
        if(divScrollTop === 0){
            console.log('会话到顶部了');
            //alert("到顶部了");
        }
    };


    var uploadImg = document.getElementById('uploadImg');
    uploadImg.onchange = function () {
        app_content.handleUploadFile(uploadImg.files)
    };


});

$(document).ready(function () {
    var app_content = new Vue({
        el: '#app_content',
        data: {
            conversationList: [],
            pageStart:0,
            isRefreshing:false,
            isDataLoadAll:false,
            isNotData:false,
            userId:'',
            outUserId:'', //外部用户id
            imUserId:'', //im用户id

        },
        created: function () {
            this.outUserId = getQueryURLString("userId");
            this.appKey = getQueryURLString("appKey");

            this.initSdk();

        },
        methods: {
            //初始化SDK
            initSdk:function(){
                //3
                InitSdkUtil.init(this.appKey,this.outUserId, "3","",function (imUserId) {
                    console.log("======= im初始化成功，imUserId："+imUserId);
                    app_content.imUserId = imUserId;
                    app_content.queryConversationList();
                    app_content.startQueryTimer();
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
                        app_content.isRefreshing = false;
                        if (data.length<param.pageSize){
                            if (param.pageIndex === 0 && data.length===0) {
                                app_content.isNotData = true; //没有数据了
                            }
                            else {
                                app_content.isDataLoadAll = true; //没有更多数据了
                            }
                        }
                        else {
                            app_content.pageStart++;
                        }

                        data = app_content.formatList(data);

                        if (param.pageIndex === 0) {
                            app_content.conversationList = data;
                        }
                        else {
                            app_content.conversationList = app_content.conversationList.concat(data);
                        }
                    },
                    function (data) {
                        app_content.isRefreshing = false;
                        console.log("error:" + JSON.stringify(data));
                        Bridge.toast("加载失败：" + JSON.stringify(data));
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
                        data = app_content.formatList(data);
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
                        app_content.isRefreshing = false;
                        console.log("error:" + JSON.stringify(data));
                        Bridge.toast("加载失败：" + JSON.stringify(data));
                    },true
                );
            },
            formatList:function(list){
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
                    if (parseInt(this.imUserId) === parseInt(extraObj.fromUserId)) {
                        //最后一条消息是自己发出去的
                        nickname = isEmpty(extraObj.toNickname)?("用户"+list[i].toUserId):extraObj.toNickname;
                        iconUrl = extraObj.toIconUrl;
                        unreadCount = 0; //最后一条消息是自己发的，则未读数量肯定为0
                        otherUserId = extraObj.toUserId;
                        otherOutUserId = extraObj.toOutUserId;
                    }
                    else {
                        //最后一条消息是别人发过来的
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
                }
                return list;
            },
            loadMore:function() {
                this.queryConversationList();
            },
            gotoMessage:function (item) {
                localStorage.setItem("conversation",JSON.stringify(item));
                localStorage.setItem("imUserId",this.imUserId);
                localStorage.setItem("isFromConversation",true);
                Bridge.openWebView("page/message.html");
            },
            startQueryTimer:function () {
                if (ComConfig.CONVERSATION_LOOPER_TIME > 0) {
                    setInterval(function () {
                        console.log("时间到:"+getNowFormatDate());
                        app_content.loopQueryConversationList(true);
                    },ComConfig.CONVERSATION_LOOPER_TIME);
                }
            },
        },
        computed: {},
        watch: {
        }


    });

    //监听页面滑动到底部，加载更多
    $(window).scroll(function(){
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
    });

});

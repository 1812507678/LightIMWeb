/*
* ======H5环境配置文件======
* 不同环境只需切换'环境指向'即可
* */

//对外可访问属性
!(function(w) {
    w.ComConfig = new function() {
        this.CONVERSATION_LOOPER_TIME = 1000*8;  //会话列表定时查询间隔
        this.MESSAGE_LOOPER_TIME = 1000*8;  //消息定时查询间隔

    };

})(window);

/**/

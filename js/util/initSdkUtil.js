!(function(w) {
    w.InitSdkUtil = new function() {
        /*
        * 初始化sdk,返回token
        * imUserType：1游客，2管理员，3已登录用户
        * */
        this.init = function (appKey,outUserId,imUserType,otherOutUserId,callback) {
            var param = {};
            param.appKey = appKey;
            param.outUserId = outUserId +"";
            param.clientType = DevicesUtil.getClientType();
            param.imUserType = imUserType;
            param.deviceUniqueId = DevicesUtil.getDeviceUniqueId();
            param.otherOutUserId = otherOutUserId +"";

            HttpUtil.sendPost(
                param,
                "CODE0011",
                function (data) {
                    UserUtil.saveIMUserToken(data.token);  //保存token
                    if (callback) {
                        callback(data.imUserId,data.otherImUserId);
                    }
                },
                function (data) {
                    console.log("error:" + JSON.stringify(data));
                },true
            );
        };



    };
})(window);





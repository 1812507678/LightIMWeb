

!(function(w) {
    w.HttpUtil = new function() {

        //post请求
        this.sendPost = function(requestData, requestNo, successFun, errorFun,isNotShowLoading,isNotShowErrorToast,isNotRepeatCheck,file) {
            if (!isNotRepeatCheck && this.isRepeatSubmit(requestNo)){
                if(errorFun){
                    errorFun();
                }
                return;
            }

            var param = this.getCommonRequestParamJson(requestNo,requestData,isNotRepeatCheck,file);

            $.ajax({
                type:'POST',  //GET/POST
                url:Envconfig.BHSH_SERVER_PATH,
                data:param,   //post请求数据
                dataType:"json",  //返回值是json格式
                contentType: false,
                processData: false,
                beforeSend:function (XHR) {
                    console.log("beforeSend");
                    if (!isNotShowLoading){
                        HttpUtil.showLoading();
                    }
                },
                complete:function (XHR, TS) {
                    console.log("complete");
                    if (!isNotShowLoading){
                        HttpUtil.hideLoading();
                    }
                },
                success:function (response) {
                    //console.log("返回数据<--------------------------:\r\n"+JSON.stringify(response));
                    layer.closeAll();

                    if(response.code === -12) { //token失效
                        UserUtil.saveIMUserToken("");
                        UserUtil.saveAdminUser({});
                    }

                    if(response.code === 200 && successFun) { //如果成功
                        successFun(response.data);
                    }
                    else if(errorFun){
                        errorFun(response.errorDec,response.code);
                        Bridge.toast(response.errorDec);
                    }
                },
                error:function(response){
                    var errorDec;
                    if(response.code === -12) { //token失效
                        UserUtil.saveIMUserToken("");
                        UserUtil.saveAdminUser({});
                    }
                    else if (response.code) {
                        errorDec = response.errorDec;
                    }
                    else {
                        //其他异常
                        if(navigator.onLine) {
                            errorDec = '网络连接异常，请检查网络'; //联网状态
                        } else {
                            errorDec ='网络断开，请检查网络';  //断网状态
                        }
                    }

                    if(!isNotShowErrorToast){
                        if (response.errorDec){
                            Bridge.toast(response.errorDec);
                        }
                        else {
                            //Bridge.toast(JSON.stringify(response));
                        }
                    }

                    if(errorFun){
                        errorFun(errorDec,response.code);
                    }
                }
            });

        };

        this.sendPostWithFile = function (file,requestData, requestNo, successFun, errorFun,isNotShowLoading,isNotShowErrorToast,isNotRepeatCheck) {
            this.sendPost(requestData, requestNo, successFun, errorFun,isNotShowLoading,isNotShowErrorToast,isNotRepeatCheck,file);
        };
        this.layerView = undefined;
        //显示等待层
        this.showLoading = function () {
            //HttpUtil.layerView = layer.open({type:2,content:"加载中",background:"#000000"})
            HttpUtil.layerView = layer.load(1);
        };
        //关闭等待层
        this.hideLoading = function () {
            //layer.closeAll();
            layer.close(HttpUtil.layerView);
        };
        //获取请求公共参数 以后对数据的封装、加密可用放在这里
        this.getCommonRequestParamJson = function (requestNo,requestData,isNotRepeatCheck,file) {
            //1.封装公共请求参数
            var requestParamBase = {};
            requestParamBase.requestNo = requestNo;
            requestParamBase.requestData = requestData;
            requestParamBase.requestTimestamp = new Date().getTime();
            requestParamBase.isNotRepeatCheck = isNotRepeatCheck;

            if (!isEmpty(requestData.isAdmin) && requestData.isAdmin && UserUtil.isAdminLogin()) {
                requestParamBase.userRole = "2";  //管理员
                requestParamBase.token = UserUtil.getAdminToken();
            }
            else if (UserUtil.getIMUserToken()) {
                requestParamBase.userRole = "3"; //im用户
                requestParamBase.token = UserUtil.getIMUserToken();
            }
            else {
                requestParamBase.userRole = "1";  //游客
            }

            //2.加密签名
            var commonRequestDataStr = JSON.stringify(requestParamBase)
            var param = new FormData();
            param.append("requestData" , encrypt(commonRequestDataStr));
            param.append("encryptWay" , "gen_H5_01");
            param.append("sign" ,  md5(commonRequestDataStr));
            param.append("file", file);

            return param;
        };

        this.getWholeImageUrl = function (url) {
            if($.isEmptyObject(url)){
                return "../images/widget_dface.png";
            }
            else if(url.startsWith("http")){
                return url;
            }
            else if(url.endWith("upload.jpg")){  //本地默认图片
                return url;
            }
            else {
                return Envconfig.BHSH_IMAGE_URL +url;
            }
        };

        this.requestTimestampArray = [];
        //防重复提交判断
        this.isRepeatSubmit = function (requestNo) {
            var requestTimestamp = new Date().getTime();
            var isRepeat = false;
            var isAddArray = false;
            for (var i = 0; i < this.requestTimestampArray.length; i++) {
                var item = this.requestTimestampArray[i];
                if (item.requestNo === requestNo){
                    isAddArray = true;
                    var intervalTimestamp = requestTimestamp-item.requestTimestamp;
                    console.log("intervalTimestamp："+intervalTimestamp);
                    if (intervalTimestamp<1000) { //2秒内为重复请求
                        isRepeat = true;
                    }
                    item.requestTimestamp = requestTimestamp;
                    break;
                }
            }
            if (!isAddArray) {
                this.requestTimestampArray.push({requestNo:requestNo,requestTimestamp:requestTimestamp});
            }
            console.log("是否重复提交："+isRepeat);
            return isRepeat;
        };
    };

})(window);


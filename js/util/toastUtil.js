!(function(w) {
    w.ToastUtil = new function () {
        this.showToast = function(content,seconds) {
            seconds = seconds?seconds:1;
            //提示
            layer.open({
                content: content
                ,skin: 'msg'
                ,time: seconds //seconds秒后自动关闭
            });
        };
        this.alertConfirmDialog = function(title,okTips,okClickCallBack,cancelTips,cancelClickCallBack) {
            if (cancelTips!=="" && cancelTips!==undefined){
                layer.open({
                    content: title
                    ,btn: [okTips,cancelTips]
                    ,yes: function(index){
                        layer.close(index);
                        okClickCallBack();
                    }
                    ,cancel: function(index){
                        cancelClickCallBack();
                    }
                });
            }
            else {
                layer.open({
                    content: title
                    ,btn: [okTips]
                    ,yes: function(index){
                        layer.close(index);
                        okClickCallBack();
                    }
                    ,cancel: function(index){
                        cancelClickCallBack();
                    }
                });
            }
        };

        this.muiConfirmDialog = function(title,content,okTips,okClickCallBack,cancelTips) {
            var btnArray = [cancelTips, okTips];
            mui.confirm(content,title, btnArray, function(e) {
                // 否：e.index=0;是：e.index=1;
                if (e.index == 1) {
                    okClickCallBack();
                }
            })
        };

        this.muiAlertDialog = function(title,content,okTips,okClickCallBack) {
            mui.alert(content, title,okTips, function() {
                if (okClickCallBack) {
                    okClickCallBack();
                }
            });
        };
    };

})(window);

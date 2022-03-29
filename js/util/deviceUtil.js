!(function(w) {
    w.DevicesUtil = new function() {
        //获取客户端设备类型
        this.getClientType = function () {
            if (isPC()) {
                return '1';
            }
            else {
                return '2';
            }
        };
        //获取客户端唯一id
        this.getDeviceUniqueId = function () {
            var fp1 = new Fingerprint();  //fingerprint.js生成浏览器唯一标识
            return  fp1.get();
        };


    };
})(window);





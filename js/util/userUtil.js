!(function(w) {
    w.UserUtil = new function() {
        this.saveAdminUser = function(user) {
            sessionStorage.setItem('userInfo',JSON.stringify(user)); // 存入用户信息
        };
        this.getAdminUser = function() {
            var userStr = sessionStorage.getItem('userInfo');
            if (!isEmpty(userStr)){
                return JSON.parse(userStr); // 返回用户信息
            }
            return undefined;
        };
        this.isAdminLogin = function() {
            return !!this.getAdminUser();
        };

        //获取管理员token
        this.getAdminToken = function() {
            if (this.isAdminLogin()){
                return this.getAdminUser().token;
            }
            return undefined;
        };


        //报错im用户token
        this.saveIMUserToken = function(token) {
            sessionStorage.setItem('IMUserToken',token);
        };

        //获取im用户token
        this.getIMUserToken = function() {
            return sessionStorage.getItem("IMUserToken");
        };



    };



})(window);


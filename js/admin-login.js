$(document).ready(function () {
    var app_content = new Vue({
        el: '#app_content',
        data: {
            username: '',
            password: '',


        },
        mounted:function(){

        },
        created: function () {

        },
        methods: {
            loginClick:function(){
                if (isEmpty(this.username) || isEmpty(this.password)) {
                    alert("请输入用户名或密码");
                    return;
                }

                var param = {};
                param.username = this.username;
                param.password = md5(this.password);
                param.appType = DevicesUtil.getClientType();

                HttpUtil.sendPost(
                    param,
                    "CODE0008",
                    function (data) {
                        UserUtil.saveAdminUser(data);
                        window.location.href = "app-list.html";
                    },
                    function (data) {
                        app_content.isRefreshing = false;
                        console.log("error:" + JSON.stringify(data));
                        //Bridge.toast(data);
                    }
                );
            },

        },
        computed: {

        },
        watch: {
        }


    });
});




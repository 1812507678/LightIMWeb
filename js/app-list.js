$(document).ready(function () {
    var app_content = new Vue({
        el: '#app_content',
        data: {
            appList: [],
            user:{"name":"未登录"},
        },
        created: function () {
            this.init();
        },
        methods: {
            init:function(){
                if (UserUtil.isAdminLogin()){
                    this.user = UserUtil.getAdminUser();
                    this.queryAppList();
                }
                else {
                    window.location.href = "admin-login.html";
                }
            },
            queryAppList: function () {
                var param = {};
                param.isAdmin = true;
                HttpUtil.sendPost(
                    param,
                    "CODE0009",
                    function (data) {
                        app_content.appList = data;
                    },
                    function (data) {
                        console.log("error:" + JSON.stringify(data));
                    }
                );
            },
            openChatClick:function (index) {
                var item = this.appList[index];
                window.open("conversation-pc.html?appKey="+item.appKey+"&adminId="+item.id);
            },
            createAppClick:function(){
                var inputAppName = prompt('输入APP名称');
                if(isEmpty(inputAppName)){
                    Vue.prototype.$message.error('输入为空');
                    return;
                }

                var param = {"appName":inputAppName};
                param.isAdmin = true;
                HttpUtil.sendPost(
                    param,
                    "CODE0010",
                    function (data) {
                        Vue.prototype.$message({
                            message: '新建成功！',
                            type: 'success'
                        });
                        window.location.reload();
                    },
                );
            },
            exitClick:function () {
                UserUtil.saveAdminUser("");
                window.location.href = "admin-login.html";
            },



        },
        computed: {},
        watch: {
        }


    });



});

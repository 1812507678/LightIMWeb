/*
* ======H5环境配置文件======
* 不同环境只需切换'环境指向'即可
* */

var currentEnv = 1;  //环境指向

var env = [{
    config: {
        //生产
        image_url: "http://resource.wzzmlk.com/app/im/upload/imgs/",
        _path: "https://www.wzzmlk.com/RewardCatServer/req",
        _isBrowserTest: false,
    }
}, {
    config: {
        //UAT
        image_url: "http://94.191.22.221/app/im/upload/imgs/",
        _path: "http://94.191.22.221:8080/LightIMServer/req",
        _isBrowserTest: true,
    }
}, {
    config: {
        //sit
        image_url: "http://8.136.138.152:8000/static/",
        _path: "http://192.168.43.108:8080/req",
        _isBrowserTest: false,
    }
},{
    config: {
        //local
        image_url: "http://192.168.43.108/app/im/upload/imgs/",
        _path: "http://192.168.43.108:8080/req",
        _isBrowserTest: true,
    }
}, ];


//对外可访问属性
!(function(w) {
    w.Envconfig = new function() {
        this.BHSH_SERVER_PATH = env[currentEnv].config._path;  //服务器接口地址
        this.BHSH_IMAGE_URL = env[currentEnv].config.image_url;  //图片地址
        this.CURRENT_ENV_INDEX = currentEnv;  //当前环境指向
        this.IS_BROWSER_TEST = env[currentEnv].config._isBrowserTest;  //是否浏览器调试

    };

})(window);

/**/

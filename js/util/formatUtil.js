!(function(w) {
    w.FormatUtil = new function() {
        //get请求
        this.getRemainTime = function(time) { //毫秒
            time = time/1000;
            var sb ="";
            if (time > 0 && time < 60) { // 1小时内
                return sb+= time + "秒";
            } else if (time > 60 && time < 3600) {
                return sb+=parseInt(time / 60)+"分钟";
            } else if (time >= 3600 && time < 3600 * 24) {
                return sb+=parseInt(time / 3600) +"小时";
            }else if (time >= 3600*24 && time < 3600*24*30) {
                return sb += parseInt(time / (3600 * 24)) + "天";
            } else if (time >= 3600*24*30 && time < 3600*24*30*12) {
                return sb+=parseInt((time/(3600*24*30))) +"月";
            }else if (time >= 3600*24*30*12) {
                return sb+=parseInt(time/(3600*24*30*12)) +"年";
            }
            return "";
        };

        //获取当前的日期时间 格式“yyyy-MM-dd hh:mm:ss”  2018-07-23 14:47:35
        this.getNowFormatDate = function () {
            return new Date().Format("yyyy-MM-dd hh:mm:ss");
        };

        this.getFormatDate  = function  (timestamp,format) {
            if (!$.isEmptyObject(format)){
                return new Date(timestamp).Format(format);
            }
            return new Date(timestamp).Format("yyyy/MM/dd");
        };

        this.getFormatDateByTime = function (timestamp) {
            if (timestamp) {
                return new Date(timestamp).Format("yyyy-MM-dd HH:mm:ss");
            }
            else {
                return "";
            }
        };

        this.getMsgDateByTime = function (timestamp) {
            if (this.isToday(new Date(timestamp))) {
                return new Date(timestamp).Format("HH:mm");
            }
            else {
                return new Date(timestamp).Format("yyyy-MM-dd");
            }
        };

        this.isToday = function (date) {
            //Code goes here.
            var d = new Date(date.toString().replace(/-/g,"/"));
            var todaysDate = new Date();
            if(d.setHours(0,0,0,0) === todaysDate.setHours(0,0,0,0)){
                return true;
            } else {
                return false;
            }
        };
        this.isShowMsgTime = function (time1, time2) {
            return (time2 - time1) > 5 * oneMinTimestamp;
        };



    };

})(window);


/**
 * Created by zmq on 2016/8/30.
 */
var urlRequest = localStorage.getItem("urlRequest");
console.log(location.href.split('#')[0]);
var currentUrl = encodeURIComponent(location.href.split('#')[0]);
//获取签名信息
$.ajax({
    url: urlRequest+"wxjsapi/getSignInfo?currentUrl="+currentUrl,
    type: "get",
    dataType: "json",
    success: function (data) {
        if(data.status==0) {
            var l_appId = data.data.appId;
            var l_timestamp = data.data.timestamp;
            var l_nonceStr = data.data.nonceStr;
            var l_signature = data.data.signature;
            console.log(l_appId);
            console.log(l_timestamp);
            console.log(l_nonceStr);
            console.log(l_signature);
            wx.config({
                debug: false,
                appId: l_appId,
                timestamp: l_timestamp,
                nonceStr: l_nonceStr,
                signature: l_signature,
                jsApiList: [
                    'hideOptionMenu'
                ]
            });


        }
    },
    error: function (data) {
        console.log('服务端报错，' + data.status);
    }
});
//调用隐藏微信右上角菜单接口
wx.ready(function () {
    wx.hideOptionMenu();
});

var key = "AMSU2015AMSU2015";
var iv = "AES00IVPARAMETER";

// 加密
function encrypt(data) { //key,iv：16位的字符串
    var key1  = CryptoJS.enc.Utf8.parse(key);
    var iv1   = CryptoJS.enc.Utf8.parse(iv);
    return CryptoJS.AES.encrypt(data, key1,{
        iv : iv1,
        mode : CryptoJS.mode.CBC,
        padding : CryptoJS.pad.Pkcs7
    }).toString();
}

// 解密
function decrypt(data){ //key,iv：16位的字符串
    var key1  = CryptoJS.enc.Utf8.parse(key);
    var iv1   = CryptoJS.enc.Utf8.parse(iv);
    var decrypted=CryptoJS.AES.decrypt(data,key1,{
        iv : iv1,
        mode : CryptoJS.mode.CBC,
        padding : CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}
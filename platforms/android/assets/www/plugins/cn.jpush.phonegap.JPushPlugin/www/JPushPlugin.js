cordova.define("cn.jpush.phonegap.JPushPlugin.JPushPlugin", function(require, exports, module) { 
var JPushPlugin = function(){
        
};

/**
 * Helpers
 */
function isString(value) {
    return (typeof value == 'string' || value instanceof String);
}

JPushPlugin.prototype.call_native = function ( name, args) {
         console.log("JPushPlugin.call_native:"+name);
         ret = cordova.exec(null,
                            null,
                           'JPushPlugin',
                            name,
                            args);
         return ret;
}
JPushPlugin.prototype.setTagsWithAlias = function (alias,tags) {
         
         console.log("JPushPlugin:setTagsWithAlias");
         if(alias==null){
            this.setAlias(alias);
            return;
         }
         if(tags==null){
            this.setTags(tags);
            return;
         }
         var arrayTagWithAlias=[tags];
         arrayTagWithAlias.unshift(alias);
         this.call_native( "setTagsWithAlias", arrayTagWithAlias);
}
JPushPlugin.prototype.setTags = function (data) {
        
         console.log("JPushPlugin:setTags");
         try{
            this.call_native("setTags", [data]);
         }
         catch(exception){
            alert(exception);
         }
}
JPushPlugin.prototype.setAlias = function (data) {
        
         console.log("JPushPlugin:setAlias");
         try{
             
            this.call_native("setAlias", [data]);
         }
         catch(exception){
             
            alert(exception);
         }
}
JPushPlugin.prototype.setCustomPushNotificationBuilder = function (data) {
        alert("setCustomPushNotificationBuilder");
         console.log("JPushPlugin:setCustomPushNotificationBuilder");
         try{
             
            this.call_native("setCustomPushNotificationBuilder", [data]);
         }
         catch(exception){
             
            alert(exception);
         }
}
JPushPlugin.prototype.resumePush = function (data) {
        alert("resumePush");
         console.log("JPushPlugin:resumePush");
         try{
             
            this.call_native("resumePush", [data]);
         }
         catch(exception){
             
            alert(exception);
         }
}
JPushPlugin.prototype.onResume = function (data) {
        alert("onResume");
         console.log("JPushPlugin:onResume");
         try{
             
            this.call_native("onResume", [data]);
         }
         catch(exception){
             
            alert(exception);
         }
}
JPushPlugin.prototype.onPause = function (data) {
        alert("onPause");
         console.log("JPushPlugin:onPause");
         try{
             
            this.call_native("onPause", [data]);
         }
         catch(exception){
             
            alert(exception);
         }
}
JPushPlugin.prototype.getNotification = function (data, successCallback, errorCallback) {
        alert("getNotification");
    if (errorCallback === null) {
        errorCallback = function () {
        }
    }

    if (!isString(data)) {
        console.error("JPushPlugin.getNotification failure: data must be a string");
        return;
    }

    if (typeof errorCallback !== "function") {
        console.error("EstimoteBeacons.getBeaconByIdx failure: error callback parameter is not a function");
        return;
    }

    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.getBeaconByIdx failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback,
        errorCallback,
        "JPushPlugin",
        "getNotification",
        [data]
    );
}
JPushPlugin.prototype.pushCallback = function (data) {
         try{
            var bToObj=JSON.parse(data);
            var code  = bToObj.resultCode;
            var tags  = bToObj.resultTags;
            var alias = bToObj.resultAlias;
            console.log("JPushPlugin:callBack--code is "+code+" tags is "+tags + " alias is "+alias);
         }
         catch(exception){
            alert(exception);
         }
}
if(!window.plugins) {
        window.plugins = {};
}
if(!window.plugins.jPushPlugin){
        window.plugins.jPushPlugin = new JPushPlugin();
}               
module.exports = new JPushPlugin();

});

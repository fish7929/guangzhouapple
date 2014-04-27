cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cn.jpush.phonegap.JPushPlugin/www/JPushPlugin.js",
        "id": "cn.jpush.phonegap.JPushPlugin.JPushPlugin",
        "clobbers": [
            "window.plugins.jPushPlugin"
        ]
    },
    {
        "file": "plugins/com.antxman.estimotebeacons/www/EstimoteBeacons.js",
        "id": "com.antxman.estimotebeacons.EstimoteBeacons",
        "clobbers": [
            "EstimoteBeacons"
        ]
    },
    {
        "file": "plugins/com.yujin.notification/www/MyNotification.js",
        "id": "com.yujin.notification.MyNotification",
        "clobbers": [
            "MyNotification"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cn.jpush.phonegap.JPushPlugin": "1.5.2",
    "com.antxman.estimotebeacons": "0.9",
    "com.yujin.notification": "0.1"
}
// BOTTOM OF METADATA
});
/**
 *  
 *  Constructor
 */ 
 /*
var MyNotification = {  
	notify:function(title, body) { 
		alert('inner notify');
		return cordova.exec(null, null, 'MyNotification','notify', [title, body]); 
	}, 
	clear:function() { 
		return cordova.exec(null, null, 'MyNotification', 'clear', []); 
	} 
}
*/
/**
 * Helpers
 */
function isString(value) {
    return (typeof value == 'string' || value instanceof String);
}

var MyNotification= function() {
};

MyNotification.prototype.notify = function(title, body, className, success, fail) {
	//alert('inner notify');
	if (fail === null) {
        fail = function () {
        }
    }
	if(!isString(title)) {
		console.error("MyNotification.notify failure: title must be a string");
		return;
	}
	if(!isString(body)) {
		console.error("MyNotification.notify failure: body must be a string");
		return;
	}
	if(!isString(className)) {
		console.error("MyNotification.notify failure: class name must be a string");
		return;
	}
	
	if (typeof fail !== "function") {
        console.error("MyNotification.notify failure: error callback parameter is not a function");
        return;
    }

    if (typeof success !== "function") {
        console.error("MyNotification.notify failure: success callback parameter must be a function");
        return;
    }
	cordova.exec(success, fail, 'MyNotification', 'notify', [title, body, className]);
	//alert('inner end');
};
MyNotification.prototype.clear = function(success, fail) {
	//alert('inner clear');
	if (fail === null) {
        fail = function () {
        }
    }
	if (typeof fail !== "function") {
        console.error("MyNotification.clear failure: error callback parameter is not a function");
        return;
    }

    if (typeof success !== "function") {
        console.error("MyNotification.clear failure: success callback parameter must be a function");
        return;
    }
	cordova.exec(success, fail, 'MyNotification', 'clear', []);
	//alert('inner end');
};

cordova.addConstructor(function() {

	if (!window.plugins) {
		window.plugins = {};
	}
	window.plugins.MyNotification = new MyNotification();
});
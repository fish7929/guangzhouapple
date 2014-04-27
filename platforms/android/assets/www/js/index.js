var ctx;
var canvas;
var distance = [];
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady(){
	canvas = document.getElementById("myCanvas");
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');
	}
	// Draw on the context.
	makeBeacons(ctx);
	window.EstimoteBeacons.startRangingBeaconsInRegion(function () {
		//alert("123");
		setInterval(function(){
			distance = [];
			window.EstimoteBeacons.getBeacons(function (beacons) {
				if (beacons.length == 0) {
					return false;	
				}
				updateNavListData(beacons);
				for (var i = 0; i < beacons.length; i++){
					//把米转换成厘米然后取整数,或者保留三位有效数字
					if (beacons[i].minor == '1'){
						//distance0.push(((beacons[i].accuracy)* 100).toFixed(0));
						//distance[0] = ((beacons[i].accuracy)* 100).toFixed(3);
						distance[0] = (beacons[i].accuracy)*100;
					}else if(beacons[i].minor == '2'){
						distance[1] = (beacons[i].accuracy)*100;
					}else if(beacons[i].minor == '3'){
						distance[2] = (beacons[i].accuracy)*100;
					}
				}
			});
			
		},1000);//0.1秒取一次值	经过测试大概底层是1秒钟刷新一次
	});
	//设置消息提醒
	$('#one').click(function(){
		//alert('1');
		window.EstimoteBeacons.startMonitoringForRegion("MyId",1233, 1,function (content) {
			//alert('456')
			window.plugins.MyNotification.notify("Minor 1", content, "com.yujin.notification.NotificationShow",function(){}, null);
        }, null);
	});
	$('#tow').click(function(){
		window.EstimoteBeacons.startMonitoringForRegion("MyId",1233, 2,function (content) {
			window.plugins.MyNotification.notify("Minor 2", content, "com.yujin.notification.NotificationShow",function(){}, null);
        }, null);
	});
	$('#three').click(function(){
		/*
		window.EstimoteBeacons.startMonitoringForRegion("MyId",1233, 3,function (content) {
			window.plugins.MyNotification.notify("Minor 3", content, function(){}, null);
        }, null);
		*/
		if (distance[2] < 500 && distance[2] > 0){
			window.plugins.MyNotification.notify("Minor 3", "Minor 3 Enter room", "com.yujin.notification.NotificationShow",function(){}, null);
		}else if(distance[2] > 500){
			window.plugins.MyNotification.notify("Minor 3", "Minor 3 Out room", "com.yujin.notification.NotificationShow",function(){}, null);
		}else if(distance[2] == 0 || distance[2] == null){
			window.plugins.MyNotification.notify("Minor 3", "Minor 3 Exited region", "com.yujin.notification.NotificationShow",function(){}, null);
		}
	});
	//设置JPush
	$('#alais').click(function(){
		try{
			window.plugins.jPushPlugin.setAlias("myFirstAlias");
		}catch(exception){
			console.log(exception);
		}
	});
	$('#tags').click(function(){
		try{
			window.plugins.jPushPlugin.setTags("myFirstTags");
		}catch(exception){
			console.log(exception);
		}
	});
	$('#tagsAndAlais').click(function(){
		try{
			window.plugins.jPushPlugin.setTagsWithAlias("myFirstAlias",["myTags1","myTags2","myTags3"]);
		}catch(exception){
			console.log(exception);
		}
	});
	$('#style').click(function(){
		try{
			window.plugins.jPushPlugin.setCustomPushNotificationBuilder("myCustom");
		}catch(exception){
			console.log(exception);
		}
	});
	$('#getInfo').click(function(){
		try{
			window.plugins.jPushPlugin.getNotification("", function(data){
				alert(JSON.stringify(data));
			}, null);
		}catch(exception){
			console.log(exception);
		}
	});
}

function showHide(obj, objToHide) {
	var el = $("#" + objToHide)[0];
	if (obj.className == "expanded") {
		obj.className = "collapsed";
	} else {
		obj.className = "expanded";
	}
	$(el).toggle();
}

function makeBeacons(ctx) {
	//beacons三点的坐标为(50, 50), (350, 50), (50, 500)
	ctx.beginPath();
	ctx.fillStyle = "blue";
	ctx.arc(50, 50, 5, 0, Math.PI*2, true); 
	ctx.arc(300, 50, 5, 0, Math.PI*2, true); 
	ctx.arc(50, 500, 5, 0, Math.PI*2, true); 
	ctx.fill();
	ctx.closePath();
}

function getDistance(){
	alert(distance);
	var point1 = [50, 50];	//1
	var point2 = [300, 50];	//2
	var point3 = [50, 500];	//3
	mark(getPoint(point1, point2, point3, distance));
}
//在地图上绘制移动点
function mark(point){
	ctx.clearRect(0,0,350,550);//清空区域
	makeBeacons(ctx);
	ctx.beginPath();
	ctx.fillStyle = "orange";
	//point[0]: left; point[1] : top
	ctx.arc(point[0], point[1], 5, 0, Math.PI*2, true);
	ctx.fill();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.lineWidth = 1.0; 
	ctx.strokeStyle = "red";
	ctx.arc(50, 50, distance[0], 0, Math.PI*2, true); 
	ctx.arc(300, 50, distance[1], 0, Math.PI*2, true); 
	ctx.arc(50, 500, distance[2], 0, Math.PI*2, true); 
	ctx.stroke();
	ctx.closePath();
}

//通过三边法求坐标
function getPoint(point1, point2, point3, distance){
	//alert("point");
	var x1 = point1[0];
	var y1 = point1[1];
	var x2 = point2[0];
	var y2 = point2[1];
	var x3 = point3[0];
	var y3 = point3[1];
	var d1 = distance[0];
	var d2 = distance[1];
	var d3 = distance[2];
	
	var x0;
	var y0;
	x0 = ((x1*x1-x2*x2+y1*y1-y2*y2+d2*d2-d1*d1)*(y2-y3)-(x2*x2-x3*x3+y2*y2-y3*y3+d3*d3-d2*d2)*(y1-y2))/(2*((y2-y3)*(x1-x2)-(y1-y2)*(x2-x3)));
	y0 = ((x2*x2-x3*x3+y2*y2-y3*y3+d3*d3-d2*d2)*(x1-x2)-(x1*x1-x2*x2+y1*y1-y2*y2+d2*d2-d1*d1)*(x2-x3))/(2*((y2-y3)*(x1-x2)-(y1-y2)*(x2-x3)));
	var point =[];
	//坐标点x,y的表达式,去掉小数点
	point[0] = x0;
	point[1] = y0;
	$('#point').text('(' +point[0]+ ','+point[1]+')');
	return point;
}


function updateNavListData(beacons){
	//alert('up 1');
	//删除重新更新
	$("#navList li").each(function(n, elem){
		//alert($(elem).text());
		if(n != 0 && n != 1){
			$(elem).remove();
		}
	});
	var element = $('#navList li').eq(1);
	if (beacons.length == 0) {
		return false;	
	}
	
	for (var i = 0; i < beacons.length; i++){
		if (i == 0){
			element.find('p').eq(0).text("Minor: " + beacons[i].minor);
			element.find('p').eq(1).text("Accuracy: " + formatAccuracy(beacons[i].accuracy));
		}else {
			var newRow = element.clone(true);
			newRow.find('p').eq(0).text("Minor: " + beacons[i].minor);
			newRow.find('p').eq(1).text("Accuracy: " + formatAccuracy(beacons[i].accuracy));
			element.parent().append(newRow);
		}
	}
	//$("#available li").listview("refresh");
}
function formatAccuracy(meters) {
	//alert(meters + "type: " +typeof(meters));
    if(meters > 1) {
    	//alert(meters + "type: " +typeof(meters));
        return meters.toFixed(3) + ' m';
    } else {
    	//alert(meters + "type: "+ typeof(meters));
        return (meters * 100).toFixed(3) + ' cm';
    }
}
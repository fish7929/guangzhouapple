package com.yujin.notification;
import org.apache.cordova.DroidGap;

import android.os.Bundle;

@SuppressWarnings("deprecation")
public class NotificationShow extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		//setContentView(R.layout.activity_beacons);
		//加载 beacons的界面
        super.loadUrl("file:///android_asset/www/test.html");
	}
}
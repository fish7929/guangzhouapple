package com.yujin.notification;
import org.apache.cordova.DroidGap;

import android.os.Bundle;

@SuppressWarnings("deprecation")
public class NotificationShow extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		//setContentView(R.layout.activity_beacons);
		//���� ��Ϣ��ʾ�Ľ���
        super.loadUrl("file:///android_asset/www/test.html");
	}
}
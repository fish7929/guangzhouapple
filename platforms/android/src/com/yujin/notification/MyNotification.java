package com.yujin.notification;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;


import android.app.Notification;
import android.app.NotificationManager; 
import android.app.PendingIntent; 
import android.content.Context; 
import android.content.Intent; 
import android.util.Log; 

/**
 * Author: YuJin
 * Class description
 */
public class MyNotification extends CordovaPlugin {

    //  Action to execute 
    public static final String NOTIFY = "notify"; 
    public static final String CLEAR = "clear"; 
    private static final int NOTIFICATION_ID = 258521;
	 
     
    private NotificationManager mNotificationManager; 
    //private Context context; 
    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
		//message control
        mNotificationManager = (NotificationManager) (this.cordova.getActivity()).getSystemService(Context.NOTIFICATION_SERVICE);
	}
    /**
     *  Executes the request and returns PluginResult
     * 
     *  @param action       Action to execute
     *  @param data         JSONArray of arguments to the plugin
     *  @param callbackId   The callback id used when calling back into JavaScript
     *  
     *  @return             A PluginRequest object with a status
     * */ 
	 @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    	try {
			if (action.equalsIgnoreCase(NOTIFY)) {
				String title = args.getString(0); 
                String body = args.getString(1); 
				String className = args.getString(2);
                showNotification(title, body, className); 
                callbackContext.success(callbackContext.getCallbackId());
                return true;
            }
			if (action.equalsIgnoreCase(CLEAR)) {
                clearNotification();
                callbackContext.success(callbackContext.getCallbackId());
                return true;
            }
		} catch (Exception e) {
            System.out.println(e.getMessage());
            callbackContext.error(e.getMessage());
            Log.d(MyNotification.class.toString(), e.getMessage());
            return false;
        }
        return false;
    }
    /**
     *  Displays status bar notification
     * 
     *  @param contentTitle Notification title
     *  @param contentText  Notification text
     * @throws ClassNotFoundException 
     * */ 
    public void showNotification( CharSequence contentTitle, CharSequence contentText, String className)throws ClassNotFoundException { 
        //Intent notifyIntent = new Intent((Context) (this.cordova.getActivity()), this.cordova.getActivity().getClass());
        Intent notifyIntent = new Intent((Context) (this.cordova.getActivity()), Class.forName(className));
        notifyIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivities(
        	(Context) (this.cordova.getActivity()),
            0,
            new Intent[]{notifyIntent},
            PendingIntent.FLAG_UPDATE_CURRENT);
		int id = this.cordova.getActivity().getResources().getIdentifier("beacon_gray", "drawable", this.cordova.getActivity().getPackageName()); 
        Notification notification = new Notification.Builder((Context) (this.cordova.getActivity()))
            //.setSmallIcon(R.drawable.ic_dialog_info)
			.setSmallIcon(id)
            .setContentTitle(contentTitle)
            .setContentText(contentText)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build();
        notification.defaults |= Notification.DEFAULT_SOUND;
        notification.defaults |= Notification.DEFAULT_LIGHTS;
        mNotificationManager.notify(NOTIFICATION_ID, notification);
    } 
     
    /**
     * Removes the Notification from status bar
     */ 
    public void clearNotification() { 
        mNotificationManager.cancelAll(); 
    }
} 
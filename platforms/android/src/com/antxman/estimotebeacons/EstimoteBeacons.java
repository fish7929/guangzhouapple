package com.antxman.estimotebeacons;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.RemoteException;
import android.util.Log;

import com.estimote.sdk.Beacon;
import com.estimote.sdk.BeaconManager;
import com.estimote.sdk.Region;
import com.estimote.sdk.Utils;
import com.estimote.sdk.BeaconManager.MonitoringListener;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Author: antxman
 * Class description
 */
public class EstimoteBeacons extends CordovaPlugin {

    public static final String START_ESTIMOTE_BEACONS_DISCOVERY_FOR_REGION = "startEstimoteBeaconsDiscoveryForRegion";
    public static final String STOP_ESTIMOTE_BEACON_DISCOVERY_FOR_REGION = "stopEstimoteBeaconsDiscoveryForRegion";

    public static final String START_RANGING_BEACONS_IN_REGION = "startRangingBeaconsInRegion";
    public static final String STOP_RANGING_BEACON_IN_REGION = "stopRangingBeaconsInRegion";
    
    public static final String START_MONITORING_FOR_REGION = "startMonitoringForRegion";
    public static final String STOP_MONITORING_FOR_REGION = "stopMonitoringForRegion";

    public static final String GET_BEACONS = "getBeacons";

    private BeaconManager iBeaconManager;

    private Region currentRegion;
    private List<Beacon> beacons = new ArrayList<Beacon>();
    private NotificationManager mNotificationManager; 
	private String content ;
	//private int minor = 0;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        Log.i("debug0....", "inner");
        iBeaconManager = new BeaconManager(this.cordova.getActivity().getApplicationContext());

        currentRegion = new Region("rid", null, null, null);
        
        mNotificationManager = (NotificationManager) (this.cordova.getActivity()).getSystemService(Context.NOTIFICATION_SERVICE); 
        iBeaconManager.setRangingListener(new BeaconManager.RangingListener() {
            @Override
            public void onBeaconsDiscovered(Region region, List<Beacon> beacons) {
                if (beacons == null || beacons.size() < 1) {

                } else {
                    EstimoteBeacons.this.beacons = beacons;
                }

            }
        });
		
        // Default values are 5s of scanning and 25s of waiting time to save CPU cycles.
        // In order for this demo to be more responsive and immediate we lower down those values.
        iBeaconManager.setBackgroundScanPeriod(TimeUnit.SECONDS.toMillis(1), 0);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    	try {
            if (action.equalsIgnoreCase(START_ESTIMOTE_BEACONS_DISCOVERY_FOR_REGION)) {
                startEstimoteBeaconsDiscoveryForRegion();
                callbackContext.success(callbackContext.getCallbackId());
                return true;
            }

            if (action.equalsIgnoreCase(STOP_ESTIMOTE_BEACON_DISCOVERY_FOR_REGION)) {
                stopEstimoteBeaconsDiscoveryForRegion();
                callbackContext.success(callbackContext.getCallbackId());
                return true;
            }

            if (action.equalsIgnoreCase(START_RANGING_BEACONS_IN_REGION)) {
                startRangingBeaconsInRegion();
                callbackContext.success(callbackContext.getCallbackId());
                return true;
            }

            if (action.equalsIgnoreCase(STOP_RANGING_BEACON_IN_REGION)) {
                stopRangingBeaconsInRegion();
                callbackContext.success(callbackContext.getCallbackId());
                return true;
            }
            
            if (action.equalsIgnoreCase(START_MONITORING_FOR_REGION)) {
				int minor = args.getInt(2);
            	startMonitoringForRegion(minor);
                //callbackContext.success(callbackContext.getCallbackId());
                callbackContext.success(content);
                return true;
            }

            if (action.equalsIgnoreCase(STOP_MONITORING_FOR_REGION)) {
            	stopMonitoringForRegion();
                callbackContext.success(callbackContext.getCallbackId());
                //callbackContext.success(callbackContext.getCallbackId());
                return true;
            }

            if (action.equalsIgnoreCase(GET_BEACONS)) {
                Log.d(EstimoteBeacons.class.toString(), "beacons - >" + beacons);
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, listToJSONArray(beacons)));
                return true;
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
            callbackContext.error(e.getMessage());
            Log.d(EstimoteBeacons.class.toString(), e.getMessage());
            return false;
        }
        return false;
    }

    private void startEstimoteBeaconsDiscoveryForRegion() throws RemoteException {
        // TODO: stub
    }

    private void stopEstimoteBeaconsDiscoveryForRegion() throws RemoteException {
        // TODO: stub
    }
    
    private void startRangingBeaconsInRegion() throws RemoteException{
    	Log.i("debug1....", "inner");
        iBeaconManager.connect(new BeaconManager.ServiceReadyCallback(){
            @Override
            public void onServiceReady() {
                try {
                    iBeaconManager.startRanging(currentRegion);
                } catch (RemoteException re) {
                    Log.d(EstimoteBeacons.class.toString(), re.getMessage());
                }

            }
        });

    }
    

    private void stopRangingBeaconsInRegion() throws RemoteException{
        iBeaconManager.stopRanging(currentRegion);
    }
    
    private void startMonitoringForRegion(final int minor) throws RemoteException{
		iBeaconManager.setMonitoringListener(new MonitoringListener() {
			@Override
			public void onEnteredRegion(Region region, List<Beacon> beacons) {
				for (Beacon beacon : beacons) {
					Log.i("debug4....",Utils.computeAccuracy(beacon) + "\t" + beacon.getMinor());
					if(beacon.getMinor() == minor){
						if(Utils.computeAccuracy(beacon) < 5){
							content = "entry room " + minor;
						}else{
							content = "out room " + minor;
						}
					}
				}
			}
			@Override
			public void onExitedRegion(Region region) {
				Log.i("debug5....","Exited region");
				content = "Exited region";
			}
        });
    	Log.i("debug2....startMonitoring", "inner Monitoring");
		final Region myRegion = new Region("MyId", null, null, minor);
        iBeaconManager.connect(new BeaconManager.ServiceReadyCallback(){
            @Override
            public void onServiceReady() {
                try {
                    iBeaconManager.startMonitoring(myRegion);
                } catch (RemoteException re) {
                    Log.d(EstimoteBeacons.class.toString(), re.getMessage());
                }

            }
        });
    }

    private void stopMonitoringForRegion() throws RemoteException{
        iBeaconManager.stopMonitoring(currentRegion);
    }



    /**
     * Convert list of beacons(@com.estimote.sdk.Beacon) to @JSONArray
     * @param beacons - list of beacons (@com.estimote.sdk.Beacon)
     * @return JSONArray
     * @throws JSONException
     */
    private JSONArray listToJSONArray(List<Beacon> beacons) throws JSONException{
        JSONArray jArray = new JSONArray();
        for (Beacon beacon : beacons) {
            jArray.put(beaconToJSONObject(beacon));
        }
        return jArray;
    }

    /**
     * Convert beacon (@com.estimote.sdk.Beacon) to @JSONObject
     * @param beacon - beacon(@com.estimote.sdk.Beacon)
     * @return JSONObject
     * @throws JSONException
     */
    private JSONObject beaconToJSONObject(Beacon beacon) throws JSONException{
        JSONObject object = new JSONObject();
        object.put("proximityUUID", beacon.getProximityUUID());
        object.put("major", beacon.getMajor());
        object.put("minor", beacon.getMinor());
        object.put("rssi", beacon.getRssi());
        object.put("accuracy", Utils.computeAccuracy(beacon)); 
        object.put("macAddress", beacon.getMacAddress());
        object.put("measuredPower", beacon.getMeasuredPower());
        return object;
    }
}

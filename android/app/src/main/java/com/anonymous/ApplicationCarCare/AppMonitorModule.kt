package com.anonymous.ApplicationCarCare
import android.util.Log // ← ✅ ADD THIS IMPORT

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AppMonitorModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AppMonitor"
    }

    @ReactMethod
fun startService() {
    try {
        val intent = Intent(reactContext, AppMonitorService::class.java)
        Log.d("AppMonitor", "Starting foreground service")
        reactContext.startForegroundService(intent)
    } catch (e: Exception) {
        Log.e("AppMonitor", "Failed to start service: ${e.message}")
    }
}


    @ReactMethod
    fun stopService() {
        val intent = Intent(reactContext, AppMonitorService::class.java)
        reactContext.stopService(intent)
    }
}

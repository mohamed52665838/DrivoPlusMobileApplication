package com.backgroundservicetracking

import android.content.ComponentName
import android.content.Intent
import android.provider.Settings
import android.text.TextUtils
import android.util.Log
import com.backgroundservicetracking.background_traking_service.AccessibilityListenerService
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = BackgroundServiceTrackingModule.NAME)
class BackgroundServiceTrackingModule(reactContext: ReactApplicationContext) :
  NativeBackgroundServiceTrackingSpec(reactContext) {
  private val TAG = "BackgroundServiceTracki"
  override fun getName(): String {
    return NAME
  }

  override fun startTrackingService(promise: Promise?) {
    Log.d(TAG, "Service Started")
    AccessibilityListenerService.startService()
    emitIsServiceRunning(true)
    promise?.resolve(true)
  }

  override fun stopTrackingService(promise: Promise?) {
    Log.d(TAG, "Service Stopped")
    AccessibilityListenerService.stopService()
    emitIsServiceRunning(false)
    promise?.resolve(true)
  }

  override fun getPermissionToUseService(promise: Promise?) {
    val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
    reactApplicationContext.startActivity(intent)
    promise?.resolve(true)
  }

  override fun checkPermissionForService(promise: Promise?) {

    val expectedComponentName = ComponentName(
      reactApplicationContext.packageName,
      AccessibilityListenerService::class.java.name
    )

    val enabledServicesSetting = Settings.Secure.getString(
      reactApplicationContext.contentResolver,
      Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
    )

    if (enabledServicesSetting == null) {
      promise?.resolve(false)
      return
    }

    val colonSplitter = TextUtils.SimpleStringSplitter(':')
    colonSplitter.setString(enabledServicesSetting)

    for (componentName in colonSplitter) {
      val enabledComponent = ComponentName.unflattenFromString(componentName)
      if (enabledComponent == expectedComponentName) {
        promise?.resolve(true)
        return
      }
    }

    promise?.resolve(false)
  }

  companion object {
    const val NAME = "BackgroundServiceTracking"
  }
}

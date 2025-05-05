package com.backgroundservicetracking.background_traking_service

import android.accessibilityservice.AccessibilityService
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import androidx.core.app.NotificationCompat
import java.time.Clock
import java.time.LocalTime
import java.util.Date
import androidx.core.net.toUri
import com.backgroundservicetracking.R

class AccessibilityListenerService: AccessibilityService() {
  private val TAG = "AccessibilityListenerSe"
  private val NOTIFICATION_ID = "super_drive_safe_notification_channel"
  private val whiteListPackagePatterns = listOf("com.android", "home")
  private var lastTimeNotificationSent = 0L



  override fun onCreate() {
    super.onCreate()
    val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    val soundUri = "android.resource://${applicationContext.packageName}/raw/notification_sound".toUri()
    if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      notificationManager.createNotificationChannel(
        NotificationChannel(NOTIFICATION_ID, "Super Drive Safe", NotificationManager.IMPORTANCE_HIGH).apply {
          description = "Super Drive Safe Notification channel"
          setSound(soundUri, AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_ALARM)
            .build())
        }
      )
    }
  }

  companion object {
    private var areWeTrackingTheUserBehavior = false
    fun startService() {
      areWeTrackingTheUserBehavior = true
    }
    fun stopService() {
      areWeTrackingTheUserBehavior = false
    }
  }

  override fun onServiceConnected() {
    super.onServiceConnected()
    Log.d(TAG, "onServiceConnected: Service connected")
  }

  override fun onAccessibilityEvent(event: AccessibilityEvent?) {

    // FILTER WHITE LIST
    for(element in whiteListPackagePatterns) {
      if(event?.packageName?.contains(element) == true) {
        Log.d(TAG, "onAccessibilityEvent: There we go it is white list element")
        return
      }
    }
    // SKIP OUR APPLICATION
    if(event?.packageName == applicationContext.packageName) {
      return
    }

    if(areWeTrackingTheUserBehavior) {
      when(event?.eventType) {
        AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED -> {
          sendNotificationWithCurrentMillis("Drive Safely! Switch Application Detected!")
        }
        AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED -> {
          sendNotificationWithCurrentMillis("Drive Safely! Typing Detected")
        }
        AccessibilityEvent.TYPE_VIEW_SCROLLED -> {
          sendNotificationWithCurrentMillis("Drive Safely!  Scroll Detected")
        }
        else -> {
        }
      }
    }else {
      Log.d(TAG, "THERE IS SOME THING GOING ON BUT WE ARE NOT TRACKING THE USER")
    }
  }

  override fun onInterrupt() {
    Log.d(TAG, "onServiceConnected: Service interrupted")
  }

  fun sendNotificationWithCurrentMillis(message: String) {

    val currentTime = System.currentTimeMillis()
    // SEND NOTIFICATION IF LAST SENT ONE BEFORE 5 SECOND
    if (currentTime - lastTimeNotificationSent > 5000) {

      val notification: Notification = NotificationCompat.Builder(applicationContext, NOTIFICATION_ID)
        .setContentTitle("Danger Detected!")
        .setContentText(message)
        .setSmallIcon(android.R.drawable.stat_notify_error)
        .build()

        val notificationManager: NotificationManager =
          getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(1, notification)

        lastTimeNotificationSent = currentTime
      }

  }
}

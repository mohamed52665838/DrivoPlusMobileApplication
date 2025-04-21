package com.anonymous.ApplicationCarCare


import android.app.Service
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import androidx.core.app.NotificationCompat
import android.app.usage.UsageStatsManager
import android.app.usage.UsageStats
import android.os.Build
import android.util.Log
import android.os.IBinder



class AppMonitorService : Service() {
    private var handler: Handler? = null
    private val checkInterval: Long = 3000 // 3 seconds
    private var hasSentNotification = false
    private var notificationCount = 0
    private var lastMessengerState = false

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("AppMonitor", "i am here")

        val channelId = "messenger_alert"
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Messenger Alert", NotificationManager.IMPORTANCE_HIGH)
            notificationManager.createNotificationChannel(channel)
        }
        Log.d("AppMonitor", "i am here 33")

        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("DrivoPlus Monitor")
            .setContentText("Monitoring for Messenger app...")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .build()
    
        startForeground(1, notification)
    
        handler = Handler(Looper.getMainLooper())
        handler?.postDelayed(checkUsageStatsRunnable, checkInterval)
        return START_STICKY
    }
    

    private val checkUsageStatsRunnable = object : Runnable {
        override fun run() {
            val isRunning = isMessengerRunning()
            Log.d("AppMonitor", "Messenger running: $isRunning")
    
            if (isRunning) {
                sendNotification("Messenger is opened!")
                lastMessengerState = true
            } else {
                if (lastMessengerState) {
                    Log.d("AppMonitor", "Messenger closed.")
                }
                lastMessengerState = false
                notificationCount = 0 // reset count when Messenger closes
            }
    
            handler?.postDelayed(this, checkInterval)
        }
    }
    

    private fun isMessengerRunning(): Boolean {
        val usm = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val endTime = System.currentTimeMillis()
        val beginTime = endTime - 10000
        val usageStats = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, beginTime, endTime)

        if (usageStats != null) {
            for (stat in usageStats) {
                val isMessengerOrInsta = (stat.packageName == "com.facebook.orca" || stat.packageName == "com.instagram.android")

                if (isMessengerOrInsta && stat.lastTimeUsed >= beginTime) {
                    return true
                }
            }
        }
        return false
    }

   

    private fun sendNotification(message: String) {
        val channelId = "messenger_alert"
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Messenger Alert",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                enableVibration(true)
                description = "Repeated alerts when Messenger is open"
            }
            notificationManager.createNotificationChannel(channel)
        }
    
        notificationCount++
        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("DrivoPlus Alert")
            .setContentText("⚠️ Please drive safely! Messenger is open while driving.")
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()
    
        notificationManager.notify(100, notification)
    }
    
    

    override fun onBind(intent: Intent?): IBinder? = null

    fun createNotificationChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channelId = "app_monitor_channel"
            val channelName = "App Monitor Notifications"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(channelId, channelName, importance)
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }
    
}

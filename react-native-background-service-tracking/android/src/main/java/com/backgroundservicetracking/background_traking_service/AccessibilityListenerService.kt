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
import com.backgroundservicetracking.R

class AccessibilityListenerService : AccessibilityService() {

    private val TAG = "AccessibilityListenerSe"
    private val CHANNEL_ID = "super_drive_safe_notification_channel"
    private var lastTimeNotificationSent = 0L

    private val whiteListPackagePatterns = listOf("com.android", "home")

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    companion object {
        private var areWeTrackingTheUserBehavior = true

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
        // Filter white list
        for (pattern in whiteListPackagePatterns) {
            if (event?.packageName?.contains(pattern) == true) {
                Log.d(TAG, "onAccessibilityEvent: Whitelisted app")
                return
            }
        }

        // Skip our app
        if (event?.packageName == applicationContext.packageName) {
            return
        }

        if (areWeTrackingTheUserBehavior) {
            when (event?.eventType) {
                AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED -> {
                    sendNotificationWithSound(
                        "Drive Safely! Switch Application Detected!",
                        R.raw.apps
                    )
                }
                AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED -> {
                    sendNotificationWithSound(
                        "Drive Safely! Typing Detected",
                        R.raw.typing
                    )
                }
                AccessibilityEvent.TYPE_VIEW_SCROLLED -> {
                    sendNotificationWithSound(
                        "Drive Safely! Scroll Detected",
                        R.raw.scroll
                    )
                }
                else -> {
                    // Do nothing
                }
            }
        } else {
            Log.d(TAG, "We are not tracking the user.")
        }
    }

    override fun onInterrupt() {
        Log.d(TAG, "onInterrupt: Service interrupted")
    }

    private fun sendNotificationWithSound(message: String, soundResId: Int) {
        val currentTime = System.currentTimeMillis()
        if (currentTime - lastTimeNotificationSent > 5000) {

            val soundUri = Uri.parse("android.resource://${packageName}/$soundResId")

            Log.d(TAG, "Sending notification with sound URI: $soundUri")

            val notification: Notification = NotificationCompat.Builder(applicationContext, CHANNEL_ID)
                .setContentTitle("Danger Detected!")
                .setContentText(message)
                .setSmallIcon(android.R.drawable.stat_notify_error)
                .setSound(soundUri)
                .build()

            val notificationManager: NotificationManager =
                getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.notify(1, notification)

            lastTimeNotificationSent = currentTime
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val soundUri = Uri.parse("android.resource://${packageName}/${R.raw.apps}") // Default sound
            val audioAttributes = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build()

            Log.d(TAG, "Creating Notification Channel with sound: $soundUri")

            val channel = NotificationChannel(
                CHANNEL_ID,
                "Super Drive Safe",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                setSound(soundUri, audioAttributes)
                enableLights(true)
                enableVibration(true)
            }

            val notificationManager =
                getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }
}

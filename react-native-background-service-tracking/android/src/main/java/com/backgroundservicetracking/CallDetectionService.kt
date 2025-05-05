package com.backgroundservicetracking

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.telephony.PhoneStateListener
import android.telephony.TelephonyManager
import androidx.core.app.NotificationCompat

class CallDetectionService(private val context: Context) : PhoneStateListener() {

    fun start() {
        Handler(Looper.getMainLooper()).post {
            val telephony = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
            telephony.listen(this, PhoneStateListener.LISTEN_CALL_STATE)
        }
    }

    override fun onCallStateChanged(state: Int, incomingNumber: String?) {
        super.onCallStateChanged(state, incomingNumber)

        when (state) {
            TelephonyManager.CALL_STATE_RINGING -> {
                showNotification("Ne répondez pas au téléphone")
            }

            TelephonyManager.CALL_STATE_IDLE -> {
                // Optionnel : afficher un message quand l'appel se termine
                // showNotification("Appel terminé ou aucun appel.")
            }
        }
    }

    private fun showNotification(message: String) {
        val channelId = "call_detection_channel"
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Détection d'appel",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifications pour les appels entrants"
            }
            notificationManager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(context, channelId)
            .setContentTitle("Alerte d'appel")
            .setContentText(message)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()

        notificationManager.notify(1, notification)
    }
}

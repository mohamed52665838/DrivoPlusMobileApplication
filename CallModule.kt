package com.anonymous.ApplicationCarCare

import android.os.Handler
import android.os.Looper
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class CallModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var callDetectionService: CallDetectionService? = null

    override fun getName(): String = "CallDetection"

    @ReactMethod
    fun startListening() {
        Log.d("CallDetection", "Démarrage de l'écoute des appels")

        Handler(Looper.getMainLooper()).post {
            callDetectionService = CallDetectionService(reactContext)
            callDetectionService?.start()
        }
    }
}

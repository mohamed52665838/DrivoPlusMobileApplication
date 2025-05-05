package com.backgroundservicetracking



import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.uimanager.ViewManager

class CallDetectionPackage : ReactPackage {
    override fun createNativeModules(reactContext: com.facebook.react.bridge.ReactApplicationContext): List<NativeModule> {
       return listOf(CallModule(reactContext))

    }

    override fun createViewManagers(reactContext: com.facebook.react.bridge.ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}

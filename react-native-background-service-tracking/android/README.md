Needs accessibility service enabled from the settings

Permission Needed
POST_NOTIFICATION

- service registration
  <service
    android:exported="false"
    android:name="com.backgroundservicetracking.background_traking_service.AccessibilityListenerService"
    android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE">
    <intent-filter>
    <action android:name="android.accessibilityservice.AccessibilityService" />
    </intent-filter>
    <meta-data
    android:name="android.accessibilityservice"
    android:resource="@xml/accessibility_service_app_xml" />
  </service>

  - related @xml resource

    <?xml version="1.0" encoding="utf-8"?>

    <accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:accessibilityEventTypes="typeWindowStateChanged|typeViewScrolled|typeViewTextChanged"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:notificationTimeout="100"
    android:canRetrieveWindowContent="true"
    android:accessibilityFlags="flagDefault"
    />


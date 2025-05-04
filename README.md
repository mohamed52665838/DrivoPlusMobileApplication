# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).



## Get started

#### 1. Clone the Repository
```bash
git clone -b mohamed-branch https://github.com/mohamed52665838/DrivoPlusMobileApplication.git
```


#### 3. Clone local dependency [(Drivo Plus Accessibility Service)](https://github.com.mohamed52665838/react-native-accessibility-service)
```bash
git clone  https://github.com/mohamed52665838/react-native-accessibility-service.git
```
* Accessibility Service is a dependency which helps us keep track of user actions (e.g, switch app, typing, scrolling).

#### 2. Install dependencies
<b>Note:</b> at this point we have two projects in the same directory
* react-native-accessibility-service
* DrivoPlusMobileApplication

    ##### 2.1 Intall remote dependencies
   ```bash
   cd DrivoPlusMobileApplication
   npm install
   ```

    ##### 2.2 Install local dependency
   * Windows
   ```bash
    yarn remove react-native-background-service-tracking
    yarn add file:../react-native-accessibility-service
   ```
   * Linux / MacOS
   ```bash
    yarn remove react-native-background-service-tracking
    yarn add ../react-native-accessibility-service
    ```
#### 3. Start the Application (Android)
    npx expo run:android

#### 4. That's it & More expo actions
Everything is now up and running.


- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

<b>Note:</b> Don’t forget to configure the correct IP and port to ensure proper communication between the application and the system.


## 📦 Project Dependencies
##### 🔧 Core React & React Native
* react: 18.3.1
* react-dom: 18.3.1
* react-native: ^0.76.7
* expo: ^52.0.36
* expo-router: ~4.0.17
* react-native-reanimated: ~3.16.1
* react-native-gesture-handler: ~2.20.2
* react-native-screens: ~4.4.0
* react-native-safe-area-context: 4.12.0

#### 🧭 Navigation
* @react-navigation/native: ^7.0.14
* @react-navigation/bottom-tabs: ^7.2.0


#### 💾 Storage & Security
* @react-native-async-storage/async-storage: 1.23.1
* react-native-async-storage: ^0.0.1
* expo-secure-store: ~14.0.1
* react-native-encrypted-storage: ^4.0.3
* react-native-keychain: ^9.2.2

#### 🎨 UI & Design
* @eva-design/eva: ^2.2.0
* @ui-kitten/components: ^5.3.1
* react-native-paper: ^5.13.1
* react-native-paper-dropdown: ^2.3.1
* @expo/vector-icons: ^14.0.4
* react-native-vector-icons: ^10.2.0
* react-native-animatable: ^1.4.0
* react-native-circular-progress: ^1.4.1
* react-native-chart-kit: ^6.12.0
* react-native-svg: ^15.8.0

#### 🎥 Media & Device APIs
* expo-camera: ~16.0.17
* expo-av: ^15.0.2
* expo-image-picker: ^16.0.6
* expo-image-manipulator: ^13.0.6
* expo-blur: ~14.0.3
* expo-haptics: ~14.0.1
* expo-system-ui: ~4.0.8
* expo-status-bar: ~2.0.1
* expo-splash-screen: ~0.29.21
* expo-symbols: ~0.2.2
* expo-document-picker: ^13.0.3
* expo-font: ~13.0.3
* expo-constants: ~17.0.5
* expo-web-browser: ~14.0.2

#### 🌐 Networking & State
* axios: ^1.8.4
* @tanstack/react-query: ^5.66.0
* zustand: ^5.0.3

#### 🌍 Localization
* i18next: ^24.2.2
* react-i18next: ^15.4.1
* expo-localization: ~16.0.1

#### 📅 Date/Time
@react-native-community/datetimepicker: ^8.3.0

#### 💳 Payments
@stripe/stripe-react-native: 0.38.6

#### 🧪 Forms
react-hook-form: ^7.54.2

#### 🔐 Permissions & Logs
* react-native-permissions: ^5.2.5
* react-native-logs: ^5.3.0

#### 🧪 Custom/Local Modules
react-native-background-service-tracking: ../background-service-tracking (local module)






## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

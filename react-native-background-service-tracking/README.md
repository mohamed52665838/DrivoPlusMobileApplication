# react-native-background-service-tracking

allows apps to track all kind of actions app in the background and so on

## Installation

```sh
npm install react-native-background-service-tracking
```

## Api Exposed

* function to check accessbility permission
```js
function checkAccessibilityPermission(): Promise<boolean>
```
* function to request the accessbility permission
```js
function requestAccessibilityService(): Promise<boolean>
```
* function to start the accessbility permission
```js
function startSuperTracking(): Promise<boolean>
```
* function to stop the accessbility permission
```js
function stopSuperTracking(): Promise<boolean>
```
* Event emitter holds the status of the service (e.g, running, stopped)
```
const superTrackingServiceStatus 
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

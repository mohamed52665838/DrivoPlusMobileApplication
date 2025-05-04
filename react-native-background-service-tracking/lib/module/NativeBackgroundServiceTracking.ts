import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  startTrackingService(): Promise<boolean>
  stopTrackingService(): Promise<boolean>
  getPermissionToUseService(): Promise<boolean>
  checkPermissionForService(): Promise<boolean>
  readonly isServiceRunning: EventEmitter<boolean>
  readonly isGlobalSettingsEnabled: EventEmitter<boolean>
}

export default TurboModuleRegistry.getEnforcing<Spec>('BackgroundServiceTracking');

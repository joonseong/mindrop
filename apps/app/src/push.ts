import { PermissionsAndroid, Platform } from 'react-native';

import messaging from '@react-native-firebase/messaging';

/** OS 알림 권한을 요청하고, 허용되면 FCM 토큰을 돌려준다 */
export async function requestPush(): Promise<{ granted: boolean; token?: string }> {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      if (result !== PermissionsAndroid.RESULTS.GRANTED) return { granted: false };
    }
    const status = await messaging().requestPermission();
    const granted =
      status === messaging.AuthorizationStatus.AUTHORIZED || status === messaging.AuthorizationStatus.PROVISIONAL;
    if (!granted) return { granted: false };
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    return { granted: true, token };
  } catch {
    return { granted: false };
  }
}

/** 알림 데이터의 path (예: /drop/123) */
export function pathFromMessage(data?: Record<string, unknown>): string | null {
  const path = data?.path;
  return typeof path === 'string' && path.startsWith('/') ? path : null;
}

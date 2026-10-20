/**
 * 네이티브 껍데기(apps/app)와 주고받는 메시지.
 * 웹 → 앱: window.ReactNativeWebView.postMessage(JSON)
 * 앱 → 웹: window에 'minicovery-native' CustomEvent
 */
export type NativeRequest =
  | { type: 'requestPushPermission'; id: string }
  | { type: 'openSettings' }
  | { type: 'haptic' };

export type NativeResponse = { type: 'pushPermission'; id: string; granted: boolean; token?: string };

declare global {
  interface Window {
    ReactNativeWebView?: { postMessage: (message: string) => void };
  }
}

export const isNative = () => typeof window !== 'undefined' && Boolean(window.ReactNativeWebView);

export function postNative(message: NativeRequest) {
  window.ReactNativeWebView?.postMessage(JSON.stringify(message));
}

/** 알림 권한 요청. 앱에서는 OS 권한, 웹에서는 브라우저 권한(개발 확인용) */
export async function requestPushPermission(): Promise<{ granted: boolean; token?: string }> {
  if (isNative()) {
    const id = Math.random().toString(36).slice(2);
    return new Promise(resolve => {
      const handler = (e: Event) => {
        const detail = (e as CustomEvent<NativeResponse>).detail;
        if (detail?.type === 'pushPermission' && detail.id === id) {
          window.removeEventListener('minicovery-native', handler);
          resolve({ granted: detail.granted, token: detail.token });
        }
      };
      window.addEventListener('minicovery-native', handler);
      postNative({ type: 'requestPushPermission', id });
      setTimeout(() => {
        window.removeEventListener('minicovery-native', handler);
        resolve({ granted: false });
      }, 60_000);
    });
  }
  if (typeof Notification === 'undefined') return { granted: false };
  const result = await Notification.requestPermission();
  return { granted: result === 'granted' };
}

import { Platform } from 'react-native';

/**
 * 웹뷰가 여는 주소. 개발 중에는 로컬 Next 서버(apps/webview, 포트 3100).
 * 안드로이드 에뮬레이터에서 호스트 PC는 10.0.2.2.
 * 운영 주소는 배포 도메인이 정해지면 바꾼다.
 */
const DEV_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3100' : 'http://localhost:3100';
const PROD_URL = 'https://app.minicovery.com';

export const WEB_URL = __DEV__ ? DEV_URL : PROD_URL;

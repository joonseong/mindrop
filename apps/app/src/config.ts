import { Platform } from 'react-native';

/**
 * 웹뷰가 여는 주소. 개발 중에는 로컬 Next 서버(apps/webview, 포트 3100).
 * 안드로이드 에뮬레이터에서 호스트 PC는 10.0.2.2.
 * 운영은 Vercel 프로젝트 'minicovery'. 도메인을 사면 그 주소로 바꾼다.
 */
const DEV_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3100' : 'http://localhost:3100';
const PROD_URL = 'https://minicovery.vercel.app';

export const WEB_URL = __DEV__ ? DEV_URL : PROD_URL;

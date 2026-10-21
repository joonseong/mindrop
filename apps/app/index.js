import { AppRegistry } from 'react-native';

import messaging from '@react-native-firebase/messaging';

import App from './App';
import { name as appName } from './app.json';
import { pushAvailable } from './src/push';

// 알림 메시지는 OS가 표시한다. 백그라운드 핸들러는 등록만 해 둔다 (iOS 경고 방지)
// Firebase 설정 파일이 없으면 건너뛴다 (알림만 빠지고 앱은 동작)
if (pushAvailable()) messaging().setBackgroundMessageHandler(async () => {});

AppRegistry.registerComponent(appName, () => App);

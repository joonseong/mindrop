import { AppRegistry } from 'react-native';

import messaging from '@react-native-firebase/messaging';

import App from './App';
import { name as appName } from './app.json';

// 알림 메시지는 OS가 표시한다. 백그라운드 핸들러는 등록만 해 둔다 (iOS 경고 방지)
messaging().setBackgroundMessageHandler(async () => {});

AppRegistry.registerComponent(appName, () => App);

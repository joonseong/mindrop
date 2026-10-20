import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [],
  theme: {
    colors: {
      transparent: 'transparent',
      shape: {
        white: '#FFFFFF',
        depth1: '#F5F5FD',
        depth2: '#EEEEF9',
        div: '#DEDFEB',
        brand: '#20967A',
        black: '#151517',
        icon: '#3F4047',
        iconlight: '#9FA0AA',
        highlight: '#F53249',
      },
      border: {
        div: '#EEEEF9',
        button: '#DEDFEB',
        thumb: '#0000000A',
        brand: '#20967A',
        error: '#F53249',
      },
      txt: {
        black: {
          primary: '#151517',
          secondary: '#3F4047',
          tertiary: '#858691',
          placeholder: '#B4B5C1',
        },
        white: {
          primary: '#FFFFFF',
          secondary: '#EEEEF9',
          tertiary: '#DCDEEC',
        },
        point: '#18715B',
        error: '#B82637',
        link: '#2140AE',
        highlight: '#F53249',
      },
    },
    extend: {
      fontFamily: {
        // Pretendard 를 기본 sans 로. variable 빌드는 'Pretendard Variable',
        // 정적 빌드는 'Pretendard' 로 등록되므로 둘 다 스택에 유지한다.
        // 폰트 파일 자체는 각 앱의 전역 CSS 에서 import 해야 로드된다
        // (storybook: src/global.css — webview/admin 은 아직 미적용, 폴백 무해).
        sans: ['Pretendard Variable', 'Pretendard', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        slide: 'slide 0.5s ease-out',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      padding: {
        '100px': '100px',
      },
      letterSpacing: {
        '-0.5px': '-0.5px',
        '-1px': '-1px',
      },
      fontSize: {
        '10px': '10px',
        '13px': '13px',
        '14px': '14px',
        '16px': '16px',
        '22px': '22px',
        '28px': '28px',
      },
      lineHeight: {
        '14px': '14px',
        '20px': '20px',
        '28px': '28px',
        '32px': '32px',
        '44px': '44px',
        '52px': '52px',
      },
    },
  },
};

export default config;

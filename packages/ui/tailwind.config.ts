import tailwindCommonConfig from '@repo/tailwind/tailwind.common.config';
import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [tailwindCommonConfig],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      ...tailwindCommonConfig.theme?.extend,
    },
  },
};
export default config;

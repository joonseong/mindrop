import { IconAssetProps } from '../components/Icon';

export function BookcaseFilled({ width, height, color, strokeWidth }: IconAssetProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 32 32">
      <path
        fill={color}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M4 5.5A1.5 1.5 0 0 1 5.5 4h3A1.5 1.5 0 0 1 10 5.5v21A1.5 1.5 0 0 1 8.5 28h-3A1.5 1.5 0 0 1 4 26.5v-21ZM10 5.5A1.5 1.5 0 0 1 11.5 4h3A1.5 1.5 0 0 1 16 5.5v21a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-21Z"
      />
      <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 7v17.999" />
      <path
        fill={color}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M16.385 6.635a1.5 1.5 0 0 1 1.06-1.837l2.898-.777a1.5 1.5 0 0 1 1.837 1.061l5.435 20.283a1.5 1.5 0 0 1-1.06 1.837l-2.898.776a1.5 1.5 0 0 1-1.837-1.06L16.385 6.635Z"
      />
    </svg>
  );
}

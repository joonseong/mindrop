import { IconAssetProps } from '../components/Icon';

export function Cancel({ width, height, color, strokeWidth }: IconAssetProps) {
  return (
    <svg width={width} height={height} fill={color || 'none'}>
      <circle cx="10" cy="10" r="10" fill="#CACBDA" />
      <g clipPath="url(#clip0_1211_1720)">
        <path
          d="M7 7L13 13M13 7L7 13"
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1211_1720">
          <rect width="12" height="12" fill="white" transform="translate(4 4)" />
        </clipPath>
      </defs>
    </svg>
  );
}

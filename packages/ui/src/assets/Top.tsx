import { IconAssetProps } from '../components/Icon';

export function Top({ width, height, color, strokeWidth }: IconAssetProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 32 32" fill={color} xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_391_4078)">
        <path
          d="M15.9998 6.66669L15.9998 25.3334"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.9998 6.66669L23.9998 14.6667"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.9998 6.66669L7.99976 14.6667"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_391_4078">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

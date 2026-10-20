import { IconAssetProps } from '../components/Icon';

export function Arrow({ width, height, color, strokeWidth }: IconAssetProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_350_2822)">
        <path
          d="M12 26L22 16L12 6"
          stroke={color}
          strokeWidth={strokeWidth || '1.5'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_350_2822">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

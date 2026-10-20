import { IconAssetProps } from '../components/Icon';

export function IconRight({ width, height, color, strokeWidth }: IconAssetProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_3699_4959)">
        <path
          d="M6 13L11 8L6 3"
          stroke={color}
          strokeWidth={strokeWidth || '1.5'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3699_4959">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

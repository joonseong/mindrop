import { IconAssetProps } from '../components/Icon';

export function SaveOff({ width, height, color, strokeWidth }: IconAssetProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_328_714)">
        <path
          d="M24 27L16.0001 22.1111L8.00013 27C8.00013 22.3334 8.00025 17.6668 8.00023 13.0002C8.00021 8.58191 11.5819 5 16.0002 5V5C20.4184 5 24 8.58162 24 12.9998C24 17.6665 24 22.3333 24 27Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_328_714">
          <rect width="32" height="32" fill="transparent" />
        </clipPath>
      </defs>
    </svg>
  );
}

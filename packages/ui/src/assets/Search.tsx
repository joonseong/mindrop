import { IconAssetProps } from '../components/Icon';

export function Search({ width, height, color, strokeWidth }: IconAssetProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 32 32">
      <g clipPath="url(#a)">
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          d="m28 28-7-7M5 14.333a9.333 9.333 0 1 0 18.666 0 9.333 9.333 0 0 0-18.666 0Z"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h32v32H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

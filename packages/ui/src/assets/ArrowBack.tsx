import { IconAssetProps } from '../components/Icon';

export function ArrowBack({ width, height, color, strokeWidth }: IconAssetProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 32 32">
      <g stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} clipPath="url(#a)">
        <path d="M6.667 16h18.666M6.667 16l8 8M6.667 16l8-8" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h32v32H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

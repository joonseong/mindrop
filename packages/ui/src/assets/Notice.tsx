import { IconAssetProps } from '../components/Icon';

export function Notice({ width, height, color, strokeWidth }: IconAssetProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 32 32">
      <g stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} clipPath="url(#a)">
        <path d="M13.333 6.667a2.667 2.667 0 1 1 5.334 0 9.334 9.334 0 0 1 5.333 8v4a5.334 5.334 0 0 0 2.667 4H5.333a5.334 5.334 0 0 0 2.667-4v-4a9.334 9.334 0 0 1 5.333-8ZM12 22.667V24a4 4 0 1 0 8 0v-1.333" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h32v32H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

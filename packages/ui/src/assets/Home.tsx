import { IconAssetProps } from '../components/Icon';

export function Home({ width, height, color, strokeWidth }: IconAssetProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 32 32">
      <g clipPath="url(#a)">
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          d="M25.584 11.47 18.25 5.772a3.668 3.668 0 0 0-4.502 0L6.415 11.47A3.661 3.661 0 0 0 5 14.362v9.89A2.746 2.746 0 0 0 7.75 27h16.5A2.751 2.751 0 0 0 27 24.253v-9.891a3.66 3.66 0 0 0-1.416-2.892Z"
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

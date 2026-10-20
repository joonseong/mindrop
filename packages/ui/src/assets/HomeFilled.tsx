import { IconAssetProps } from '../components/Icon';

export function HomeFilled({ width, height, color, strokeWidth }: IconAssetProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 32 32">
      <g clipPath="url(#a)">
        <path
          fill={color}
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          d="M25.584 11.47 18.25 5.772a3.668 3.668 0 0 0-4.502 0L6.415 11.47A3.661 3.661 0 0 0 5 14.362v9.89A2.746 2.746 0 0 0 7.75 27h16.5A2.751 2.751 0 0 0 27 24.253v-9.891a3.66 3.66 0 0 0-1.416-2.892Z"
        />
        <path
          fill="#fff"
          d="M11.989 26H10v-7.05c.012-2.061 1.206-2.95 3.554-2.95 1.088 0 1.89.177 2.446.557.555-.38 1.358-.557 2.446-.557 2.348 0 3.542.889 3.554 2.95V26h-1.988v-7.37c0-.729-.46-1.186-1.566-1.186-.982 0-1.455.457-1.455 1.186l.006 1.861h-1.994l.005-1.861c0-.729-.472-1.186-1.454-1.186-1.106 0-1.566.457-1.566 1.186V26Z"
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

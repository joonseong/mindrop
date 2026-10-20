import { IconAssetProps } from '../components/Icon';

export function MyFilled({ width, height, color, strokeWidth }: IconAssetProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 32 32">
      <g strokeLinecap="round" strokeLinejoin="round" clipPath="url(#a)">
        <path fill={color} stroke={color} strokeWidth={strokeWidth} d="M4 16a12 12 0 1 0 24 0 12 12 0 0 0-24 0Z" />
        <path fill="#fff" stroke="#fff" strokeWidth={strokeWidth} d="M12 13.333a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />
        <path
          fill="#fff"
          stroke={color}
          d="M23.778 25.138a5.333 5.333 0 0 0-5.111-3.805h-5.334a5.333 5.333 0 0 0-5.109 3.799v.008a12 12 0 0 0 15.554-.002Z"
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

import { IconAssetProps } from '../components/Icon';

export function My({ width, height, color, strokeWidth }: IconAssetProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 32 32">
      <g stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} clipPath="url(#a)">
        <path d="M4 16a12 12 0 1 0 24 0 12 12 0 0 0-24 0Z" />
        <path d="M12 13.333a4 4 0 1 0 8 0 4 4 0 0 0-8 0ZM8.224 25.132a5.333 5.333 0 0 1 5.11-3.799h5.333a5.334 5.334 0 0 1 5.112 3.807" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h32v32H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

import { IconAssetProps } from '../components/Icon';

export function Bookcase({ width, height, color, strokeWidth }: IconAssetProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 32 32">
      <g stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} clipPath="url(#a)">
        <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h3A1.5 1.5 0 0 1 10 5.5v21A1.5 1.5 0 0 1 8.5 28h-3A1.5 1.5 0 0 1 4 26.5v-21ZM10 5.5A1.5 1.5 0 0 1 11.5 4h3A1.5 1.5 0 0 1 16 5.5v21a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-21ZM16.385 6.635a1.5 1.5 0 0 1 1.06-1.837l2.898-.777a1.5 1.5 0 0 1 1.837 1.061l5.435 20.283a1.5 1.5 0 0 1-1.06 1.837l-2.898.776a1.5 1.5 0 0 1-1.837-1.06L16.385 6.635Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h32v32H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

import { IconAssetProps } from '../components/Icon';

export function More({ width, height, color }: IconAssetProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_585_2885)">
        <path
          d="M11.5 16.5C11.5 17.3284 10.8284 18 10 18C9.17157 18 8.5 17.3284 8.5 16.5C8.5 15.6716 9.17157 15 10 15C10.8284 15 11.5 15.6716 11.5 16.5Z"
          fill={color}
        />
        <path
          d="M17.5 16.5C17.5 17.3284 16.8284 18 16 18C15.1716 18 14.5 17.3284 14.5 16.5C14.5 15.6716 15.1716 15 16 15C16.8284 15 17.5 15.6716 17.5 16.5Z"
          fill={color}
        />
        <path
          d="M23.5 16.5C23.5 17.3284 22.8284 18 22 18C21.1716 18 20.5 17.3284 20.5 16.5C20.5 15.6716 21.1716 15 22 15C22.8284 15 23.5 15.6716 23.5 16.5Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_585_2885">
          <rect width={width} height={height} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

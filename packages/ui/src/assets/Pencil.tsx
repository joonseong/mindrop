import { IconAssetProps } from '../components/Icon';

export function Pencil({ width, height, color }: IconAssetProps) {
  return (
    <svg width={width} height={height} fill={color || 'none'}>
      <circle cx="16" cy="16" r="16" fill="#3F4047" />
      <g clipPath="url(#clip0_378_3305)">
        <path
          d="M10.6665 21.3332H13.3332L20.3332 14.3332C20.5083 14.1581 20.6472 13.9502 20.7419 13.7215C20.8367 13.4927 20.8855 13.2475 20.8855 12.9999C20.8855 12.7523 20.8367 12.5071 20.7419 12.2783C20.6472 12.0495 20.5083 11.8416 20.3332 11.6665C20.1581 11.4914 19.9502 11.3526 19.7214 11.2578C19.4927 11.163 19.2475 11.1143 18.9998 11.1143C18.7522 11.1143 18.507 11.163 18.2782 11.2578C18.0495 11.3526 17.8416 11.4914 17.6665 11.6665L10.6665 18.6665V21.3332Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 12.3335L19.6667 15.0002"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_378_3305">
          <rect width="16" height="16" fill="white" transform="translate(8 8)" />
        </clipPath>
      </defs>
    </svg>
  );
}

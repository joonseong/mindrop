import { IconAssetProps } from '../components/Icon';

export function NoBook({ width, height, color, strokeWidth }: IconAssetProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 25.3333C5.82423 24.2801 7.89356 23.7256 10 23.7256C12.1064 23.7256 14.1758 24.2801 16 25.3333C18.3775 23.9609 21.1536 23.4451 23.8653 23.8719"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 8.00003C4.8855 7.48865 5.83273 7.09255 6.81867 6.82136M11.8853 6.54136C13.312 6.76803 14.7067 7.25336 16 8.00003C17.8242 6.94681 19.8936 6.39233 22 6.39233C24.1064 6.39233 26.1758 6.94681 28 8.00003"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 8V25.3333" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M16 8V10.6667M16 16V25.3333"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M28 8V22.6667" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 4L28 28" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

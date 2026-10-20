import { IconAssetProps } from '../components/Icon';

export function Money({ width, height, color }: IconAssetProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#FFD542" />
      <ellipse cx="12" cy="11.5" rx="12" ry="11.5" fill="#FFEAA0" />
      <ellipse cx="12" cy="11.5" rx="8" ry="7.5" fill="#FFD542" />
      <g clipPath="url(#clip0_560_2399)">
        <path
          d="M8.65705 15H7V9.36049C7.01036 7.71111 8.00459 7 9.96199 7C10.8683 7 11.5372 7.14176 12 7.44549C12.4628 7.14176 13.1317 7 14.038 7C15.9954 7 16.9896 7.71111 17 9.36049V15H15.3429V9.1037C15.3429 8.52099 14.9597 8.15556 14.038 8.15556C13.2198 8.15556 12.8263 8.52099 12.8263 9.1037L12.8308 10.5931H11.1692L11.1737 9.1037C11.1737 8.52099 10.7802 8.15556 9.96199 8.15556C9.04025 8.15556 8.65705 8.52099 8.65705 9.1037V15Z"
          fill="#FFEAA0"
        />
      </g>
      <defs>
        <clipPath id="clip0_560_2399">
          <rect width="12" height="12" fill="white" transform="translate(6 5)" />
        </clipPath>
      </defs>
    </svg>
  );
}

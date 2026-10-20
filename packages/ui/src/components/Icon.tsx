import { ICONS } from '../constants/icon';

export interface IconAssetProps {
  width: number;
  height: number;
  color?: string;
  strokeWidth?: number;
}

export interface IconProps {
  name: keyof typeof ICONS;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 32, color = '#3F4047' }: IconProps) {
  const Icon = ICONS[name];
  const strokeWidth = size < 32 ? 1.5 * (32 / size) : 1.5;

  return <Icon width={size} height={size} color={color} strokeWidth={strokeWidth} />;
}

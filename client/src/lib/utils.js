import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import animationData from '@/assets/lottie-json';
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  'bg-[#ff006e] text-black/50 border-[1px] border-[#ff006e]',
  'bg-[#ffd60a] text-black/50 border-[1px] border-[#ffd60a]',
  'bg-[#06d6a0] text-black/50 border-[1px] border-[#06d6a0]',
  'bg-[#5f27cd] text-black/50 border-[1px] border-[#5f27cd]',
];
export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0];
};

export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
};

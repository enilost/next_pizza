import clsx from 'clsx';
import React from 'react';

type TitleSize = 'h5' | 'h4' | 'h3' | 'h2' | 'h1' | 'h1+';

interface Props {
  size?: TitleSize;
  className?: string;
  children: string;
}

export const Title: React.FC<Props> = ({  size = 'h4', className,children }) => {
//   const mapTagBySize = {
//     xs: 'h5',
//     sm: 'h4',
//     md: 'h3',
//     lg: 'h2',
//     xl: 'h1',
//     '2xl': 'h1',
//   } as const;

  const mapClassNameBySize = {
    h5: 'text-[16px]',
    h4: 'text-[22px]',
    h3: 'text-[26px]',
    h2: 'text-[32px] ys-display',
    h1: 'text-[40px]',
    'h1+': 'text-[48px]',
  } as const;

  return React.createElement(
    size == 'h1+'? 'h1': size,
    { className: clsx(mapClassNameBySize[size], className) },
    children,
  );
};
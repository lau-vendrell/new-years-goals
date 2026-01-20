import type { ButtonHTMLAttributes } from 'react';

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
  activeClassName?: string;
};

export default function Chip({
  className = '',
  isActive = false,
  activeClassName = '',
  type = 'button',
  ...props
}: ChipProps) {
  const classes = [className, isActive ? activeClassName : ''].filter(Boolean).join(' ');
  return <button type={type} className={classes} {...props} />;
}

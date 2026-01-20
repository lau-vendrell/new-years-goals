import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ type = 'button', ...props }: ButtonProps) {
  return <button type={type} {...props} />;
}

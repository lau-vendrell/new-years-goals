import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  'aria-label': string;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ type = 'button', ...props }, ref) => {
    return <button ref={ref} type={type} {...props} />;
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;

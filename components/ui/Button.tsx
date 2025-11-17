import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles - erişilebilirlik
          'inline-flex items-center justify-center rounded-lg font-medium transition-all',
          'focus:outline-none focus:ring-4 focus:ring-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'min-h-[44px] min-w-[44px]',
          
          // Variants
          {
            'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800':
              variant === 'primary',
            'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400':
              variant === 'secondary',
            'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400':
              variant === 'outline',
            'text-gray-700 hover:bg-gray-100 active:bg-gray-200':
              variant === 'ghost',
          },
          
          // Sizes
          {
            'px-3 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

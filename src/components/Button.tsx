'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    children,
    className = '',
    disabled,
    ...props
  }, ref) => {
    
    const baseClasses = `
      inline-flex items-center justify-center font-semibold
      transition-all duration-200 ease-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
      touch-target-min
    `;

    const variantClasses = {
      primary: `
        bg-primary-600 text-white
        hover:bg-primary-700 hover:-translate-y-0.5 hover:shadow-primary
        active:bg-primary-800 active:translate-y-0
      `,
      secondary: `
        bg-transparent text-primary-600 border-2 border-primary-600
        hover:bg-primary-50 hover:-translate-y-0.5
        active:bg-primary-100 active:translate-y-0
      `,
      ghost: `
        bg-transparent text-primary-600 border-none
        hover:bg-primary-50
        active:bg-primary-100
      `,
      danger: `
        bg-error-500 text-white
        hover:bg-error-600 hover:-translate-y-0.5 hover:shadow-md
        active:bg-error-700 active:translate-y-0
      `,
      warning: `
        bg-warning-500 text-primary-900
        hover:bg-warning-400 hover:-translate-y-0.5 hover:shadow-md
        active:bg-warning-600 active:translate-y-0
      `,
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm rounded-lg min-h-[36px]',
      md: 'px-6 py-3 text-base rounded-button min-h-[48px]',
      lg: 'px-8 py-4 text-lg rounded-button min-h-[56px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${loading ? 'relative text-transparent pointer-events-none' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
        
        {/* Loading spinner */}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

// Link-styled button component
interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonLinkProps) {
  
  const baseClasses = `
    inline-flex items-center justify-center font-semibold no-underline
    transition-all duration-200 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    rounded-button
  `;

  const variantClasses = {
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-700 hover:-translate-y-0.5 hover:shadow-primary
      active:bg-primary-800 active:translate-y-0
      focus-visible:ring-primary-600
    `,
    secondary: `
      bg-transparent text-primary-600 border-2 border-primary-600
      hover:bg-primary-50 hover:-translate-y-0.5
      active:bg-primary-100 active:translate-y-0
      focus-visible:ring-primary-600
    `,
    ghost: `
      bg-transparent text-primary-600 border-none
      hover:bg-primary-50
      active:bg-primary-100
      focus-visible:ring-primary-600
    `,
    warning: `
      bg-warning-500 text-primary-900
      hover:bg-warning-400 hover:-translate-y-0.5 hover:shadow-md
      active:bg-warning-600 active:translate-y-0
      focus-visible:ring-warning-500
    `,
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]',
  };

  return (
    <a
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </a>
  );
}

// Icon Button component
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  'aria-label': string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}: IconButtonProps) {
  
  const baseClasses = `
    inline-flex items-center justify-center
    transition-all duration-200 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2
    rounded-full
  `;

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-transparent text-primary-600 border-2 border-primary-600 hover:bg-primary-50',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
}

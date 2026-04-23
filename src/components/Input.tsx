'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, fullWidth = true, className = '', ...props }, ref) => {
    
    const inputClasses = `
      w-full px-4 py-3 rounded-lg
      text-gray-900 placeholder-gray-400
      bg-white border transition-all duration-200
      min-h-[48px]
      focus:outline-none focus:ring-0
      ${error
        ? 'border-error-500 focus:border-error-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)] bg-error-50'
        : 'border-gray-200 focus:border-primary-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'
      }
      disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
      read-only:bg-gray-50
    `;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          className={`${inputClasses} ${className}`}
          {...props}
        />
        
        {error && (
          <p className="mt-2 text-sm text-error-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
        
        {helper && !error && (
          <p className="mt-2 text-sm text-gray-500">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helper, fullWidth = true, className = '', ...props }, ref) => {
    
    const textareaClasses = `
      w-full px-4 py-3 rounded-lg
      text-gray-900 placeholder-gray-400
      bg-white border transition-all duration-200
      min-h-[120px] resize-y
      focus:outline-none focus:ring-0
      ${error
        ? 'border-error-500 focus:border-error-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)] bg-error-50'
        : 'border-gray-200 focus:border-primary-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'
      }
      disabled:bg-gray-100 disabled:cursor-not-allowed
    `;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={`${textareaClasses} ${className}`}
          {...props}
        />
        
        {error && (
          <p className="mt-2 text-sm text-error-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
        
        {helper && !error && (
          <p className="mt-2 text-sm text-gray-500">{helper}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select component
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helper?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helper, options, placeholder, fullWidth = true, className = '', ...props }, ref) => {
    
    const selectClasses = `
      w-full px-4 py-3 rounded-lg
      text-gray-900 bg-white
      border transition-all duration-200
      min-h-[48px]
      focus:outline-none focus:ring-0
      appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]
      bg-[length:20px] bg-[right_12px_center] bg-no-repeat
      pr-10
      ${error
        ? 'border-error-500 focus:border-error-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]'
        : 'border-gray-200 focus:border-primary-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'
      }
      disabled:bg-gray-100 disabled:cursor-not-allowed
    `;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        
        <select
          ref={ref}
          className={`${selectClasses} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <p className="mt-2 text-sm text-error-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
        
        {helper && !error && (
          <p className="mt-2 text-sm text-gray-500">{helper}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Checkbox component
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    
    return (
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          type="checkbox"
          className={`
            w-5 h-5 mt-0.5 rounded border-gray-300
            text-primary-600
            focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
            cursor-pointer
            ${error ? 'border-error-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        <div>
          <label className="text-sm text-gray-700 cursor-pointer">{label}</label>
          {error && (
            <p className="mt-1 text-sm text-error-600">{error}</p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Radio component
interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className = '', ...props }, ref) => {
    
    return (
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          type="radio"
          className={`
            w-5 h-5 mt-0.5
            text-primary-600
            border-gray-300
            focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
            cursor-pointer
            ${className}
          `}
          {...props}
        />
        <label className="text-sm text-gray-700 cursor-pointer">{label}</label>
      </div>
    );
  }
);

Radio.displayName = 'Radio';

// Form Field wrapper for consistent spacing
interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

export function FormField({ children, className = '' }: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  );
}

export default Input;

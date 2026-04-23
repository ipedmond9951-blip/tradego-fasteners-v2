'use client';

import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'premium';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  outline?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  outline = false,
  className = ''
}: BadgeProps) {
  
  const baseClasses = `
    inline-flex items-center font-medium
    transition-all duration-150
  `;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const variantClasses = {
    success: outline
      ? 'border border-success-500 text-success-500 bg-transparent'
      : 'bg-success-100 text-success-600',
    warning: outline
      ? 'border border-warning-500 text-warning-500 bg-transparent'
      : 'bg-warning-100 text-warning-600',
    error: outline
      ? 'border border-error-500 text-error-500 bg-transparent'
      : 'bg-error-100 text-error-600',
    info: outline
      ? 'border border-primary-600 text-primary-600 bg-transparent'
      : 'bg-info-100 text-primary-600',
    neutral: outline
      ? 'border border-gray-300 text-gray-600 bg-transparent'
      : 'bg-gray-100 text-gray-600',
    premium: outline
      ? 'border border-accent text-accent bg-transparent'
      : 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700',
  };

  return (
    <span
      className={`
        ${baseClasses}
        rounded-full
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Status Badge with dot indicator
interface StatusBadgeProps {
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
  showLabel?: boolean;
}

export function StatusBadge({ status, showLabel = true }: StatusBadgeProps) {
  const statusConfig = {
    'in-stock': { color: 'bg-success-500', label: 'In Stock' },
    'low-stock': { color: 'bg-warning-500', label: 'Low Stock' },
    'out-of-stock': { color: 'bg-error-500', label: 'Out of Stock' },
    'discontinued': { color: 'bg-gray-400', label: 'Discontinued' },
  };

  const config = statusConfig[status];

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${config.color}`} />
      {showLabel && (
        <span className="text-xs font-medium text-gray-600">{config.label}</span>
      )}
    </span>
  );
}

// Certification Badge
interface CertBadgeProps {
  name: string;
  className?: string;
}

export function CertBadge({ name, className = '' }: CertBadgeProps) {
  return (
    <Badge variant="success" size="sm" className={className}>
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      {name}
    </Badge>
  );
}

// Premium Badge with gold accent
export function PremiumBadge({ className = '' }: { className?: string }) {
  return (
    <span className={`
      inline-flex items-center gap-1 px-2 py-0.5
      bg-gradient-to-r from-amber-200 to-yellow-100
      text-amber-800 text-xs font-semibold rounded-full
      border border-amber-300
      ${className}
    `}>
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      Premium
    </span>
  );
}

// ISO Badge
export function ISOBadge({ standard = 'ISO 9001', className = '' }: { standard?: string; className?: string }) {
  return (
    <Badge variant="info" size="sm" className={className}>
      {standard}
    </Badge>
  );
}

// Country Badge for localization
interface CountryBadgeProps {
  country: string;
  code?: string;
  className?: string;
}

export function CountryBadge({ country, code, className = '' }: CountryBadgeProps) {
  return (
    <span className={`
      inline-flex items-center gap-1 px-2 py-1
      bg-gray-100 text-gray-700 text-xs font-medium rounded-lg
      border border-gray-200
      ${className}
    `}>
      <span className="font-semibold">{code || country.slice(0, 2).toUpperCase()}</span>
      {country}
    </span>
  );
}

export default Badge;

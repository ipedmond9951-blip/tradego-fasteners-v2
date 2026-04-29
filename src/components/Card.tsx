'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = true, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-card border border-gray-200
        transition-all duration-200 ease-out
        ${hover ? 'hover:border-primary-600 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Product Card component
interface ProductCardProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function ProductCard({ 
  children, 
  className = '', 
  selected = false, 
  disabled = false,
  onClick 
}: ProductCardProps) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        bg-white rounded-card border p-5
        transition-all duration-200 ease-out
        ${disabled 
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:border-primary-600 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer'
        }
        ${selected 
          ? 'border-primary-600 border-2 bg-primary-50' 
          : 'border-gray-200'
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Feature Card component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className = '' }: FeatureCardProps) {
  return (
    <div className={`
      bg-white rounded-card border border-gray-200 p-6
      hover:border-primary-600 hover:shadow-card-hover hover:-translate-y-0.5
      transition-all duration-200 ease-out
      ${className}
    `}>
      <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// Stats Card component
interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export function StatCard({ value, label, icon, trend, className = '' }: StatCardProps) {
  return (
    <div className={`
      bg-white rounded-card border border-gray-200 p-6
      transition-all duration-200 ease-out
      hover:border-primary-600 hover:shadow-md hover:-translate-y-0.5
      ${className}
    `}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.positive ? 'text-success-600' : 'text-error-600'}`}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// Certification Badge Card
interface CertBadgeProps {
  name: string;
  issuer: string;
  validUntil?: string;
  className?: string;
}

export function CertBadge({ name, issuer, validUntil, className = '' }: CertBadgeProps) {
  return (
    <div className={`
      bg-white rounded-card border border-gray-200 p-4
      hover:border-success-500 hover:shadow-md
      transition-all duration-200 ease-out
      ${className}
    `}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-success-100 text-success-600 flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{issuer}</p>
          {validUntil && (
            <p className="text-xs text-gray-400">Valid until: {validUntil}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Testimonial Card
interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating?: number;
  className?: string;
}

export function TestimonialCard({ quote, author, role, company, rating = 5, className = '' }: TestimonialCardProps) {
  return (
    <div className={`
      bg-white rounded-card border border-gray-200 p-6
      hover:border-primary-600 hover:shadow-card-hover hover:-translate-y-0.5
      transition-all duration-200 ease-out
      ${className}
    `}>
      {/* Star Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      
      <blockquote className="text-gray-700 mb-4">
        <p className="text-sm leading-relaxed">"{quote}"</p>
      </blockquote>
      
      <div className="border-t pt-4">
        <p className="font-semibold text-gray-900">{author}</p>
        <p className="text-sm text-gray-500">{role}, {company}</p>
      </div>
    </div>
  );
}

export default Card;

'use client'

import { Skeleton } from './Skeleton'

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
      {/* Image skeleton */}
      <div className="relative h-44 md:h-52 bg-gray-100">
        <Skeleton className="absolute inset-0" />
        <div className="absolute top-3 right-3">
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 mb-2 rounded" />
        
        {/* Specs */}
        <div className="space-y-1.5 text-sm mb-4 mt-auto">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
        </div>
        
        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-5 w-20 rounded" />
          <Skeleton className="h-5 w-14 rounded" />
        </div>
        
        {/* Applications */}
        <div className="mb-4">
          <Skeleton className="h-4 w-20 mb-1.5 rounded" />
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-5 w-20 rounded" />
          </div>
        </div>

        {/* Button */}
        <Skeleton className="h-10 w-full rounded-lg mt-auto" />
      </div>
    </div>
  )
}

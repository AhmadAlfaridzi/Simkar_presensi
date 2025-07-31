'use client'

import { usePageMetadata } from '@/context/pageMetadataContext'
import { ChevronRight } from 'lucide-react'
import { useMobile } from '@/hooks/use-mobile'
export function PageHeader() {
  const { metadata } = usePageMetadata()
  const isMobile = useMobile()

  if (!metadata) return null

  const { title, breadcrumbs = [] } = metadata

  return (
    <div className="mb-6">
      {/* Title */}
      {title && <h1 className="text-2xl font-bold mb-1">{title}</h1>}

      {/* Breadcrumbs */}
      {!isMobile && metadata.breadcrumbs && breadcrumbs.length > 0 && (
        <div className="text-sm text-gray-400 flex items-center gap-1 flex-wrap">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1">
              {idx > 0 && <ChevronRight className="w-4 h-4" />}
              {crumb.href ? (
                <a href={crumb.href} className="hover:underline text-gray-300">
                  {crumb.label}
                </a>
              ) : (
                <span>{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

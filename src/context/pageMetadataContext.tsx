'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type Breadcrumb = {
  label: string
  href?: string
}

type PageMetadata = {
  title: string
  breadcrumbs: Breadcrumb[] 
}

type PageMetadataContextType = {
  metadata: PageMetadata
  setMetadata: (meta: PageMetadata) => void
}

const PageMetadataContext = createContext<PageMetadataContextType | undefined>(undefined)

export function PageMetadataProvider({ children }: { children: ReactNode }) {
  const [metadata, setMetadata] = useState<PageMetadata>({
    title: '',
    breadcrumbs: [],
  })

  return (
    <PageMetadataContext.Provider value={{ metadata, setMetadata }}>
      {children}
    </PageMetadataContext.Provider>
  )
}

export function usePageMetadata() {
  const context = useContext(PageMetadataContext)
  if (!context) throw new Error('usePageMetadata must be used within PageMetadataProvider')
  return context
}

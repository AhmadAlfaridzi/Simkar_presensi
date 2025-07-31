import { menuItems } from '@/data/menu-items'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []
  let currentPath = ''

  for (let i = 0; i < segments.length; i++) {
    currentPath += '/' + segments[i]

    const match = findMenuItem(currentPath)
    if (match) {
      breadcrumbs.push({ label: match.name, href: match.href })
    }
  }

  return breadcrumbs
}

function findMenuItem(path: string): { name: string; href: string } | undefined {
  for (const item of menuItems) {
    if (item.href === path) return { name: item.name, href: item.href }
    for (const sub of item.items) {
      if (sub.href === path) return { name: sub.name, href: sub.href }
    }
  }
  return undefined
}
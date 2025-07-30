import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia(query)

    const updateMatch = () => setMatches(media.matches)
    updateMatch() 

    media.addEventListener('change', updateMatch)

    return () => media.removeEventListener('change', updateMatch)
  }, [query]) 

  return matches
}

export function useMobile(): boolean {
  return useMediaQuery('(max-width: 768px)')
}

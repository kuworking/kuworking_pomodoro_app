// v2020.05.02

import { useWindowResize } from './usewindowresize'
import { useEffect } from 'react'

export const useInnerWidth = () => {
  const setCssVar = () => document.documentElement.style.setProperty('--innerWidth', `${window.innerWidth}px`)

  useEffect(() => setCssVar(), [])
  useWindowResize(setCssVar, 500)
  return ''
}

// v2020.04.08

import { useState, useEffect } from 'react'

export const useWindowResize = (method, debounce = 2000) => {
  let stillMounted = { value: false } // in order to prevent the memory leak
  useEffect(() => {
    stillMounted.value = true
    return () => (stillMounted.value = false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [resized, rerender] = useState()
  const repaint = () => {
    if (!stillMounted.value) return
    if (method) method()
    else rerender({})
  }

  let doit
  const resize = () => {
    clearTimeout(doit) // eliminate previous timeouts, as a debounce
    doit = setTimeout(repaint, debounce) // if it is not resizing for 2s, timeout won't be cleared
  }

  typeof window !== 'undefined' && window.addEventListener('resize', resize)

  return resized
}

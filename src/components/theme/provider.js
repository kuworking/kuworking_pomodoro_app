import React, { useContext, createContext } from 'react'
import { ThemeProvider } from 'emotion-theming'

import { useLocalStorage } from '../hooks/uselocalstorage'
import { modes } from './colors'

const ThemeContext = createContext({ mode: '', toogle: () => {} })

/* To use the theme as a constant and not as a received props */
export const useTheme = () => useContext(ThemeContext)

/* To change the theme */
export const useThemeSwitch = () => {
  const [theme, setTheme] = useLocalStorage('kuworkingtheme', 'light')
  return [theme, setTheme]
}

export const ProvideTheme = ({ children }) => {
  const [theme, setTheme] = useThemeSwitch()
  const toogle = () => {
    /*
    const mods = Object.keys(modes)
    const index = mods.indexOf(theme)
    const next = mods[(index + 1) % mods.length]
    setColorMode(modes[next])
    */
    setTheme(t => (t === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeProvider theme={modes[theme]}>
      <ThemeContext.Provider value={{ mode: theme, toogle }}>{children}</ThemeContext.Provider>
    </ThemeProvider>
  )
}

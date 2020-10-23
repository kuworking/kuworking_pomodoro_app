import React from 'react'
import { ProvideTheme } from './src/components/theme/provider'
import '@openfonts/kulim-park_latin'

/*
 Because wrapRootElement doesn’t render when the page changes it’s a good fit for context providers...
 ... that don’t need the page like theme or global application state providers
 */
// Provide context with the layout-component <ProvideAuth>

export const wrapRootElement = ({ element }) => {
  return <ProvideTheme>{element}</ProvideTheme>
}

/*
 wrapPageElement renders every time the page changes making it ideal for complex page transitions...
 ... or for stuff that need the page path, like an internationalization context provider for example
*/
// Provide styled outside mdx files frmo theme-ui
export const wrapPageElement = ({ element }) => <>{element}</>

export const onRouteUpdateDelayed = () => {}
export const onRouteUpdate = () => {}

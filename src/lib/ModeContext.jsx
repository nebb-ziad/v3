import { createContext, useContext } from 'react'

export const MODES = {
  signature: { key: 'signature', label: 'Signature', desc: 'The animated experience' },
  minimalist: { key: 'minimalist', label: 'Minimalist', desc: 'Clean & to the point' },
  legacy: { key: 'legacy', label: 'Legacy', desc: 'The first portfolio' },
}

export const ModeContext = createContext({
  mode: 'signature',
  setMode: () => {},
  dark: true,
  setDark: () => {},
})

export function useMode() {
  return useContext(ModeContext)
}
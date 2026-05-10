import { createContext, useContext } from 'react'

export const CanvasContext = createContext<any>(null)

export const useCanvas = () => {
  const context = useContext(CanvasContext)

  if (!context) {
    throw new Error('error')
  }

  return context
}

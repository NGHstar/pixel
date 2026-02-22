import { ReactNode } from 'react'

function layout({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex container mx-auto items-center
    justify-start max-w-5xl w-full flex-col py-32"
    >
      {children}
    </div>
  )
}

export default layout

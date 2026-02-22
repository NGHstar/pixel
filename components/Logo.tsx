import { Jersey_10 } from 'next/font/google'
import Image from 'next/image'

const pixelFont = Jersey_10({
  variable: '--font-pixel-font',
  subsets: ['latin'],
  weight: '400',
})
function Logo() {
  return (
    <div dir="ltr" className={`${pixelFont.className} flex items-center gap-1.5`}>
      <Image src="/pixellogo.svg" alt="pixel logo" width={32} height={24} />
      <p className="text-3xl translate-y-[1px] tracking-wider">Pixel</p>
    </div>
  )
}

export default Logo

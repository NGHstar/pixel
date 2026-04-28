import { useTranslations } from 'next-intl'
import Image from 'next/image'

function Logo() {
  const t = useTranslations()
  return (
    <div className={`font-[vazirmatn] flex items-center gap-1.5`}>
      <Image src="/pixellogo.svg" alt="pixel logo" className="rtl:rotate-180" width={32} height={24} />
      <p className="text-2xl font-extrabold rtl:text-xl translate-y-[4px] rtl:translate-y-[0px]">
        {t('logo')}
      </p>
    </div>
  )
}

export default Logo

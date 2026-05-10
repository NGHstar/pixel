import { Crown, X, Zap } from 'lucide-react'
import { Button } from './ui/button'
import { PricingTable } from '@clerk/nextjs'

type Tools = {
  background: string
  ai_extender: string
  ai_edit: string
  projects: string
}

type props = {
  isOpen: boolean
  onClose: () => void
  restrictedTool: keyof Tools
  reason: string
}

function UpgradeModal({ isOpen, onClose, restrictedTool, reason }: props) {
  // ---
  const toolNames = {
    background: 'AI Background Tools',
    ai_extender: 'AI Image Extender',
    ai_edit: 'AI Editor',
    projects: 'More Than 3 Projects',
  }

  return (
    <>
      {
        // todo use Dialog comp from shadcn
      }
      {/* بک‌دراپ ( backdrop ) */}
      <div
        className={`fixed inset-0 z-60 bg-white/5 backdrop-blur-xl transition-all duration-300 ${isOpen ? '' : 'hidden'}`}
        onClick={onClose}
      />

      {/* دیالوگ اصلی */}
      <div className={`fixed inset-0 z-60 flex items-center justify-center p-4 ${isOpen ? '' : 'hidden'}`}>
        <div
          className={`
            relative bg-white dark:bg-gray-900 rounded-lg shadow-xl 
            max-w-2xl w-full max-h-[90vh] overflow-hidden
            animate-in fade-in zoom-in duration-300
          `}
        >
          {/* هدر دیالوگ */}
          <div className="relative flex flex-col sm:flex-row items-bottom gap-2 sm:gap-4 justify-start p-5 border-b border-gray-300 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold translate-y-1">Upgrade to &quot;Pro&quot;</h2>
            </div>

            <button
              onClick={onClose}
              className="absolute inset-e-2 top-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* محتوای دیالوگ */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {restrictedTool && (
              <div className="bg-amber-500/10 border-amber-500/20 flex p-3 rounded-md gap-3">
                <Zap className="text-amber-100 w-6 h-6" />
                <div className="text-amber-200/70">
                  <div className="font-semibold text-amber-400 mb-1">
                    {toolNames[restrictedTool]} - Pro Feature
                  </div>
                  {reason ||
                    `${toolNames[restrictedTool]} is only available on Pro plan. Upgrade now to unlock this powerful feature and more.`}
                </div>
              </div>
            )}
            <PricingTable
              checkoutProps={{
                appearance: {
                  elements: {
                    drawerRoot: {
                      zIndex: 1000,
                    },
                  },
                },
              }}
            />
          </div>
          {/* dialog footer */}
          <footer className="p-5 flex justify-end">
            <Button
              variant="ghost"
              onClick={onClose}
              className=" text-foreground/70 hover:text-foreground bg-foreground/5 pb-1.5"
            >
              Maybe later
            </Button>
          </footer>
        </div>
      </div>
    </>
  )
}

export default UpgradeModal

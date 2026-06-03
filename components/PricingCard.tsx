import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import { Button } from './ui/button'

interface PricingCardProps {
  planName: string
  planId: string
  plan: string
  price: string
  features: string[]
  featured?: string
  buttonText: string
  currentPlanText: string
}

function PricingCard({
  planId,
  planName,
  plan,
  price,
  features,
  featured = '',
  buttonText,
  currentPlanText,
}: PricingCardProps) {
  // ---
  const { has } = useAuth()

  const isCurrentPlan = planName ? has?.({ plan: planName }) : false
  console.log('has ', isCurrentPlan)

  const handlePopup = async () => {
    if (isCurrentPlan) return

    try {
      if (window.Clerk && window.Clerk.__internal_openCheckout) {
        await window.Clerk.__internal_openCheckout({
          planId: planId,
          planPeriod: 'month',
          subscriberType: 'user',
        })
      }
    } catch (error) {
      console.error('checkout error: ', error)
      toast.error('something went wrong: ' + error.message)
    }
  }

  return (
    <div
      className={`relative flex flex-col flex-1 justify-center backdrop-blur-lg 
        bg-foreground/5 border rounded-2xl pt-8 pb-6 px-7 max-w-96 min-w-72 transition-transform 
         ${featured !== '' ? 'bg-linear-210 from-blue-500/20 to-purple-600/20' : ''}`}
    >
      {featured !== '' && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r
         from-blue-500 to-purple-600 text-white px-5 ltr:pt-1.5 py-1 
         rounded-full text-sm font-bold"
        >
          {featured}
        </span>
      )}
      <h3 className="text-2xl font-bold mb-4">{plan}</h3>
      <p className="text-4xl font-extrabold dark:text-cyan-400 text-blue-600 mb-6">{price}</p>
      <ul className="space-y-2 mb-6 text-slate-600 dark:text-slate-400">
        {features.map((f, i) => (
          <li key={i}>• {f}</li>
        ))}
      </ul>
      <Button
        variant={`${featured !== '' ? 'primary' : 'outline'}`}
        disabled={isCurrentPlan || !featured}
        onClick={handlePopup}
        className="w-full h-11 ltr:pt-1 text-md"
        size="lg"
      >
        {isCurrentPlan ? currentPlanText : buttonText}
      </Button>
    </div>
  )
}

export default PricingCard

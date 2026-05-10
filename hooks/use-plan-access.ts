import { useAuth } from '@clerk/nextjs'

export function usePlanAccess() {
  const { has } = useAuth()
  const isPro = has?.({ plan: 'pro' }) || false

  const isFree = !isPro

  const planAccess = {
    // free
    resize: true,
    crop: true,
    adjust: true,
    text: true,
    //pro
    background: isPro,
    ai_extender: isPro,
    ai_edit: isPro,
  }
  //todo toolId: keyof typeof planAccess
  const hasAccess = (toolId: any) => {
    return planAccess[toolId] === true
  }

  const getRestrictedTools = () => {
    return Object.entries(planAccess)
      .filter(([_, hasAccess]) => !hasAccess)
      .map(([toolId]) => toolId)
  }

  const canCreateProject = (currentProjectCount: number) => {
    if (isPro) return true
    return currentProjectCount < 3 // Free plan limit
  }
  const canExport = (currentExportsThisMonth: number) => {
    if (isPro) return true
    return currentExportsThisMonth < 20
  }

  return {
    userPlan: isPro ? 'pro' : 'free',
    isPro,
    isFree,
    hasAccess,
    planAccess,
    getRestrictedTools,
    canCreateProject,
    canExport,
  }
}

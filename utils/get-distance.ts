type Locale = 'fa' | 'en'

export function getDistance(createdAt: string | Date, locale: Locale = 'fa'): string {
  const now = Date.now()
  const date = new Date(createdAt).getTime()

  const diff = now - date

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const year = 365 * day

  if (diff < minute) {
    return locale === 'fa' ? 'کمتر از یک دقیقه پیش' : 'less than a minute ago'
  }

  if (diff < 20 * minute) {
    return locale === 'fa' ? 'چند دقیقه پیش' : 'a few minutes ago'
  }

  if (diff < hour) {
    const minutes = Math.floor(diff / minute)

    return locale === 'fa' ? `${minutes} دقیقه پیش` : `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }

  if (diff < day) {
    const hours = Math.floor(diff / hour)

    return locale === 'fa' ? `${hours} ساعت پیش` : `${hours} hour${hours > 1 ? 's' : ''} ago`
  }

  if (diff < year) {
    const days = Math.floor(diff / day)

    return locale === 'fa' ? `${days} روز پیش` : `${days} day${days > 1 ? 's' : ''} ago`
  }

  const years = Math.floor(diff / year)

  return locale === 'fa' ? `${years} سال پیش` : `${years} year${years > 1 ? 's' : ''} ago`
}

import { useEffect, useState } from 'react'

const useCounter = (target: number, duration: number) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = target / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 32)
    return () => clearInterval(timer)
  }, [target, duration])

  return count
}

export default useCounter

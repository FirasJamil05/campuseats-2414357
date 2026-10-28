import { useEffect, useState } from 'react'

// Like useState, but saves the value after refreshing
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : initialValue
    } catch (error) {
      console.warn(`Could not read ${key} from localStorage`, error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Could not save ${key} to localStorage`, error)
    }
  }, [key, value])

  return [value, setValue]
}

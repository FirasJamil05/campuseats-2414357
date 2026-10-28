import { useEffect, useState } from 'react'

export function useVendors() {
  const [vendors, setVendors] = useState([])
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [finishedKey, setFinishedKey] = useState(-1)

  const loading = finishedKey !== reloadKey

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/vendors.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setVendors(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && !controller.signal.aborted) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setFinishedKey(reloadKey)
        }
      })

    return () => controller.abort()
  }, [reloadKey])

  return {
    vendors,
    loading,
    error,
    reload: () => setReloadKey((key) => key + 1)
  }
}

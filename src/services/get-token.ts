'use client'

import { useEffect, useState } from 'react'

export function LocalStorageAccess() {
  const [data, setData] = useState<string | null>(null)

  useEffect(() => {
    const storedData = localStorage.getItem('Token')
    setData(storedData)
  }, [])

  return data
}
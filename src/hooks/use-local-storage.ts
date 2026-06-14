import { useCallback, useEffect, useState } from 'react'
import { readStorage, writeStorage } from '@/utils/storage'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, initialValue))

  useEffect(() => {
    writeStorage(key, value)
  }, [key, value])

  const reset = useCallback(() => {
    setValue(initialValue)
  }, [initialValue])

  return [value, setValue, reset] as const
}

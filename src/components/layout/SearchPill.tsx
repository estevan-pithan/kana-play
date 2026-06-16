import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'

import { SearchTypeSelect } from './SearchTypeSelect'

export function SearchPill() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')
  const debounceRef = useRef<number | undefined>(undefined)
  const lastUrlValueRef = useRef<string>(searchParams.get('q') ?? '')

  useEffect(() => {
    const fromUrl = searchParams.get('q') ?? ''
    if (fromUrl !== lastUrlValueRef.current) {
      lastUrlValueRef.current = fromUrl
      setValue(fromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    return () => {
      window.clearTimeout(debounceRef.current)
    }
  }, [])

  function pushToUrl(term: string) {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    lastUrlValueRef.current = term
    const qs = params.toString()
    navigate(qs ? `/?${qs}` : '/', { replace: true })
  }

  function handleChange(next: string) {
    setValue(next)
    window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => {
      pushToUrl(next.trim())
    }, 300)
  }

  function handleClear() {
    window.clearTimeout(debounceRef.current)
    setValue('')
    pushToUrl('')
  }

  return (
    <div
      className="flex h-11 w-full max-w-[560px] items-center gap-2 rounded-3xl px-4 transition-colors focus-within:border-white/20"
      style={{
        background: 'rgba(255, 255, 255, 0.07)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <Search className="h-4 w-4 shrink-0 text-white/50" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          handleChange(e.target.value)
        }}
        placeholder={t('nav.searchPlaceholder')}
        className="h-full flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
        aria-label={t('common.search')}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={t('common.clear')}
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      <span
        aria-hidden="true"
        className="h-5 w-px shrink-0"
        style={{ background: 'rgba(255, 255, 255, 0.1)' }}
      />
      <SearchTypeSelect />
    </div>
  )
}

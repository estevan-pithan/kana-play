import { afterEach, describe, expect, it, vi } from 'vitest'

import { readStorage, removeStorage, writeStorage } from './storage'

describe('storage', () => {
  afterEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('readStorage', () => {
    it('returns the parsed value when the key exists', () => {
      window.localStorage.setItem('k', JSON.stringify({ a: 1 }))
      expect(readStorage('k', null)).toEqual({ a: 1 })
    })

    it('returns the fallback when the key is missing', () => {
      expect(readStorage('missing', 'fallback')).toBe('fallback')
    })

    it('returns the fallback when the stored value is invalid JSON', () => {
      window.localStorage.setItem('bad', '{not json')
      expect(readStorage('bad', [])).toEqual([])
    })

    it('preserves falsy stored values (0, false, empty string)', () => {
      window.localStorage.setItem('zero', JSON.stringify(0))
      expect(readStorage('zero', 99)).toBe(0)
    })
  })

  describe('writeStorage', () => {
    it('serializes and persists the value', () => {
      writeStorage('w', { hello: 'world' })
      expect(window.localStorage.getItem('w')).toBe('{"hello":"world"}')
    })

    it('swallows quota/serialization errors instead of throwing', () => {
      vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceeded')
      })
      expect(() => {
        writeStorage('w', 'x')
      }).not.toThrow()
    })
  })

  describe('removeStorage', () => {
    it('removes the key', () => {
      window.localStorage.setItem('r', '1')
      removeStorage('r')
      expect(window.localStorage.getItem('r')).toBeNull()
    })
  })
})

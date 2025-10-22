import { describe, it, expect } from 'vitest'
import { formatNumber, formatDate, generateHash } from '@/lib/format'

describe('format utilities', () => {
  it('should format numbers correctly', () => {
    expect(formatNumber(1234)).toBe('1,234')
    expect(formatNumber(1000000)).toBe('1,000,000')
    expect(formatNumber(0)).toBe('0')
  })

  it('should format dates correctly', () => {
    const date = '2024-01-15T10:30:00Z'
    const formatted = formatDate(date)
    expect(formatted).toContain('January')
    expect(formatted).toContain('2024')
  })

  it('should generate hash correctly', () => {
    const hash1 = generateHash('test input')
    const hash2 = generateHash('test input')
    const hash3 = generateHash('different input')
    
    expect(hash1).toBe(hash2) // Same input should produce same hash
    expect(hash1).not.toBe(hash3) // Different input should produce different hash
    expect(typeof hash1).toBe('string')
  })
})

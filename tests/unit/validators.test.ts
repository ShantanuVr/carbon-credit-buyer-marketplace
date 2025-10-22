import { describe, it, expect } from 'vitest'
import { AuthLoginSchema, PurchaseFormSchema, RetireFormSchema } from '@/lib/types'

describe('Zod validators', () => {
  describe('AuthLoginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123'
      }
      expect(() => AuthLoginSchema.parse(validData)).not.toThrow()
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123'
      }
      expect(() => AuthLoginSchema.parse(invalidData)).toThrow()
    })

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: ''
      }
      expect(() => AuthLoginSchema.parse(invalidData)).toThrow()
    })
  })

  describe('PurchaseFormSchema', () => {
    it('should validate correct purchase data', () => {
      const validData = {
        classId: 'class_123',
        quantity: 100
      }
      expect(() => PurchaseFormSchema.parse(validData)).not.toThrow()
    })

    it('should reject negative quantity', () => {
      const invalidData = {
        classId: 'class_123',
        quantity: -1
      }
      expect(() => PurchaseFormSchema.parse(invalidData)).toThrow()
    })

    it('should reject zero quantity', () => {
      const invalidData = {
        classId: 'class_123',
        quantity: 0
      }
      expect(() => PurchaseFormSchema.parse(invalidData)).toThrow()
    })
  })

  describe('RetireFormSchema', () => {
    it('should validate correct retire data', () => {
      const validData = {
        classId: 'class_123',
        quantity: 50,
        purpose: 'Climate action',
        beneficiary: 'Company ABC'
      }
      expect(() => RetireFormSchema.parse(validData)).not.toThrow()
    })

    it('should reject purpose longer than 280 characters', () => {
      const invalidData = {
        classId: 'class_123',
        quantity: 50,
        purpose: 'a'.repeat(281),
        beneficiary: 'Company ABC'
      }
      expect(() => RetireFormSchema.parse(invalidData)).toThrow()
    })

    it('should reject beneficiary longer than 120 characters', () => {
      const invalidData = {
        classId: 'class_123',
        quantity: 50,
        purpose: 'Climate action',
        beneficiary: 'a'.repeat(121)
      }
      expect(() => RetireFormSchema.parse(invalidData)).toThrow()
    })
  })
})

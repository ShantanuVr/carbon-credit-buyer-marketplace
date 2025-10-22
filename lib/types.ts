import { z } from 'zod'

// Registry API DTOs
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  methodology: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']),
  totalIssued: z.number(),
  totalRetired: z.number(),
  createdAt: z.string(),
})

export const ClassSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  vintage: z.string(),
  issued: z.number(),
  retired: z.number(),
  remaining: z.number(),
  factorRef: z.string().optional(),
  status: z.enum(['FINALIZED', 'PENDING', 'CANCELLED']),
  createdAt: z.string(),
})

export const IssuanceSchema = z.object({
  id: z.string(),
  classId: z.string(),
  quantity: z.number(),
  status: z.enum(['FINALIZED', 'PENDING', 'CANCELLED']),
  createdAt: z.string(),
})

export const CreditBalanceSchema = z.object({
  classId: z.string(),
  quantity: z.number(),
  class: ClassSchema,
})

export const TransferRequestSchema = z.object({
  toOrgId: z.string(),
  classId: z.string(),
  quantity: z.number().positive(),
})

export const RetireRequestSchema = z.object({
  classId: z.string(),
  quantity: z.number().positive(),
  purposeHash: z.string(),
  beneficiaryHash: z.string(),
  memo: z.string().optional(),
})

export const RetirementSchema = z.object({
  id: z.string(),
  certificateId: z.string(),
  classId: z.string(),
  quantity: z.number(),
  purposeHash: z.string(),
  beneficiaryHash: z.string(),
  memo: z.string().optional(),
  createdAt: z.string(),
})

export const AuthLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    role: z.enum(['BUYER', 'SELLER', 'ADMIN']),
    orgId: z.string(),
  }),
})

// Adapter API DTOs
export const ReceiptSchema = z.object({
  id: z.string(),
  txHash: z.string(),
  status: z.string(),
  createdAt: z.string(),
})

export const TransactionSchema = z.object({
  hash: z.string(),
  status: z.string(),
  blockNumber: z.number().optional(),
  createdAt: z.string(),
})

// Local DTOs
export const CartItemSchema = z.object({
  classId: z.string(),
  quantity: z.number().positive(),
  class: ClassSchema,
})

export const OrderSchema = z.object({
  id: z.string(),
  lines: z.array(CartItemSchema),
  createdAt: z.string(),
  transferReceiptIds: z.array(z.string()).optional(),
})

export const CertificateSchema = z.object({
  id: z.string(),
  classId: z.string(),
  quantity: z.number(),
  purposeHash: z.string(),
  beneficiaryHash: z.string(),
  createdAt: z.string(),
  class: ClassSchema,
})

// Form schemas
export const PurchaseFormSchema = z.object({
  classId: z.string(),
  quantity: z.number().positive(),
})

export const RetireFormSchema = z.object({
  classId: z.string(),
  quantity: z.number().positive(),
  purpose: z.string().max(280),
  beneficiary: z.string().max(120),
})

// Type exports
export type Project = z.infer<typeof ProjectSchema>
export type Class = z.infer<typeof ClassSchema>
export type Issuance = z.infer<typeof IssuanceSchema>
export type CreditBalance = z.infer<typeof CreditBalanceSchema>
export type TransferRequest = z.infer<typeof TransferRequestSchema>
export type RetireRequest = z.infer<typeof RetireRequestSchema>
export type Retirement = z.infer<typeof RetirementSchema>
export type AuthLogin = z.infer<typeof AuthLoginSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>
export type Receipt = z.infer<typeof ReceiptSchema>
export type Transaction = z.infer<typeof TransactionSchema>
export type CartItem = z.infer<typeof CartItemSchema>
export type Order = z.infer<typeof OrderSchema>
export type Certificate = z.infer<typeof CertificateSchema>
export type PurchaseForm = z.infer<typeof PurchaseFormSchema>
export type RetireForm = z.infer<typeof RetireFormSchema>

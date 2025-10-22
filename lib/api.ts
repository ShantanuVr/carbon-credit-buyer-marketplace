import { env } from './env'
import { Project, Class, AuthResponse, CreditBalance, Retirement } from './types'

// Mock data for demo mode
const mockProjects: Project[] = [
  {
    id: 'proj_001',
    name: 'Solar Energy Project - India',
    description: 'Large-scale solar energy project in Rajasthan, India, generating clean electricity and reducing carbon emissions.',
    region: 'Asia',
    country: 'India',
    methodology: 'Solar Energy Generation',
    status: 'ACTIVE',
    totalIssued: 50000,
    totalRetired: 12000,
    createdAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 'proj_002',
    name: 'Wind Farm - Brazil',
    description: 'Offshore wind farm project in Brazil generating renewable energy.',
    region: 'South America',
    country: 'Brazil',
    methodology: 'Wind Energy Generation',
    status: 'ACTIVE',
    totalIssued: 75000,
    totalRetired: 25000,
    createdAt: '2023-03-20T00:00:00Z',
  },
  {
    id: 'proj_003',
    name: 'Forest Conservation - Kenya',
    description: 'Community-based forest conservation project protecting biodiversity.',
    region: 'Africa',
    country: 'Kenya',
    methodology: 'Forest Conservation',
    status: 'ACTIVE',
    totalIssued: 30000,
    totalRetired: 8000,
    createdAt: '2023-05-10T00:00:00Z',
  },
]

const mockClasses: Class[] = [
  {
    id: '1001',
    projectId: 'proj_001',
    vintage: '2023',
    issued: 1000,
    retired: 150,
    remaining: 850,
    status: 'FINALIZED',
    createdAt: '2023-01-15T00:00:00Z',
  },
  {
    id: '1002',
    projectId: 'proj_001',
    vintage: '2024',
    issued: 2000,
    retired: 300,
    remaining: 1700,
    status: 'FINALIZED',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2001',
    projectId: 'proj_002',
    vintage: '2023',
    issued: 1500,
    retired: 200,
    remaining: 1300,
    status: 'FINALIZED',
    createdAt: '2023-03-20T00:00:00Z',
  },
  {
    id: '3001',
    projectId: 'proj_003',
    vintage: '2023',
    issued: 800,
    retired: 100,
    remaining: 700,
    status: 'FINALIZED',
    createdAt: '2023-05-10T00:00:00Z',
  },
]

const mockUser = {
  id: 'user_001',
  email: 'buyer@buyerco.local',
  role: 'BUYER' as const,
  orgId: 'org_001',
}

const mockHoldings: CreditBalance[] = [
  {
    classId: '1001',
    quantity: 50,
    class: mockClasses[0],
  },
  {
    classId: '2001',
    quantity: 25,
    class: mockClasses[2],
  },
]

const mockRetirements: Retirement[] = [
  {
    id: 'ret_001',
    certificateId: 'cert_001',
    classId: '1001',
    quantity: 10,
    purposeHash: '0x1234567890abcdef',
    beneficiaryHash: '0xabcdef1234567890',
    memo: 'Corporate sustainability initiative',
    createdAt: '2024-01-15T00:00:00Z',
  },
]

// Mock API client for demo mode
export class MockRegistryClient {
  async login(email: string, password: string): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (email === 'buyer@buyerco.local' && password === 'Buyer@123') {
      return {
        token: 'mock_token_' + Date.now(),
        user: mockUser,
      }
    }
    throw new Error('Invalid credentials')
  }

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  async getProjects(status?: string): Promise<Project[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    if (status) {
      return mockProjects.filter(p => p.status === status)
    }
    return mockProjects
  }

  async getProject(id: string): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const project = mockProjects.find(p => p.id === id)
    if (!project) throw new Error('Project not found')
    return project
  }

  async getClasses(available?: boolean): Promise<Class[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    if (available) {
      return mockClasses.filter(c => c.remaining > 0)
    }
    return mockClasses
  }

  async getClass(id: string): Promise<Class> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const cls = mockClasses.find(c => c.id === id)
    if (!cls) throw new Error('Class not found')
    return cls
  }

  async getCreditBalance(ownerId?: string): Promise<CreditBalance[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockHoldings
  }

  async transferCredits(data: { toOrgId: string; classId: string; quantity: number }): Promise<{ receiptId: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { receiptId: 'receipt_' + Date.now() }
  }

  async retireCredits(data: {
    classId: string
    quantity: number
    purposeHash: string
    beneficiaryHash: string
    memo?: string
  }): Promise<{ certificateId: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { certificateId: 'cert_' + Date.now() }
  }

  async getRetirement(certificateId: string): Promise<Retirement> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const retirement = mockRetirements.find(r => r.certificateId === certificateId)
    if (!retirement) throw new Error('Retirement not found')
    return retirement
  }
}

// Registry API client
export class RegistryClient {
  private baseUrl: string
  private token?: string

  constructor(token?: string) {
    this.baseUrl = env.NEXT_PUBLIC_REGISTRY_API_URL
    this.token = token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`Registry API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    })
  }

  // Project endpoints
  async getProjects(status?: string) {
    const params = status ? `?status=${status}` : ''
    return this.request(`/projects${params}`)
  }

  async getProject(id: string) {
    return this.request(`/projects/${id}`)
  }

  // Class endpoints
  async getClasses(available?: boolean) {
    const params = available !== undefined ? `?available=${available}` : ''
    return this.request(`/classes${params}`)
  }

  async getClass(id: string) {
    return this.request(`/classes/${id}`)
  }

  // Credit endpoints
  async getCreditBalance(ownerId?: string) {
    const params = ownerId ? `?ownerId=${ownerId}` : '?ownerId=me'
    return this.request(`/credits/balance${params}`)
  }

  async transferCredits(data: { toOrgId: string; classId: string; quantity: number }) {
    return this.request('/credits/transfer', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async retireCredits(data: {
    classId: string
    quantity: number
    purposeHash: string
    beneficiaryHash: string
    memo?: string
  }) {
    return this.request('/credits/retire', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Retirement endpoints
  async getRetirement(certificateId: string) {
    return this.request(`/retirements/${certificateId}`)
  }
}

// Adapter API client
export class AdapterClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = env.NEXT_PUBLIC_ADAPTER_API_URL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Adapter API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getReceipt(adapterTxId: string) {
    return this.request(`/v1/receipts/${adapterTxId}`)
  }

  async getTransaction(txHash: string) {
    return this.request(`/v1/tx/${txHash}`)
  }
}

// Health check client
export class HealthClient {
  async checkHealth() {
    if (env.DEMO_MODE) {
      return {
        ok: true,
        registry: true,
        adapter: true,
        demo: true,
      }
    }

    const registryClient = new RegistryClient()
    const adapterClient = new AdapterClient()

    const [registryHealth, adapterHealth] = await Promise.allSettled([
      registryClient.getProjects(),
      adapterClient.getReceipt('test'),
    ])

    return {
      ok: true,
      registry: registryHealth.status === 'fulfilled',
      adapter: adapterHealth.status === 'fulfilled',
    }
  }
}

// Factory function to get the appropriate client
export function createRegistryClient(token?: string) {
  if (env.DEMO_MODE) {
    return new MockRegistryClient()
  }
  return new RegistryClient(token)
}
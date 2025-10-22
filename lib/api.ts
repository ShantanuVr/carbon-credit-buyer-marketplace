import { env } from './env'

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

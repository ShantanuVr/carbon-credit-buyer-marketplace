'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RegistryClient } from '@/lib/api'
import { Retirement, Certificate } from '@/lib/types'
import { formatNumber, formatDate } from '@/lib/format'
import { Receipt, Shield, ExternalLink, Download, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const registryClient = new RegistryClient()
      // TODO: Implement getCertificates method in RegistryClient
      // For now, we'll simulate some data
      const mockCertificates: Certificate[] = [
        {
          id: 'cert_001',
          classId: '1001',
          quantity: 150,
          purposeHash: '0x1234...5678',
          beneficiaryHash: '0xabcd...efgh',
          createdAt: new Date().toISOString(),
          class: {
            id: '1001',
            projectId: 'proj_001',
            vintage: '2023',
            issued: 1000,
            retired: 150,
            remaining: 850,
            status: 'FINALIZED',
            createdAt: new Date().toISOString(),
          },
        },
      ]
      setCertificates(mockCertificates)
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalRetired = certificates.reduce((sum, cert) => sum + cert.quantity, 0)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
            <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="space-y-2">
                    <div className="h-6 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-muted rounded animate-pulse flex-1" />
                    <div className="h-8 bg-muted rounded animate-pulse flex-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Retirement Certificates</h1>
          <p className="text-xl text-muted-foreground">
            Your carbon credit retirement certificates and environmental impact
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatNumber(totalRetired)}</p>
                  <p className="text-sm text-muted-foreground">Total Retired</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Receipt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{certificates.length}</p>
                  <p className="text-sm text-muted-foreground">Certificates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                  <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {certificates.length > 0 ? formatDate(certificates[0].createdAt) : 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">Latest Retirement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates Grid */}
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">Certificate #{certificate.id}</CardTitle>
                      <CardDescription>
                        Class {certificate.classId} • Vintage {certificate.class.vintage}
                      </CardDescription>
                    </div>
                    <Badge variant="default">
                      <Shield className="h-3 w-3 mr-1" />
                      Retired
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity Retired:</span>
                      <span className="font-semibold">{formatNumber(certificate.quantity)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Retirement Date:</span>
                      <span className="font-medium">{formatDate(certificate.createdAt)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Project:</span>
                      <span className="font-medium">{certificate.class.projectId}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2 bg-muted rounded-md">
                      <p className="text-xs text-muted-foreground">Purpose Hash:</p>
                      <p className="text-xs font-mono break-all">{certificate.purposeHash}</p>
                    </div>
                    <div className="p-2 bg-muted rounded-md">
                      <p className="text-xs text-muted-foreground">Beneficiary Hash:</p>
                      <p className="text-xs font-mono break-all">{certificate.beneficiaryHash}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View in Explorer
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6">
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No certificates yet</h2>
            <p className="text-muted-foreground mb-6">
              Retire some carbon credits to generate your first certificate.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/buyer/dashboard">
                <Button>
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline">
                  Browse Projects
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Impact Summary */}
        {certificates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Environmental Impact Summary</CardTitle>
              <CardDescription>
                Your contribution to climate action through carbon credit retirement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                      <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{formatNumber(totalRetired)} Credits Retired</p>
                      <p className="text-sm text-muted-foreground">
                        Equivalent to removing {Math.round(totalRetired * 0.5)} tons of CO₂
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                      <Receipt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{certificates.length} Certificates</p>
                      <p className="text-sm text-muted-foreground">
                        Permanent retirement records
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Retirement Timeline</h4>
                    <div className="space-y-2">
                      {certificates.slice(0, 3).map((cert) => (
                        <div key={cert.id} className="flex justify-between text-sm">
                          <span>{formatDate(cert.createdAt)}</span>
                          <span className="font-medium">{formatNumber(cert.quantity)} credits</span>
                        </div>
                      ))}
                      {certificates.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{certificates.length - 3} more retirements
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

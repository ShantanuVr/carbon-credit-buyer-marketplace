import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Retirement } from '@/lib/types'
import { formatNumber, formatDate } from '@/lib/format'
import { Shield, ExternalLink, Download } from 'lucide-react'

interface CertificateCardProps {
  certificate: Retirement
  onViewExplorer?: (certificateId: string) => void
  onDownload?: (certificateId: string) => void
}

export function CertificateCard({ certificate, onViewExplorer, onDownload }: CertificateCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Certificate #{certificate.certificateId}</CardTitle>
            <CardDescription>
              Class {certificate.classId} • Vintage {certificate.vintage || 'N/A'}
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
            <span className="font-medium">{certificate.projectId || 'N/A'}</span>
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

        {certificate.memo && (
          <div className="p-2 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground">Memo:</p>
            <p className="text-xs">{certificate.memo}</p>
          </div>
        )}

        <div className="flex gap-2">
          {onViewExplorer && (
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewExplorer(certificate.certificateId)}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View in Explorer
            </Button>
          )}
          {onDownload && (
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onDownload(certificate.certificateId)}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

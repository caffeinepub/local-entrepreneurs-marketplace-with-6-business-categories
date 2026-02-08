import { useGetInquiriesByEntrepreneur } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, MessageSquare } from 'lucide-react';

interface InquiriesPanelProps {
  entrepreneurId: bigint;
}

export default function InquiriesPanel({ entrepreneurId }: InquiriesPanelProps) {
  const { data: inquiries, isLoading } = useGetInquiriesByEntrepreneur(entrepreneurId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (!inquiries || inquiries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-4">
          <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <div>
            <h3 className="text-lg font-semibold">No inquiries yet</h3>
            <p className="text-muted-foreground">Customer inquiries will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Customer Inquiries</h2>
        <p className="text-muted-foreground">Messages from interested customers</p>
      </div>

      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id.toString()}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{inquiry.customerName}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Mail className="h-3 w-3" />
                    {inquiry.customerContact}
                  </CardDescription>
                </div>
                <Badge variant="secondary">Product #{inquiry.productId.toString()}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{inquiry.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

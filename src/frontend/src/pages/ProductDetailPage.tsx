import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct, useGetProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Store, Tag } from 'lucide-react';
import ProductInquiryForm from '../components/inquiries/ProductInquiryForm';
import { useState } from 'react';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { data: product, isLoading: productLoading } = useGetProduct(BigInt(productId));
  const { data: seller, isLoading: sellerLoading } = useGetProfile(product?.entrepreneurId);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  if (productLoading || sellerLoading) {
    return (
      <div className="container py-8 space-y-8">
        <Skeleton className="h-10 w-32" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-64 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product || !seller) {
    return (
      <div className="container py-8">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/' })} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-muted/30 rounded-lg aspect-square flex items-center justify-center">
          <Package className="h-32 w-32 text-muted-foreground/30" />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                ${Number(product.price).toFixed(2)}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Tag className="h-3 w-3" />
                {product.category.name}
              </Badge>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Store className="h-5 w-5" />
                Sold by
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold">{seller.businessName}</p>
              <p className="text-sm text-muted-foreground">{seller.description}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: '/seller/$sellerId', params: { sellerId: seller.id.toString() } })}
              >
                View Seller Profile
              </Button>
            </CardContent>
          </Card>

          {!showInquiryForm ? (
            <Button onClick={() => setShowInquiryForm(true)} size="lg" className="w-full">
              Contact Seller
            </Button>
          ) : (
            <ProductInquiryForm
              productId={product.id}
              entrepreneurId={product.entrepreneurId}
              onSuccess={() => setShowInquiryForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" x2="12" y1="22" y2="12" />
    </svg>
  );
}

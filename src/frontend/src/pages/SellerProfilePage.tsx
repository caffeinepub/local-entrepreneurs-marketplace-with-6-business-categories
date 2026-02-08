import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProfile, useGetProductsByEntrepreneur } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Mail, Package, Tag } from 'lucide-react';

export default function SellerProfilePage() {
  const { sellerId } = useParams({ from: '/seller/$sellerId' });
  const navigate = useNavigate();
  const { data: seller, isLoading: sellerLoading } = useGetProfile(BigInt(sellerId));
  const { data: products, isLoading: productsLoading } = useGetProductsByEntrepreneur(BigInt(sellerId));

  if (sellerLoading) {
    return (
      <div className="container py-8 space-y-8">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="container py-8">
        <p>Seller not found</p>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/' })} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{seller.businessName}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="secondary">{seller.category.name}</Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-muted-foreground">{seller.description}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{seller.contact}</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Products</h2>
        {productsLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product.id.toString()}
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                onClick={() => navigate({ to: '/product/$productId', params: { productId: product.id.toString() } })}
              >
                <CardHeader>
                  <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge variant="secondary">${Number(product.price).toFixed(2)}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <div>
              <h3 className="text-lg font-semibold">No products yet</h3>
              <p className="text-muted-foreground">This seller hasn't listed any products</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

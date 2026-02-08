import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetCategories, useGetProductsByCategory } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CategoryBrowsePage() {
  const { categoryId } = useParams({ from: '/category/$categoryId' });
  const navigate = useNavigate();
  const { data: categories } = useGetCategories();
  const { data: products, isLoading } = useGetProductsByCategory(BigInt(categoryId));

  const category = categories?.find((c) => c.id.toString() === categoryId);

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{category?.name}</h1>
          <p className="text-muted-foreground">{category?.description}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product.id.toString()}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group"
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
            <p className="text-muted-foreground">Check back soon for new listings in this category</p>
          </div>
        </div>
      )}
    </div>
  );
}

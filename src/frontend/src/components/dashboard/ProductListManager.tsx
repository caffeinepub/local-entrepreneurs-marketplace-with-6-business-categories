import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Package } from 'lucide-react';
import ProductEditor from './ProductEditor';
import type { ProductListing } from '../../backend';

interface ProductListManagerProps {
  entrepreneurId: bigint;
  products: ProductListing[];
}

export default function ProductListManager({ entrepreneurId, products }: ProductListManagerProps) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductListing | undefined>();

  const handleAddNew = () => {
    setEditingProduct(undefined);
    setEditorOpen(true);
  };

  const handleEdit = (product: ProductListing) => {
    setEditingProduct(product);
    setEditorOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Products</h2>
          <p className="text-muted-foreground">Manage your product listings</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <div>
              <h3 className="text-lg font-semibold">No products yet</h3>
              <p className="text-muted-foreground">Create your first product to get started</p>
            </div>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id.toString()}>
              <CardHeader>
                <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary">${(Number(product.price) / 100).toFixed(2)}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
                <Button variant="outline" size="sm" onClick={() => handleEdit(product)} className="w-full gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProductEditor
        entrepreneurId={entrepreneurId}
        existingProduct={editingProduct}
        open={editorOpen}
        onOpenChange={setEditorOpen}
      />
    </div>
  );
}

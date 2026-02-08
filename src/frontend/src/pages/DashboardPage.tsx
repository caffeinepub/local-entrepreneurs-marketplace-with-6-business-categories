import { useCurrentUser } from '../hooks/useCurrentUser';
import { useGetProductsByEntrepreneur } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { AlertCircle, Store } from 'lucide-react';
import SellerProfileForm from '../components/dashboard/SellerProfileForm';
import ProductListManager from '../components/dashboard/ProductListManager';
import InquiriesPanel from '../components/dashboard/InquiriesPanel';
import { useState, useEffect } from 'react';
import type { EntrepreneurProfile } from '../backend';

export default function DashboardPage() {
  const { isAuthenticated, loginStatus } = useCurrentUser();
  const navigate = useNavigate();
  const [myProfile, setMyProfile] = useState<EntrepreneurProfile | null>(null);
  const { data: myProducts } = useGetProductsByEntrepreneur(myProfile?.id);

  useEffect(() => {
    if (!isAuthenticated && loginStatus !== 'logging-in' && loginStatus !== 'initializing') {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, loginStatus, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please sign in to access the dashboard.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center gap-3">
        <Store className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Entrepreneur Dashboard</h1>
          <p className="text-muted-foreground">Manage your business profile and products</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>
                {myProfile
                  ? 'Update your business information'
                  : 'Create your business profile to start listing products'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SellerProfileForm existingProfile={myProfile} onProfileCreated={setMyProfile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {!myProfile ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please create your business profile first before adding products.</AlertDescription>
            </Alert>
          ) : (
            <ProductListManager entrepreneurId={myProfile.id} products={myProducts || []} />
          )}
        </TabsContent>

        <TabsContent value="inquiries" className="space-y-6">
          {!myProfile ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please create your business profile first to view inquiries.</AlertDescription>
            </Alert>
          ) : (
            <InquiriesPanel entrepreneurId={myProfile.id} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

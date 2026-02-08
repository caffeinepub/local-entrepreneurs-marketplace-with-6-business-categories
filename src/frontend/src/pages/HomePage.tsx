import { useNavigate } from '@tanstack/react-router';
import { useGetCategories } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: categories, isLoading } = useGetCategories();

  return (
    <div className="container py-8 space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Discover Local Entrepreneurs
            </h1>
            <p className="text-lg text-muted-foreground">
              Support your community by connecting with talented local business owners. Browse unique products
              across multiple categories and help small businesses thrive.
            </p>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
            <img
              src="/assets/generated/hero-illustration.dim_1600x900.png"
              alt="Local marketplace"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Browse by Category</h2>
          <p className="text-muted-foreground">
            Explore products from local entrepreneurs in various industries
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.map((category) => (
              <Card
                key={category.id.toString()}
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group"
                onClick={() => navigate({ to: '/category/$categoryId', params: { categoryId: category.id.toString() } })}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {category.name}
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

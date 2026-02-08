import { Link, useNavigate } from '@tanstack/react-router';
import LoginButton from '../auth/LoginButton';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import ProfileSetupDialog from '../auth/ProfileSetupDialog';
import { Store, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, userProfile, profileLoading, isFetched } = useCurrentUser();
  const navigate = useNavigate();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/assets/generated/logo.dim_512x512.png" alt="Logo" className="h-10 w-10" />
            <span className="font-bold text-xl hidden sm:inline-block">Local Market</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/dashboard' })}
              >
                Dashboard
              </Button>
            )}
            <LoginButton />
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-muted/30 py-8 mt-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Store className="h-4 w-4" />
              <span>Empowering local entrepreneurs</span>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              © 2026. Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>

      <ProfileSetupDialog open={showProfileSetup} />
    </div>
  );
}

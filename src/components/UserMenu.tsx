import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, LogOut } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const UserMenu = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { lang } = useParams();
  const [userProfile, setUserProfile] = useState<{ first_name: string; last_name: string } | null>(null);

  useEffect(() => {
    if (user) {
      // Fetch user profile from public.users table
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('users')
          .select('first_name, last_name')
          .eq('auth_user_id', user.id)
          .maybeSingle();
        
        if (data) {
          setUserProfile(data);
        }
      };
      fetchProfile();
    }
  }, [user]);

  if (!user) return null;

  const displayName = userProfile 
    ? `${userProfile.first_name} ${userProfile.last_name.charAt(0)}.`
    : user.email?.split('@')[0] || 'User';

  const initials = userProfile
    ? `${userProfile.first_name.charAt(0)}${userProfile.last_name.charAt(0)}`
    : user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-primary text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline-block font-medium">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => navigate(`/${lang}/dashboard/settings`)}>
          <Settings className="mr-2 h-4 w-4" />
          <span>{t('dashboard.settings.title')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('auth.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

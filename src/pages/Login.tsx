import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (lang && (lang === 'en' || lang === 'fr')) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate(`/${lang || 'fr'}/dashboard`);
      }
    };
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate(`/${lang || 'fr'}/dashboard`);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, lang]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        // Sign up flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password: password || Math.random().toString(36), // Generate random password if not provided
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              provider: 'email',
              preferred_locale: lang || 'fr',
              is_demo: false,
              role: 'member'
            },
            emailRedirectTo: `${window.location.origin}/${lang || 'fr'}/dashboard`
          }
        });

        if (error) throw error;

        toast({
          title: t('common.success'),
          description: t('auth.signupSuccess'),
        });
        
        // Auto login after signup
        navigate(`/${lang || 'fr'}/dashboard`);
      } else {
        // Sign in flow - if user doesn't exist, auto-create the account so any email/password works
        const effectivePassword = password || 'demo-password-123';
        let { error } = await supabase.auth.signInWithPassword({
          email,
          password: effectivePassword,
        });

        if (error) {
          // Auto-create account on failed login (open access mode)
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password: effectivePassword,
            options: {
              data: {
                first_name: email.split('@')[0],
                last_name: '',
                provider: 'email',
                preferred_locale: lang || 'fr',
                is_demo: false,
                role: 'member',
              },
              emailRedirectTo: `${window.location.origin}/${lang || 'fr'}/dashboard`,
            },
          });

          if (signUpError && !signUpError.message.toLowerCase().includes('registered')) {
            throw signUpError;
          }

          // Try login again after signup
          const retry = await supabase.auth.signInWithPassword({
            email,
            password: effectivePassword,
          });
          if (retry.error) throw retry.error;
        }

        toast({
          title: t('common.success'),
          description: t('auth.loginSuccess'),
        });

        navigate(`/${lang || 'fr'}/dashboard`);
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || (isSignUp ? t('auth.signupError') : t('auth.loginError')),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/${lang || 'fr'}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('auth.googleError'),
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/5 via-success/5 to-background p-6">
      {/* Animated background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent/20 rounded-3xl animate-float" />
        <div className="absolute bottom-40 right-32 w-40 h-40 bg-success/20 rounded-3xl animate-float-delayed" />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-elegant">
        <CardHeader className="text-center">
          <div className="absolute top-4 right-4">
            <LanguageSwitcher />
          </div>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-primary rounded-2xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">{isSignUp ? t('login.signUp') : t('login.title')}</CardTitle>
          <CardDescription>
            {isSignUp ? t('login.subtitle').replace('Connectez', 'Créez') : t('login.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('auth.firstName')}</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder={t('auth.firstNamePlaceholder')}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('auth.lastName')}</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder={t('auth.lastNamePlaceholder')}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="jean@agoras.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">{t('auth.passwordOptional')}</p>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isLoading}
            >
              {isLoading 
                ? t('common.loading') 
                : (isSignUp ? t('auth.createAccount') : t('auth.login'))}
            </Button>
          </form>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              OU
            </span>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleAuth}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
...
            </svg>
            {t('login.withGoogle')}
          </Button>

          <div className="mt-6 text-center space-y-2">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-muted-foreground"
              disabled={isLoading}
            >
              {isSignUp ? t('auth.hasAccount') : t('auth.noAccount')}
            </Button>
            <br />
            <Button 
              variant="link" 
              onClick={() => navigate(`/${lang}`)}
              className="text-muted-foreground"
              disabled={isLoading}
            >
              ← {t('common.close')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

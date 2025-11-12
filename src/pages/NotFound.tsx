import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { lang } = useParams();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    if (lang && (lang === 'en' || lang === 'fr')) {
      i18n.changeLanguage(lang);
    }
  }, [location.pathname, lang, i18n]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-2xl text-muted-foreground">{t('common.notFound')}</p>
        <Button onClick={() => navigate(`/${lang || 'fr'}`)} variant="default">
          {t('common.returnHome')}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

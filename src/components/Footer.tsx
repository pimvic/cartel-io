import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterSubmitted(true);
    setNewsletterEmail("");
    setTimeout(() => setNewsletterSubmitted(false), 3000);
  };

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Solutions */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.solutions')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Entreprises</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Formation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Éducation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Particuliers</a></li>
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.enterprise')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">À propos</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Carrières</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Presse</a></li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Tutoriels</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Guides</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Partenaires */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.partners')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Devenir partenaire</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Réseau</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Affiliés</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Intégrations</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.newsletter.title')}</h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="w-full"
              />
              <Button type="submit" className="w-full">
                {t('footer.newsletter.send')}
              </Button>
              {newsletterSubmitted && (
                <p className="text-xs text-green-600 dark:text-green-400">{t('home.contact.form.success')}</p>
              )}
            </form>
            
            <div className="mt-6 space-y-1">
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t('footer.links.presentation')}</a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t('footer.links.mission')}</a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t('footer.links.team')}</a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t('footer.links.philosophy')}</a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t('footer.links.opportunities')}</a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t('footer.links.contacts')}</a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t('footer.links.investors')}</a>
            </div>
          </div>
        </div>

        {/* Legal Bar */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {t('footer.legal.copyright')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('footer.legal.terms')}
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('footer.legal.privacy')}
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('footer.legal.gdpr')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();

  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Solutions */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.solutions')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.accounts')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.kartelEdu')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.onboardingServices')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.mentoring')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.tutoring')}</a></li>
            </ul>
          </div>

          {/* Entreprise/Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.enterprise')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.aboutMission')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.team')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.philosophy')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.opportunities')}</a></li>
              <li><a href="#contact" onClick={scrollToContact} className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.contact')}</a></li>
            </ul>
          </div>

          {/* Ressources/Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.aboutKartels')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.workInGroups')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.infographics')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.documentation')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.toolsDownloads')}</a></li>
            </ul>
          </div>

          {/* Partenaires/Partners */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.partners')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.learnersCommunity')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.trainersCommunity')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.plusOneCommunity')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.institutionalPartners')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.items.businessPartners')}</a></li>
            </ul>
          </div>
        </div>

        {/* Legal Bar */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4">
            <p className="text-sm text-muted-foreground text-center">
              {t('footer.legal.copyright')}
            </p>
            <span className="hidden md:inline text-muted-foreground">|</span>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t('footer.legal.terms')}
            </a>
            <span className="hidden md:inline text-muted-foreground">|</span>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t('footer.legal.privacy')}
            </a>
            <span className="hidden md:inline text-muted-foreground">|</span>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t('footer.legal.gdpr')}
            </a>
            <span className="hidden md:inline text-muted-foreground">|</span>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t('footer.legal.newsletter')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

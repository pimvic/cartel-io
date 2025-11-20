import { useParams } from "react-router-dom";

export const Footer = () => {
  const { lang } = useParams<{ lang: string }>();

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
            <h3 className="font-semibold text-lg mb-4">{lang === 'fr' ? 'Solutions' : 'Solutions'}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Comptes' : 'Accounts'}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Kartel Édu' : 'Kartel Edu'}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Services d\'onboarding' : 'Onboarding Services'}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Mentorat' : 'Mentoring'}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Tutorat' : 'Tutoring'}</a></li>
            </ul>
          </div>

          {/* Entreprise/Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{lang === 'fr' ? 'Entreprise' : 'Company'}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'À propos / Mission' : 'About / Mission'}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Équipe' : 'Team'}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Philosophie' : 'Philosophy'}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Opportunités' : 'Opportunities'}</a></li>
              <li><a href="#contact" onClick={scrollToContact} className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Contact' : 'Contact'}</a></li>
            </ul>
          </div>

          {/* Ressources/Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{lang === 'fr' ? 'Ressources' : 'Resources'}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'À propos des Kartels' : 'About Kartels'}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Travailler en groupe' : 'Work in Groups'}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Infographies' : 'Infographics'}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Documentation' : 'Documentation'}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Outils / Téléchargements' : 'Tools / Downloads'}</a></li>
            </ul>
          </div>

          {/* Partenaires/Partners */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{lang === 'fr' ? 'Partenaires' : 'Partners'}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Communauté apprenants' : 'Learners Community'}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Communauté formateurs' : 'Trainers Community'}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Communauté +1' : '+1 Community'}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Partenaires institutionnels' : 'Institutional Partners'}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{lang === 'fr' ? 'Partenaires entreprises' : 'Business Partners'}</a></li>
            </ul>
          </div>
        </div>

        {/* Legal Bar */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4">
            <p className="text-sm text-muted-foreground text-center">
              © 2024 Kartels.io. {lang === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
            </p>
            <span className="hidden md:inline text-muted-foreground">|</span>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {lang === 'fr' ? 'Conditions d\'utilisation' : 'Terms of Use'}
            </a>
            <span className="hidden md:inline text-muted-foreground">|</span>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {lang === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy'}
            </a>
            <span className="hidden md:inline text-muted-foreground">|</span>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {lang === 'fr' ? 'RGPD' : 'GDPR'}
            </a>
            <span className="hidden md:inline text-muted-foreground">|</span>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {lang === 'fr' ? 'Newsletter' : 'Newsletter'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

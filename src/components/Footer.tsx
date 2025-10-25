import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Footer = () => {
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
            <h3 className="font-semibold text-lg mb-4">Solutions</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Entreprises</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Formation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Éducation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Particuliers</a></li>
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Entreprise</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">À propos</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Carrières</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Presse</a></li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Ressources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Tutoriels</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Guides</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Partenaires */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Partenaires</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Devenir partenaire</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Réseau</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Affiliés</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Intégrations</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="Votre email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="w-full"
              />
              <Button type="submit" className="w-full">
                Envoyer
              </Button>
              {newsletterSubmitted && (
                <p className="text-xs text-green-600 dark:text-green-400">Inscription réussie!</p>
              )}
            </form>
            
            <div className="mt-6 space-y-1">
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Présentation</a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Mission</a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Équipe</a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Philosophie</a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Opportunités</a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Contacts</a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Investisseurs</a>
            </div>
          </div>
        </div>

        {/* Legal Bar */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 – KARTELS S.A. Tous droits réservés.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Conditions Générales
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Politique de Confidentialité
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                RGPD
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

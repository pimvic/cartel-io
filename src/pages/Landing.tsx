import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Trophy, Star, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const [videoLoaded, setVideoLoaded] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/5 via-success/5 to-background">
      {/* Animated background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent/20 rounded-3xl animate-float" />
        <div className="absolute bottom-40 right-32 w-40 h-40 bg-success/20 rounded-3xl animate-float-delayed" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-accent/15 rounded-2xl animate-float" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b border-border z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Cartel
          </h1>
          <div className="hidden md:flex gap-6">
            <button onClick={() => scrollToSection("qui")} className="hover:text-accent transition-colors">
              Qui Sommes nous ?
            </button>
            <button onClick={() => scrollToSection("pourquoi")} className="hover:text-accent transition-colors">
              Pourquoi Cartel ?
            </button>
            <button onClick={() => scrollToSection("tarifs")} className="hover:text-accent transition-colors">
              Tarifs
            </button>
            <button onClick={() => scrollToSection("temoignages")} className="hover:text-accent transition-colors">
              Témoignages
            </button>
            <button onClick={() => scrollToSection("apropos")} className="hover:text-accent transition-colors">
              À propos
            </button>
          </div>
          <Button onClick={() => navigate("/login")} variant="outline">
            Se connecter
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
            Apprenez plus vite et plus loin{" "}
            <span className="text-black dark:text-white">en petits groupes!</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Travaillez ensemble, partagez vos connaissances, aidez-vous mutuellement et progressez en équipe
          </p>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-elegant text-lg px-8 py-6 h-auto"
            onClick={() => navigate("/login")}
          >
            Lancez-vous! <ArrowRight className="ml-2" />
          </Button>

          {/* Video Preview */}
          <div className="mt-16 relative group">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-soft hover-lift">
              {!videoLoaded ? (
                <div 
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => setVideoLoaded(true)}
                >
                  <img 
                    src="https://img.youtube.com/vi/M4NIu4aXsJ0/hqdefault.jpg"
                    alt="Découvrez Cartel en vidéo"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover:bg-black/40">
                    <div className="bg-accent rounded-full p-6 shadow-elegant transition-transform group-hover:scale-110">
                      <Play className="w-12 h-12 text-accent-foreground fill-current" />
                    </div>
                  </div>
                </div>
              ) : (
                <iframe
                  src="https://www.youtube.com/embed/M4NIu4aXsJ0?rel=0&modestbranding=1"
                  loading="lazy"
                  allowFullScreen
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="w-full h-full"
                  title="Découvrez Cartel en vidéo"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Qui Sommes nous */}
      <section id="qui" className="py-20 px-6 bg-background/50 backdrop-blur">
        <div className="container mx-auto max-w-5xl">
          <h3 className="text-4xl font-bold text-center mb-12">Qui Sommes nous ?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-accent/5 hover-lift">
              <Users className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-bold mb-3">Collaboration</h4>
              <p className="text-muted-foreground">
                Des groupes de 3-4 apprenants qui travaillent ensemble pour atteindre leurs objectifs
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-success/5 hover-lift">
              <BookOpen className="w-12 h-12 text-success mb-4" />
              <h4 className="text-xl font-bold mb-3">Connaissances</h4>
              <p className="text-muted-foreground">
                Une base de connaissances partagée avec flashcards et quiz générés automatiquement
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-accent/5 hover-lift">
              <Trophy className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-bold mb-3">Progression</h4>
              <p className="text-muted-foreground">
                Suivez votre avancement et celui de votre groupe avec des outils de suivi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi Cartel */}
      <section id="pourquoi" className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <h3 className="text-4xl font-bold text-center mb-12">Pourquoi Cartel ?</h3>
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">🎯 Apprentissage actif</h4>
              <p className="text-muted-foreground">
                Apprenez en enseignant aux autres membres de votre cartel
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">🤝 Entraide</h4>
              <p className="text-muted-foreground">
                Bénéficiez du soutien de votre groupe pour surmonter les difficultés
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">⚡ Outils intelligents</h4>
              <p className="text-muted-foreground">
                Génération automatique de flashcards et quiz à partir de vos documents
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="py-20 px-6 bg-background/50 backdrop-blur">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-4xl font-bold text-center mb-12">Tarifs</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border hover-lift">
              <h4 className="text-2xl font-bold mb-4">Gratuit</h4>
              <p className="text-4xl font-bold mb-6">0€<span className="text-lg text-muted-foreground">/mois</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>1 cartel actif</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Base de connaissances limitée</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Flashcards et Quiz basiques</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">Commencer</Button>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border hover-lift relative">
              <div className="absolute top-4 right-4">
                <Star className="w-6 h-6 fill-accent text-accent" />
              </div>
              <h4 className="text-2xl font-bold mb-4">Pro</h4>
              <p className="text-4xl font-bold mb-6">20€<span className="text-lg text-muted-foreground">/mois</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Cartels illimités</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Base de connaissances illimitée</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>IA avancée pour flashcards et quiz</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Statistiques détaillées</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Essayer Pro
              </Button>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border hover-lift">
              <h4 className="text-2xl font-bold mb-4">Sur mesure</h4>
              <p className="text-4xl font-bold mb-6">Contactez-nous</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Membres illimités</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Fonctionnalités personnalisées</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Intégrations sur mesure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Support dédié</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">Nous contacter</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section id="temoignages" className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <h3 className="text-4xl font-bold text-center mb-12">Témoignages</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Marie L.",
                role: "Étudiante",
                text: "Cartel m'a permis de progresser 2x plus vite grâce au soutien de mon groupe !",
                rating: 5
              },
              {
                name: "Thomas B.",
                role: "Formateur",
                text: "Un outil parfait pour organiser l'apprentissage collaboratif. Les flashcards auto-générées sont incroyables.",
                rating: 5
              },
              {
                name: "Sophie M.",
                role: "Professionnelle",
                text: "J'ai enfin réussi ma certification grâce à l'entraide de mon cartel. Merci !",
                rating: 5
              }
            ].map((testimonial, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border hover-lift">
                <div className="flex gap-1 mb-3">
                  {Array(testimonial.rating).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* À propos */}
      <section id="apropos" className="py-20 px-6 bg-background/50 backdrop-blur">
        <div className="container mx-auto max-w-3xl text-center">
          <h3 className="text-4xl font-bold mb-6">À propos de Cartel</h3>
          <p className="text-lg text-muted-foreground mb-8">
            Cartel est né de la conviction que l'apprentissage en groupe est plus efficace et plus motivant. 
            Notre plateforme facilite la création et la gestion de petits groupes d'apprentissage collaboratif, 
            appelés "cartels", où chaque membre contribue à la réussite collective.
          </p>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => navigate("/login")}
          >
            Rejoignez-nous
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 Cartel. Tous droits réservés.</p>
        </div>
      </footer>

      {/* Fixed Demo Button */}
      <div className="fixed left-6 bottom-6 z-50">
        <Button 
          size="lg"
          className="bg-success hover:bg-success/90 text-success-foreground shadow-elegant"
          onClick={() => navigate("/login")}
        >
          Démo
        </Button>
      </div>
    </div>
  );
};

export default Landing;

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
      <nav className="fixed top-0 w-full bg-accent backdrop-blur-lg border-b border-border z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Kartel.io
          </h1>
          <div className="hidden md:flex gap-6">
            <button onClick={() => scrollToSection("qui")} className="hover:text-accent transition-colors">
              Qui Sommes nous ?
            </button>
            <button onClick={() => scrollToSection("pourquoi")} className="hover:text-accent transition-colors">
              Kartel : la meilleure façon d'apprendre ?
            </button>
            <button onClick={() => scrollToSection("tarifs")} className="hover:text-accent transition-colors">
              Tarifs
            </button>
            <button onClick={() => scrollToSection("temoignages")} className="hover:text-accent transition-colors">
              Témoignages
            </button>
            <button onClick={() => scrollToSection("resultats")} className="hover:text-accent transition-colors">
              Les Résultats sont là !
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
      <section className="relative pt-32 pb-12 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
            Apprenez plus vite et mieux{" "}
            <span className="text-black dark:text-white">en petits groupes!</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Etudiez en petits groupes motivés et bienveillants, entraidez-vous et atteignez plus rapidement et efficacement vos objectifs pédagogiques
          </p>

          {/* Video Preview */}
          <div className="mt-12 relative group">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-soft hover-lift">
              {!videoLoaded ? (
                <div 
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => setVideoLoaded(true)}
                >
                  <img 
                    src="https://img.youtube.com/vi/M4NIu4aXsJ0/hqdefault.jpg"
                    alt="Découvrez Kartel.io en vidéo"
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
                  title="Découvrez Kartel.io en vidéo"
                />
              )}
            </div>
          </div>

          {/* CTA Buttons below video */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-accent/30 hover:bg-accent/40 text-foreground border border-accent shadow-elegant text-lg px-8 py-6 h-auto"
              onClick={() => {
                // Demo request functionality
                alert("Demande de démo - À venir !");
              }}
            >
              Demandez une démo
            </Button>
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-elegant text-lg px-8 py-6 h-auto"
              onClick={() => navigate("/login")}
            >
              Lancez-vous maintenant ! <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Qui Sommes nous */}
      <section id="qui" className="py-12 px-6 bg-background/50 backdrop-blur">
        <div className="container mx-auto max-w-5xl">
          <h3 className="text-4xl font-bold text-center mb-12">Etudiez ensemble en petits groupes motivés</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-accent/5 hover-lift">
              <Users className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-bold mb-3">Collaboration</h4>
              <p className="text-muted-foreground">
                Des groupes de 3-5 apprenants qui travaillent ensemble sur une même plateforme collaborative pour atteindre leurs objectifs pédagogiques.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-success/5 hover-lift">
              <BookOpen className="w-12 h-12 text-success mb-4" />
              <h4 className="text-xl font-bold mb-3">Connaissances</h4>
              <p className="text-muted-foreground">
                Des apprenants qui nourrissent et partagent une base de connaissances IA et l'exploitent avec des outils pédagogiques innovants.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-accent/5 hover-lift">
              <Trophy className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-bold mb-3">Progression</h4>
              <p className="text-muted-foreground">
                Progressez ensemble, partagez, échangez, discutez, entraidez-vous. Atteignez vos objectifs en groupes !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi Kartel */}
      <section id="pourquoi" className="py-12 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <h3 className="text-4xl font-bold text-center mb-12">Kartel : la meilleure façon d'apprendre ?</h3>
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">🎯 Un apprentissage actif qui maintient l'engagement</h4>
              <p className="text-muted-foreground">
                RDV quotidiens en ligne, partage, échanges, messages de vos pairs, notes, échanges d'infos, de tips, de petits secrets d'apprentissages.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">🤝 Entraide active</h4>
              <p className="text-muted-foreground">
                Apprenez en équipe comme dans un véritable atelier collaboratif. Chaque membre du groupe apporte ses connaissances, ses questions et ses idées... L'objectif : comprendre, maîtriser et réussir ensemble.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">⚡ Outils intelligents communs pour progresser plus vite et mieux ensemble</h4>
              <p className="text-muted-foreground">
                Kartel met à votre disposition une véritable boîte à outils IA... 🧠 Quiz adaptatifs, 📝 QCM collaboratifs, 🃏 Flashcards automatiques, 🗺 Mindmaps dynamiques, 🎭 Jeux de rôle en visioconférence, 📊 Tableaux de progression partagés, 💬 Chat IA pédagogique, 🎯 Défis collectifs, 📚 Synthèses automatiques, 🔁 Fiches de révisions...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Les Résultats sont là */}
      <section id="resultats" className="py-12 px-6 bg-background/50 backdrop-blur">
        <div className="container mx-auto max-w-5xl text-center">
          <h3 className="text-4xl font-bold text-center mb-12">🚀 Les résultats sont là !</h3>
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">🎯 Des progrès visibles et mesurables</h4>
              <p className="text-muted-foreground">
                Grâce à la dynamique de groupe et aux outils IA de Kartel... +45% de taux de réussite observé dans les parcours en petits groupes.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">🤝 Une motivation retrouvée, durable et partagée</h4>
              <p className="text-muted-foreground">
                L'apprentissage en petits groupes crée un engagement réel... 9 utilisateurs sur 10 se sentent plus motivés à poursuivre leur formation avec Kartel qu'avec un LMS traditionnel.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">🧩 Des compétences maîtrisées et valorisées</h4>
              <p className="text-muted-foreground">
                Chaque groupe vise un objectif commun... Résultat : des apprenants plus compétents, autonomes et confiants dans leur avenir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="py-12 px-6 bg-background/50 backdrop-blur">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-4xl font-bold text-center mb-12">Tarifs</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border hover-lift">
              <h4 className="text-2xl font-bold mb-4">Gratuit</h4>
              <p className="text-4xl font-bold mb-6">0€<span className="text-lg text-muted-foreground">/mois</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>1 Compte perso</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>1 accès Kartel possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Base de connaissances (max 10Go)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>IA avancée</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>+4 outils pédagogiques (Flashcards, Quizz, QCM, Chat)</span>
                </li>
              </ul>
              <Button className="w-full bg-accent/30 hover:bg-accent/40 text-foreground border border-accent">Commencer</Button>
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
                  <span>1 Compte perso</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>2 accès Kartels</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Base de connaissances (max 20Go)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>IA avancée</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>8 outils pédagogiques</span>
                </li>
              </ul>
              <Button className="w-full bg-accent/30 hover:bg-accent/40 text-foreground border border-accent">
                Essayer Pro
              </Button>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border hover-lift">
              <h4 className="text-2xl font-bold mb-4">Sur Mesure</h4>
              <p className="text-4xl font-bold mb-6">Contactez-nous</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Comptes illimités possibles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Kartels illimités possibles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Fonctionnalités personnalisées</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Prix étudiés sur mesure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Support dédié 7/24h</span>
                </li>
              </ul>
              <Button className="w-full bg-accent/30 hover:bg-accent/40 text-foreground border border-accent">Nous contacter</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section id="temoignages" className="py-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <h3 className="text-4xl font-bold text-center mb-12">Témoignages</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Marie L.",
                role: "Étudiante",
                text: "Kartel m'a permis de progresser 2x plus vite grâce au soutien de mon groupe !",
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
                text: "J'ai enfin réussi ma certification grâce à l'entraide de mon kartel. Merci !",
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

          {/* CTA Buttons below testimonials */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-accent/30 hover:bg-accent/40 text-foreground border border-accent shadow-elegant text-lg px-8 py-6 h-auto"
              onClick={() => {
                alert("Demande de démo - À venir !");
              }}
            >
              Demandez une démo
            </Button>
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-elegant text-lg px-8 py-6 h-auto"
              onClick={() => navigate("/login")}
            >
              Lancez-vous maintenant ! <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* À propos */}
      <section id="apropos" className="py-12 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h3 className="text-4xl font-bold mb-6">À propos de Kartel</h3>
          <p className="text-lg text-muted-foreground mb-8">
            Kartel est né d'une conviction simple : on apprend mieux ensemble. Plutôt que d'affronter seul les difficultés de la formation en ligne, Kartel réunit de petits groupes d'apprenants motivés, appelés 'kartels', qui s'entraident pour atteindre leurs objectifs pédagogiques. Notre plateforme combine intelligence collective et intelligence artificielle pour créer des expériences d'apprentissage vivantes, interactives et profondément humaines. Chaque membre progresse à son rythme, soutient et est soutenu par les autres, partage ses ressources, échange ses idées, et bénéficie de la bienveillance mutuelle de tous. Kartel, c'est l'e-learning réinventé : humain, collaboratif et propulsé par l'IA.
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
          <p>© 2025 Kartel.io. Tous droits réservés.</p>
        </div>
      </footer>

      {/* Fixed Chatbot Button */}
      <div className="fixed right-6 bottom-6 z-50">
        <Button 
          size="lg"
          className="rounded-full w-16 h-16 bg-accent hover:bg-accent/90 text-accent-foreground shadow-elegant"
          onClick={() => {
            // Chatbot functionality placeholder
            alert("Chatbot à venir - Posez vos questions !");
          }}
        >
          💬
        </Button>
      </div>
    </div>
  );
};

export default Landing;

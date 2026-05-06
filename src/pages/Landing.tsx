import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Trophy, Star, Play } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ContactForm = () => {
  const { lang } = useParams<{ lang: string }>();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    mobile: "",
    email: "",
    commentaire: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = encodeURIComponent("Contact depuis AGORA");
    const body = encodeURIComponent(
      `Nom: ${formData.nom}\n` +
      `Prénom: ${formData.prenom}\n` +
      `Mobile: ${formData.mobile}\n` +
      `Email: ${formData.email}\n\n` +
      `Message:\n${formData.commentaire}`
    );
    
    window.location.href = `mailto:superteam@agoras.io?subject=${subject}&body=${body}`;
    
    setSubmitted(true);
    setFormData({
      nom: "",
      prenom: "",
      mobile: "",
      email: "",
      commentaire: ""
    });
    
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-4">
      {submitted && (
        <div className="text-center text-success font-semibold text-lg mb-4">
          {lang === 'fr' ? 'Merci pour votre message !' : 'Thank you for your message!'}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nom">{lang === 'fr' ? 'Nom' : 'Last Name'} *</Label>
            <Input
              id="nom"
              required
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prenom">{lang === 'fr' ? 'Prénom' : 'First Name'} *</Label>
            <Input
              id="prenom"
              required
              value={formData.prenom}
              onChange={(e) => setFormData({...formData, prenom: e.target.value})}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">{lang === 'fr' ? 'Mobile' : 'Mobile'} *</Label>
          <Input
            id="mobile"
            type="tel"
            required
            value={formData.mobile}
            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{lang === 'fr' ? 'Email' : 'Email'} *</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="commentaire">{lang === 'fr' ? 'Commentaire' : 'Comment'}</Label>
          <Textarea
            id="commentaire"
            rows={4}
            value={formData.commentaire}
            onChange={(e) => setFormData({...formData, commentaire: e.target.value})}
          />
        </div>
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {lang === 'fr' ? 'Envoyer' : 'Send'}
        </Button>
      </form>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
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
            AGORA
          </h1>
          <div className="hidden md:flex gap-6">
            <button onClick={() => scrollToSection("qui")} className="hover:text-accent transition-colors">
              {lang === 'fr' ? 'Qui sommes-nous' : 'Who We Are'}
            </button>
            <button onClick={() => scrollToSection("pourquoi")} className="hover:text-accent transition-colors">
              {lang === 'fr' ? 'Pourquoi AGORA' : 'Why AGORA'}
            </button>
            <button onClick={() => scrollToSection("tarifs")} className="hover:text-accent transition-colors">
              {lang === 'fr' ? 'Tarifs' : 'Pricing'}
            </button>
            <button onClick={() => scrollToSection("temoignages")} className="hover:text-accent transition-colors">
              {lang === 'fr' ? 'Témoignages' : 'Testimonials'}
            </button>
            <button onClick={() => scrollToSection("resultats")} className="hover:text-accent transition-colors">
              {lang === 'fr' ? 'Résultats' : 'Results'}
            </button>
            <button onClick={() => scrollToSection("apropos")} className="hover:text-accent transition-colors">
              {lang === 'fr' ? 'À propos' : 'About'}
            </button>
          </div>
          <div className="flex gap-2">
            <LanguageSwitcher />
            <Button onClick={() => navigate(`/${lang}/login`)} variant="outline">
              {lang === 'fr' ? 'Se connecter' : 'Sign In'}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
            {lang === 'fr' ? 'Réussir ensemble avec ' : 'Succeed together with '}
            <span className="text-black dark:text-white">AGORA</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            {lang === 'fr' ? 'La plateforme collaborative pour les groupes d\'apprentissage' : 'The collaborative platform for learning groups'}
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
                    alt={lang === 'fr' ? 'Vidéo de présentation AGORA' : 'AGORA presentation video'}
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
                  title={lang === 'fr' ? 'Vidéo de présentation AGORA' : 'AGORA presentation video'}
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
                alert(lang === 'fr' ? 'Contactez-nous à superteam@agoras.io pour une démo !' : 'Contact us at superteam@agoras.io for a demo!');
              }}
            >
              {lang === 'fr' ? 'Demander une démo' : 'Request a demo'}
            </Button>
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-elegant text-lg px-8 py-6 h-auto"
              onClick={() => navigate(`/${lang}/login`)}
            >
              {lang === 'fr' ? 'Commencer' : 'Get Started'} <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Qui Sommes nous */}
      <section id="qui" className="py-12 px-6 bg-background/50 backdrop-blur">
        <div className="container mx-auto max-w-5xl">
          <h3 className="text-4xl font-bold text-center mb-12">
            {lang === 'fr' ? 'Qui sommes-nous ?' : 'Who are we?'}
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-accent/5 hover-lift">
              <Users className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-bold mb-3">
                {lang === 'fr' ? 'Collaboration' : 'Collaboration'}
              </h4>
              <p className="text-muted-foreground">
                {lang === 'fr' 
                  ? 'Travaillez ensemble, partagez vos connaissances et progressez en groupe.' 
                  : 'Work together, share your knowledge and progress as a group.'}
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-success/5 hover-lift">
              <BookOpen className="w-12 h-12 text-success mb-4" />
              <h4 className="text-xl font-bold mb-3">
                {lang === 'fr' ? 'Base de connaissances' : 'Knowledge Base'}
              </h4>
              <p className="text-muted-foreground">
                {lang === 'fr' 
                  ? 'Centralisez tous vos documents et ressources pédagogiques.' 
                  : 'Centralize all your documents and educational resources.'}
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-accent/5 hover-lift">
              <Trophy className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-bold mb-3">
                {lang === 'fr' ? 'Suivi de progression' : 'Progress Tracking'}
              </h4>
              <p className="text-muted-foreground">
                {lang === 'fr' 
                  ? 'Suivez vos objectifs et célébrez vos réussites.' 
                  : 'Track your goals and celebrate your successes.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi AGORA */}
      <section id="pourquoi" className="py-12 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <h3 className="text-4xl font-bold text-center mb-12">
            {lang === 'fr' ? 'Pourquoi AGORA ?' : 'Why AGORA?'}
          </h3>
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">
                {lang === 'fr' ? 'Apprentissage collaboratif' : 'Collaborative Learning'}
              </h4>
              <p className="text-muted-foreground">
                {lang === 'fr' 
                  ? 'Apprenez plus vite et mieux en partageant vos connaissances avec vos pairs.' 
                  : 'Learn faster and better by sharing knowledge with your peers.'}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">
                {lang === 'fr' ? 'Outils intégrés' : 'Integrated Tools'}
              </h4>
              <p className="text-muted-foreground">
                {lang === 'fr' 
                  ? 'Tout ce dont vous avez besoin au même endroit : notes, calendrier, visio, etc.' 
                  : 'Everything you need in one place: notes, calendar, video, etc.'}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">
                {lang === 'fr' ? 'Intelligence artificielle' : 'Artificial Intelligence'}
              </h4>
              <p className="text-muted-foreground">
                {lang === 'fr' 
                  ? 'Profitez de l\'IA pour créer du contenu, résumer et vous aider dans votre apprentissage.' 
                  : 'Leverage AI to create content, summarize and help you learn.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Les Résultats sont là */}
      <section id="resultats" className="py-12 px-6 bg-background/50 backdrop-blur">
        <div className="container mx-auto max-w-5xl text-center">
          <h3 className="text-4xl font-bold text-center mb-12">
            {lang === 'fr' ? 'Les résultats sont là' : 'The results are here'}
          </h3>
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">
                {lang === 'fr' ? 'Taux de réussite élevé' : 'High Success Rate'}
              </h4>
              <p className="text-muted-foreground">
                {lang === 'fr' 
                  ? 'Nos utilisateurs affichent un taux de réussite supérieur de 30% à la moyenne.' 
                  : 'Our users show a 30% higher success rate than average.'}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">
                {lang === 'fr' ? 'Meilleure rétention' : 'Better Retention'}
              </h4>
              <p className="text-muted-foreground">
                {lang === 'fr' 
                  ? 'Les connaissances acquises en groupe sont mieux retenues sur le long terme.' 
                  : 'Knowledge acquired in groups is better retained over time.'}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">
                {lang === 'fr' ? 'Engagement accru' : 'Increased Engagement'}
              </h4>
              <p className="text-muted-foreground">
                {lang === 'fr' 
                  ? 'Les apprenants sont plus motivés et engagés dans leur formation.' 
                  : 'Learners are more motivated and engaged in their training.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="py-12 px-6 bg-background/50 backdrop-blur">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-4xl font-bold text-center mb-12">
            {lang === 'fr' ? 'Nos tarifs' : 'Our Pricing'}
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border hover-lift">
              <h4 className="text-2xl font-bold mb-4">
                {lang === 'fr' ? 'Gratuit' : 'Free'}
              </h4>
              <p className="text-4xl font-bold mb-6">
                0€<span className="text-lg text-muted-foreground">{lang === 'fr' ? '/mois' : '/month'}</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{lang === 'fr' ? '1 compte' : '1 account'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{lang === 'fr' ? '500 Mo de stockage' : '500 MB storage'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{lang === 'fr' ? 'IA limitée' : 'Limited AI'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{lang === 'fr' ? 'Outils de base' : 'Basic tools'}</span>
                </li>
              </ul>
              <Button className="w-full bg-accent/30 hover:bg-accent/40 text-foreground border border-accent">
                {lang === 'fr' ? 'Commencer gratuitement' : 'Start for free'}
              </Button>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border hover-lift relative">
              <div className="absolute top-4 right-4">
                <Star className="w-6 h-6 fill-accent text-accent" />
              </div>
              <h4 className="text-2xl font-bold mb-4">
                {lang === 'fr' ? 'Pro' : 'Pro'}
              </h4>
              <p className="text-4xl font-bold mb-6">
                19€<span className="text-lg text-muted-foreground">{lang === 'fr' ? '/mois' : '/month'}</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{lang === 'fr' ? '1 compte premium' : '1 premium account'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{lang === 'fr' ? '5 AGORA' : '5 AGORA'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{lang === 'fr' ? '10 Go de stockage' : '10 GB storage'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{lang === 'fr' ? 'IA illimitée' : 'Unlimited AI'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{lang === 'fr' ? 'Tous les outils' : 'All tools'}</span>
                </li>
              </ul>
              <Button className="w-full bg-accent/30 hover:bg-accent/40 text-foreground border border-accent">
                {lang === 'fr' ? 'Passer à Pro' : 'Upgrade to Pro'}
              </Button>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border hover-lift">
              <h4 className="text-2xl font-bold mb-4">
                {lang === 'fr' ? 'Équipe' : 'Team'}
              </h4>
              <p className="text-4xl font-bold mb-6">
                {lang === 'fr' ? 'Sur mesure' : 'Custom'}
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{lang === 'fr' ? 'Comptes illimités' : 'Unlimited accounts'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{lang === 'fr' ? 'Gestion multi-AGORA' : 'Multi-AGORA management'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{lang === 'fr' ? 'Entreprises' : 'Corporate'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{lang === 'fr' ? 'Écoles de commerce' : 'Business Schools'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{lang === 'fr' ? 'Universités' : 'Universities'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{lang === 'fr' ? 'Formateur dédié' : 'Dedicated trainer'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{lang === 'fr' ? 'Support prioritaire' : 'Priority support'}</span>
                </li>
              </ul>
              <Button className="w-full bg-accent/30 hover:bg-accent/40 text-foreground border border-accent">
                {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section id="temoignages" className="py-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <h3 className="text-4xl font-bold text-center mb-12">
            {lang === 'fr' ? 'Témoignages' : 'Testimonials'}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: lang === 'fr' ? 'Marie Dupont' : 'Marie Dupont',
                role: lang === 'fr' ? 'Étudiante en Master' : 'Master Student',
                text: lang === 'fr' 
                  ? 'AGORA a révolutionné ma façon d\'apprendre. Je ne peux plus m\'en passer !' 
                  : 'AGORA revolutionized the way I learn. I can\'t live without it anymore!',
                rating: 5
              },
              {
                name: lang === 'fr' ? 'Thomas Martin' : 'Thomas Martin',
                role: lang === 'fr' ? 'Coordinateur pédagogique' : 'Educational Coordinator',
                text: lang === 'fr' 
                  ? 'Un outil indispensable pour gérer nos groupes d\'apprentissage efficacement.' 
                  : 'An essential tool for managing our learning groups effectively.',
                rating: 5
              },
              {
                name: lang === 'fr' ? 'Sophie Bernard' : 'Sophie Bernard',
                role: lang === 'fr' ? 'Formatrice professionnelle' : 'Professional Trainer',
                text: lang === 'fr' 
                  ? 'Mes apprenants sont plus engagés et obtiennent de meilleurs résultats.' 
                  : 'My learners are more engaged and achieve better results.',
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
                alert(lang === 'fr' ? 'Contactez-nous à superteam@agoras.io pour une démo !' : 'Contact us at superteam@agoras.io for a demo!');
              }}
            >
              {lang === 'fr' ? 'Demander une démo' : 'Request a demo'}
            </Button>
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-elegant text-lg px-8 py-6 h-auto"
              onClick={() => navigate(`/${lang}/login`)}
            >
              {lang === 'fr' ? 'Commencer' : 'Get Started'} <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* À propos */}
      <section id="apropos" className="py-12 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h3 className="text-4xl font-bold mb-6">
            {lang === 'fr' ? 'À propos de AGORA' : 'About AGORA'}
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            {lang === 'fr' 
              ? 'AGORA est né de la conviction que l\'apprentissage en groupe est plus efficace et plus motivant. Notre mission est de fournir les meilleurs outils pour faciliter la collaboration et la réussite collective.' 
              : 'AGORA was born from the belief that group learning is more effective and motivating. Our mission is to provide the best tools to facilitate collaboration and collective success.'}
          </p>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => navigate(`/${lang}/login`)}
          >
            {lang === 'fr' ? 'Rejoignez-nous' : 'Join us'}
          </Button>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 px-6 border-t border-border">
        <div className="container mx-auto max-w-2xl">
          <h3 className="text-2xl font-bold text-center mb-8">
            {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
          </h3>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Fixed Chatbot Button */}
      <div className="fixed right-6 bottom-6 z-50">
        <Button 
          size="lg"
          className="rounded-full w-16 h-16 bg-accent hover:bg-accent/90 text-accent-foreground shadow-elegant"
          onClick={() => {
            alert(lang === 'fr' ? 'Contactez-nous à superteam@agoras.io !' : 'Contact us at superteam@agoras.io!');
          }}
        >
          💬
        </Button>
      </div>
    </div>
  );
};

export default Landing;

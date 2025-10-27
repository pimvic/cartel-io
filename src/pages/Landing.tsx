import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Trophy, Star, Play } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ContactForm = () => {
  const { t } = useTranslation();
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
    
    // Create mailto link with form data
    const subject = encodeURIComponent("Contact depuis Kartels.io");
    const body = encodeURIComponent(
      `Nom: ${formData.nom}\n` +
      `Prénom: ${formData.prenom}\n` +
      `Mobile: ${formData.mobile}\n` +
      `Email: ${formData.email}\n\n` +
      `Message:\n${formData.commentaire}`
    );
    
    window.location.href = `mailto:superteam@kartels.io?subject=${subject}&body=${body}`;
    
    // Show confirmation and clear form
    setSubmitted(true);
    setFormData({
      nom: "",
      prenom: "",
      mobile: "",
      email: "",
      commentaire: ""
    });
    
    // Reset submitted state after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-4">
      {submitted && (
        <div className="text-center text-success font-semibold text-lg mb-4">
          {t('home.contact.form.success')}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nom">{t('home.contact.form.lastName')} *</Label>
            <Input
              id="nom"
              required
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prenom">{t('home.contact.form.firstName')} *</Label>
            <Input
              id="prenom"
              required
              value={formData.prenom}
              onChange={(e) => setFormData({...formData, prenom: e.target.value})}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">{t('home.contact.form.mobile')} *</Label>
          <Input
            id="mobile"
            type="tel"
            required
            value={formData.mobile}
            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('home.contact.form.email')} *</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="commentaire">{t('home.contact.form.comment')}</Label>
          <Textarea
            id="commentaire"
            rows={4}
            value={formData.commentaire}
            onChange={(e) => setFormData({...formData, commentaire: e.target.value})}
          />
        </div>
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {t('home.contact.form.send')}
        </Button>
      </form>
    </div>
  );
};

const Landing = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (lang && (lang === 'en' || lang === 'fr')) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

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
            Kartels.io
          </h1>
          <div className="hidden md:flex gap-6">
            <button onClick={() => scrollToSection("qui")} className="hover:text-accent transition-colors">
              {t('nav.whoWeAre')}
            </button>
            <button onClick={() => scrollToSection("pourquoi")} className="hover:text-accent transition-colors">
              {t('nav.whyKartel')}
            </button>
            <button onClick={() => scrollToSection("tarifs")} className="hover:text-accent transition-colors">
              {t('nav.pricing')}
            </button>
            <button onClick={() => scrollToSection("temoignages")} className="hover:text-accent transition-colors">
              {t('nav.testimonials')}
            </button>
            <button onClick={() => scrollToSection("resultats")} className="hover:text-accent transition-colors">
              {t('nav.results')}
            </button>
            <button onClick={() => scrollToSection("apropos")} className="hover:text-accent transition-colors">
              {t('nav.about')}
            </button>
          </div>
          <div className="flex gap-2">
            <LanguageSwitcher />
            <Button onClick={() => navigate(`/${lang}/login`)} variant="outline">
              {t('login.signIn')}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
            {t('home.hero.title')}{" "}
            <span className="text-black dark:text-white">{t('home.hero.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            {t('home.hero.subtitle')}
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
                    alt={t('home.hero.videoAlt')}
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
                  title={t('home.hero.videoAlt')}
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
                alert(t('home.chatbot.alert'));
              }}
            >
              {t('home.hero.demoRequest')}
            </Button>
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-elegant text-lg px-8 py-6 h-auto"
              onClick={() => navigate(`/${lang}/login`)}
            >
              {t('home.hero.cta')} <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Qui Sommes nous */}
      <section id="qui" className="py-12 px-6 bg-background/50 backdrop-blur">
        <div className="container mx-auto max-w-5xl">
          <h3 className="text-4xl font-bold text-center mb-12">{t('home.whoWeAre.title')}</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-accent/5 hover-lift">
              <Users className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-bold mb-3">{t('home.whoWeAre.collaboration.title')}</h4>
              <p className="text-muted-foreground">
                {t('home.whoWeAre.collaboration.description')}
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-success/5 hover-lift">
              <BookOpen className="w-12 h-12 text-success mb-4" />
              <h4 className="text-xl font-bold mb-3">{t('home.whoWeAre.knowledge.title')}</h4>
              <p className="text-muted-foreground">
                {t('home.whoWeAre.knowledge.description')}
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-accent/5 hover-lift">
              <Trophy className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-bold mb-3">{t('home.whoWeAre.progress.title')}</h4>
              <p className="text-muted-foreground">
                {t('home.whoWeAre.progress.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi Kartel */}
      <section id="pourquoi" className="py-12 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <h3 className="text-4xl font-bold text-center mb-12">{t('home.whyKartel.title')}</h3>
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">{t('home.whyKartel.point1.title')}</h4>
              <p className="text-muted-foreground">
                {t('home.whyKartel.point1.description')}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">{t('home.whyKartel.point2.title')}</h4>
              <p className="text-muted-foreground">
                {t('home.whyKartel.point2.description')}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">{t('home.whyKartel.point3.title')}</h4>
              <p className="text-muted-foreground">
                {t('home.whyKartel.point3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Les Résultats sont là */}
      <section id="resultats" className="py-12 px-6 bg-background/50 backdrop-blur">
        <div className="container mx-auto max-w-5xl text-center">
          <h3 className="text-4xl font-bold text-center mb-12">{t('home.results.title')}</h3>
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">{t('home.results.point1.title')}</h4>
              <p className="text-muted-foreground">
                {t('home.results.point1.description')}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">{t('home.results.point2.title')}</h4>
              <p className="text-muted-foreground">
                {t('home.results.point2.description')}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border hover-lift">
              <h4 className="text-xl font-bold mb-2">{t('home.results.point3.title')}</h4>
              <p className="text-muted-foreground">
                {t('home.results.point3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="py-12 px-6 bg-background/50 backdrop-blur">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-4xl font-bold text-center mb-12">{t('home.pricing.title')}</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border hover-lift">
              <h4 className="text-2xl font-bold mb-4">{t('home.pricing.free.title')}</h4>
              <p className="text-4xl font-bold mb-6">{t('home.pricing.free.price')}<span className="text-lg text-muted-foreground">{t('home.pricing.free.perMonth')}</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{t('home.pricing.free.features.account')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{t('home.pricing.free.features.storage')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{t('home.pricing.free.features.ai')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{t('home.pricing.free.features.tools')}</span>
                </li>
              </ul>
              <Button className="w-full bg-accent/30 hover:bg-accent/40 text-foreground border border-accent">{t('home.pricing.free.cta')}</Button>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border hover-lift relative">
              <div className="absolute top-4 right-4">
                <Star className="w-6 h-6 fill-accent text-accent" />
              </div>
              <h4 className="text-2xl font-bold mb-4">{t('home.pricing.pro.title')}</h4>
              <p className="text-4xl font-bold mb-6">{t('home.pricing.pro.price')}<span className="text-lg text-muted-foreground">{t('home.pricing.pro.perMonth')}</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{t('home.pricing.pro.features.account')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{t('home.pricing.pro.features.kartels')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{t('home.pricing.pro.features.storage')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{t('home.pricing.pro.features.ai')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{t('home.pricing.pro.features.tools')}</span>
                </li>
              </ul>
              <Button className="w-full bg-accent/30 hover:bg-accent/40 text-foreground border border-accent">
                {t('home.pricing.pro.cta')}
              </Button>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border hover-lift">
              <h4 className="text-2xl font-bold mb-4">{t('home.pricing.team.title')}</h4>
              <p className="text-4xl font-bold mb-6">{t('home.pricing.team.price')}</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{t('home.pricing.team.features.unlimitedAccounts')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{t('home.pricing.team.features.multiManagement')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{t('home.pricing.team.features.corporate')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{t('home.pricing.team.features.businessSchools')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{t('home.pricing.team.features.universities')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{t('home.pricing.team.features.dedicatedTrainer')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>{t('home.pricing.team.features.support')}</span>
                </li>
              </ul>
              <Button className="w-full bg-accent/30 hover:bg-accent/40 text-foreground border border-accent">{t('home.pricing.team.cta')}</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section id="temoignages" className="py-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <h3 className="text-4xl font-bold text-center mb-12">{t('home.testimonials.title')}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: t('home.testimonials.testimonial1.author'),
                role: t('home.testimonials.testimonial1.role'),
                text: t('home.testimonials.testimonial1.text'),
                rating: 5
              },
              {
                name: t('home.testimonials.testimonial2.author'),
                role: t('home.testimonials.testimonial2.role'),
                text: t('home.testimonials.testimonial2.text'),
                rating: 5
              },
              {
                name: t('home.testimonials.testimonial3.author'),
                role: t('home.testimonials.testimonial3.role'),
                text: t('home.testimonials.testimonial3.text'),
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
                alert(t('home.chatbot.alert'));
              }}
            >
              {t('home.hero.demoRequest')}
            </Button>
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-elegant text-lg px-8 py-6 h-auto"
              onClick={() => navigate(`/${lang}/login`)}
            >
              {t('home.hero.cta')} <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* À propos */}
      <section id="apropos" className="py-12 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h3 className="text-4xl font-bold mb-6">{t('home.about.title')}</h3>
          <p className="text-lg text-muted-foreground mb-8">
            {t('home.about.description')}
          </p>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => navigate(`/${lang}/login`)}
          >
            {t('home.about.cta')}
          </Button>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 px-6 border-t border-border">
        <div className="container mx-auto max-w-2xl">
          <h3 className="text-2xl font-bold text-center mb-8">{t('home.contactSection.title')}</h3>
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
            alert(t('home.chatbot.alert'));
          }}
        >
          💬
        </Button>
      </div>
    </div>
  );
};

export default Landing;

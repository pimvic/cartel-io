import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Star, 
  Lightbulb, 
  Bell, 
  BellOff,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TipCardProps {
  tipId: string;
  title: string;
  text: string;
  isFavorite: boolean;
  isSpotlight?: boolean;
  onToggleFavorite: () => void;
  onToggleReminder: () => void;
  hasReminder: boolean;
}

const TipCard = ({ 
  tipId, 
  title, 
  text, 
  isFavorite, 
  isSpotlight = false,
  onToggleFavorite,
  onToggleReminder,
  hasReminder
}: TipCardProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(isSpotlight);

  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      isSpotlight && "border-primary bg-primary/5"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {isSpotlight && (
                <Badge variant="default" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  {t('dashboard.kartelSpirit.spotlightBadge')}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              {title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFavorite}
              className={cn(
                "h-8 w-8 p-0",
                isFavorite && "text-red-500 hover:text-red-600"
              )}
            >
              <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleReminder}
              className={cn(
                "h-8 w-8 p-0",
                hasReminder && "text-primary"
              )}
            >
              {hasReminder ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{text}</p>
        </CardContent>
      )}
    </Card>
  );
};

export const Rules = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [reminders, setReminders] = useState<Set<string>>(new Set());
  const [spotlightTip, setSpotlightTip] = useState<string>("tip1");
  const [userRole, setUserRole] = useState<string>("member");

  // Load preferences from localStorage
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const storedFavorites = localStorage.getItem("kartel_spirit_favorites");
        const storedReminders = localStorage.getItem("kartel_spirit_reminders");
        const storedSpotlight = localStorage.getItem("kartel_spirit_spotlight");

        if (storedFavorites) {
          setFavorites(new Set(JSON.parse(storedFavorites)));
        }
        if (storedReminders) {
          setReminders(new Set(JSON.parse(storedReminders)));
        }
        if (storedSpotlight) {
          setSpotlightTip(storedSpotlight);
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };

    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userData } = await supabase
            .from("users")
            .select("id")
            .eq("auth_user_id", user.id)
            .single();

          if (userData) {
            const { data: membershipData } = await supabase
              .from("memberships")
              .select("role")
              .eq("user_id", userData.id)
              .maybeSingle();

            if (membershipData) {
              setUserRole(membershipData.role);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    loadPreferences();
    fetchUserRole();
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: Set<string>) => {
    localStorage.setItem("kartel_spirit_favorites", JSON.stringify([...newFavorites]));
    setFavorites(newFavorites);
  };

  // Save reminders to localStorage
  const saveReminders = (newReminders: Set<string>) => {
    localStorage.setItem("kartel_spirit_reminders", JSON.stringify([...newReminders]));
    setReminders(newReminders);
  };

  const toggleFavorite = (tipId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(tipId)) {
      newFavorites.delete(tipId);
      toast({
        title: t('dashboard.kartelSpirit.removedFromFavorites'),
        description: t('dashboard.kartelSpirit.removedFromFavoritesDesc'),
      });
    } else {
      newFavorites.add(tipId);
      toast({
        title: t('dashboard.kartelSpirit.addedToFavorites'),
        description: t('dashboard.kartelSpirit.addedToFavoritesDesc'),
      });
    }
    saveFavorites(newFavorites);
  };

  const toggleReminder = (tipId: string) => {
    const newReminders = new Set(reminders);
    if (newReminders.has(tipId)) {
      newReminders.delete(tipId);
      toast({
        title: t('dashboard.kartelSpirit.reminderRemoved'),
        description: t('dashboard.kartelSpirit.reminderRemovedDesc'),
      });
    } else {
      newReminders.add(tipId);
      toast({
        title: t('dashboard.kartelSpirit.reminderSet'),
        description: t('dashboard.kartelSpirit.reminderSetDesc'),
      });
    }
    saveReminders(newReminders);
  };

  const setNewSpotlight = (tipId: string) => {
    localStorage.setItem("kartel_spirit_spotlight", tipId);
    setSpotlightTip(tipId);
    toast({
      title: t('dashboard.kartelSpirit.spotlightUpdated'),
      description: t('dashboard.kartelSpirit.spotlightUpdatedDesc'),
    });
  };

  const tips = [
    { id: "tip1", title: t('dashboard.kartelSpirit.tips.tip1.title'), text: t('dashboard.kartelSpirit.tips.tip1.text') },
    { id: "tip2", title: t('dashboard.kartelSpirit.tips.tip2.title'), text: t('dashboard.kartelSpirit.tips.tip2.text') },
    { id: "tip3", title: t('dashboard.kartelSpirit.tips.tip3.title'), text: t('dashboard.kartelSpirit.tips.tip3.text') },
    { id: "tip4", title: t('dashboard.kartelSpirit.tips.tip4.title'), text: t('dashboard.kartelSpirit.tips.tip4.text') },
    { id: "tip5", title: t('dashboard.kartelSpirit.tips.tip5.title'), text: t('dashboard.kartelSpirit.tips.tip5.text') },
    { id: "tip6", title: t('dashboard.kartelSpirit.tips.tip6.title'), text: t('dashboard.kartelSpirit.tips.tip6.text') },
    { id: "tip7", title: t('dashboard.kartelSpirit.tips.tip7.title'), text: t('dashboard.kartelSpirit.tips.tip7.text') },
    { id: "tip8", title: t('dashboard.kartelSpirit.tips.tip8.title'), text: t('dashboard.kartelSpirit.tips.tip8.text') },
    { id: "tip9", title: t('dashboard.kartelSpirit.tips.tip9.title'), text: t('dashboard.kartelSpirit.tips.tip9.text') },
    { id: "tip10", title: t('dashboard.kartelSpirit.tips.tip10.title'), text: t('dashboard.kartelSpirit.tips.tip10.text') },
  ];

  // Render spotlight tip first if user is coordinator
  const isCoordinator = userRole === "coordinator";
  const spotlightTipData = tips.find(tip => tip.id === spotlightTip);
  const otherTips = tips.filter(tip => tip.id !== spotlightTip);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{t('dashboard.kartelSpirit.title')}</h1>
        <p className="text-muted-foreground text-lg">
          {t('dashboard.kartelSpirit.subtitle')}
        </p>
      </div>

      {/* Intro */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            {t('dashboard.kartelSpirit.intro.p1')}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t('dashboard.kartelSpirit.intro.p2')}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t('dashboard.kartelSpirit.intro.p3')}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t('dashboard.kartelSpirit.intro.p4')}
          </p>
        </CardContent>
      </Card>

      {/* Spotlight Tip (for coordinators) */}
      {isCoordinator && spotlightTipData && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">{t('dashboard.kartelSpirit.tipOfWeek')}</h2>
          </div>
          <TipCard
            tipId={spotlightTipData.id}
            title={spotlightTipData.title}
            text={spotlightTipData.text}
            isFavorite={favorites.has(spotlightTipData.id)}
            isSpotlight={true}
            onToggleFavorite={() => toggleFavorite(spotlightTipData.id)}
            onToggleReminder={() => toggleReminder(spotlightTipData.id)}
            hasReminder={reminders.has(spotlightTipData.id)}
          />
        </div>
      )}

      {/* Tips Section */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">{t('dashboard.kartelSpirit.tips.title')}</h2>
        <div className="space-y-3">
          {otherTips.map((tip) => (
            <TipCard
              key={tip.id}
              tipId={tip.id}
              title={tip.title}
              text={tip.text}
              isFavorite={favorites.has(tip.id)}
              onToggleFavorite={() => toggleFavorite(tip.id)}
              onToggleReminder={() => toggleReminder(tip.id)}
              hasReminder={reminders.has(tip.id)}
            />
          ))}
        </div>
      </div>

      {/* Rules Section */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-2xl font-bold mb-4">{t('dashboard.kartelSpirit.rules.title')}</h3>
          <ol className="space-y-3 list-decimal list-inside">
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule1.title')}</span> {t('dashboard.kartelSpirit.rules.rule1.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule2.title')}</span> {t('dashboard.kartelSpirit.rules.rule2.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule3.title')}</span> {t('dashboard.kartelSpirit.rules.rule3.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule4.title')}</span> {t('dashboard.kartelSpirit.rules.rule4.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule5.title')}</span> {t('dashboard.kartelSpirit.rules.rule5.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule6.title')}</span> {t('dashboard.kartelSpirit.rules.rule6.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule7.title')}</span> {t('dashboard.kartelSpirit.rules.rule7.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule8.title')}</span> {t('dashboard.kartelSpirit.rules.rule8.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule9.title')}</span> {t('dashboard.kartelSpirit.rules.rule9.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule10.title')}</span> {t('dashboard.kartelSpirit.rules.rule10.text')}
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-2xl font-bold mb-4">{t('dashboard.kartelSpirit.summary.title')}</h3>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t('dashboard.kartelSpirit.summary.intro')}
          </p>
          <ul className="space-y-2 ml-4">
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.summary.clarity.title')}</span> {t('dashboard.kartelSpirit.summary.clarity.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.summary.warmth.title')}</span> {t('dashboard.kartelSpirit.summary.warmth.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.summary.discipline.title')}</span> {t('dashboard.kartelSpirit.summary.discipline.text')}
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            {t('dashboard.kartelSpirit.summary.closing')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

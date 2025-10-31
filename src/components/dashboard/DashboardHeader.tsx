import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { UserMenu } from "@/components/UserMenu";

const members = [
  {
    id: "1",
    name: "Jean-Stéphane B.",
    avatar: "https://i.pravatar.cc/150?img=12",
    isCoordinator: true,
  },
  {
    id: "2",
    name: "Thierry F.",
    avatar: "https://i.pravatar.cc/150?img=13",
    isCoordinator: false,
  },
  {
    id: "3",
    name: "Isabelle L.",
    avatar: "https://i.pravatar.cc/150?img=45",
    isCoordinator: false,
  },
  {
    id: "4",
    name: "Elsa B.",
    avatar: "https://i.pravatar.cc/150?img=47",
    isCoordinator: false,
  },
];

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lang } = useParams();

  return (
    <header className="fixed top-0 w-full h-16 bg-accent/30 backdrop-blur-sm border-b border-border z-50">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h1 
              className="text-xl font-bold text-black dark:text-white cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate(`/${lang || 'fr'}`)}
            >
              {t('dashboard.header.title')}
            </h1>
            <p className="text-xs text-muted-foreground text-center">27 octobre 2025</p>
          </div>
          <div className="ml-6">
            <p className="font-bold text-lg">{t('dashboard.header.course')}</p>
            <p className="text-sm text-muted-foreground">Diplôme donnant lieu à un Titre Professionnel d'État</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="flex items-center gap-2">
            {members.map((member) => (
              <div key={member.id} className="relative group">
                <Avatar className="w-12 h-12 border-2 border-background hover:border-accent transition-colors cursor-pointer">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {member.isCoordinator && (
                  <Star className="w-3 h-3 fill-accent text-accent absolute -top-1 -right-1" />
                )}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                  {member.name}
                  {member.isCoordinator && ` (${t('dashboard.header.coordinator')})`}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground whitespace-nowrap">{t('dashboard.header.deadline')}</p>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

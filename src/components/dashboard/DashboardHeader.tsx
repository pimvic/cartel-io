import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Star, User, Settings, LogOut } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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
  const currentUser = members[0]; // Jean-Stéphane B.

  const handleLogout = () => {
    navigate(`/${lang || 'fr'}`);
  };

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
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">
                  {currentUser.isCoordinator ? t('dashboard.header.coordinator') : t('dashboard.header.members')}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>{t('dashboard.profile.profile')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('dashboard.profile.settings')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('dashboard.profile.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

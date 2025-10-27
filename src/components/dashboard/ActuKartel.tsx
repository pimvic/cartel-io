import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, FileText, Calendar as CalendarIcon, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ActuKartel = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">{t('dashboard.actuKartel.subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Latest Messages */}
        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              <span>{t('dashboard.actuKartel.latestMessages.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium">{t('dashboard.actuKartel.latestMessages.message1.author')}</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.actuKartel.latestMessages.message1.text')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('dashboard.actuKartel.latestMessages.message1.time')}</p>
              </div>
              <div className="p-3 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium">{t('dashboard.actuKartel.latestMessages.message2.author')}</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.actuKartel.latestMessages.message2.text')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('dashboard.actuKartel.latestMessages.message2.time')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-accent" />
              <span>{t('dashboard.actuKartel.upcomingEvents.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium">{t('dashboard.actuKartel.upcomingEvents.event1.name')}</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.actuKartel.upcomingEvents.event1.time')}</p>
              </div>
              <div className="p-3 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium">{t('dashboard.actuKartel.upcomingEvents.event2.name')}</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.actuKartel.upcomingEvents.event2.time')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-accent" />
              <span>{t('dashboard.actuKartel.recentDocuments.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium">{t('dashboard.actuKartel.recentDocuments.doc1.name')}</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.actuKartel.recentDocuments.doc1.addedBy')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('dashboard.actuKartel.recentDocuments.doc1.time')}</p>
              </div>
              <div className="p-3 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium">{t('dashboard.actuKartel.recentDocuments.doc2.name')}</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.actuKartel.recentDocuments.doc2.addedBy')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('dashboard.actuKartel.recentDocuments.doc2.time')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notes */}
        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              <span>{t('dashboard.actuKartel.recentNotes.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium">{t('dashboard.actuKartel.recentNotes.note1.name')}</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.actuKartel.recentNotes.note1.author')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('dashboard.actuKartel.recentNotes.note1.time')}</p>
              </div>
              <div className="p-3 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium">{t('dashboard.actuKartel.recentNotes.note2.name')}</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.actuKartel.recentNotes.note2.author')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('dashboard.actuKartel.recentNotes.note2.time')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

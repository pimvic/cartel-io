import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Newspaper, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

export const MessagerieNewsEvents = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">{t('dashboard.messagerie.subtitle')}</p>
      </div>

      <Tabs defaultValue="messagerie" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messagerie" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            {t('dashboard.messagerie.tabs.messages')}
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            {t('dashboard.messagerie.tabs.news')}
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {t('dashboard.messagerie.tabs.events')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messagerie" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.messagerie.groupChat.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-96 bg-muted/30 rounded-lg p-4 overflow-y-auto space-y-3">
                  <div className="bg-background p-3 rounded-lg">
                    <p className="text-sm font-medium">{t('dashboard.messagerie.groupChat.message1.author')}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t('dashboard.messagerie.groupChat.message1.text')}</p>
                    <p className="text-xs text-muted-foreground mt-2">{t('dashboard.messagerie.groupChat.message1.time')}</p>
                  </div>
                  <div className="bg-background p-3 rounded-lg ml-8">
                    <p className="text-sm font-medium">{t('dashboard.messagerie.groupChat.message2.author')}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t('dashboard.messagerie.groupChat.message2.text')}</p>
                    <p className="text-xs text-muted-foreground mt-2">{t('dashboard.messagerie.groupChat.message2.time')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input placeholder={t('dashboard.messagerie.groupChat.inputPlaceholder')} />
                  <Button>{t('dashboard.messagerie.groupChat.sendButton')}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="mt-6">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t('dashboard.messagerie.news.title')}</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">{t('dashboard.messagerie.news.archive')}</Button>
              <Button size="sm">{t('dashboard.messagerie.news.create')}</Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.messagerie.news.recentNews')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium">{t('dashboard.messagerie.news.news1.title')}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('dashboard.messagerie.news.news1.text')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">{t('dashboard.messagerie.news.news1.time')}</p>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium">{t('dashboard.messagerie.news.news2.title')}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('dashboard.messagerie.news.news2.text')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">{t('dashboard.messagerie.news.news2.time')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t('dashboard.messagerie.events.title')}</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">{t('dashboard.messagerie.events.archive')}</Button>
              <Button size="sm">{t('dashboard.messagerie.events.create')}</Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.messagerie.events.upcoming')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium">{t('dashboard.messagerie.events.event1.title')}</p>
                  <p className="text-sm text-muted-foreground mt-2">{t('dashboard.messagerie.events.event1.description')}</p>
                  <p className="text-xs text-muted-foreground mt-2">{t('dashboard.messagerie.events.event1.time')}</p>
                  <Button size="sm" className="mt-3">{t('dashboard.messagerie.events.event1.join')}</Button>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium">{t('dashboard.messagerie.events.event2.title')}</p>
                  <p className="text-sm text-muted-foreground mt-2">{t('dashboard.messagerie.events.event2.description')}</p>
                  <p className="text-xs text-muted-foreground mt-2">{t('dashboard.messagerie.events.event2.time')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

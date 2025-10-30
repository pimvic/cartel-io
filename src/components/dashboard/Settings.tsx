import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const Settings = () => {
  const { t } = useTranslation();
  const [kartelName, setKartelName] = useState(t('dashboard.settings.kartelInfo.kartelNameValue'));
  const [coordinator, setCoordinator] = useState(t('dashboard.settings.kartelInfo.coordinatorValue'));
  const [deadline, setDeadline] = useState("2026-04-15");

  const handleSave = () => {
    toast.success(t('dashboard.settings.kartelInfo.saveButton'));
  };

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">{t('dashboard.settings.subtitle')}</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">{t('dashboard.settings.tabs.general')}</TabsTrigger>
          <TabsTrigger value="members">{t('dashboard.settings.tabs.members')}</TabsTrigger>
          <TabsTrigger value="display">{t('dashboard.settings.tabs.display')}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.settings.kartelInfo.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kartel-name">{t('dashboard.settings.kartelInfo.kartelName')}</Label>
                <Input
                  id="kartel-name"
                  value={kartelName}
                  onChange={(e) => setKartelName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coordinator">{t('dashboard.settings.kartelInfo.coordinator')}</Label>
                <Input
                  id="coordinator"
                  value={coordinator}
                  onChange={(e) => setCoordinator(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">{t('dashboard.settings.kartelInfo.deadline')}</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              <Button onClick={handleSave}>{t('dashboard.settings.kartelInfo.saveButton')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.settings.tabs.members')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('dashboard.settings.comingSoon')}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.settings.tabs.display')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('dashboard.settings.comingSoon')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

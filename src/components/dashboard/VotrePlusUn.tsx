import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RequestForm } from "./plusone/RequestForm";
import { RequestList } from "./plusone/RequestList";
import { RequestThread } from "./plusone/RequestThread";
import { FeedList } from "./plusone/FeedList";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ChevronRight, Plus } from "lucide-react";

export const VotrePlusUn = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [cartelId, setCartelId] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Get user ID from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (userError) throw userError;
      setCurrentUserId(userData.id);

      // Get user's cartel and role
      const { data: membership, error: membershipError } = await supabase
        .from('memberships')
        .select('cartel_id, role')
        .eq('user_id', userData.id)
        .single();

      if (membershipError) throw membershipError;

      setCartelId(membership.cartel_id);
      setIsCoordinator(membership.role === 'coordinator');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  if (!cartelId || !currentUserId) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (selectedRequestId) {
    return (
      <RequestThread
        requestId={selectedRequestId}
        userId={currentUserId}
        isCoordinator={isCoordinator}
        onBack={() => setSelectedRequestId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">{t('dashboard.menu.dashboard')}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{t('dashboard.menu.plusOne')}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('plusOne.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('plusOne.subtitle')}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">{t('plusOne.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="requests">{t('plusOne.tabs.requests')}</TabsTrigger>
          <TabsTrigger value="new-request">{t('plusOne.tabs.newRequest')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('plusOne.about.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{t('plusOne.about.whoTitle')}</h4>
                  <p className="text-sm text-muted-foreground">{t('plusOne.about.whoContent')}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('plusOne.about.roleTitle')}</h4>
                  <p className="text-sm text-muted-foreground">{t('plusOne.about.roleContent')}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('plusOne.about.whenTitle')}</h4>
                  <p className="text-sm text-muted-foreground">{t('plusOne.about.whenContent')}</p>
                </div>
              </CardContent>
            </Card>

            <FeedList cartelId={cartelId} />
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <RequestList
            cartelId={cartelId}
            userId={currentUserId}
            isCoordinator={isCoordinator}
            onSelectRequest={setSelectedRequestId}
          />
        </TabsContent>

        <TabsContent value="new-request">
          <RequestForm
            cartelId={cartelId}
            userId={currentUserId}
            onSuccess={() => setShowRequestForm(false)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
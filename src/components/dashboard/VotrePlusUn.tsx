import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const { lang } = useParams<{ lang: string }>();
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
        <p className="text-muted-foreground">{lang === 'fr' ? 'Chargement...' : 'Loading...'}</p>
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
            <BreadcrumbLink href="#">{lang === 'fr' ? 'Tableau de bord' : 'Dashboard'}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{lang === 'fr' ? 'Votre +1' : 'Your +1'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{lang === 'fr' ? 'Votre +1' : 'Your +1'}</h1>
          <p className="text-muted-foreground mt-1">
            {lang === 'fr' ? 'Demandez de l\'aide et des ressources à votre coordinateur' : 'Request help and resources from your coordinator'}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">{lang === 'fr' ? 'Aperçu' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="requests">{lang === 'fr' ? 'Demandes' : 'Requests'}</TabsTrigger>
          <TabsTrigger value="new-request">{lang === 'fr' ? 'Nouvelle demande' : 'New Request'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{lang === 'fr' ? 'À propos du +1' : 'About +1'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{lang === 'fr' ? 'Qui est le +1 ?' : 'Who is +1?'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {lang === 'fr' ? 'Le +1 est votre coordinateur de cartel, votre point de contact principal pour toute demande d\'aide ou de ressources.' : 'The +1 is your cartel coordinator, your main point of contact for any help or resource requests.'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{lang === 'fr' ? 'Quel est son rôle ?' : 'What is their role?'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {lang === 'fr' ? 'Le +1 facilite votre travail en groupe, répond à vos questions et vous oriente vers les bonnes ressources.' : 'The +1 facilitates your group work, answers your questions and guides you to the right resources.'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{lang === 'fr' ? 'Quand le contacter ?' : 'When to contact them?'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {lang === 'fr' ? 'Contactez votre +1 pour toute difficulté méthodologique, organisationnelle ou motivationnelle.' : 'Contact your +1 for any methodological, organizational or motivational difficulty.'}
                  </p>
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
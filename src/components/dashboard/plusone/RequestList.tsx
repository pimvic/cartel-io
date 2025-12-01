import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

interface Request {
  id: string;
  title: string;
  body: string;
  tags: string[];
  visibility: string;
  status: string;
  due_date: string | null;
  created_at: string;
  requester?: {
    name: string;
  };
}

interface RequestListProps {
  cartelId: string;
  userId: string;
  isCoordinator: boolean;
  onSelectRequest: (requestId: string) => void;
}

export const RequestList = ({ cartelId, userId, isCoordinator, onSelectRequest }: RequestListProps) => {
  const { lang } = useParams<{ lang: string }>();
  const [requests, setRequests] = useState<Request[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRequests();
    
    const channel = supabase
      .channel(`requests-${cartelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'plus_one_requests',
          filter: `cartel_id=eq.${cartelId}`
        },
        () => {
          loadRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cartelId, statusFilter]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('plus_one_requests')
        .select('*, requester:requester_id(name)')
        .eq('cartel_id', cartelId)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
      }

      const { data, error } = await query;

      if (error) throw error;

      setRequests((data || []) as any);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => 
    req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const locale = lang === 'fr' ? fr : enUS;

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { fr: string; en: string }> = {
      ouvert: { fr: 'Ouvert', en: 'Open' },
      en_cours: { fr: 'En cours', en: 'In Progress' },
      en_attente_infos: { fr: 'En attente d\'infos', en: 'Waiting for Info' },
      resolu: { fr: 'Résolu', en: 'Resolved' },
      ferme: { fr: 'Fermé', en: 'Closed' }
    };
    return lang === 'fr' ? labels[status]?.fr : labels[status]?.en;
  };

  const getTagLabel = (tag: string) => {
    const labels: Record<string, { fr: string; en: string }> = {
      methodo: { fr: 'Méthodo', en: 'Method' },
      ressource: { fr: 'Ressource', en: 'Resource' },
      blocage: { fr: 'Blocage', en: 'Blocker' },
      motivation: { fr: 'Motivation', en: 'Motivation' },
      organisation: { fr: 'Organisation', en: 'Organization' }
    };
    return lang === 'fr' ? labels[tag]?.fr : labels[tag]?.en;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'fr' ? 'Rechercher...' : 'Search...'}
            className="pl-10"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-md border bg-background"
        >
          <option value="all">{lang === 'fr' ? 'Tous les statuts' : 'All Statuses'}</option>
          <option value="ouvert">{getStatusLabel('ouvert')}</option>
          <option value="en_cours">{getStatusLabel('en_cours')}</option>
          <option value="en_attente_infos">{getStatusLabel('en_attente_infos')}</option>
          <option value="resolu">{getStatusLabel('resolu')}</option>
          <option value="ferme">{getStatusLabel('ferme')}</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          {lang === 'fr' ? 'Chargement...' : 'Loading...'}
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {lang === 'fr' ? 'Aucune demande trouvée' : 'No requests found'}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((request) => (
            <Card 
              key={request.id} 
              className="hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => onSelectRequest(request.id)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold">{request.title}</h4>
                    <Badge variant={
                      request.status === 'resolu' || request.status === 'ferme' 
                        ? 'secondary' 
                        : 'default'
                    }>
                      {getStatusLabel(request.status)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {request.body}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {request.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {getTagLabel(tag)}
                      </Badge>
                    ))}
                    {request.visibility === 'prive' && (
                      <Badge variant="outline" className="text-xs">
                        {lang === 'fr' ? 'Privé' : 'Private'}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{request.requester?.name || 'Unknown'}</span>
                    <span>{format(new Date(request.created_at), 'PP', { locale })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
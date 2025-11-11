import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();
  const [requests, setRequests] = useState<Request[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRequests();
    
    // Real-time subscription
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

  const locale = i18n.language === 'fr' ? fr : enUS;

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('plusOne.requests.search')}
            className="pl-10"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-md border bg-background"
        >
          <option value="all">{t('plusOne.requests.allStatus')}</option>
          <option value="ouvert">{t('plusOne.status.ouvert')}</option>
          <option value="en_cours">{t('plusOne.status.en_cours')}</option>
          <option value="en_attente_infos">{t('plusOne.status.en_attente_infos')}</option>
          <option value="resolu">{t('plusOne.status.resolu')}</option>
          <option value="ferme">{t('plusOne.status.ferme')}</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          {t('common.loading')}
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t('plusOne.requests.empty')}
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
                      {t(`plusOne.status.${request.status}`)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {request.body}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {request.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {t(`plusOne.tags.${tag}`)}
                      </Badge>
                    ))}
                    {request.visibility === 'prive' && (
                      <Badge variant="outline" className="text-xs">
                        {t('plusOne.visibility.private')}
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
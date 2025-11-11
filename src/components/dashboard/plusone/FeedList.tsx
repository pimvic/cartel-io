import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, FileText, Link2, Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

interface FeedItem {
  id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  metadata: any;
  created_at: string;
  users: {
    name: string;
  };
}

interface FeedListProps {
  cartelId: string;
}

const ITEMS_PER_PAGE = 10;

export const FeedList = ({ cartelId }: FeedListProps) => {
  const { t, i18n } = useTranslation();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFeed();
    
    // Real-time subscription for new feed items
    const channel = supabase
      .channel(`feed-${cartelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'plus_one_feed',
          filter: `cartel_id=eq.${cartelId}`
        },
        () => {
          loadFeed();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cartelId]);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('plus_one_feed')
        .select('*, users(name)')
        .eq('cartel_id', cartelId)
        .order('created_at', { ascending: false })
        .range(0, (page * ITEMS_PER_PAGE) - 1);

      if (error) throw error;

      setFeedItems(data || []);
      setHasMore(data?.length === page * ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(p => p + 1);
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'message':
        return <MessageSquare className="h-5 w-5" />;
      case 'resource':
      case 'note':
        return <FileText className="h-5 w-5" />;
      case 'lien':
        return <Link2 className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  const locale = i18n.language === 'fr' ? fr : enUS;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('plusOne.feed.title')}</h3>
      
      {loading && feedItems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {t('common.loading')}
        </div>
      ) : feedItems.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t('plusOne.feed.empty')}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {feedItems.map((item) => (
              <Card key={item.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-primary">
                      {getActionIcon(item.action_type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.users.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(item.created_at), 'PPp', { locale })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {t(`plusOne.feed.actionTypes.${item.action_type}`)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {item.metadata?.title || t(`plusOne.feed.targetTypes.${item.target_type}`)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {hasMore && (
            <Button 
              variant="outline" 
              onClick={loadMore} 
              disabled={loading}
              className="w-full"
            >
              {loading ? t('common.loading') : t('plusOne.feed.loadMore')}
            </Button>
          )}
        </>
      )}
    </div>
  );
};
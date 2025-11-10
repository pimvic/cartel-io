import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Newspaper, Calendar, Pin, Send, Users, Clock, MapPin, Video, Plus, Trash2, Edit, Heart, MessageCircle, Bell, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

interface User {
  id: string;
  name: string;
  avatar_url: string | null;
}

interface Thread {
  id: string;
  title: string | null;
  is_group: boolean;
  participants: string[];
  last_message_at: string;
  unread_count?: number;
}

interface ChatMessage {
  id: string;
  body: string;
  sender_id: string;
  created_at: string;
  sender: User;
}

interface NewsItem {
  id: string;
  title: string;
  body: string;
  tags: string[];
  created_at: string;
  pinned: boolean;
  author: User;
  comments_count?: number;
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_type: string;
  location?: string;
  visio_link?: string;
  capacity?: number;
  attendees_count?: number;
  is_registered?: boolean;
}

interface PinnedItem {
  id: string;
  item_type: string;
  item_id: string;
  pinned_at: string;
  content?: any;
}

export const MessagerieNewsEvents = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "fr" ? fr : enUS;
  
  const [userMembership, setUserMembership] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // State for Messages tab
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // State for News tab
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  const [newsForm, setNewsForm] = useState({ title: "", body: "", tags: [] as string[] });

  // State for Events tab
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    event_date: "",
    event_type: "meeting",
    location: "",
    visio_link: "",
    capacity: ""
  });

  // State for Pinned Highlights
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>([]);

  const canModerate = userMembership?.role === "coordinator" || currentUser?.role === "admin";

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

      setCurrentUser(userData);

      const { data: membershipData } = await supabase
        .from("memberships")
        .select("*, cartel:cartels(*)")
        .eq("user_id", userData?.id)
        .maybeSingle();

      setUserMembership(membershipData);

      if (membershipData?.cartel_id) {
        await Promise.all([
          fetchThreads(membershipData.cartel_id),
          fetchNews(membershipData.cartel_id),
          fetchEvents(membershipData.cartel_id),
          fetchPinnedItems(membershipData.cartel_id)
        ]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(t('dashboard.messagerie.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const fetchThreads = async (cartelId: string) => {
    const { data } = await supabase
      .from("threads")
      .select("*")
      .eq("cartel_id", cartelId)
      .order("last_message_at", { ascending: false });
    
    if (data) setThreads(data);
  };

  const fetchMessages = async (threadId: string) => {
    const { data } = await supabase
      .from("chat_messages")
      .select(`
        *,
        sender:users(id, name, avatar_url)
      `)
      .eq("thread_id", threadId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true })
      .limit(50);
    
    if (data) setMessages(data as any);
  };

  const fetchNews = async (cartelId: string) => {
    const { data } = await supabase
      .from("news")
      .select(`
        *,
        author:users(id, name, avatar_url)
      `)
      .eq("cartel_id", cartelId)
      .order("created_at", { ascending: false });
    
    if (data) setNews(data as any);
  };

  const fetchEvents = async (cartelId: string) => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("cartel_id", cartelId)
      .order("event_date", { ascending: true });
    
    if (data) setEvents(data as any);
  };

  const fetchPinnedItems = async (cartelId: string) => {
    const { data } = await supabase
      .from("pins")
      .select("*")
      .eq("cartel_id", cartelId)
      .order("display_order", { ascending: true })
      .limit(3);
    
    if (data) setPinnedItems(data);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread || !currentUser) return;

    try {
      const { error } = await supabase.from("chat_messages").insert({
        thread_id: selectedThread.id,
        sender_id: currentUser.id,
        body: newMessage.trim()
      });

      if (error) throw error;
      setNewMessage("");
      toast.success(t('dashboard.messagerie.messages.sent'));
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t('dashboard.messagerie.errors.sendFailed'));
    }
  };

  const handleCreateNews = async () => {
    if (!newsForm.title || !newsForm.body || !userMembership?.cartel_id || !currentUser) return;

    try {
      const { error } = await supabase.from("news").insert({
        cartel_id: userMembership.cartel_id,
        author_id: currentUser.id,
        title: newsForm.title,
        body: newsForm.body,
        tags: newsForm.tags
      });

      if (error) throw error;
      setNewsDialogOpen(false);
      setNewsForm({ title: "", body: "", tags: [] });
      toast.success(t('dashboard.messagerie.news.created'));
      fetchNews(userMembership.cartel_id);
    } catch (error) {
      console.error("Error creating news:", error);
      toast.error(t('dashboard.messagerie.errors.createFailed'));
    }
  };

  const handleCreateEvent = async () => {
    if (!eventForm.title || !eventForm.event_date || !userMembership?.cartel_id) return;

    try {
      const { error } = await supabase.from("events").insert({
        cartel_id: userMembership.cartel_id,
        title: eventForm.title,
        description: eventForm.description,
        event_date: eventForm.event_date,
        event_type: eventForm.event_type,
        location: eventForm.location || null,
        visio_link: eventForm.visio_link || null,
        capacity: eventForm.capacity ? parseInt(eventForm.capacity) : null
      });

      if (error) throw error;
      setEventDialogOpen(false);
      setEventForm({
        title: "",
        description: "",
        event_date: "",
        event_type: "meeting",
        location: "",
        visio_link: "",
        capacity: ""
      });
      toast.success(t('dashboard.messagerie.events.created'));
      fetchEvents(userMembership.cartel_id);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(t('dashboard.messagerie.errors.createFailed'));
    }
  };

  const handleRSVP = async (eventId: string, isRegistered: boolean) => {
    if (!currentUser) return;

    try {
      if (isRegistered) {
        const { error } = await supabase
          .from("event_attendees")
          .delete()
          .eq("event_id", eventId)
          .eq("user_id", currentUser.id);
        
        if (error) throw error;
        toast.success(t('dashboard.messagerie.events.unregistered'));
      } else {
        const { error } = await supabase
          .from("event_attendees")
          .insert({ event_id: eventId, user_id: currentUser.id });
        
        if (error) throw error;
        toast.success(t('dashboard.messagerie.events.registered'));
      }
      fetchEvents(userMembership.cartel_id);
    } catch (error) {
      console.error("Error updating RSVP:", error);
      toast.error(t('dashboard.messagerie.errors.rsvpFailed'));
    }
  };

  const handlePinItem = async (itemType: string, itemId: string) => {
    if (!canModerate || !userMembership?.cartel_id || !currentUser) return;

    try {
      const { error } = await supabase.from("pins").insert({
        cartel_id: userMembership.cartel_id,
        item_type: itemType,
        item_id: itemId,
        pinned_by: currentUser.id,
        display_order: pinnedItems.length
      });

      if (error) throw error;
      toast.success(t('dashboard.messagerie.pinned.added'));
      fetchPinnedItems(userMembership.cartel_id);
    } catch (error) {
      console.error("Error pinning item:", error);
      toast.error(t('dashboard.messagerie.errors.pinFailed'));
    }
  };

  useEffect(() => {
    if (!selectedThread) return;
    
    fetchMessages(selectedThread.id);

    const channel = supabase
      .channel(`thread-${selectedThread.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `thread_id=eq.${selectedThread.id}`
        },
        (payload) => {
          fetchMessages(selectedThread.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedThread]);

  useEffect(() => {
    if (!userMembership?.cartel_id) return;

    const newsChannel = supabase
      .channel("news-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "news",
          filter: `cartel_id=eq.${userMembership.cartel_id}`
        },
        () => {
          fetchNews(userMembership.cartel_id);
        }
      )
      .subscribe();

    const eventsChannel = supabase
      .channel("events-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: `cartel_id=eq.${userMembership.cartel_id}`
        },
        () => {
          fetchEvents(userMembership.cartel_id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(newsChannel);
      supabase.removeChannel(eventsChannel);
    };
  }, [userMembership]);

  if (loading) {
    return <div className="flex items-center justify-center p-8">{t('common.loading')}</div>;
  }

  if (!userMembership) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-lg font-semibold">{t('dashboard.messagerie.noCartel')}</p>
        <p className="text-muted-foreground mt-2">{t('dashboard.messagerie.noCartelDescription')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">{t('dashboard.messagerie.subtitle')}</p>
      </div>

      {pinnedItems.length > 0 && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Pin className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-lg">{t('dashboard.messagerie.pinned.title')}</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {pinnedItems.map((pin) => (
              <Card key={pin.id} className="bg-background">
                <CardContent className="p-4">
                  <p className="text-sm">
                    {pin.item_type === "news" ? t('dashboard.messagerie.pinned.typeNews') : 
                     pin.item_type === "event" ? t('dashboard.messagerie.pinned.typeEvent') :
                     t('dashboard.messagerie.pinned.typeMessage')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(pin.pinned_at), "PPp", { locale })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

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
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t('dashboard.messagerie.threads.title')}</span>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {threads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    className={`p-3 rounded-lg cursor-pointer hover:bg-accent/10 transition ${
                      selectedThread?.id === thread.id ? "bg-accent/20" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <p className="font-medium text-sm">
                        {thread.title || t('dashboard.messagerie.threads.untitled')}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(thread.last_message_at), "PPp", { locale })}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedThread?.title || t('dashboard.messagerie.chat.selectThread')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedThread ? (
                  <div className="space-y-4">
                    <div className="h-96 overflow-y-auto space-y-3 p-4 bg-muted/30 rounded-lg">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-lg ${
                            msg.sender_id === currentUser?.id
                              ? "bg-primary/10 ml-8"
                              : "bg-background mr-8"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={msg.sender.avatar_url || ""} />
                              <AvatarFallback>{msg.sender.name[0]}</AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-medium">{msg.sender.name}</p>
                          </div>
                          <p className="text-sm">{msg.body}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(msg.created_at), "p", { locale })}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder={t('dashboard.messagerie.chat.placeholder')}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    {t('dashboard.messagerie.chat.noThread')}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="news" className="mt-6">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t('dashboard.messagerie.news.title')}</h3>
            {canModerate && (
              <Dialog open={newsDialogOpen} onOpenChange={setNewsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('dashboard.messagerie.news.create')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('dashboard.messagerie.news.createTitle')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder={t('dashboard.messagerie.news.titlePlaceholder')}
                      value={newsForm.title}
                      onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    />
                    <Textarea
                      placeholder={t('dashboard.messagerie.news.bodyPlaceholder')}
                      value={newsForm.body}
                      onChange={(e) => setNewsForm({ ...newsForm, body: e.target.value })}
                      rows={5}
                    />
                    <Select
                      value={newsForm.tags[0] || ""}
                      onValueChange={(value) => setNewsForm({ ...newsForm, tags: [value] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('dashboard.messagerie.news.tagPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Update">Update</SelectItem>
                        <SelectItem value="Decision">Decision</SelectItem>
                        <SelectItem value="New File">New File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateNews}>{t('common.create')}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="space-y-4">
            {news.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={item.author.avatar_url || ""} />
                          <AvatarFallback>{item.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{item.author.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(item.created_at), "PPp", { locale })}
                        </span>
                      </div>
                    </div>
                    {canModerate && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePinItem("news", item.id)}
                      >
                        <Pin className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{item.body}</p>
                  <div className="flex gap-2 mt-3">
                    {item.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t('dashboard.messagerie.events.title')}</h3>
            {canModerate && (
              <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('dashboard.messagerie.events.create')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('dashboard.messagerie.events.createTitle')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder={t('dashboard.messagerie.events.titlePlaceholder')}
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    />
                    <Textarea
                      placeholder={t('dashboard.messagerie.events.descPlaceholder')}
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      rows={3}
                    />
                    <Input
                      type="datetime-local"
                      value={eventForm.event_date}
                      onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                    />
                    <Input
                      placeholder={t('dashboard.messagerie.events.locationPlaceholder')}
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    />
                    <Input
                      placeholder={t('dashboard.messagerie.events.visioPlaceholder')}
                      value={eventForm.visio_link}
                      onChange={(e) => setEventForm({ ...eventForm, visio_link: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder={t('dashboard.messagerie.events.capacityPlaceholder')}
                      value={eventForm.capacity}
                      onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateEvent}>{t('common.create')}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(event.event_date), "PPp", { locale })}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                        )}
                        {event.visio_link && (
                          <div className="flex items-center gap-1">
                            <Video className="w-4 h-4" />
                            <a href={event.visio_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {t('dashboard.messagerie.events.joinVisio')}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={event.is_registered ? "secondary" : "default"}
                      onClick={() => handleRSVP(event.id, event.is_registered || false)}
                    >
                      {event.is_registered ? t('dashboard.messagerie.events.unregister') : t('dashboard.messagerie.events.register')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{event.description}</p>
                  {event.capacity && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {t('dashboard.messagerie.events.capacity')}: {event.attendees_count || 0}/{event.capacity}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

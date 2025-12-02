import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  addHours,
} from "date-fns";
import { fr, enUS } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Clock,
  MapPin,
  CalendarDays,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// TODO: restore i18n - Hard-coded strings for now
const labels = {
  fr: {
    title: "Calendrier",
    subtitle: "Gérez vos événements et rendez-vous",
    addEvent: "Ajouter un événement",
    editEvent: "Modifier l'événement",
    deleteEvent: "Supprimer l'événement",
    eventTitle: "Titre de l'événement",
    description: "Description",
    startDateTime: "Date et heure de début",
    duration: "Durée",
    location: "Lieu",
    save: "Enregistrer",
    cancel: "Annuler",
    today: "Aujourd'hui",
    noEvents: "Aucun événement pour ce jour",
    eventsForDay: "Événements du",
    deleteConfirm: "Supprimer cet événement ?",
    createSuccess: "Événement créé",
    updateSuccess: "Événement mis à jour",
    deleteSuccess: "Événement supprimé",
    errorLoad: "Échec du chargement",
    errorCreate: "Échec de la création",
    errorUpdate: "Échec de la mise à jour",
    errorDelete: "Échec de la suppression",
    demoMode: "Mode démo",
    demoModeDesc: "Rejoignez un kartel pour synchroniser vos événements",
    durationOptions: {
      "15": "15 minutes",
      "30": "30 minutes",
      "60": "1 heure",
      "90": "1h30",
      "120": "2 heures",
      "180": "3 heures",
      "240": "4 heures",
      "480": "Journée entière",
    },
    weekDays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  },
  en: {
    title: "Calendar",
    subtitle: "Manage your events and appointments",
    addEvent: "Add Event",
    editEvent: "Edit Event",
    deleteEvent: "Delete Event",
    eventTitle: "Event Title",
    description: "Description",
    startDateTime: "Start Date & Time",
    duration: "Duration",
    location: "Location",
    save: "Save",
    cancel: "Cancel",
    today: "Today",
    noEvents: "No events for this day",
    eventsForDay: "Events for",
    deleteConfirm: "Delete this event?",
    createSuccess: "Event created",
    updateSuccess: "Event updated",
    deleteSuccess: "Event deleted",
    errorLoad: "Failed to load",
    errorCreate: "Creation failed",
    errorUpdate: "Update failed",
    errorDelete: "Deletion failed",
    demoMode: "Demo mode",
    demoModeDesc: "Join a kartel to sync your events",
    durationOptions: {
      "15": "15 minutes",
      "30": "30 minutes",
      "60": "1 hour",
      "90": "1h30",
      "120": "2 hours",
      "180": "3 hours",
      "240": "4 hours",
      "480": "Full day",
    },
    weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
};

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_type: string;
  location: string | null;
  visio_link?: string | null;
  capacity?: number | null;
  cartel_id?: string;
  tags?: string[] | null;
}

interface EventFormData {
  title: string;
  description: string;
  event_date: string;
  event_type: string;
  location: string;
  duration: number;
}

interface User {
  id: string;
  name: string;
  role: string;
}

interface Membership {
  role: string;
  cartel_id: string;
}

// Generate demo events relative to current date
const generateDemoEvents = (lang: string): CalendarEvent[] => {
  const now = new Date();
  const currentMonth = startOfMonth(now);
  
  const demoEventsFr: Omit<CalendarEvent, 'id' | 'event_date'>[] = [
    { title: "Réunion d'équipe", description: "Discussion hebdomadaire", event_type: "meeting", location: "Salle A" },
    { title: "Présentation projet", description: "Revue des avancées", event_type: "presentation", location: "Auditorium" },
    { title: "Atelier collaboratif", description: "Brainstorming créatif", event_type: "workshop", location: "Espace créatif" },
    { title: "Point individuel", description: "Suivi personnalisé", event_type: "meeting", location: "Bureau 12" },
    { title: "Formation continue", description: "Module avancé", event_type: "training", location: "Salle de formation" },
    { title: "Deadline rapport", description: "Remise du rapport final", event_type: "deadline", location: null },
    { title: "Séance de révision", description: "Préparation examen", event_type: "study", location: "Bibliothèque" },
    { title: "Webinaire externe", description: "Conférencier invité", event_type: "webinar", location: "En ligne" },
  ];

  const demoEventsEn: Omit<CalendarEvent, 'id' | 'event_date'>[] = [
    { title: "Team Meeting", description: "Weekly discussion", event_type: "meeting", location: "Room A" },
    { title: "Project Presentation", description: "Progress review", event_type: "presentation", location: "Auditorium" },
    { title: "Collaborative Workshop", description: "Creative brainstorming", event_type: "workshop", location: "Creative space" },
    { title: "One-on-One", description: "Personal follow-up", event_type: "meeting", location: "Office 12" },
    { title: "Continued Training", description: "Advanced module", event_type: "training", location: "Training room" },
    { title: "Report Deadline", description: "Final report submission", event_type: "deadline", location: null },
    { title: "Study Session", description: "Exam preparation", event_type: "study", location: "Library" },
    { title: "External Webinar", description: "Guest speaker", event_type: "webinar", location: "Online" },
  ];

  const baseEvents = lang === 'fr' ? demoEventsFr : demoEventsEn;
  
  // Distribute events across the current month
  const events: CalendarEvent[] = [];
  const daysInMonth = endOfMonth(currentMonth).getDate();
  
  baseEvents.forEach((event, index) => {
    // Spread events across different days
    const dayOffset = Math.floor((index * daysInMonth) / baseEvents.length) + 1;
    const eventDate = new Date(currentMonth);
    eventDate.setDate(Math.min(dayOffset + 2, daysInMonth));
    eventDate.setHours(9 + (index % 8), (index % 2) * 30, 0, 0);
    
    events.push({
      ...event,
      id: `demo-${index}`,
      event_date: eventDate.toISOString(),
    });
  });

  // Add an event for today
  const todayEvent: CalendarEvent = {
    id: 'demo-today',
    title: lang === 'fr' ? "Événement du jour" : "Today's Event",
    description: lang === 'fr' ? "Un événement prévu aujourd'hui" : "An event scheduled for today",
    event_date: addHours(new Date().setHours(14, 0, 0, 0), 0).toString(),
    event_type: "meeting",
    location: lang === 'fr' ? "Salle principale" : "Main room",
  };
  
  // Fix today's event date
  const todayDate = new Date();
  todayDate.setHours(14, 0, 0, 0);
  todayEvent.event_date = todayDate.toISOString();
  
  events.push(todayEvent);

  return events;
};

export const Calendar = () => {
  const { lang } = useParams<{ lang: string }>();
  const { user } = useAuth();
  const t = lang === "fr" ? labels.fr : labels.en;
  const locale = lang === "fr" ? fr : enUS;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userMembership, setUserMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  // Modal states
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Form state
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    event_date: "",
    event_type: "meeting",
    location: "",
    duration: 60,
  });

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [user, currentMonth, lang]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!user) {
        // No user logged in - show demo
        setIsDemo(true);
        setEvents(generateDemoEvents(lang || 'en'));
        setLoading(false);
        return;
      }

      // Fetch current user
      const { data: userData } = await supabase
        .from("users")
        .select("id, name, role")
        .eq("auth_user_id", user.id)
        .single();

      setCurrentUser(userData);

      // Fetch user's cartel membership
      if (userData) {
        const { data: membershipData } = await supabase
          .from("memberships")
          .select("role, cartel_id")
          .eq("user_id", userData.id)
          .maybeSingle();

        setUserMembership(membershipData);

        // Fetch events for the current month if user has cartel
        if (membershipData?.cartel_id) {
          setIsDemo(false);
          const monthStart = startOfMonth(currentMonth);
          const monthEnd = endOfMonth(currentMonth);

          const { data: eventsData, error } = await supabase
            .from("events")
            .select("*")
            .eq("cartel_id", membershipData.cartel_id)
            .gte("event_date", monthStart.toISOString())
            .lte("event_date", monthEnd.toISOString())
            .order("event_date", { ascending: true });

          if (error) throw error;
          setEvents((eventsData as CalendarEvent[]) || []);
        } else {
          // User exists but no kartel - show demo
          setIsDemo(true);
          setEvents(generateDemoEvents(lang || 'en'));
        }
      } else {
        // No user data - show demo
        setIsDemo(true);
        setEvents(generateDemoEvents(lang || 'en'));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // On error, show demo data
      setIsDemo(true);
      setEvents(generateDemoEvents(lang || 'en'));
    } finally {
      setLoading(false);
    }
  };

  // Setup realtime subscription (only for non-demo mode)
  useEffect(() => {
    if (!userMembership?.cartel_id || isDemo) return;

    const channel = supabase
      .channel("events-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: `cartel_id=eq.${userMembership.cartel_id}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userMembership?.cartel_id, isDemo]);

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentMonth]);

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      try {
        return isSameDay(parseISO(event.event_date), day);
      } catch {
        return false;
      }
    });
  };

  // Get events for selected date
  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return getEventsForDay(selectedDate);
  }, [selectedDate, events]);

  // Navigation handlers
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
    setIsDayModalOpen(true);
  };

  // Day click handler
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsDayModalOpen(true);
  };

  // Open create modal
  const openCreateModal = (date?: Date) => {
    const targetDate = date || selectedDate || new Date();
    setFormData({
      title: "",
      description: "",
      event_date: format(targetDate, "yyyy-MM-dd'T'HH:mm"),
      event_type: "meeting",
      location: "",
      duration: 60,
    });
    setIsCreateModalOpen(true);
    setIsDayModalOpen(false);
  };

  // Open edit modal
  const openEditModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      event_date: format(parseISO(event.event_date), "yyyy-MM-dd'T'HH:mm"),
      event_type: event.event_type,
      location: event.location || "",
      duration: 60,
    });
    setIsEditModalOpen(true);
    setIsDayModalOpen(false);
  };

  // Create event (demo mode: local only)
  const handleCreate = async () => {
    if (!formData.title || !formData.event_date) return;

    if (isDemo) {
      // Demo mode: add to local state
      const newEvent: CalendarEvent = {
        id: `demo-new-${Date.now()}`,
        title: formData.title,
        description: formData.description || null,
        event_date: new Date(formData.event_date).toISOString(),
        event_type: formData.event_type,
        location: formData.location || null,
      };
      setEvents((prev) => [...prev, newEvent]);
      toast.success(t.createSuccess);
      setIsCreateModalOpen(false);
      return;
    }

    // Real mode: save to database
    if (!userMembership || !currentUser) return;

    try {
      const { error } = await supabase.from("events").insert({
        title: formData.title,
        description: formData.description || null,
        event_date: new Date(formData.event_date).toISOString(),
        event_type: formData.event_type,
        location: formData.location || null,
        cartel_id: userMembership.cartel_id,
      });

      if (error) throw error;
      toast.success(t.createSuccess);
      setIsCreateModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(t.errorCreate);
    }
  };

  // Update event
  const handleUpdate = async () => {
    if (!selectedEvent || !formData.title || !formData.event_date) return;

    if (isDemo) {
      // Demo mode: update local state
      setEvents((prev) =>
        prev.map((e) =>
          e.id === selectedEvent.id
            ? {
                ...e,
                title: formData.title,
                description: formData.description || null,
                event_date: new Date(formData.event_date).toISOString(),
                event_type: formData.event_type,
                location: formData.location || null,
              }
            : e
        )
      );
      toast.success(t.updateSuccess);
      setIsEditModalOpen(false);
      setSelectedEvent(null);
      return;
    }

    // Real mode: update in database
    try {
      const { error } = await supabase
        .from("events")
        .update({
          title: formData.title,
          description: formData.description || null,
          event_date: new Date(formData.event_date).toISOString(),
          event_type: formData.event_type,
          location: formData.location || null,
        })
        .eq("id", selectedEvent.id);

      if (error) throw error;
      toast.success(t.updateSuccess);
      setIsEditModalOpen(false);
      setSelectedEvent(null);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(t.errorUpdate);
    }
  };

  // Delete event
  const handleDelete = async (event: CalendarEvent) => {
    if (!confirm(t.deleteConfirm)) return;

    if (isDemo) {
      // Demo mode: remove from local state
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
      toast.success(t.deleteSuccess);
      setIsDayModalOpen(false);
      return;
    }

    // Real mode: delete from database
    try {
      const { error } = await supabase.from("events").delete().eq("id", event.id);

      if (error) throw error;
      toast.success(t.deleteSuccess);
      setIsDayModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(t.errorDelete);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{t.title}</h1>
            {isDemo && (
              <Badge variant="secondary" className="text-xs">
                {t.demoMode}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {isDemo ? t.demoModeDesc : t.subtitle}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={goToToday}>
            {t.today}
          </Button>
          <Button onClick={() => openCreateModal()}>
            <Plus className="h-4 w-4 mr-2" />
            {t.addEvent}
          </Button>
        </div>
      </div>

      {/* Calendar Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth} aria-label="Previous month">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-xl font-semibold capitalize">
              {format(currentMonth, "MMMM yyyy", { locale })}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={goToNextMonth} aria-label="Next month">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {t.weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isCurrentDay = isToday(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <button
                  key={idx}
                  onClick={() => handleDayClick(day)}
                  className={`
                    relative min-h-[70px] sm:min-h-[90px] p-1 sm:p-2 border rounded-md text-left transition-colors
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    ${isCurrentMonth ? "bg-background hover:bg-muted/50" : "bg-muted/30 text-muted-foreground"}
                    ${isCurrentDay ? "ring-2 ring-primary" : ""}
                    ${isSelected ? "bg-primary/10" : ""}
                  `}
                  aria-label={format(day, "PPPP", { locale })}
                >
                  <span
                    className={`
                      text-sm font-medium inline-flex items-center justify-center
                      ${isCurrentDay ? "bg-primary text-primary-foreground rounded-full w-6 h-6 sm:w-7 sm:h-7" : ""}
                    `}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Events indicators */}
                  <div className="mt-1 space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs truncate px-1 py-0.5 rounded bg-primary/20 text-foreground"
                        title={event.title}
                      >
                        <span className="hidden sm:inline">
                          {format(parseISO(event.event_date), "HH:mm")} -{" "}
                        </span>
                        <span className="truncate">{event.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground px-1">
                        +{dayEvents.length - 2}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day Events Modal */}
      <Dialog open={isDayModalOpen} onOpenChange={setIsDayModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              {t.eventsForDay}{" "}
              {selectedDate && format(selectedDate, "d MMMM yyyy", { locale })}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedDayEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">{t.noEvents}</p>
            ) : (
              selectedDayEvents.map((event) => (
                <Card key={event.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold">{event.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        {format(parseISO(event.event_date), "HH:mm", { locale })}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(event)}
                        aria-label={t.editEvent}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(event)}
                        aria-label={t.deleteEvent}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => openCreateModal(selectedDate || undefined)}>
              <Plus className="h-4 w-4 mr-2" />
              {t.addEvent}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Event Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.addEvent}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">{t.eventTitle}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t.eventTitle}
              />
            </div>

            <div>
              <Label htmlFor="event_date">{t.startDateTime}</Label>
              <Input
                id="event_date"
                type="datetime-local"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="duration">{t.duration}</Label>
              <Select
                value={String(formData.duration)}
                onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}
              >
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(t.durationOptions).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">{t.location}</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder={t.location}
              />
            </div>

            <div>
              <Label htmlFor="description">{t.description}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t.description}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={handleCreate}>{t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.editEvent}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">{t.eventTitle}</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t.eventTitle}
              />
            </div>

            <div>
              <Label htmlFor="edit-event_date">{t.startDateTime}</Label>
              <Input
                id="edit-event_date"
                type="datetime-local"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-duration">{t.duration}</Label>
              <Select
                value={String(formData.duration)}
                onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}
              >
                <SelectTrigger id="edit-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(t.durationOptions).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-location">{t.location}</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder={t.location}
              />
            </div>

            <div>
              <Label htmlFor="edit-description">{t.description}</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t.description}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={handleUpdate}>{t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

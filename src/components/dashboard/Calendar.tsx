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
} from "date-fns";
import { fr, enUS } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  X,
  Clock,
  MapPin,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
    noKartel: "Aucun kartel",
    noKartelDesc: "Vous devez rejoindre un kartel pour accéder au calendrier",
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
    noKartel: "No kartel",
    noKartelDesc: "You must join a kartel to access the calendar",
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
  visio_link: string | null;
  capacity: number | null;
  cartel_id: string;
  tags: string[] | null;
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
  }, [user, currentMonth]);

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    try {
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

        // Fetch events for the current month
        if (membershipData?.cartel_id) {
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
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(t.errorLoad);
    } finally {
      setLoading(false);
    }
  };

  // Setup realtime subscription
  useEffect(() => {
    if (!userMembership?.cartel_id) return;

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
  }, [userMembership?.cartel_id]);

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
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
    return events.filter((event) => isSameDay(parseISO(event.event_date), day));
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

  // Create event
  const handleCreate = async () => {
    if (!formData.title || !formData.event_date || !userMembership || !currentUser) {
      return;
    }

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

  // No kartel membership
  if (!userMembership) {
    return (
      <div className="space-y-6">
        <div className="pt-2">
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">{t.noKartel}</h3>
            <p className="text-muted-foreground">{t.noKartelDesc}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
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
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-xl font-semibold capitalize">
              {format(currentMonth, "MMMM yyyy", { locale })}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={goToNextMonth}>
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
                    relative min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 border rounded-md text-left transition-colors
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    ${isCurrentMonth ? "bg-background hover:bg-muted/50" : "bg-muted/30 text-muted-foreground"}
                    ${isCurrentDay ? "ring-2 ring-primary" : ""}
                    ${isSelected ? "bg-primary/10" : ""}
                  `}
                  aria-label={format(day, "PPPP", { locale })}
                >
                  <span
                    className={`
                      text-sm font-medium
                      ${isCurrentDay ? "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center" : ""}
                    `}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Events indicators */}
                  <div className="mt-1 space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs truncate px-1 py-0.5 rounded bg-primary/20 text-primary-foreground"
                        title={event.title}
                      >
                        <span className="hidden sm:inline">
                          {format(parseISO(event.event_date), "HH:mm")} -{" "}
                        </span>
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground px-1">
                        +{dayEvents.length - 3}
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
            <DialogTitle>
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
                        <Clock className="h-3 w-3" />
                        {format(parseISO(event.event_date), "HH:mm", { locale })}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
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

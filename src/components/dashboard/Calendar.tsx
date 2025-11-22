import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { format as formatDate } from "date-fns";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Check,
  RotateCcw,
  Bell,
  ChevronDown,
  X,
  Flag,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  status: "a_venir" | "en_cours" | "termine";
  importance: boolean;
  is_final: boolean;
  created_by: string;
  completed_at: string | null;
  attachments: any;
  assignees: string[];
  audit_log: any;
  cartel_id: string;
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
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userMembership, setUserMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get("status") || "all");
  const [importanceFilter, setImportanceFilter] = useState<string>(searchParams.get("importance") || "all");
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Milestone>>({});
  const [reminderDate, setReminderDate] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const locale = lang === 'fr' ? fr : enUS;

  // Fetch data
  useEffect(() => {
    fetchData();
    setupRealtimeSubscription();
  }, [user]);

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

        // Only fetch milestones if user has a cartel
        if (membershipData?.cartel_id) {
          // Fetch milestones
          const { data: milestonesData, error } = await supabase
            .from("milestones")
            .select("*")
            .eq("cartel_id", membershipData.cartel_id)
            .order("due_date", { ascending: true });

          if (error) throw error;
          setMilestones((milestonesData as Milestone[]) || []);

        // Fetch all users in cartel
        const { data: usersData } = await supabase
          .from("users")
          .select("id, name, role")
          .in("id", (await supabase
            .from("memberships")
            .select("user_id")
            .eq("cartel_id", membershipData.cartel_id)).data?.map(m => m.user_id) || []);
        
        setUsers(usersData || []);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(t("calendar.errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("milestones-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "milestones",
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Permissions
  const canEdit = userMembership?.role === "coordinator" || currentUser?.role === "admin";
  const canDelete = currentUser?.role === "admin";

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchQuery) {
        params.set("search", searchQuery);
      } else {
        params.delete("search");
      }
      setSearchParams(params);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter milestones
  const filteredMilestones = useMemo(() => {
    let filtered = [...milestones];

    // Search filter
    if (searchQuery.length >= 3) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        m =>
          m.title.toLowerCase().includes(query) ||
          m.description?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(m => m.status === selectedStatus);
    }

    // Importance filter
    if (importanceFilter === "important") {
      filtered = filtered.filter(m => m.importance);
    }

    return filtered;
  }, [milestones, searchQuery, selectedStatus, importanceFilter]);

  // Paginated milestones
  const paginatedMilestones = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredMilestones.slice(start, start + pageSize);
  }, [filteredMilestones, page]);

  const totalPages = Math.ceil(filteredMilestones.length / pageSize);

  // Handlers
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    const params = new URLSearchParams(searchParams);
    if (value !== "all") {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    setSearchParams(params);
    setPage(1);
  };

  const handleImportanceChange = (value: string) => {
    setImportanceFilter(value);
    const params = new URLSearchParams(searchParams);
    if (value !== "all") {
      params.set("importance", value);
    } else {
      params.delete("importance");
    }
    setSearchParams(params);
    setPage(1);
  };

  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsDetailOpen(true);
  };

  const handleMarkComplete = async (milestone: Milestone) => {
    try {
      const auditEntry = {
        action: "completed",
        by: currentUser?.name,
        timestamp: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("milestones")
        .update({
          status: "termine",
          completed_at: new Date().toISOString(),
          audit_log: [...(milestone.audit_log || []), auditEntry],
        })
        .eq("id", milestone.id);

      if (error) throw error;
      toast.success(t("calendar.success.completed"));
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(t("calendar.errors.updateFailed"));
    }
  };

  const handleReopen = async (milestone: Milestone) => {
    try {
      const auditEntry = {
        action: "reopened",
        by: currentUser?.name,
        timestamp: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("milestones")
        .update({
          status: "en_cours",
          completed_at: null,
          audit_log: [...(milestone.audit_log || []), auditEntry],
        })
        .eq("id", milestone.id);

      if (error) throw error;
      toast.success(t("calendar.success.reopened"));
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(t("calendar.errors.updateFailed"));
    }
  };

  const handleEdit = (milestone: Milestone) => {
    setEditForm(milestone);
    setIsEditOpen(true);
    setIsDetailOpen(false);
  };

  const handleSaveEdit = async () => {
    if (!editForm.id) return;

    try {
      const auditEntry = {
        action: "updated",
        by: currentUser?.name,
        timestamp: new Date().toISOString(),
        changes: editForm,
      };

      const { error } = await supabase
        .from("milestones")
        .update({
          ...editForm,
          audit_log: [...(editForm.audit_log || []), auditEntry],
        })
        .eq("id", editForm.id);

      if (error) throw error;
      toast.success(t("calendar.success.updated"));
      setIsEditOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(t("calendar.errors.updateFailed"));
    }
  };

  const handleCreate = async () => {
    if (!editForm.title || !editForm.due_date || !userMembership || !currentUser) return;

    try {
      const auditEntry = {
        action: "created",
        by: currentUser.name,
        timestamp: new Date().toISOString(),
      };

      const newMilestone = {
        title: editForm.title,
        description: editForm.description || null,
        due_date: editForm.due_date,
        cartel_id: userMembership.cartel_id,
        created_by: currentUser.id,
        status: new Date(editForm.due_date) > new Date() ? "a_venir" as const : "en_cours" as const,
        importance: editForm.importance || false,
        audit_log: [auditEntry],
      };

      const { error } = await supabase
        .from("milestones")
        .insert(newMilestone);

      if (error) throw error;
      toast.success(t("calendar.success.created"));
      setIsCreateOpen(false);
      setEditForm({});
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(t("calendar.errors.createFailed"));
    }
  };

  const handleDelete = async (milestone: Milestone) => {
    if (!canDelete) return;
    
    if (!confirm(t("calendar.confirmDelete"))) return;

    try {
      const { error } = await supabase
        .from("milestones")
        .delete()
        .eq("id", milestone.id);

      if (error) throw error;
      toast.success(t("calendar.success.deleted"));
      setIsDetailOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(t("calendar.errors.deleteFailed"));
    }
  };

  const handleSetReminder = async () => {
    if (!selectedMilestone || !reminderDate || !currentUser) return;

    try {
      const { error } = await supabase
        .from("milestone_reminders")
        .insert({
          milestone_id: selectedMilestone.id,
          user_id: currentUser.id,
          reminder_date: reminderDate,
        });

      if (error) throw error;
      toast.success(t("calendar.success.reminderSet"));
      setIsReminderOpen(false);
      setReminderDate("");
    } catch (error) {
      console.error(error);
      toast.error(t("calendar.errors.reminderFailed"));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      a_venir: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      en_cours: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      termine: "bg-green-500/10 text-green-600 dark:text-green-400",
    };

    return (
      <Badge className={`${variants[status]} border-0`}>
        {t(`calendar.status.${status}`)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Show message if user has no cartel membership
  if (!userMembership) {
    return (
      <div className="space-y-6">
        <div className="pt-2">
          <p className="text-muted-foreground text-[110%]">{t("calendar.subtitle")}</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">{t("calendar.noCartel")}</h3>
            <p className="text-muted-foreground">{t("calendar.noCartelDescription")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">{t("calendar.subtitle")}</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("calendar.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("calendar.filters.allStatus")}</SelectItem>
            <SelectItem value="a_venir">{t("calendar.status.a_venir")}</SelectItem>
            <SelectItem value="en_cours">{t("calendar.status.en_cours")}</SelectItem>
            <SelectItem value="termine">{t("calendar.status.termine")}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={importanceFilter} onValueChange={handleImportanceChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("calendar.filters.allImportance")}</SelectItem>
            <SelectItem value="important">{t("calendar.filters.importantOnly")}</SelectItem>
          </SelectContent>
        </Select>

        {canEdit && (
          <Button onClick={() => { setEditForm({}); setIsCreateOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            {t("calendar.create")}
          </Button>
        )}
      </div>

      {/* Milestones List */}
      <div className="space-y-3">
        {paginatedMilestones.map((milestone) => (
          <Card
            key={milestone.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              milestone.is_final ? "border-2 border-accent bg-accent/5" : ""
            } ${milestone.importance ? "border-l-4 border-l-accent" : ""}`}
            onClick={() => handleMilestoneClick(milestone)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-semibold ${milestone.is_final ? "text-lg" : ""}`}>
                      {milestone.title}
                    </h3>
                    {milestone.importance && (
                      <Badge className="bg-accent text-accent-foreground border-0">
                        Important
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(milestone.due_date), "EEEE d MMMM yyyy 'à' HH:mm", { locale })}
                  </p>
                  {milestone.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {milestone.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(milestone.status)}
                  {milestone.status === "termine" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReopen(milestone);
                      }}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      {t("calendar.actions.reopen")}
                    </Button>
                  )}
                  {milestone.status !== "termine" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkComplete(milestone);
                      }}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      {t("calendar.actions.complete")}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredMilestones.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              {t("calendar.noResults")}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            {t("calendar.pagination.previous")}
          </Button>
          <span className="flex items-center px-4 text-sm">
            {t("calendar.pagination.page", { current: page, total: totalPages })}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            {t("calendar.pagination.next")}
          </Button>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedMilestone && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedMilestone.title}
                  {selectedMilestone.importance && (
                    <Badge className="bg-accent text-accent-foreground">Important</Badge>
                  )}
                </DialogTitle>
                <DialogDescription>
                  {format(new Date(selectedMilestone.due_date), "EEEE d MMMM yyyy 'à' HH:mm", { locale })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{t("calendar.detail.status")}</h4>
                  {getStatusBadge(selectedMilestone.status)}
                </div>

                {selectedMilestone.description && (
                  <div>
                    <h4 className="font-semibold mb-2">{t("calendar.detail.description")}</h4>
                    <p className="text-sm text-muted-foreground">{selectedMilestone.description}</p>
                  </div>
                )}

                {selectedMilestone.completed_at && (
                  <div>
                    <h4 className="font-semibold mb-2">{t("calendar.detail.completedAt")}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(selectedMilestone.completed_at), "PPpp", { locale })}
                    </p>
                  </div>
                )}

                {selectedMilestone.audit_log && selectedMilestone.audit_log.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">{t("calendar.detail.auditLog")}</h4>
                    <div className="space-y-2 text-sm">
                      {selectedMilestone.audit_log.map((entry: any, idx: number) => (
                        <div key={idx} className="border-l-2 border-muted pl-3 py-1">
                          <p className="font-medium">{entry.action}</p>
                          <p className="text-muted-foreground text-xs">
                            {t("calendar.detail.by")} {entry.by} - {format(new Date(entry.timestamp), "PPpp", { locale })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsReminderOpen(true);
                    setIsDetailOpen(false);
                  }}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  {t("calendar.actions.setReminder")}
                </Button>
                {canEdit && (
                  <Button variant="outline" onClick={() => handleEdit(selectedMilestone)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {t("calendar.actions.edit")}
                  </Button>
                )}
                {canDelete && (
                  <Button variant="destructive" onClick={() => handleDelete(selectedMilestone)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("calendar.actions.delete")}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Modal */}
      <Dialog open={isEditOpen || isCreateOpen} onOpenChange={(open) => { setIsEditOpen(open); setIsCreateOpen(open); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isCreateOpen ? t("calendar.create") : t("calendar.edit")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>{t("calendar.form.title")}</Label>
              <Input
                value={editForm.title || ""}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>

            <div>
              <Label>{t("calendar.form.description")}</Label>
              <Textarea
                value={editForm.description || ""}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={4}
              />
            </div>

            <div>
              <Label>{t("calendar.form.dueDate")}</Label>
              <Input
                type="datetime-local"
                value={editForm.due_date ? format(new Date(editForm.due_date), "yyyy-MM-dd'T'HH:mm") : ""}
                onChange={(e) => setEditForm({ ...editForm, due_date: new Date(e.target.value).toISOString() })}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="importance"
                checked={editForm.importance || false}
                onChange={(e) => setEditForm({ ...editForm, importance: e.target.checked })}
              />
              <Label htmlFor="importance">{t("calendar.form.importance")}</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditOpen(false); setIsCreateOpen(false); }}>
              {t("calendar.form.cancel")}
            </Button>
            <Button onClick={isCreateOpen ? handleCreate : handleSaveEdit}>
              {t("calendar.form.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reminder Modal */}
      <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("calendar.reminder.title")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>{t("calendar.reminder.selectDate")}</Label>
              <Input
                type="datetime-local"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const date = new Date(selectedMilestone?.due_date || "");
                  date.setDate(date.getDate() - 1);
                  setReminderDate(format(date, "yyyy-MM-dd'T'HH:mm"));
                }}
              >
                1 {t("calendar.reminder.dayBefore")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const date = new Date(selectedMilestone?.due_date || "");
                  date.setDate(date.getDate() - 3);
                  setReminderDate(format(date, "yyyy-MM-dd'T'HH:mm"));
                }}
              >
                3 {t("calendar.reminder.daysBefore")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const date = new Date(selectedMilestone?.due_date || "");
                  date.setDate(date.getDate() - 7);
                  setReminderDate(format(date, "yyyy-MM-dd'T'HH:mm"));
                }}
              >
                1 {t("calendar.reminder.weekBefore")}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReminderOpen(false)}>
              {t("calendar.form.cancel")}
            </Button>
            <Button onClick={handleSetReminder}>
              {t("calendar.reminder.set")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
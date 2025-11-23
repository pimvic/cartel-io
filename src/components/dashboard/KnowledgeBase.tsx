import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Hard-coded translations for Knowledge Base
const getKBText = (key: string, lang: string): string => {
  const translations: Record<string, { fr: string; en: string }> = {
    'knowledgeBase.unknownUser': { fr: 'Utilisateur inconnu', en: 'Unknown user' },
    'knowledgeBase.error': { fr: 'Erreur', en: 'Error' },
    'knowledgeBase.validation.missingFields': { fr: 'Champs manquants', en: 'Missing fields' },
    'knowledgeBase.validation.categoryRequired': { fr: 'Catégorie requise', en: 'Category required' },
    'knowledgeBase.validation.fileTooLarge': { fr: 'Fichier trop volumineux (max 20 MB)', en: 'File too large (max 20 MB)' },
    'knowledgeBase.validation.invalidUrl': { fr: 'URL invalide', en: 'Invalid URL' },
    'knowledgeBase.validation.urlNotReachable': { fr: 'URL non accessible', en: 'URL not reachable' },
    'knowledgeBase.validation.noPermission': { fr: 'Permission refusée', en: 'Permission denied' },
    'knowledgeBase.validation.reportReasonRequired': { fr: 'Raison requise', en: 'Reason required' },
    'knowledgeBase.success.resourceAdded': { fr: 'Ressource ajoutée', en: 'Resource added' },
    'knowledgeBase.success.resourceUpdated': { fr: 'Ressource mise à jour', en: 'Resource updated' },
    'knowledgeBase.success.resourceDeleted': { fr: 'Ressource supprimée', en: 'Resource deleted' },
    'knowledgeBase.success.reportSubmitted': { fr: 'Signalement envoyé', en: 'Report submitted' },
    'knowledgeBase.success.exported': { fr: 'Exporté avec succès', en: 'Successfully exported' },
    'knowledgeBase.title': { fr: 'Base de Connaissances', en: 'Knowledge Base' },
    'knowledgeBase.subtitle': { fr: 'Gérez et partagez les ressources du kartel', en: 'Manage and share kartel resources' },
    'knowledgeBase.export': { fr: 'Exporter', en: 'Export' },
    'knowledgeBase.exportCSV': { fr: 'Exporter en CSV', en: 'Export as CSV' },
    'knowledgeBase.exportJSON': { fr: 'Exporter en JSON', en: 'Export as JSON' },
    'knowledgeBase.addResource': { fr: 'Ajouter une ressource', en: 'Add resource' },
    'knowledgeBase.addResourceTitle': { fr: 'Ajouter une ressource', en: 'Add Resource' },
    'knowledgeBase.addResourceDescription': { fr: 'Partagez des documents, vidéos ou liens', en: 'Share documents, videos or links' },
    'knowledgeBase.editResourceTitle': { fr: 'Modifier la ressource', en: 'Edit Resource' },
    'knowledgeBase.form.title': { fr: 'Titre', en: 'Title' },
    'knowledgeBase.form.titlePlaceholder': { fr: 'Entrez le titre', en: 'Enter title' },
    'knowledgeBase.form.description': { fr: 'Description', en: 'Description' },
    'knowledgeBase.form.descriptionPlaceholder': { fr: 'Décrivez la ressource', en: 'Describe the resource' },
    'knowledgeBase.form.type': { fr: 'Type', en: 'Type' },
    'knowledgeBase.form.category': { fr: 'Catégorie', en: 'Category' },
    'knowledgeBase.form.tags': { fr: 'Étiquettes', en: 'Tags' },
    'knowledgeBase.form.tagsPlaceholder': { fr: 'Ajouter une étiquette', en: 'Add a tag' },
    'knowledgeBase.form.addTag': { fr: 'Ajouter', en: 'Add' },
    'knowledgeBase.form.file': { fr: 'Fichier', en: 'File' },
    'knowledgeBase.form.maxFileSize': { fr: 'Taille max : 20 MB', en: 'Max size: 20 MB' },
    'knowledgeBase.form.url': { fr: 'URL', en: 'URL' },
    'knowledgeBase.form.urlPlaceholder': { fr: 'https://example.com', en: 'https://example.com' },
    'knowledgeBase.uploading': { fr: 'Téléchargement...', en: 'Uploading...' },
    'knowledgeBase.add': { fr: 'Ajouter', en: 'Add' },
    'knowledgeBase.save': { fr: 'Enregistrer', en: 'Save' },
    'knowledgeBase.searchPlaceholder': { fr: 'Rechercher des ressources...', en: 'Search resources...' },
    'knowledgeBase.searchMinChars': { fr: 'Minimum 3 caractères', en: 'Minimum 3 characters' },
    'knowledgeBase.filterByCategory': { fr: 'Filtrer par catégorie', en: 'Filter by category' },
    'knowledgeBase.allCategories': { fr: 'Toutes les catégories', en: 'All categories' },
    'knowledgeBase.filterByType': { fr: 'Filtrer par type', en: 'Filter by type' },
    'knowledgeBase.allTypes': { fr: 'Tous les types', en: 'All types' },
    'knowledgeBase.allResources': { fr: 'Toutes les ressources', en: 'All resources' },
    'knowledgeBase.favorites': { fr: 'Favoris', en: 'Favorites' },
    'knowledgeBase.loading': { fr: 'Chargement...', en: 'Loading...' },
    'knowledgeBase.noResources': { fr: 'Aucune ressource', en: 'No resources' },
    'knowledgeBase.noFavorites': { fr: 'Aucun favori', en: 'No favorites' },
    'knowledgeBase.preview': { fr: 'Aperçu', en: 'Preview' },
    'knowledgeBase.edit': { fr: 'Modifier', en: 'Edit' },
    'knowledgeBase.delete': { fr: 'Supprimer', en: 'Delete' },
    'knowledgeBase.report': { fr: 'Signaler', en: 'Report' },
    'knowledgeBase.uploadedBy': { fr: 'Ajouté par', en: 'Uploaded by' },
    'knowledgeBase.fileSize': { fr: 'Taille', en: 'File size' },
    'knowledgeBase.reports': { fr: 'signalement(s)', en: 'report(s)' },
    'knowledgeBase.reportResourceTitle': { fr: 'Signaler une ressource', en: 'Report Resource' },
    'knowledgeBase.reportResourceDescription': { fr: 'Décrivez le problème', en: 'Describe the issue' },
    'knowledgeBase.reportReason': { fr: 'Raison du signalement', en: 'Report reason' },
    'knowledgeBase.reportReasonPlaceholder': { fr: 'Décrivez le problème', en: 'Describe the problem' },
    'knowledgeBase.submit': { fr: 'Signaler', en: 'Report' },
    'knowledgeBase.openResource': { fr: 'Ouvrir la ressource', en: 'Open resource' },
    'common.cancel': { fr: 'Annuler', en: 'Cancel' },
    'common.save': { fr: 'Enregistrer', en: 'Save' },
    'knowledgeBase.types.document': { fr: 'Document', en: 'Document' },
    'knowledgeBase.types.video': { fr: 'Vidéo', en: 'Video' },
    'knowledgeBase.types.summary': { fr: 'Résumé', en: 'Summary' },
    'knowledgeBase.types.tool': { fr: 'Outil', en: 'Tool' },
    'knowledgeBase.types.link': { fr: 'Lien', en: 'Link' },
    'knowledgeBase.categories.documents': { fr: 'Documents', en: 'Documents' },
    'knowledgeBase.categories.videos': { fr: 'Vidéos', en: 'Videos' },
    'knowledgeBase.categories.summaries': { fr: 'Résumés', en: 'Summaries' },
    'knowledgeBase.categories.tools': { fr: 'Outils', en: 'Tools' },
    'knowledgeBase.categories.other': { fr: 'Autre', en: 'Other' },
  };
  
  return translations[key]?.[lang === 'fr' ? 'fr' : 'en'] || key;
};
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  FileText,
  Video,
  Link as LinkIcon,
  Star,
  MoreVertical,
  Edit,
  Trash,
  Flag,
  Download,
  Upload,
  Filter,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ResourceType = "document" | "video" | "summary" | "tool" | "link";
type ResourceCategory = "documents" | "videos" | "summaries" | "tools" | "other";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  type: ResourceType;
  category: ResourceCategory;
  tags: string[];
  resource_url: string;
  file_size: number | null;
  uploaded_by: string;
  uploaded_at: string;
  updated_at: string;
  uploader_name?: string;
  is_favorite?: boolean;
  report_count?: number;
}

export const KnowledgeBase = () => {
  const { lang } = useParams<{ lang: string }>();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [cartelId, setCartelId] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "document" as ResourceType,
    category: "documents" as ResourceCategory,
    tags: [] as string[],
    resource_url: "",
    file: null as File | null,
  });

  const [reportReason, setReportReason] = useState("");
  const [tagInput, setTagInput] = useState("");

  const locale = lang === "fr" ? fr : enUS;

  useEffect(() => {
    fetchCurrentUser();
    fetchResources();
    subscribeToRealtime();
  }, []);

  useEffect(() => {
    filterResources();
  }, [searchQuery, selectedCategory, selectedType, resources]);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userData } = await supabase
        .from("users")
        .select("id, role")
        .eq("auth_user_id", user.id)
        .single();
      
      if (userData) {
        setCurrentUserId(userData.id);
        setUserRole(userData.role);

        // Fetch user's cartel
        const { data: membership } = await supabase
          .from("memberships")
          .select("cartel_id")
          .eq("user_id", userData.id)
          .single();
        
        if (membership) {
          setCartelId(membership.cartel_id);
        }
      }
    }
  };

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's cartel
      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (!userData) return;

      const { data: membership } = await supabase
        .from("memberships")
        .select("cartel_id")
        .eq("user_id", userData.id)
        .single();

      if (!membership) return;

      // Fetch resources with uploader info and favorites
      const { data: resourcesData, error } = await supabase
        .from("knowledge_base_resources")
        .select(`
          *,
          uploader:users!knowledge_base_resources_uploaded_by_fkey(name),
          favorites:knowledge_base_favorites(user_id),
          reports:knowledge_base_reports(id)
        `)
        .eq("cartel_id", membership.cartel_id)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;

      const formattedResources = resourcesData?.map((resource: any) => ({
        ...resource,
        uploader_name: resource.uploader?.name || getKBText("knowledgeBase.unknownUser", lang),
        is_favorite: resource.favorites?.some((f: any) => f.user_id === userData.id) || false,
        report_count: resource.reports?.length || 0,
      })) || [];

      setResources(formattedResources);
    } catch (error: any) {
      toast({
        title: getKBText("knowledgeBase.error", lang),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToRealtime = () => {
    const channel = supabase
      .channel("knowledge_base_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "knowledge_base_resources",
        },
        () => {
          fetchResources();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filterResources = () => {
    let filtered = [...resources];

    // Search filter (AC-001: after 3 characters)
    if (searchQuery.length >= 3) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query) ||
          r.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          r.uploader_name?.toLowerCase().includes(query)
      );
    } else if (searchQuery.length === 0) {
      // Show all when no search
    } else {
      // Don't filter if less than 3 characters
      filtered = resources;
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((r) => r.category === selectedCategory);
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((r) => r.type === selectedType);
    }

    setFilteredResources(filtered);
  };

  const handleAddResource = async () => {
    try {
      if (!formData.title || (!formData.resource_url && !formData.file)) {
        toast({
          title: getKBText("knowledgeBase.validation.missingFields", lang),
          variant: "destructive",
        });
        return;
      }

      // BR-002: Each resource must belong to at least one category
      if (!formData.category) {
        toast({
          title: getKBText("knowledgeBase.validation.categoryRequired", lang),
          variant: "destructive",
        });
        return;
      }

      setUploading(true);
      let resourceUrl = formData.resource_url;
      let fileSize = null;

      // Handle file upload
      if (formData.file) {
        // BR-005: Files larger than 20 MB are rejected
        if (formData.file.size > 20 * 1024 * 1024) {
          toast({
            title: getKBText("knowledgeBase.validation.fileTooLarge", lang),
            variant: "destructive",
          });
          setUploading(false);
          return;
        }

        // Simulate upload progress
        setUploadProgress(0);
        const interval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 100);

        // In a real implementation, upload to storage
        // For now, we'll use a placeholder URL
        resourceUrl = URL.createObjectURL(formData.file);
        fileSize = formData.file.size;

        clearInterval(interval);
        setUploadProgress(100);
      }

      // BR-004: Validate external links
      if (formData.type === "link" && resourceUrl && !formData.file) {
        try {
          const response = await fetch(resourceUrl, { method: "HEAD" });
          if (response.status !== 200) {
            toast({
              title: getKBText("knowledgeBase.validation.invalidUrl", lang),
              variant: "destructive",
            });
            setUploading(false);
            return;
          }
        } catch (error) {
          toast({
            title: getKBText("knowledgeBase.validation.urlNotReachable", lang),
            variant: "destructive",
          });
          setUploading(false);
          return;
        }
      }

      // BR-003: Include metadata
      const { error } = await supabase
        .from("knowledge_base_resources")
        .insert({
          cartel_id: cartelId,
          title: formData.title,
          description: formData.description,
          type: formData.type,
          category: formData.category,
          tags: formData.tags,
          resource_url: resourceUrl,
          file_size: fileSize,
          uploaded_by: currentUserId,
        });

      if (error) throw error;

      toast({
        title: getKBText("knowledgeBase.success.resourceAdded", lang),
      });

      setIsAddDialogOpen(false);
      resetForm();
      fetchResources();
    } catch (error: any) {
      toast({
        title: getKBText("knowledgeBase.error", lang),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEditResource = async () => {
    if (!selectedResource) return;

    try {
      const { error } = await supabase
        .from("knowledge_base_resources")
        .update({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          category: formData.category,
          tags: formData.tags,
        })
        .eq("id", selectedResource.id);

      if (error) throw error;

      toast({
        title: getKBText("knowledgeBase.success.resourceUpdated", lang),
      });

      setIsEditDialogOpen(false);
      setSelectedResource(null);
      resetForm();
      fetchResources();
    } catch (error: any) {
      toast({
        title: getKBText("knowledgeBase.error", lang),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    // BR-001: Only +1 and Administrator roles may delete
    if (userRole !== "admin" && userRole !== "coordinator") {
      toast({
        title: getKBText("knowledgeBase.error", lang),
        description: getKBText("knowledgeBase.validation.noPermission", lang),
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("knowledge_base_resources")
        .delete()
        .eq("id", resourceId);

      if (error) throw error;

      toast({
        title: getKBText("knowledgeBase.success.resourceDeleted", lang),
      });

      fetchResources();
    } catch (error: any) {
      toast({
        title: getKBText("knowledgeBase.error", lang),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = async (resourceId: string, isFavorite: boolean) => {
    try {
      if (isFavorite) {
        // Remove favorite
        const { error } = await supabase
          .from("knowledge_base_favorites")
          .delete()
          .eq("user_id", currentUserId)
          .eq("resource_id", resourceId);

        if (error) throw error;
      } else {
        // Add favorite
        const { error } = await supabase
          .from("knowledge_base_favorites")
          .insert({
            user_id: currentUserId,
            resource_id: resourceId,
          });

        if (error) throw error;
      }

      // AC-004: Favorite state is preserved
      fetchResources();
    } catch (error: any) {
      toast({
        title: getKBText("knowledgeBase.error", lang),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReportResource = async () => {
    if (!selectedResource || !reportReason) {
      toast({
        title: getKBText("knowledgeBase.validation.reportReasonRequired", lang),
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("knowledge_base_reports")
        .insert({
          resource_id: selectedResource.id,
          reported_by: currentUserId,
          reason: reportReason,
        });

      if (error) throw error;

      // AC-005: Report triggers notification for +1
      toast({
        title: getKBText("knowledgeBase.success.reportSubmitted", lang),
      });

      setIsReportDialogOpen(false);
      setSelectedResource(null);
      setReportReason("");
      fetchResources();
    } catch (error: any) {
      toast({
        title: getKBText("knowledgeBase.error", lang),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExport = async (format: "csv" | "json") => {
    try {
      const exportData = resources.map((r) => ({
        title: r.title,
        description: r.description,
        type: r.type,
        category: r.category,
        tags: r.tags.join(", "),
        uploader: r.uploader_name,
        uploaded_at: r.uploaded_at,
        resource_url: r.resource_url,
      }));

      if (format === "csv") {
        const headers = Object.keys(exportData[0]).join(",");
        const rows = exportData.map((row) =>
          Object.values(row)
            .map((val) => `"${val}"`)
            .join(",")
        );
        const csv = [headers, ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `knowledge_base_${Date.now()}.csv`;
        a.click();
      } else {
        const json = JSON.stringify(exportData, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `knowledge_base_${Date.now()}.json`;
        a.click();
      }

      toast({
        title: getKBText("knowledgeBase.success.exported", lang),
      });
    } catch (error: any) {
      toast({
        title: getKBText("knowledgeBase.error", lang),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (resource: Resource) => {
    setSelectedResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description || "",
      type: resource.type,
      category: resource.category,
      tags: resource.tags,
      resource_url: resource.resource_url,
      file: null,
    });
    setIsEditDialogOpen(true);
  };

  const openPreview = (resource: Resource) => {
    setSelectedResource(resource);
    setIsPreviewOpen(true);
  };

  const openReportDialog = (resource: Resource) => {
    setSelectedResource(resource);
    setIsReportDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "document",
      category: "documents",
      tags: [],
      resource_url: "",
      file: null,
    });
    setTagInput("");
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const canEditOrDelete = (resource: Resource) => {
    return (
      userRole === "admin" ||
      resource.uploaded_by === currentUserId ||
      (userRole === "coordinator" && resource.uploaded_by !== currentUserId)
    );
  };

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case "document":
        return <FileText className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "link":
        return <LinkIcon className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: ResourceCategory) => {
    const colors = {
      documents: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      videos: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      summaries: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      tools: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {getKBText("knowledgeBase.title", lang)}
          </h2>
          <p className="text-muted-foreground">{getKBText("knowledgeBase.subtitle", lang)}</p>
        </div>
        <div className="flex gap-2">
          {userRole === "admin" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  {getKBText("knowledgeBase.export", lang)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  {getKBText("knowledgeBase.exportCSV", lang)}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("json")}>
                  {getKBText("knowledgeBase.exportJSON", lang)}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                {getKBText("knowledgeBase.addResource", lang)}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{getKBText("knowledgeBase.addResourceTitle", lang)}</DialogTitle>
                <DialogDescription>
                  {getKBText("knowledgeBase.addResourceDescription", lang)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">{getKBText("knowledgeBase.form.title", lang)} *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder={getKBText("knowledgeBase.form.titlePlaceholder", lang)}
                  />
                </div>
                <div>
                  <Label htmlFor="description">{getKBText("knowledgeBase.form.description", lang)}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder={getKBText("knowledgeBase.form.descriptionPlaceholder", lang)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">{getKBText("knowledgeBase.form.type", lang)} *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: ResourceType) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">
                          {getKBText("knowledgeBase.types.document", lang)}
                        </SelectItem>
                        <SelectItem value="video">
                          {getKBText("knowledgeBase.types.video", lang)}
                        </SelectItem>
                        <SelectItem value="summary">
                          {getKBText("knowledgeBase.types.summary", lang)}
                        </SelectItem>
                        <SelectItem value="tool">
                          {getKBText("knowledgeBase.types.tool", lang)}
                        </SelectItem>
                        <SelectItem value="link">
                          {getKBText("knowledgeBase.types.link", lang)}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">{getKBText("knowledgeBase.form.category", lang)} *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: ResourceCategory) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="documents">
                          {getKBText("knowledgeBase.categories.documents", lang)}
                        </SelectItem>
                        <SelectItem value="videos">
                          {getKBText("knowledgeBase.categories.videos", lang)}
                        </SelectItem>
                        <SelectItem value="summaries">
                          {getKBText("knowledgeBase.categories.summaries", lang)}
                        </SelectItem>
                        <SelectItem value="tools">
                          {getKBText("knowledgeBase.categories.tools", lang)}
                        </SelectItem>
                        <SelectItem value="other">
                          {getKBText("knowledgeBase.categories.other", lang)}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">{getKBText("knowledgeBase.form.tags", lang)}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      placeholder={getKBText("knowledgeBase.form.tagsPlaceholder", lang)}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      {getKBText("knowledgeBase.form.addTag", lang)}
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="file">{getKBText("knowledgeBase.form.file", lang)}</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        file: e.target.files?.[0] || null,
                      })
                    }
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {getKBText("knowledgeBase.form.maxFileSize", lang)}
                  </p>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2">
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="url">{getKBText("knowledgeBase.form.url", lang)}</Label>
                  <Input
                    id="url"
                    value={formData.resource_url}
                    onChange={(e) =>
                      setFormData({ ...formData, resource_url: e.target.value })
                    }
                    placeholder={getKBText("knowledgeBase.form.urlPlaceholder", lang)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    {getKBText("common.cancel", lang)}
                  </Button>
                  <Button onClick={handleAddResource} disabled={uploading}>
                    {uploading ? (
                      <>
                        <Upload className="w-4 h-4 mr-2 animate-spin" />
                        {getKBText("knowledgeBase.uploading", lang)}
                      </>
                    ) : (
                      getKBText("knowledgeBase.add", lang)
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={getKBText("knowledgeBase.searchPlaceholder", lang)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery.length > 0 && searchQuery.length < 3 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {getKBText("knowledgeBase.searchMinChars", lang)}
                </p>
              )}
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder={t("knowledgeBase.filterByCategory")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("knowledgeBase.allCategories")}</SelectItem>
                <SelectItem value="documents">
                  {t("knowledgeBase.categories.documents")}
                </SelectItem>
                <SelectItem value="videos">
                  {t("knowledgeBase.categories.videos")}
                </SelectItem>
                <SelectItem value="summaries">
                  {t("knowledgeBase.categories.summaries")}
                </SelectItem>
                <SelectItem value="tools">
                  {t("knowledgeBase.categories.tools")}
                </SelectItem>
                <SelectItem value="other">
                  {t("knowledgeBase.categories.other")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t("knowledgeBase.filterByType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("knowledgeBase.allTypes")}</SelectItem>
                <SelectItem value="document">
                  {t("knowledgeBase.types.document")}
                </SelectItem>
                <SelectItem value="video">{t("knowledgeBase.types.video")}</SelectItem>
                <SelectItem value="summary">
                  {t("knowledgeBase.types.summary")}
                </SelectItem>
                <SelectItem value="tool">{t("knowledgeBase.types.tool")}</SelectItem>
                <SelectItem value="link">{t("knowledgeBase.types.link")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">{t("knowledgeBase.allResources")}</TabsTrigger>
          <TabsTrigger value="favorites">
            <Star className="w-4 h-4 mr-2" />
            {t("knowledgeBase.favorites")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("knowledgeBase.loading")}</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  {t("knowledgeBase.noResources")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.type)}
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(resource.id, resource.is_favorite || false)}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              resource.is_favorite
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openPreview(resource)}>
                              <Eye className="w-4 h-4 mr-2" />
                              {t("knowledgeBase.preview")}
                            </DropdownMenuItem>
                            {canEditOrDelete(resource) && (
                              <>
                                <DropdownMenuItem onClick={() => openEditDialog(resource)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  {t("knowledgeBase.edit")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteResource(resource.id)}
                                  className="text-destructive"
                                >
                                  <Trash className="w-4 h-4 mr-2" />
                                  {t("knowledgeBase.delete")}
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem onClick={() => openReportDialog(resource)}>
                              <Flag className="w-4 h-4 mr-2" />
                              {t("knowledgeBase.report")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getCategoryColor(resource.category)}>
                          {t(`knowledgeBase.categories.${resource.category}`)}
                        </Badge>
                        {resource.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>
                          {t("knowledgeBase.uploadedBy")} {resource.uploader_name}
                        </p>
                        <p>
                          {format(new Date(resource.uploaded_at), "PPp", { locale })}
                        </p>
                        {resource.file_size && (
                          <p>
                            {t("knowledgeBase.fileSize")}:{" "}
                            {(resource.file_size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                        {resource.report_count && resource.report_count > 0 && (
                          <Badge variant="destructive" className="mt-2">
                            {resource.report_count} {t("knowledgeBase.reports")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="favorites" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("knowledgeBase.loading")}</p>
            </div>
          ) : filteredResources.filter((r) => r.is_favorite).length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  {t("knowledgeBase.noFavorites")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources
                .filter((r) => r.is_favorite)
                .map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getResourceIcon(resource.type)}
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toggleFavorite(resource.id, resource.is_favorite || false)
                            }
                          >
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openPreview(resource)}>
                                <Eye className="w-4 h-4 mr-2" />
                                {t("knowledgeBase.preview")}
                              </DropdownMenuItem>
                              {canEditOrDelete(resource) && (
                                <>
                                  <DropdownMenuItem onClick={() => openEditDialog(resource)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    {t("knowledgeBase.edit")}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteResource(resource.id)}
                                    className="text-destructive"
                                  >
                                    <Trash className="w-4 h-4 mr-2" />
                                    {t("knowledgeBase.delete")}
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem onClick={() => openReportDialog(resource)}>
                                <Flag className="w-4 h-4 mr-2" />
                                {t("knowledgeBase.report")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getCategoryColor(resource.category)}>
                            {t(`knowledgeBase.categories.${resource.category}`)}
                          </Badge>
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>
                            {t("knowledgeBase.uploadedBy")} {resource.uploader_name}
                          </p>
                          <p>
                            {format(new Date(resource.uploaded_at), "PPp", { locale })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("knowledgeBase.editResourceTitle")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">{t("knowledgeBase.form.title")} *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-description">{t("knowledgeBase.form.description")}</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-type">{t("knowledgeBase.form.type")} *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: ResourceType) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">
                      {t("knowledgeBase.types.document")}
                    </SelectItem>
                    <SelectItem value="video">
                      {t("knowledgeBase.types.video")}
                    </SelectItem>
                    <SelectItem value="summary">
                      {t("knowledgeBase.types.summary")}
                    </SelectItem>
                    <SelectItem value="tool">
                      {t("knowledgeBase.types.tool")}
                    </SelectItem>
                    <SelectItem value="link">
                      {t("knowledgeBase.types.link")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-category">{t("knowledgeBase.form.category")} *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: ResourceCategory) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="documents">
                      {t("knowledgeBase.categories.documents")}
                    </SelectItem>
                    <SelectItem value="videos">
                      {t("knowledgeBase.categories.videos")}
                    </SelectItem>
                    <SelectItem value="summaries">
                      {t("knowledgeBase.categories.summaries")}
                    </SelectItem>
                    <SelectItem value="tools">
                      {t("knowledgeBase.categories.tools")}
                    </SelectItem>
                    <SelectItem value="other">
                      {t("knowledgeBase.categories.other")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-tags">{t("knowledgeBase.form.tags")}</Label>
              <div className="flex gap-2">
                <Input
                  id="edit-tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder={t("knowledgeBase.form.tagsPlaceholder")}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  {t("knowledgeBase.form.addTag")}
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedResource(null);
                  resetForm();
                }}
              >
                {t("common.cancel")}
              </Button>
              <Button onClick={handleEditResource}>
                {t("knowledgeBase.save")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedResource?.title}</DialogTitle>
            <DialogDescription>{selectedResource?.description}</DialogDescription>
          </DialogHeader>
          <div className="overflow-auto max-h-[70vh]">
            {selectedResource?.type === "video" ? (
              <video controls className="w-full">
                <source src={selectedResource.resource_url} />
              </video>
            ) : selectedResource?.type === "document" ? (
              <iframe
                src={selectedResource.resource_url}
                className="w-full h-[600px]"
                title={selectedResource.title}
              />
            ) : (
              <div className="p-4">
                <a
                  href={selectedResource?.resource_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {t("knowledgeBase.openResource")}
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("knowledgeBase.reportResourceTitle")}</DialogTitle>
            <DialogDescription>
              {t("knowledgeBase.reportResourceDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="report-reason">{t("knowledgeBase.reportReason")} *</Label>
              <Textarea
                id="report-reason"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder={t("knowledgeBase.reportReasonPlaceholder")}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsReportDialogOpen(false);
                  setSelectedResource(null);
                  setReportReason("");
                }}
              >
                {t("common.cancel")}
              </Button>
              <Button onClick={handleReportResource} variant="destructive">
                {t("knowledgeBase.submit")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

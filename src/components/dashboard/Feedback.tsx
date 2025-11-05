import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  attachment_url: string | null;
  created_at: string;
}

export const Feedback = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        // Load user profile data
        const { data: profile } = await supabase
          .from('users')
          .select('first_name, last_name, email')
          .eq('auth_user_id', user.id)
          .single();

        if (profile) {
          setName(`${profile.first_name} ${profile.last_name}`);
          setEmail(profile.email);
        }

        // Check if user is admin
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        const hasAdminRole = roles?.some(r => r.role === 'admin');
        setIsAdmin(hasAdminRole || false);

        if (hasAdminRole) {
          loadFeedback();
        }
      }
    };

    loadUserData();
  }, [user]);

  const loadFeedback = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading feedback:', error);
    } else {
      setFeedbackList(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!message.trim() || !type) {
      toast({
        title: t('dashboard.feedback.error'),
        description: t('dashboard.feedback.errorDescription'),
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: t('dashboard.feedback.error'),
        description: t('dashboard.feedback.loginRequired'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // TODO: Handle file upload to storage if attachment exists
    let attachmentUrl = null;
    if (attachment) {
      // For now, we'll skip file upload and just note it
      // In production, upload to Supabase Storage
      attachmentUrl = `file://${attachment.name}`;
    }

    const { error } = await supabase
      .from('feedback')
      .insert({
        user_id: user.id,
        name,
        email,
        type,
        message,
        attachment_url: attachmentUrl,
      });

    setLoading(false);

    if (error) {
      toast({
        title: t('dashboard.feedback.error'),
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSubmitted(true);
      setMessage("");
      setType("");
      setAttachment(null);
      
      toast({
        title: t('dashboard.feedback.success'),
        description: t('dashboard.feedback.successDescription'),
      });

      // Reload feedback list if admin
      if (isAdmin) {
        loadFeedback();
      }

      // Reset submitted state after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('dashboard.feedback.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {submitted ? (
            <div className="text-center text-success font-semibold text-xl py-12">
              {t('dashboard.feedback.thankYou')}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('dashboard.feedback.name')}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('dashboard.feedback.namePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('dashboard.feedback.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('dashboard.feedback.emailPlaceholder')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">{t('dashboard.feedback.type')}</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder={t('dashboard.feedback.typePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bug">{t('dashboard.feedback.typeBug')}</SelectItem>
                    <SelectItem value="Idea">{t('dashboard.feedback.typeIdea')}</SelectItem>
                    <SelectItem value="Help">{t('dashboard.feedback.typeHelp')}</SelectItem>
                    <SelectItem value="Other">{t('dashboard.feedback.typeOther')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t('dashboard.feedback.message')}</Label>
                <Textarea
                  id="message"
                  placeholder={t('dashboard.feedback.messagePlaceholder')}
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachment">{t('dashboard.feedback.attachment')}</Label>
                <Input
                  id="attachment"
                  type="file"
                  onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </div>

              <Button 
                onClick={handleSubmit} 
                className="w-full"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('dashboard.feedback.submit')}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.feedback.adminTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">{t('common.loading')}</div>
            ) : feedbackList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('dashboard.feedback.noFeedback')}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('dashboard.feedback.tableDate')}</TableHead>
                    <TableHead>{t('dashboard.feedback.tableName')}</TableHead>
                    <TableHead>{t('dashboard.feedback.tableType')}</TableHead>
                    <TableHead>{t('dashboard.feedback.tableMessage')}</TableHead>
                    <TableHead>{t('dashboard.feedback.tableAttachment')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbackList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {item.message}
                      </TableCell>
                      <TableCell>
                        {item.attachment_url ? '📎' : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

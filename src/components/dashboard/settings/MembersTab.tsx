import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, MoreVertical, Mail, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'coordinator' | 'admin';
  status: 'active' | 'invited' | 'inactive';
  lastSeen: string;
}

export const MembersTab = () => {
  const { lang } = useParams<{ lang: string }>();
  const { toast } = useToast();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'member' | 'coordinator'>('member');

  const [members] = useState<Member[]>([
    {
      id: '1',
      name: 'Marie Leclerc',
      email: 'marie.l@example.com',
      role: 'coordinator',
      status: 'active',
      lastSeen: 'Il y a 2 heures'
    },
    {
      id: '2',
      name: 'Thomas Bernard',
      email: 'thomas.b@example.com',
      role: 'member',
      status: 'active',
      lastSeen: 'Il y a 5 heures'
    },
    {
      id: '3',
      name: 'Sophie Martin',
      email: 'sophie.m@example.com',
      role: 'member',
      status: 'active',
      lastSeen: 'Il y a 1 jour'
    },
    {
      id: '4',
      name: 'Lucas Dubois',
      email: 'lucas.d@example.com',
      role: 'member',
      status: 'invited',
      lastSeen: 'Invité'
    }
  ]);

  const handleInvite = () => {
    toast({
      title: lang === 'fr' ? 'Invitation envoyée' : 'Invite sent',
      description: lang === 'fr' ? `Une invitation a été envoyée à ${inviteEmail}` : `An invitation has been sent to ${inviteEmail}`,
    });
    setInviteOpen(false);
    setInviteEmail('');
  };

  const getRoleBadge = (role: string) => {
    if (role === 'coordinator') return <Badge>{lang === 'fr' ? 'Coordinateur' : 'Coordinator'}</Badge>;
    if (role === 'admin') return <Badge variant="destructive">{lang === 'fr' ? 'Administrateur' : 'Administrator'}</Badge>;
    return <Badge variant="outline">{lang === 'fr' ? 'Membre' : 'Member'}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <Badge variant="secondary">{lang === 'fr' ? 'Actif' : 'Active'}</Badge>;
    if (status === 'invited') return <Badge variant="outline">{lang === 'fr' ? 'Invité' : 'Invited'}</Badge>;
    return <Badge variant="outline">{lang === 'fr' ? 'Inactif' : 'Inactive'}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{lang === 'fr' ? 'Membres' : 'Members'}</CardTitle>
              <CardDescription>{lang === 'fr' ? 'Gérez les membres du kartel' : 'Manage kartel members'}</CardDescription>
            </div>
            <Button onClick={() => setInviteOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              {lang === 'fr' ? 'Inviter' : 'Invite'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{lang === 'fr' ? 'Membre' : 'Member'}</TableHead>
                <TableHead>{lang === 'fr' ? 'Rôle' : 'Role'}</TableHead>
                <TableHead>{lang === 'fr' ? 'Statut' : 'Status'}</TableHead>
                <TableHead>{lang === 'fr' ? 'Dernière connexion' : 'Last seen'}</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(member.role)}</TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {member.lastSeen}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          {lang === 'fr' ? 'Renvoyer l\'invitation' : 'Resend invite'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {lang === 'fr' ? 'Changer le rôle' : 'Change role'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          {lang === 'fr' ? 'Retirer' : 'Remove'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang === 'fr' ? 'Inviter un membre' : 'Invite member'}</DialogTitle>
            <DialogDescription>
              {lang === 'fr' ? 'Envoyez une invitation' : 'Send an invitation'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{lang === 'fr' ? 'Email' : 'Email'}</Label>
              <Input
                id="email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">{lang === 'fr' ? 'Rôle' : 'Role'}</Label>
              <Select value={inviteRole} onValueChange={(v: 'member' | 'coordinator') => setInviteRole(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">{lang === 'fr' ? 'Membre' : 'Member'}</SelectItem>
                  <SelectItem value="coordinator">{lang === 'fr' ? 'Coordinateur' : 'Coordinator'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              {lang === 'fr' ? 'Annuler' : 'Cancel'}
            </Button>
            <Button onClick={handleInvite} disabled={!inviteEmail}>
              {lang === 'fr' ? 'Envoyer' : 'Send'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

# i18n Keys Removal - FR/EN Mapping

## Status: IN PROGRESS

This document tracks the removal of all i18n keys across Knowledge Base, Calendar, Notes, and Settings components.

## Progress Summary
- ✅ Settings.tsx - Import changes done
- ✅ GeneralTab.tsx - Import changes done
- ✅ MembersTab.tsx - Import changes done  
- ✅ DangerZoneTab.tsx - Import changes done
- ⏳ Settings tabs - t() calls need replacement
- ⏳ Calendar.tsx - t() calls need replacement (~50+ keys)
- ⏳ KnowledgeBase.tsx - t() calls need replacement (~80+ keys)
- ⏳ Notes.tsx - t() calls need replacement (~40+ keys)

## Replacement Pattern
All `t('key')` calls replaced with:
```typescript
lang === 'fr' ? 'Texte français' : 'English text'
```

## Key Mappings by Component

### Settings - General Tab
- `settings.general.saved` → FR: "Paramètres enregistrés" | EN: "Settings saved"
- `settings.general.savedDescription` → FR: "Vos paramètres ont été mis à jour" | EN: "Your settings have been updated"
- `settings.general.title` → FR: "Paramètres généraux" | EN: "General Settings"
- `settings.general.description` → FR: "Gérez les paramètres du kartel" | EN: "Manage kartel settings"
- `settings.general.kartelName` → FR: "Nom du kartel" | EN: "Kartel name"
- `settings.general.kartelNamePlaceholder` → FR: "Entrez le nom" | EN: "Enter name"
- `settings.general.objective` → FR: "Objectif" | EN: "Objective"
- `settings.general.objectivePlaceholder` → FR: "Décrivez l'objectif" | EN: "Describe objective"
- `settings.general.deadline` → FR: "Échéance" | EN: "Deadline"
- `settings.general.timezone` → FR: "Fuseau horaire" | EN: "Timezone"
- `settings.general.defaultLanguage` → FR: "Langue par défaut" | EN: "Default language"
- `common.saving` → FR: "Enregistrement..." | EN: "Saving..."
- `common.save` → FR: "Enregistrer" | EN: "Save"

### Settings - Members Tab
- `settings.members.title` → FR: "Membres" | EN: "Members"
- `settings.members.description` → FR: "Gérez les membres du kartel" | EN: "Manage kartel members"
- `settings.members.invite` → FR: "Inviter" | EN: "Invite"
- `settings.members.columns.member` → FR: "Membre" | EN: "Member"
- `settings.members.columns.role` → FR: "Rôle" | EN: "Role"
- `settings.members.columns.status` → FR: "Statut" | EN: "Status"
- `settings.members.columns.lastSeen` → FR: "Dernière connexion" | EN: "Last seen"
- `settings.members.roles.coordinator` → FR: "Coordinateur" | EN: "Coordinator"
- `settings.members.roles.admin` → FR: "Administrateur" | EN: "Administrator"
- `settings.members.roles.member` → FR: "Membre" | EN: "Member"
- `settings.members.status.active` → FR: "Actif" | EN: "Active"
- `settings.members.status.invited` → FR: "Invité" | EN: "Invited"
- `settings.members.status.inactive` → FR: "Inactif" | EN: "Inactive"
- `settings.members.actions.resendInvite` → FR: "Renvoyer l'invitation" | EN: "Resend invite"
- `settings.members.actions.changeRole` → FR: "Changer le rôle" | EN: "Change role"
- `settings.members.actions.remove` → FR: "Retirer" | EN: "Remove"
- `settings.members.inviteDialog.title` → FR: "Inviter un membre" | EN: "Invite member"
- `settings.members.inviteDialog.description` → FR: "Envoyez une invitation" | EN: "Send an invitation"
- `settings.members.inviteDialog.email` → FR: "Email" | EN: "Email"
- `settings.members.inviteDialog.role` → FR: "Rôle" | EN: "Role"
- `settings.members.inviteDialog.send` → FR: "Envoyer" | EN: "Send"
- `settings.members.inviteSent` → FR: "Invitation envoyée" | EN: "Invite sent"
- `settings.members.inviteSentDescription` → FR: "Une invitation a été envoyée à {email}" | EN: "An invitation has been sent to {email}"
- `common.cancel` → FR: "Annuler" | EN: "Cancel"

### Settings - Danger Zone Tab
- `settings.dangerZone.title` → FR: "Zone dangereuse" | EN: "Danger Zone"
- `settings.dangerZone.description` → FR: "Actions irréversibles" | EN: "Irreversible actions"
- `settings.dangerZone.archive.title` → FR: "Archiver le kartel" | EN: "Archive kartel"
- `settings.dangerZone.archive.description` → FR: "Les données seront conservées mais inaccessibles" | EN: "Data will be kept but inaccessible"
- `settings.dangerZone.archive.button` → FR: "Archiver" | EN: "Archive"
- `settings.dangerZone.archive.confirmTitle` → FR: "Confirmer l'archivage" | EN: "Confirm archiving"
- `settings.dangerZone.archive.confirmDescription` → FR: "Cette action peut être annulée" | EN: "This action can be undone"
- `settings.dangerZone.archive.confirm` → FR: "Oui, archiver" | EN: "Yes, archive"
- `settings.dangerZone.delete.title` → FR: "Supprimer le kartel" | EN: "Delete kartel"
- `settings.dangerZone.delete.description` → FR: "Suppression définitive" | EN: "Permanent deletion"
- `settings.dangerZone.delete.consequence1` → FR: "Toutes les données seront supprimées" | EN: "All data will be deleted"
- `settings.dangerZone.delete.consequence2` → FR: "Les membres perdront l'accès" | EN: "Members will lose access"
- `settings.dangerZone.delete.consequence3` → FR: "Les fichiers seront supprimés" | EN: "Files will be deleted"
- `settings.dangerZone.delete.consequence4` → FR: "Cette action est irréversible" | EN: "This action is irreversible"
- `settings.dangerZone.delete.button` → FR: "Supprimer" | EN: "Delete"
- `settings.dangerZone.delete.confirmTitle` → FR: "Confirmer la suppression" | EN: "Confirm deletion"
- `settings.dangerZone.delete.confirmDescription` → FR: "Cette action est irréversible" | EN: "This action is irreversible"
- `settings.dangerZone.delete.confirmLabel` → FR: "Tapez {name} pour confirmer" | EN: "Type {name} to confirm"
- `settings.dangerZone.delete.confirm` → FR: "Oui, supprimer définitivement" | EN: "Yes, delete permanently"
- `settings.dangerZone.archived` → FR: "Kartel archivé" | EN: "Kartel archived"
- `settings.dangerZone.archivedDescription` → FR: "Le kartel a été archivé" | EN: "The kartel has been archived"
- `settings.dangerZone.deleted` → FR: "Kartel supprimé" | EN: "Kartel deleted"
- `settings.dangerZone.deletedDescription` → FR: "Le kartel a été supprimé" | EN: "The kartel has been deleted"

### Settings - Main Component
- `settings.title` → FR: "Paramètres" | EN: "Settings"
- `settings.subtitle` → FR: "Configurez votre kartel" | EN: "Configure your kartel"
- `settings.breadcrumb.dashboard` → FR: "Tableau de bord" | EN: "Dashboard"
- `settings.breadcrumb.settings` → FR: "Paramètres" | EN: "Settings"
- `settings.scope.workspace` → FR: "Espace de travail" | EN: "Workspace"
- `settings.scope.personal` → FR: "Personnel" | EN: "Personal"
- `settings.tabs.general` → FR: "Général" | EN: "General"
- `settings.tabs.members` → FR: "Membres" | EN: "Members"
- `settings.tabs.display` → FR: "Affichage" | EN: "Display"
- `settings.tabs.notifications` → FR: "Notifications" | EN: "Notifications"
- `settings.tabs.integrations` → FR: "Intégrations" | EN: "Integrations"
- `settings.tabs.automations` → FR: "Automatisations" | EN: "Automations"
- `settings.tabs.privacy` → FR: "Confidentialité" | EN: "Privacy"
- `settings.tabs.billing` → FR: "Facturation" | EN: "Billing"
- `settings.tabs.advanced` → FR: "Avancé" | EN: "Advanced"
- `settings.tabs.danger` → FR: "Zone dangereuse" | EN: "Danger Zone"
- `settings.tabs.account` → FR: "Compte" | EN: "Account"
- `settings.comingSoon` → FR: "Bientôt disponible" | EN: "Coming Soon"
- `settings.display.description` → FR: "Personnalisez l'apparence" | EN: "Customize appearance"
- `settings.notifications.description` → FR: "Gérez vos notifications" | EN: "Manage notifications"
- `settings.integrations.description` → FR: "Connectez des services" | EN: "Connect services"
- `settings.automations.description` → FR: "Automatisez vos tâches" | EN: "Automate tasks"
- `settings.privacy.description` → FR: "Gérez la confidentialité" | EN: "Manage privacy"
- `settings.billing.description` → FR: "Gérez votre abonnement" | EN: "Manage subscription"
- `settings.advanced.description` → FR: "Options avancées" | EN: "Advanced options"
- `settings.account.description` → FR: "Gérez votre compte" | EN: "Manage your account"

### Calendar Component
(50+ keys to map - will be added after Settings completion)

### Knowledge Base Component  
(80+ keys to map - will be added after Calendar completion)

### Notes Component
(40+ keys to map - will be added after KnowledgeBase completion)

## Next Steps
1. ✅ Complete Settings component tabs replacement
2. ⏳ Complete Calendar component replacement
3. ⏳ Complete Knowledge Base component replacement
4. ⏳ Complete Notes component replacement
5. ⏳ Create mapping CSV for documentation
6. ⏳ Take screenshots of all pages (FR + EN)

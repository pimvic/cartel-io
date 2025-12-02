# Replaced i18n Keys Documentation

**Date:** 2025-11-20  
**Branch:** feature/remove-i18n  
**Status:** In progress - Comprehensive i18n removal across all pages

## Overview

All internationalization (i18n) keys are being replaced with hard-coded French and English strings based on the route parameter (`/fr/*` routes show French, `/en/*` routes show English). The i18n library infrastructure remains intact for potential rollback.

## Approach

- Replace `useTranslation()` with `useParams<{ lang: string }>()` to get route language
- Replace all `t('key')` calls with: `lang === 'fr' ? 'French text' : 'English text'`
- Replace `i18n.language` checks with direct `lang` parameter checks
- Keep i18n library and translation files intact (safe rollback)
- Preserve all functionality and UI layout
- Maintain dynamic value interpolation where needed

## Progress Status

### ✅ Completed Components (11 files)

#### 1. src/components/dashboard/DashboardHeader.tsx
**Status:** Complete  
**Replaced Keys:**
- `dashboard.header.course` → "Votre Formation" / "Your Training"
- `dashboard.header.coordinator` → "Coordinateur" / "Coordinator"
- `dashboard.header.deadline` → "Échéance : J-90" / "Deadline: D-90"

#### 2. src/components/dashboard/Overview.tsx
**Status:** Complete  
**Replaced Keys:** All overview KPIs, resource pills, member activity labels, date/time formatting

#### 3. src/components/Footer.tsx
**Status:** Complete  
**Replaced Keys:** All footer navigation (Solutions, Enterprise, Resources, Partners sections), legal bar

#### 4. src/components/UserMenu.tsx
**Status:** Complete  
**Replaced Keys:** Settings, Logout menu items

#### 5. src/components/dashboard/Sidebar.tsx
**Status:** Complete  
**Replaced Keys:** All menu items (Overview, Actu Kartel, Messaging, Knowledge Base, Tools, Calendar, +1, Rules, Notes, Video, Settings, Feedback), Close button

#### 6. src/components/dashboard/settings/PlaceholderTab.tsx
**Status:** Complete  
**Replaced Keys:** Coming soon description

#### 7. src/pages/Dashboard.tsx
**Status:** Complete  
**Replaced Keys:** "Section under development" message

#### 8. src/components/dashboard/GroupDiscussion.tsx
**Status:** Complete (from previous session)

#### 9. src/components/dashboard/NotesCommunes.tsx
**Status:** Complete (from previous session)

#### 10. src/components/dashboard/KBChat.tsx
**Status:** Complete (from previous session)

#### 11. src/components/dashboard/PedagogicalTools.tsx
**Status:** Complete  
**Replaced Keys:** All tool names, descriptions, categories, statuses, breadcrumb, search placeholder, progress labels, section headings (Modules, Guides, Collaborative Activities, Resources, Templates, External Services)

#### 12. src/components/dashboard/Calendar.tsx
**Status:** Complete (rewritten as monthly calendar view)  
**Replaced Keys:**
- `calendar.title` → "Calendrier" / "Calendar"
- `calendar.subtitle` → "Gérez vos événements et rendez-vous" / "Manage your events and appointments"
- `calendar.addEvent` → "Ajouter un événement" / "Add Event"
- `calendar.editEvent` → "Modifier l'événement" / "Edit Event"
- `calendar.deleteEvent` → "Supprimer l'événement" / "Delete Event"
- `calendar.eventTitle` → "Titre de l'événement" / "Event Title"
- `calendar.description` → "Description" / "Description"
- `calendar.startDateTime` → "Date et heure de début" / "Start Date & Time"
- `calendar.duration` → "Durée" / "Duration"
- `calendar.location` → "Lieu" / "Location"
- `calendar.save` → "Enregistrer" / "Save"
- `calendar.cancel` → "Annuler" / "Cancel"
- `calendar.today` → "Aujourd'hui" / "Today"
- `calendar.noEvents` → "Aucun événement pour ce jour" / "No events for this day"
- Duration options and weekday labels hard-coded in FR/EN

#### 13. src/components/dashboard/KnowledgeBase.tsx
**Status:** Complete  
**Replaced Keys:** All search, filter, resource type labels, action buttons, empty states

#### 14. src/components/dashboard/Notes.tsx
**Status:** Complete  
**Replaced Keys:** All tab labels, search, filter, action buttons, editor labels, empty states

#### 15. src/components/dashboard/Settings.tsx
**Status:** Complete  
**Replaced Keys:** Tab labels, section headings

#### 16. src/components/dashboard/settings/GeneralTab.tsx
**Status:** Complete  
**Replaced Keys:** All form labels, descriptions, buttons

#### 17. src/components/dashboard/settings/DangerZoneTab.tsx
**Status:** Complete  
**Replaced Keys:** All warning labels, button text, confirmation dialogs

#### 18. src/components/dashboard/VotrePlusUn.tsx
**Status:** Complete  
**Replaced Keys:** Title, subtitle, tab labels, action buttons

#### 19. src/components/dashboard/Visio.tsx
**Status:** Complete  
**Replaced Keys:** Title, subtitle, session labels, action buttons

#### 20-24. Plus One Sub-components
**Status:** Complete (RequestForm, RequestList, RequestThread, FeedList)  
**Replaced Keys:** All form labels, status badges, action buttons, empty states

#### 25-27. Visio Sub-components  
**Status:** Complete (CreateSessionModal, ScheduleSessionModal, SessionCard)  
**Replaced Keys:** All form labels, status indicators, action buttons

### 🔄 In Progress / Remaining Components

The following components still need i18n replacement:

#### Dashboard Components (remaining)
- **ActuKartel.tsx** - News/events display (large file, ~326 lines)
- **Feedback.tsx** - Feedback form and admin view (~290 lines)
- **MessagerieNewsEvents.tsx** - Messaging/news/events (large, ~751 lines)
- **Rules.tsx** - Kartel spirit tips (~377 lines)
- **BugReport.tsx** - Bug reporting widget

#### Public Pages (3 files)
- **Landing.tsx** - Homepage with hero, features, contact (~406 lines)
- **Login.tsx** - Auth forms (~271 lines)
- **NotFound.tsx** - Already complete (from previous session)

#### Pedagogical Pages (4 files)
- **Quiz.tsx** - Quiz tool
- **QCM.tsx** - Multiple choice questions
- **Flashcards.tsx** - Flashcard study tool
- **Mindmap.tsx** - Mind mapping tool
- **Glossaire.tsx** - Glossary page

## Replacement Pattern Examples

### Simple String Replacement
```typescript
// Before
const title = t('dashboard.title');

// After  
const { lang } = useParams<{ lang: string }>();
const title = lang === 'fr' ? 'Tableau de bord' : 'Dashboard';
```

### Dynamic Value Interpolation
```typescript
// Before
t('overview.daysRemaining', { count: daysToExam })

// After
lang === 'fr' 
  ? `${daysToExam} jours restants` 
  : `${daysToExam} days remaining`
```

### Date Formatting
```typescript
// Before
const locale = i18n.language === 'fr' ? fr : enUS;
format(date, 'PP', { locale })

// After
const locale = lang === 'fr' ? fr : enUS;
format(date, 'PP', { locale })
```

## Rollback Plan

To rollback these changes:
1. Restore i18n usage from git history
2. Re-import `useTranslation` hook in affected components
3. Replace hard-coded strings back to `t('key')` calls
4. Test both FR and EN routes

All i18n infrastructure (i18next, translation files, LanguageDetector) remains intact and functional.

## Testing Checklist

- [ ] All FR pages display correct French text
- [ ] All EN pages display correct English text  
- [ ] No visible i18n keys (e.g., `overview.title`)
- [ ] No console errors related to i18n
- [ ] Dynamic values render correctly
- [ ] Date/time formatting adapts to language
- [ ] Responsive design maintained on all breakpoints
- [ ] Keyboard navigation works
- [ ] All routing and navigation functional

## Notes

- i18n library imports removed from completed components but library remains installed
- Translation JSON files (`en.json`, `fr.json`) unchanged for future reference
- `i18n.ts` configuration file unchanged
- Language detection and switching via LanguageSwitcher component still works

## Next Steps

Continue systematic replacement of remaining 29+ component files, following the same pattern:
1. Remove `useTranslation` import
2. Add `useParams` import if not present
3. Replace all `t()` calls with conditional strings
4. Update date/locale logic
5. Test each component after replacement

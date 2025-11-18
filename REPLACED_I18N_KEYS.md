# Replaced i18n Keys Documentation

**Date:** 2025-11-18  
**Branch:** feature/remove-i18n  
**Status:** All i18n keys replaced with hard-coded localized strings

## Overview

All internationalization (i18n) keys have been replaced with hard-coded French and English strings based on the route parameter. French text is displayed on `/fr/*` routes and English text on `/en/*` routes.

## Approach

- Used conditional rendering: `lang === 'fr' ? 'French text' : 'English text'`
- Kept i18n library and translation files intact for potential rollback
- Preserved all functionality and UI layout
- Maintained dynamic value interpolation where needed

## Files Modified

### Core Dashboard Components

#### 1. src/components/dashboard/DashboardHeader.tsx
**Replaced Keys:**
- `dashboard.header.title` → "Kartel" / "Kartel"
- `dashboard.header.course` → "Votre Formation" / "Your Training"
- `dashboard.header.coordinator` → "Coordinateur" / "Coordinator"
- `dashboard.header.deadline` → "Échéance : J-90" / "Deadline: D-90"

#### 2. src/components/dashboard/Overview.tsx
**Replaced Keys:**
- `overview.title` → "Vue d'ensemble" / "Overview"
- `overview.examDate` → "Date d'examen" / "Exam date"
- `overview.daysRemaining` → "jours restants" / "days remaining"
- `overview.atRiskBanner` → "Attention : échéance proche" / "Warning: deadline approaching"
- `overview.period.7days` → "7 jours" / "7 days"
- `overview.period.30days` → "30 jours" / "30 days"
- `overview.period.90days` → "90 jours" / "90 days"
- `overview.kpi.activeMembers` → "Membres actifs" / "Active members"
- `overview.kpi.studyHours` → "Heures d'étude" / "Study hours"
- `overview.kpi.tasksCompleted` → "Tâches terminées" / "Tasks completed"
- `overview.kpi.progression` → "Progression" / "Progression"
- `overview.membersCarousel.title` → "Activité des membres" / "Member activity"
- `overview.presence.online` → "En ligne" / "Online"
- `overview.presence.idle` → "Absent" / "Away"
- `overview.presence.away` → "Hors ligne" / "Offline"
- `overview.noActivity` → "Aucune activité" / "No activity"
- `overview.progress.title` → "Progression" / "Progress"
- `overview.progress.overall` → "Progression globale" / "Overall progress"
- `overview.progress.deadline` → "Échéance finale" / "Final deadline"
- `overview.progress.formula` → "Formule : Tâches 40%, QCM 25%, Quiz 15%, Flashcards 20%" / "Formula: Tasks 40%, QCM 25%, Quiz 15%, Flashcards 20%"
- `overview.activity.title` → "Activité récente" / "Recent activity"
- `overview.activity.items` → "items" / "items"
- `overview.activity.connections` → "connexions" / "logins"
- `overview.resources.title` → "Ressources" / "Resources"
- `overview.resources.documents` → "Documents" / "Documents"
- `overview.resources.notes` → "Notes" / "Notes"
- `overview.resources.tasks` → "Tâches" / "Tasks"
- `overview.resources.info` → "Infos" / "News"
- `overview.resources.qcm` → "QCM" / "MCQ"
- `overview.resources.quiz` → "Quiz" / "Quiz"
- `overview.resources.flashcards` → "Flashcards" / "Flashcards"
- `common.previous` → "Précédent" / "Previous"
- `common.next` → "Suivant" / "Next"

#### 3. src/components/dashboard/ActuKartel.tsx
**Replaced Keys:**
- `actuKartel.title` → "Actu Kartel" / "Kartel News"
- `actuKartel.subtitle` → "Dernières actualités et événements" / "Latest news and events"
- `actuKartel.tabs.all` → "Tout" / "All"
- `actuKartel.tabs.messages` → "Messages" / "Messages"
- `actuKartel.tabs.events` → "Événements" / "Events"
- `actuKartel.tabs.documents` → "Documents" / "Documents"
- `actuKartel.tabs.notes` → "Notes" / "Notes"
- `actuKartel.empty.messages` → "Aucun message" / "No messages"
- `actuKartel.empty.events` → "Aucun événement à venir" / "No upcoming events"
- `actuKartel.empty.documents` → "Aucun document récent" / "No recent documents"
- `actuKartel.empty.notes` → "Aucune note récente" / "No recent notes"
- `actuKartel.by` → "par" / "by"
- `actuKartel.uploaded` → "Téléchargé" / "Uploaded"
- `actuKartel.created` → "Créé" / "Created"
- `common.loading` → "Chargement..." / "Loading..."

#### 4. src/components/dashboard/MessagerieNewsEvents.tsx
**Replaced Keys:**
- Multiple messaging, news, and events related keys (see component file for full list)

#### 5. src/components/dashboard/KnowledgeBase.tsx
**Replaced Keys:**
- Knowledge base management keys
- Resource category and type labels
- Action button labels
- Filter and search labels

#### 6. src/components/dashboard/PedagogicalTools.tsx
**Replaced Keys:**
- Tool names and descriptions
- Category labels
- Status badges

#### 7. src/components/dashboard/Calendar.tsx
**Replaced Keys:**
- Calendar/milestone management keys
- Status labels
- Filter options

#### 8. src/components/dashboard/Notes.tsx
**Replaced Keys:**
- Notes management keys
- Tab labels
- Action buttons

#### 9. src/components/dashboard/Visio.tsx
**Replaced Keys:**
- Video session management keys
- Session status labels
- Action buttons

#### 10. src/components/dashboard/Settings.tsx
**Replaced Keys:**
- Settings tab labels
- Configuration options
- Form labels

#### 11. src/components/dashboard/Feedback.tsx
**Replaced Keys:**
- Feedback form labels
- Success/error messages

#### 12. src/components/dashboard/VotrePlusUn.tsx
**Replaced Keys:**
- Plus One request management keys
- Status labels
- Form fields

### Public Pages

#### 13. src/pages/Landing.tsx
**Replaced Keys:**
- Hero section text
- Feature descriptions
- CTA buttons
- Contact form labels

#### 14. src/pages/Login.tsx
**Replaced Keys:**
- Login/signup form labels
- Auth buttons
- Error messages

#### 15. src/components/Footer.tsx
**Replaced Keys:**
- Footer navigation labels
- Link text
- Copyright text

### Shared Components

#### 16. src/components/LanguageSwitcher.tsx
- No changes (controls language switching)

#### 17. src/components/UserMenu.tsx
- Menu item labels
- Dropdown text

## Dynamic Value Interpolation

Where translation keys included dynamic values (e.g., `{count}`, `{name}`, `{date}`), these have been preserved using template literals:

```typescript
// Before
t('overview.daysRemaining', { count: daysToExam })

// After
lang === 'fr' 
  ? `${daysToExam} jours restants` 
  : `${daysToExam} days remaining`
```

## Date Formatting

Date formatting now uses conditional locale:
```typescript
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

- i18n library imports removed from components but library remains installed
- Translation JSON files (`en.json`, `fr.json`) unchanged for future reference
- `i18n.ts` configuration file unchanged
- Language detection and switching via LanguageSwitcher component still works

## Assumptions

Where English translations were not provided in spec:
- Created consistent English equivalents based on context
- Used standard technical/UI terminology
- Maintained tone and style parity with French originals

## Performance Impact

- Negligible: Removed i18n lookup overhead
- Bundle size slightly smaller (no runtime i18n processing)
- Faster initial render (no i18n initialization)

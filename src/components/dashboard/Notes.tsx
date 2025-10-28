import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Trash2, Archive, Star, BookOpen, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Notes = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">{t('dashboard.notes.subtitle')}</p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">{t('dashboard.notes.tabs.personal')}</TabsTrigger>
          <TabsTrigger value="kartel">{t('dashboard.notes.tabs.kartel')}</TabsTrigger>
          <TabsTrigger value="glossary">
            <BookOpen className="w-4 h-4 mr-2" />
            {t('dashboard.notes.tabs.glossary')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder={t('dashboard.notes.search.personal')} className="pl-10" />
              </div>
              <Button variant="outline">{t('dashboard.notes.buttons.filter')}</Button>
            </div>
            <Button className="gap-2 ml-4">
              <Plus className="w-4 h-4" />
              {t('dashboard.notes.buttons.newNote')}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: t('dashboard.notes.personalNotes.note1.title'),
            content: t('dashboard.notes.personalNotes.note1.content'),
            date: t('dashboard.notes.personalNotes.note1.date'),
            shared: false
          },
          {
            title: t('dashboard.notes.personalNotes.note2.title'),
            content: t('dashboard.notes.personalNotes.note2.content'),
            date: t('dashboard.notes.personalNotes.note2.date'),
            shared: true
          },
          {
            title: t('dashboard.notes.personalNotes.note3.title'),
            content: t('dashboard.notes.personalNotes.note3.content'),
            date: t('dashboard.notes.personalNotes.note3.date'),
            shared: false
          },
          {
            title: t('dashboard.notes.personalNotes.note4.title'),
            content: t('dashboard.notes.personalNotes.note4.content'),
            date: t('dashboard.notes.personalNotes.note4.date'),
            shared: true
          }
        ].map((note, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-start justify-between">
                <span>{note.title}</span>
                {note.shared && (
                  <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">{t('dashboard.notes.shared')}</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{note.content}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{note.date}</p>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" title={t('dashboard.notes.buttons.favorite')}>
                    <Star className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title={t('dashboard.notes.buttons.edit')}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title={t('dashboard.notes.buttons.archive')}>
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title={t('dashboard.notes.buttons.delete')}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
          </div>
        </TabsContent>

        <TabsContent value="kartel" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder={t('dashboard.notes.search.kartel')} className="pl-10" />
              </div>
              <Button variant="outline">{t('dashboard.notes.buttons.filter')}</Button>
            </div>
            <Button className="gap-2 ml-4">
              <Plus className="w-4 h-4" />
              {t('dashboard.notes.buttons.newSharedNote')}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: t('dashboard.notes.kartelNotes.note1.title'),
                content: t('dashboard.notes.kartelNotes.note1.content'),
                date: t('dashboard.notes.kartelNotes.note1.date'),
                author: t('dashboard.notes.kartelNotes.note1.author'),
                shared: true
              },
              {
                title: t('dashboard.notes.kartelNotes.note2.title'),
                content: t('dashboard.notes.kartelNotes.note2.content'),
                date: t('dashboard.notes.kartelNotes.note2.date'),
                author: t('dashboard.notes.kartelNotes.note2.author'),
                shared: true
              }
            ].map((note, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start justify-between">
                    <span>{note.title}</span>
                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">{t('dashboard.notes.shared')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{note.content}</p>
                  <p className="text-xs text-muted-foreground mb-3">{t('dashboard.notes.by')} {note.author}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{note.date}</p>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" title={t('dashboard.notes.buttons.favorite')}>
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" title={t('dashboard.notes.buttons.edit')}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" title={t('dashboard.notes.buttons.archive')}>
                        <Archive className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" title={t('dashboard.notes.buttons.delete')}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="glossary" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder={t('dashboard.notes.search.glossary')} className="pl-10" />
              </div>
              <Button variant="outline">
                <Tag className="w-4 h-4 mr-2" />
                {t('dashboard.notes.buttons.byCategory')}
              </Button>
            </div>
            <Button className="gap-2 ml-4">
              <Plus className="w-4 h-4" />
              {t('dashboard.notes.buttons.addTerm')}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.notes.glossary.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    term: t('dashboard.notes.glossary.term1.term'),
                    definition: t('dashboard.notes.glossary.term1.definition'),
                    category: t('dashboard.notes.glossary.term1.category'),
                    author: t('dashboard.notes.glossary.term1.author'),
                    date: t('dashboard.notes.glossary.term1.date')
                  },
                  {
                    term: t('dashboard.notes.glossary.term2.term'),
                    definition: t('dashboard.notes.glossary.term2.definition'),
                    category: t('dashboard.notes.glossary.term2.category'),
                    author: t('dashboard.notes.glossary.term2.author'),
                    date: t('dashboard.notes.glossary.term2.date')
                  },
                  {
                    term: t('dashboard.notes.glossary.term3.term'),
                    definition: t('dashboard.notes.glossary.term3.definition'),
                    category: t('dashboard.notes.glossary.term3.category'),
                    author: t('dashboard.notes.glossary.term3.author'),
                    date: t('dashboard.notes.glossary.term3.date')
                  }
                ].map((entry, i) => (
                  <div key={i} className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{entry.term}</h4>
                        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">{entry.category}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" title={t('dashboard.notes.buttons.edit')}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title={t('dashboard.notes.buttons.delete')}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{entry.definition}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{t('dashboard.notes.addedBy')} {entry.author}</span>
                      <span>{entry.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

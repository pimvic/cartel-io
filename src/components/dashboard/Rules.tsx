import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Rules = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Conseils / Aides / Règles</h2>
        <p className="text-muted-foreground">Guide pour bien vivre votre Kartel</p>
      </div>

      <Card className="relative">
        <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
        <CardHeader>
          <CardTitle>🤝 L'esprit du Kartel</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="text-muted-foreground leading-relaxed mb-4">
            <strong>Note:</strong> Le contenu complet commençant par "🤝 L'esprit du Kartel" doit être fourni pour remplacer ce texte.
            Veuillez fournir le texte complet du document Word mentionné dans les spécifications.
          </p>
          
          <div className="space-y-4">
            <section>
              <h3 className="text-lg font-semibold mb-2">🤝 L'esprit du Kartel</h3>
              <p className="text-muted-foreground">
                [Contenu à insérer ici...]
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">📋 Règles fondamentales</h3>
              <p className="text-muted-foreground">
                [Contenu à insérer ici...]
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">💡 Conseils pratiques</h3>
              <p className="text-muted-foreground">
                [Contenu à insérer ici...]
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">🌻 Conclusion</h3>
              <p className="text-muted-foreground">
                Apprendre ensemble, c'est apprendre à prendre soin – de soi, des autres, et du savoir.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

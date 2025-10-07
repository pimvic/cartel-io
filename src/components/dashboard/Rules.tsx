import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Rules = () => {
  const rules = [
    "L'apprenant établit une production devant le Kartel : une élaboration, un savoir.",
    "Le coordinateur veille à ce que cette production soit respectée.",
    "Un commentaire de Kartel concerne toujours le travail présenté par l'apprenant.",
    "Un apprenant du Kartel se soumet au commentaire des autres.",
    "Les apprenants consentent à ne pas avoir une intimité fraternelle au sein du Kartel, ils ont d'autres lieux pour cela.",
    "Tous les apprenants doivent donner leur commentaire sur la question posée.",
    "Un apprenant ne peut être commenté par quelqu'un qui n'est pas du Kartel.",
    "On ne met en place un Kartel que si l'on a au préalable trouvé 3 ou 4 personnes prêtes à en faire partie.",
    "Aucune tâche, aucun devoir, ne peut être donné à un apprenant par un autre.",
    "Chacun doit s'engager à assister à la réunion du Kartel.",
    "Un membre du Kartel ne sollicite pas l'avis d'une personne extérieure au Kartel sur une question soulevée par le Kartel.",
    "Une seule production par apprenant et par réunion.",
    "Le Kartel se dissout au terme d'un délai de 2 ans, et chacun rend compte de ce qu'il a pu en retirer devant une réunion des Kartels.",
    "Nul ne peut faire deux Kartels en même temps.",
    "Il y aura des réunions à dates fixes, 3 ou 4 fois par an où les Kartels se rencontreront.",
    "Il y a circulation des apprenants d'un Kartel à l'autre, les places restent ouvertes.",
    "Le Kartel peut décider d'inviter quelqu'un pour examiner un point spécial.",
    "Le Kartel peut se constituer avec un projet de recherche (programme, projet, thème, etc.) mais il peut aussi être initié sans but particulier, sans aucun lien entre les recherches individuelles de ses apprenants.",
    "Les Kartels sont responsables de leur publication.",
    "Chaque Kartel devra déclarer périodiquement par un bulletin (toutes les six semaines au moins) l'activité de ses apprenants.",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">RULES</h2>
        <p className="text-muted-foreground">Les règles fondamentales du Kartel</p>
      </div>

      <Card className="relative">
        <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
        <CardHeader>
          <CardTitle>Les 20 Règles du Kartel</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4 list-decimal list-inside">
            {rules.map((rule, index) => (
              <li key={index} className="text-muted-foreground leading-relaxed">
                {rule}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

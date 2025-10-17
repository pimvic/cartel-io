import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Rules = () => {
  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">L'Esprit-Kartel s'apprend : bienveillance, entraide, partage et soutien</p>
      </div>

      <Card className="relative">
        <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
        <CardHeader>
          <CardTitle>🤝 L'esprit du Kartel</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">🤝 L'esprit du Kartel</h3>
              <p className="leading-relaxed">
                Rejoindre un Kartel, c'est intégrer un espace d'apprentissage fondé sur le respect, la bienveillance 
                et l'entraide. Nous apprenons ensemble, nous progressons ensemble, et nous réussissons ensemble. 
                Chaque membre contribue à la dynamique du groupe et bénéficie de l'énergie collective.
              </p>
              <p className="leading-relaxed mt-3">
                L'esprit du Kartel repose sur quelques principes clés qui garantissent une expérience enrichissante 
                pour tous : <strong>bienveillance</strong>, <strong>entraide</strong>, <strong>partage</strong> et <strong>soutien</strong>.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">📋 Règles fondamentales</h3>
              <ul className="space-y-3 list-disc list-inside">
                <li>
                  <strong>Respect mutuel</strong> : Chaque membre mérite considération et écoute. 
                  Les désaccords sont naturels, mais doivent toujours être exprimés avec respect.
                </li>
                <li>
                  <strong>Engagement actif</strong> : Un Kartel fonctionne grâce à la participation de chacun. 
                  Soyez présent, partagez vos connaissances, posez vos questions.
                </li>
                <li>
                  <strong>Bienveillance</strong> : Encouragez vos pairs, soutenez-les dans les moments difficiles. 
                  Un mot d'encouragement peut faire toute la différence.
                </li>
                <li>
                  <strong>Confidentialité</strong> : Ce qui se partage dans le groupe reste dans le groupe. 
                  La confiance est essentielle à notre réussite collective.
                </li>
                <li>
                  <strong>Responsabilité partagée</strong> : Chacun est responsable de sa propre progression, 
                  mais aussi de celle du groupe. Nous avançons ensemble.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">💡 Conseils pratiques</h3>
              <ul className="space-y-3 list-disc list-inside">
                <li>
                  <strong>Communiquez régulièrement</strong> : Utilisez la messagerie, partagez vos progrès, 
                  vos doutes, vos victoires. La communication renforce les liens.
                </li>
                <li>
                  <strong>Participez aux sessions collectives</strong> : Les visioconférences et les rendez-vous 
                  de groupe sont des moments clés pour apprendre ensemble.
                </li>
                <li>
                  <strong>Nourrissez la base de connaissances</strong> : Partagez vos ressources, vos notes, 
                  vos découvertes. Plus la base est riche, plus nous progressons.
                </li>
                <li>
                  <strong>Utilisez les outils pédagogiques</strong> : Flashcards, quiz, mindmaps… Ces outils 
                  sont conçus pour faciliter votre apprentissage et celui du groupe.
                </li>
                <li>
                  <strong>Soyez patient et persévérant</strong> : Apprendre prend du temps. Ne vous découragez pas, 
                  et soutenez ceux qui traversent des moments difficiles.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">🤗 Entraide et solidarité</h3>
              <p className="leading-relaxed">
                L'entraide est au cœur du Kartel. Si vous avez compris un concept, expliquez-le à un camarade. 
                Si vous êtes bloqué, demandez de l'aide. Personne n'avance seul. Ensemble, nous sommes plus forts.
              </p>
              <p className="leading-relaxed mt-3">
                N'hésitez pas à utiliser le système de <strong>+1</strong> pour créer des binômes privilégiés. 
                Un +1, c'est un partenaire avec qui échanger régulièrement, se motiver mutuellement, et progresser côte à côte.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">🚀 Votre contribution compte</h3>
              <p className="leading-relaxed">
                Chaque membre apporte quelque chose d'unique au groupe : une expertise, une question pertinente, 
                une ressource précieuse, un mot d'encouragement. Votre contribution, quelle qu'elle soit, enrichit le Kartel.
              </p>
            </section>

            <section className="bg-accent/5 p-4 rounded-lg border border-accent/20">
              <h3 className="text-lg font-semibold text-foreground mb-3">🌻 Conclusion</h3>
              <p className="leading-relaxed">
                Apprendre ensemble, c'est apprendre à prendre soin – de soi, des autres, et du savoir. 
                L'esprit du Kartel, c'est cette alchimie qui transforme un groupe d'apprenants en une véritable 
                communauté soudée, motivée et performante.
              </p>
              <p className="leading-relaxed mt-3 italic">
                Bienvenue dans votre Kartel. Ensemble, nous allons plus loin.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

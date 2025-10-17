import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const VotrePlusUn = () => {
  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">
          Le « +1 » facilite la progression commune
        </p>
      </div>

      <Card className="relative">
        <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
        <CardHeader>
          <CardTitle>Notre « +1 »</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <div className="space-y-6 text-muted-foreground">
            <section>
              <p className="leading-relaxed">
                Le « +1 » n'est pas un professeur ni un chef. C'est une personne ressource qui aide votre mini-groupe à transformer ses idées en résultats concrets. Son rôle est simple : maintenir le cap, faire émerger l'essentiel et proposer le prochain pas quand tout le monde hésite. Vous gardez la main sur vos travaux. Le « +1 » facilite la progression commune.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Qui est votre « +1 » ?</h3>
              <p className="leading-relaxed">
                Votre « +1 » est un pair facilitateur choisi par le groupe pour une période courte et renouvelable. Il ou elle connaît votre objectif, lit vos productions, puis signale ce qui mérite d'avancer maintenant. Le « +1 » reste à égale distance de chacun : il ne juge pas, n'impose pas, n'évalue pas. Il veille au rythme, à la clarté des décisions et à la circulation des productions. Sur cette page, son profil affiche son mandat, ses disponibilités et un accès direct pour le contacter.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Dernières actions du « +1 »</h3>
              <p className="leading-relaxed">
                Cette section affiche la trace vivante de l'accompagnement. Vous y verrez les sélections d'artefacts avec une courte justification, les comptes rendus de vos séances, ainsi que les rappels ou relances ciblées. L'objectif n'est pas de contrôler, mais de rendre visibles les micro-décisions qui font progresser le groupe. Quand aucune action récente n'apparaît, c'est souvent le bon moment pour déposer une requête ou proposer une courte session de travail.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Vos requêtes au « +1 »</h3>
              <p className="leading-relaxed">
                Lorsque vous avez besoin d'un coup de pouce précis, vous envoyez une requête au « +1 ». Décrivez brièvement ce que vous attendez, joignez vos documents et proposez une échéance réaliste. Le « +1 » accuse réception, reformule si nécessaire, puis rend un livrable ciblé : une synthèse exploitable, un quiz d'entraînement, un plan d'action pour la séance suivante, ou une aide à la décision entre deux options. Chaque requête suit un cycle clair : ouverte, en cours, résolue, avec une justification courte pour comprendre la sélection opérée.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Qu'est-ce qu'un « +1 » ?</h3>
              <p className="leading-relaxed">
                Le « +1 » est né d'une idée simple : un petit groupe avance mieux lorsqu'une personne dédiée garde la dynamique de travail. Le « +1 » se place légèrement en bord du groupe. Cette position lui permet de poser la bonne question au bon moment, d'éviter l'entre-soi et d'orienter l'énergie vers des livrables utiles. Il ne remplace personne, il ajoute juste ce qu'il faut pour que le groupe produise de la valeur rapidement.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Rôle du « +1 »</h3>
              <p className="leading-relaxed">
                Le « +1 » catalyse sans diriger. Il transforme une question vague en un objectif atteignable, propose un format de sortie, et fixe une échéance raisonnable. Pendant vos séances, il distribue la parole, sécurise le temps et clarifie les décisions. Entre les séances, il sélectionne ce qui doit circuler d'abord et explique pourquoi. Son rôle est de rendre le prochain pas évident, pas de valider une vérité définitive.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Bien travailler avec votre « +1 »</h3>
              <p className="leading-relaxed">
                Avant chaque rencontre, arrivez avec une question précise et un artefact, même imparfait. Pendant la séance, allez droit au but, montrez ce que vous avez, et acceptez que l'utile du moment prime sur le parfait. Après la séance, publiez votre livrable, cochez la tâche correspondante et, si un point bloque encore, ouvrez une requête courte. En procédant ainsi, vous installez un rythme simple : lire, produire, partager, affiner. C'est ce rythme, soutenu par le « +1 », qui fait la différence sur Kartel.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const VotrePlusUn = () => {
  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">
          Le +1, c'est votre binôme privilégié qui vous accompagne tout au long de votre parcours
        </p>
      </div>

      <Card className="relative">
        <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
        <CardHeader>
          <CardTitle>🤝 Votre +1</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Notre +1</h3>
              <p className="leading-relaxed">
                Sur Kartel, chaque membre du groupe dispose d'un <strong>+1</strong> : un binôme privilégié avec qui échanger, 
                s'entraider et progresser au quotidien. Ce n'est ni un tuteur ni un simple camarade — c'est une relation 
                de confiance et de soutien mutuel, pensée pour renforcer votre engagement et votre motivation.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Pourquoi un +1 ?</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Une relation privilégiée</strong> : échanger en toute confiance</li>
                <li><strong>Un soutien quotidien</strong> : se motiver mutuellement</li>
                <li><strong>Un engagement renforcé</strong> : progresser ensemble</li>
                <li><strong>Une responsabilité partagée</strong> : s'entraider pour avancer</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Comment ça fonctionne ?</h3>
              <p className="leading-relaxed mb-3">
                Au début de votre parcours, vous choisissez (ou on vous attribue) un <strong>+1</strong>. 
                Vous vous contactez régulièrement pour :
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Partager vos avancées et difficultés</li>
                <li>Vous encourager mutuellement</li>
                <li>Réviser ensemble certains points</li>
                <li>Vous challenger positivement</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Les règles du +1</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Respect</strong> : écoutez-vous mutuellement</li>
                <li><strong>Régularité</strong> : contactez-vous au moins 2-3 fois par semaine</li>
                <li><strong>Bienveillance</strong> : encouragez sans juger</li>
                <li><strong>Engagement</strong> : soyez présent(e) pour votre binôme</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Le +1 en pratique</h3>
              <p className="leading-relaxed">
                Chaque semaine, prenez le temps d'échanger avec votre +1 : un message, un appel, une visio. 
                Partagez vos progrès, vos doutes, vos victoires. Le +1 n'est pas là pour tout résoudre, 
                mais pour être un point d'ancrage, un repère constant dans votre progression.
              </p>
            </section>

            <section className="bg-accent/5 p-4 rounded-lg border border-accent/20">
              <p className="leading-relaxed italic">
                <strong>💡 Le secret :</strong> Le +1 n'est pas qu'un contact — c'est une responsabilité partagée. 
                Vous progressez pour vous, mais aussi pour votre binôme. C'est ce lien qui fait toute la différence.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">🎯 Conclusion</h3>
              <p className="leading-relaxed">
                Sur Kartel, personne n'avance seul. Le groupe vous porte, mais le <strong>+1</strong> vous accompagne pas à pas. 
                C'est ce rythme, soutenu par le +1, qui fait la différence sur Kartel.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
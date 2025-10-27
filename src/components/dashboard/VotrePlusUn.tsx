import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export const VotrePlusUn = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">
          {t('dashboard.plusOne.title')}
        </p>
      </div>

      <Card className="relative">
        <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
        <CardHeader>
          <CardTitle>{t('dashboard.plusOne.sections.intro.title')}</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <div className="space-y-6 text-muted-foreground">
            <section>
              <p className="leading-relaxed">
                {t('dashboard.plusOne.sections.intro.content')}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">{t('dashboard.plusOne.sections.who.title')}</h3>
              <p className="leading-relaxed">
                {t('dashboard.plusOne.sections.who.content')}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">{t('dashboard.plusOne.sections.latestActions.title')}</h3>
              <p className="leading-relaxed">
                {t('dashboard.plusOne.sections.latestActions.content')}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">{t('dashboard.plusOne.sections.requests.title')}</h3>
              <p className="leading-relaxed">
                {t('dashboard.plusOne.sections.requests.content')}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">{t('dashboard.plusOne.sections.what.title')}</h3>
              <p className="leading-relaxed">
                {t('dashboard.plusOne.sections.what.content')}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">{t('dashboard.plusOne.sections.role.title')}</h3>
              <p className="leading-relaxed">
                {t('dashboard.plusOne.sections.role.content')}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">{t('dashboard.plusOne.sections.workingWith.title')}</h3>
              <p className="leading-relaxed">
                {t('dashboard.plusOne.sections.workingWith.content')}
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
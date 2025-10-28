import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export const Rules = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-4">{t('dashboard.kartelSpirit.title')}</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t('dashboard.kartelSpirit.intro.p1')}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t('dashboard.kartelSpirit.intro.p2')}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t('dashboard.kartelSpirit.intro.p3')}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t('dashboard.kartelSpirit.intro.p4')}
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">{t('dashboard.kartelSpirit.tips.title')}</h3>
          <ul className="space-y-3">
            <li className="flex gap-2">
              <span className="font-semibold">{t('dashboard.kartelSpirit.tips.tip1.title')}</span>
              <span className="text-muted-foreground">{t('dashboard.kartelSpirit.tips.tip1.text')}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">{t('dashboard.kartelSpirit.tips.tip2.title')}</span>
              <span className="text-muted-foreground">{t('dashboard.kartelSpirit.tips.tip2.text')}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">{t('dashboard.kartelSpirit.tips.tip3.title')}</span>
              <span className="text-muted-foreground">{t('dashboard.kartelSpirit.tips.tip3.text')}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">{t('dashboard.kartelSpirit.tips.tip4.title')}</span>
              <span className="text-muted-foreground">{t('dashboard.kartelSpirit.tips.tip4.text')}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">{t('dashboard.kartelSpirit.tips.tip5.title')}</span>
              <span className="text-muted-foreground">{t('dashboard.kartelSpirit.tips.tip5.text')}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">{t('dashboard.kartelSpirit.tips.tip6.title')}</span>
              <span className="text-muted-foreground">{t('dashboard.kartelSpirit.tips.tip6.text')}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">{t('dashboard.kartelSpirit.tips.tip7.title')}</span>
              <span className="text-muted-foreground">{t('dashboard.kartelSpirit.tips.tip7.text')}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">{t('dashboard.kartelSpirit.tips.tip8.title')}</span>
              <span className="text-muted-foreground">{t('dashboard.kartelSpirit.tips.tip8.text')}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">{t('dashboard.kartelSpirit.tips.tip9.title')}</span>
              <span className="text-muted-foreground">{t('dashboard.kartelSpirit.tips.tip9.text')}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">{t('dashboard.kartelSpirit.tips.tip10.title')}</span>
              <span className="text-muted-foreground">{t('dashboard.kartelSpirit.tips.tip10.text')}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">{t('dashboard.kartelSpirit.rules.title')}</h3>
          <ol className="space-y-3 list-decimal list-inside">
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule1.title')}</span> {t('dashboard.kartelSpirit.rules.rule1.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule2.title')}</span> {t('dashboard.kartelSpirit.rules.rule2.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule3.title')}</span> {t('dashboard.kartelSpirit.rules.rule3.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule4.title')}</span> {t('dashboard.kartelSpirit.rules.rule4.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule5.title')}</span> {t('dashboard.kartelSpirit.rules.rule5.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule6.title')}</span> {t('dashboard.kartelSpirit.rules.rule6.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule7.title')}</span> {t('dashboard.kartelSpirit.rules.rule7.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule8.title')}</span> {t('dashboard.kartelSpirit.rules.rule8.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule9.title')}</span> {t('dashboard.kartelSpirit.rules.rule9.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.rules.rule10.title')}</span> {t('dashboard.kartelSpirit.rules.rule10.text')}
            </li>
          </ol>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">{t('dashboard.kartelSpirit.summary.title')}</h3>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t('dashboard.kartelSpirit.summary.intro')}
          </p>
          <ul className="space-y-2 ml-4">
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.summary.clarity.title')}</span> {t('dashboard.kartelSpirit.summary.clarity.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.summary.warmth.title')}</span> {t('dashboard.kartelSpirit.summary.warmth.text')}
            </li>
            <li className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t('dashboard.kartelSpirit.summary.discipline.title')}</span> {t('dashboard.kartelSpirit.summary.discipline.text')}
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            {t('dashboard.kartelSpirit.summary.closing')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

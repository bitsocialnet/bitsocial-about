import { useTranslation } from "react-i18next";
import { getAreaColor, getAreaNameKey } from "@/lib/about-areas";
import { intlTextProps, useAboutFormatters } from "@/lib/about-format";
import { ABOUT_MILESTONES, type AboutMilestone } from "@/lib/about-milestones";

const MILESTONES_BY_YEAR = ABOUT_MILESTONES.reduce<Map<string, AboutMilestone[]>>(
  (years, milestone) => {
    const year = milestone.month.slice(0, 4);
    years.set(year, [...(years.get(year) ?? []), milestone]);
    return years;
  },
  new Map(),
);

export default function AboutMilestones() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const format = useAboutFormatters();

  return (
    <div className="flex flex-col gap-5 pt-3">
      <h3 className="route-eyebrow font-display font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {t("about.milestones.title")}
      </h3>
      {/* Year columns line up with the chart's years at desktop width and stack on phones. Like the
          chart, they run left to right in every language; each column keeps the page direction. */}
      <div
        dir="ltr"
        className="grid grid-cols-[repeat(auto-fit,minmax(min(180px,100%),1fr))] gap-y-8"
      >
        {[...MILESTONES_BY_YEAR].map(([year, milestones]) => (
          <div
            key={year}
            dir={dir}
            className="flex min-w-0 flex-col gap-4 border-l border-border/60 pl-3.5 pr-4"
          >
            <h4
              className="font-display text-base font-semibold leading-snug text-foreground"
              {...intlTextProps}
            >
              {format.year(year)}
            </h4>
            <ul className="flex flex-col gap-4">
              {milestones.map((milestone) => (
                <li key={milestone.titleKey} className="flex flex-col gap-1">
                  <span className="flex flex-wrap items-center gap-x-2 text-xs leading-4 text-muted-foreground">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: getAreaColor(milestone.area) }}
                    />
                    <span
                      className="font-display text-[0.8125rem] font-semibold text-foreground"
                      {...intlTextProps}
                    >
                      {format.shortMonth(milestone.month)}
                    </span>
                    <span>{t(getAreaNameKey(milestone.area))}</span>
                  </span>
                  <span className="text-sm leading-normal text-muted-foreground">
                    {t(milestone.titleKey)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

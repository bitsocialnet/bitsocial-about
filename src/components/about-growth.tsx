import { useTranslation } from "react-i18next";
import AboutGrowthChart from "@/components/about-growth-chart";
import AboutMilestones from "@/components/about-milestones";
import { aboutSectionTitleClassName } from "@/components/about-section-header";
import { ABOUT_AREA_IDS, getAreaColor, getAreaNameKey } from "@/lib/about-areas";
import { intlTextProps, useAboutFormatters } from "@/lib/about-format";
import { ABOUT_STATS } from "@/lib/about-growth";

export default function AboutGrowth() {
  const { t } = useTranslation();
  const format = useAboutFormatters();
  const figures = [
    { key: "commits", count: ABOUT_STATS.totalCommits, labelKey: "about.growth.commits" },
    {
      key: "repositories",
      count: ABOUT_STATS.publicRepositories,
      labelKey: "about.growth.repositories",
    },
    {
      key: "organizations",
      count: ABOUT_STATS.organizations.length,
      labelKey: "about.growth.organizations",
    },
  ];

  return (
    <section
      id="growth"
      aria-labelledby="about-growth-heading"
      className="flex scroll-mt-[99px] flex-col gap-7 md:scroll-mt-[103px]"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <div className="flex min-w-0 max-w-[46rem] flex-[1_1_420px] flex-col gap-3">
          <h2 id="about-growth-heading" className={aboutSectionTitleClassName}>
            {t("about.growth.title")}
          </h2>
          <p className="route-lede text-pretty text-muted-foreground">{t("about.growth.intro")}</p>
        </div>
        <dl className="flex flex-wrap gap-x-8 gap-y-4 sm:gap-x-10">
          {figures.map((figure, index) => (
            <div
              key={figure.key}
              className={`flex flex-col-reverse gap-1${index ? " sm:border-s sm:border-border/60 sm:ps-10" : ""}`}
            >
              <dt className="text-sm leading-snug text-muted-foreground">
                {t(figure.labelKey, { count: figure.count })}
              </dt>
              <dd
                className="font-display text-4xl font-semibold leading-tight text-foreground tabular-nums"
                {...intlTextProps}
              >
                {format.number(figure.count)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <ul aria-label={t("about.growth.legendLabel")} className="flex flex-wrap gap-x-6 gap-y-2">
        {ABOUT_AREA_IDS.map((id) => (
          <li
            key={id}
            className="inline-flex items-center gap-2 text-sm leading-snug text-muted-foreground"
          >
            <span
              aria-hidden="true"
              className="h-3 w-3 shrink-0 rounded-[3px]"
              style={{ background: getAreaColor(id) }}
            />
            {t(getAreaNameKey(id))}
          </li>
        ))}
      </ul>
      <AboutGrowthChart />
      <AboutMilestones />
    </section>
  );
}

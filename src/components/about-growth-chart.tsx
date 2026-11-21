import { useTranslation } from "react-i18next";
import { ABOUT_AREA_IDS, getAreaColor, getAreaNameKey } from "@/lib/about-areas";
import { intlTextProps, useAboutFormatters } from "@/lib/about-format";
import {
  ABOUT_STATS,
  CHART_BASE,
  CHART_HEIGHT,
  CHART_TOP,
  CHART_WIDTH,
  buildGrowthChart,
  getRepositoryGrowth,
  sumAreaCommits,
} from "@/lib/about-growth";

const GROWTH_CHART = buildGrowthChart(ABOUT_STATS);
const REPOSITORY_GROWTH = getRepositoryGrowth(ABOUT_STATS);

const labelProps = {
  className: "fill-muted-foreground stroke-background",
  fontSize: 14,
  strokeWidth: 4,
  strokeLinejoin: "round",
  paintOrder: "stroke",
} as const;

export default function AboutGrowthChart() {
  const { t } = useTranslation();
  const format = useAboutFormatters();
  const stats = ABOUT_STATS;
  const chart = GROWTH_CHART;
  const { months } = stats;
  const lastIndex = months.length - 1;
  const lastMonth = months[lastIndex];
  const currentYear = chart.years[chart.years.length - 1];
  const previousYear = chart.years[chart.years.length - 2];
  const areaNames = Object.fromEntries(ABOUT_AREA_IDS.map((id) => [id, t(getAreaNameKey(id))]));

  const describeAreas = (value: (id: (typeof ABOUT_AREA_IDS)[number]) => number) =>
    ABOUT_AREA_IDS.flatMap((id) => {
      const areaValue = value(id);
      return areaValue > 0 ? [`${areaNames[id]} ${format.number(areaValue)}`] : [];
    }).join(" · ");

  const summarize = (period: string, total: number, areas: string) =>
    t("about.growth.periodSummary", {
      count: total,
      value: format.number(total),
      period,
      areas,
    }).trim();

  const chartLabel = t("about.growth.chartLabel", {
    count: currentYear.commits,
    value: format.number(currentYear.commits),
    start: format.longMonthYear(months[0]),
    end: format.longMonthYear(lastMonth),
    year: format.year(currentYear.year),
    previousValue: format.number(previousYear?.commits ?? 0),
    previousYear: format.year(previousYear?.year ?? currentYear.year - 1),
  });

  // Keep the repository annotation, which runs left from the current year, above the months
  // it covers, and below the partial-month note at the top.
  const tailBeforeCurrentYear = chart.months
    .filter((month) => month.x < currentYear.x && month.x >= currentYear.x - 400)
    .map((month) => month.total);
  const annotationY = Math.max(
    CHART_TOP + 8,
    Math.min(CHART_TOP + 62, chart.scaleY(Math.max(0, ...tailBeforeCurrentYear)) - 40),
  );
  const repositoryNotes = REPOSITORY_GROWTH
    ? [
        t("about.growth.repositoriesAnnotation", {
          count: REPOSITORY_GROWTH.before,
          value: format.number(REPOSITORY_GROWTH.before),
          now: format.number(REPOSITORY_GROWTH.now),
          year: format.year(REPOSITORY_GROWTH.lastYear),
        }),
        t("about.growth.startedAnnotation", {
          count: REPOSITORY_GROWTH.started,
          value: format.number(REPOSITORY_GROWTH.started),
          year: format.year(REPOSITORY_GROWTH.currentYear),
        }),
      ]
    : null;
  const latestLineTop = 30;
  const day = Number(stats.generatedAt.slice(8, 10));

  return (
    <figure className="flex flex-col gap-3.5">
      {repositoryNotes ? (
        <p className="text-sm leading-normal text-muted-foreground sm:hidden" {...intlTextProps}>
          <span className="font-display font-semibold text-foreground" {...intlTextProps}>
            {repositoryNotes[0]}
          </span>
          <br />
          {repositoryNotes[1]}
        </p>
      ) : null}
      {/* `rtl` on the scroll box starts it scrolled to the latest months on narrow screens, with
          no script; the chart itself stays left to right. */}
      <div
        dir="rtl"
        role="group"
        tabIndex={0}
        aria-label={t("about.growth.axisLabel")}
        className="focus-ring-app overflow-x-auto overflow-y-hidden rounded-xl"
      >
        <div dir="ltr" className="min-w-[920px]">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            role="img"
            aria-label={chartLabel}
            className="block h-auto w-full font-body"
            {...intlTextProps}
          >
            {chart.gridlines.map((line) => (
              <line
                key={line.value}
                x1={0}
                x2={CHART_WIDTH}
                y1={line.y}
                y2={line.y}
                className="stroke-border/60"
                strokeWidth={1}
              />
            ))}
            {chart.yearLines.map((x) => (
              <line
                key={x}
                x1={Math.min(CHART_WIDTH - 0.5, Math.round(x) + 0.5)}
                x2={Math.min(CHART_WIDTH - 0.5, Math.round(x) + 0.5)}
                y1={CHART_TOP}
                y2={CHART_BASE + 10}
                className="stroke-border/60"
                strokeWidth={1}
              />
            ))}
            {chart.bands.map((band) => (
              <path key={band.id} d={band.path} style={{ fill: getAreaColor(band.id) }} />
            ))}
            {chart.separators.map((band) => (
              <path
                key={band.id}
                d={band.path}
                fill="none"
                className="stroke-background"
                strokeWidth={2}
                strokeLinejoin="round"
              />
            ))}
            <line
              x1={0}
              x2={CHART_WIDTH}
              y1={CHART_BASE + 0.5}
              y2={CHART_BASE + 0.5}
              className="stroke-border"
              strokeWidth={1}
            />
            <text x={0} y={16} {...labelProps}>
              {t("about.growth.axisLabel")}
            </text>
            {chart.gridlines.map((line) => (
              <text
                key={line.value}
                x={0}
                y={line.y - 7}
                {...labelProps}
                className={`${labelProps.className} tabular-nums`}
                {...intlTextProps}
              >
                {format.number(line.value)}
              </text>
            ))}
            {repositoryNotes && currentYear.x > 0 ? (
              // Phones show this note above the scrolling chart instead, where it is not cut off.
              <g className="max-sm:hidden">
                <text
                  x={currentYear.x - 12}
                  y={annotationY}
                  textAnchor="end"
                  fontSize={16}
                  strokeWidth={5}
                  strokeLinejoin="round"
                  paintOrder="stroke"
                  className="fill-foreground stroke-background font-display font-semibold"
                  {...intlTextProps}
                >
                  {repositoryNotes[0]}
                </text>
                <text
                  x={currentYear.x - 12}
                  y={annotationY + 21}
                  textAnchor="end"
                  {...labelProps}
                  {...intlTextProps}
                >
                  {repositoryNotes[1]}
                </text>
              </g>
            ) : null}
            <text x={CHART_WIDTH - 4} y={20} textAnchor="end" {...labelProps} {...intlTextProps}>
              {t("about.growth.partialAnnotation", {
                count: day,
                ordinal: true,
                day: format.year(day),
                month: format.longMonthYear(lastMonth),
              })}
            </text>
            {chart.latest.y - 7 > latestLineTop ? (
              <line
                x1={chart.latest.x}
                x2={chart.latest.x}
                y1={latestLineTop}
                y2={chart.latest.y - 7}
                className="stroke-muted-foreground"
                strokeWidth={1}
              />
            ) : null}
            <circle
              cx={chart.latest.x}
              cy={chart.latest.y}
              r={4}
              className="fill-foreground stroke-background"
              strokeWidth={2}
            />
            {chart.years.map((year) => (
              <g key={year.year}>
                <text
                  x={year.x + 14}
                  y={436}
                  fontSize={16}
                  className="fill-foreground font-display font-semibold"
                  {...intlTextProps}
                >
                  {format.year(year.year)}
                </text>
                <text
                  x={year.x + 14}
                  y={456}
                  fontSize={14}
                  className="fill-muted-foreground tabular-nums"
                  {...intlTextProps}
                >
                  {t("about.growth.yearCommits", {
                    count: year.commits,
                    value: format.number(year.commits),
                  })}
                </text>
              </g>
            ))}
            {chart.months.map((month, index) => {
              const label = format.shortMonthYear(month.month);
              const period =
                index === lastIndex ? t("about.growth.partialMonthLabel", { month: label }) : label;
              return (
                <rect
                  key={month.month}
                  x={month.x}
                  y={CHART_TOP}
                  width={month.width}
                  height={CHART_BASE - CHART_TOP}
                  className="fill-transparent hover:fill-foreground/[0.07]"
                >
                  <title {...intlTextProps}>
                    {summarize(
                      period,
                      month.total,
                      describeAreas((id) => stats.commitsByArea[id][index]),
                    )}
                  </title>
                </rect>
              );
            })}
          </svg>
        </div>
      </div>
      <ul className="sr-only">
        {chart.years.map((year) => (
          <li key={year.year} {...intlTextProps}>
            {summarize(
              format.year(year.year),
              year.commits,
              describeAreas((id) => sumAreaCommits(stats, id, String(year.year))),
            )}
          </li>
        ))}
      </ul>
      <figcaption className="text-sm leading-relaxed text-muted-foreground">
        {t("about.growth.caption")}
      </figcaption>
    </figure>
  );
}

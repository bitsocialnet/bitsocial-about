import { ArrowUpRight, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import AboutSectionHeader from "@/components/about-section-header";
import { highlightedCtaClassName } from "@/components/card-inline-cta";
import { intlTextProps, useAboutFormatters } from "@/lib/about-format";
import { ABOUT_STATS } from "@/lib/about-growth";
import { ABOUT_FOUNDER, getGithubAvatarUrl } from "@/lib/about-team";
import { cn } from "@/lib/utils";

// Open issues across the three organizations. GitHub's search page works signed out, unlike the
// github.com/issues dashboard, which answers 404 to visitors who are not signed in.
const FIRST_CONTRIBUTION_URL =
  "https://github.com/search?q=org%3Apkcprotocol+org%3Abitsocialnet+org%3Abitsocialforge+is%3Aissue+is%3Aopen&type=issues";

export default function AboutThanks() {
  const { t } = useTranslation();
  const format = useAboutFormatters();
  const nextLabel = t("about.thanks.nextLabel");

  return (
    <section
      id="thanks"
      aria-labelledby="about-thanks-heading"
      className="flex scroll-mt-[99px] flex-col gap-6 md:scroll-mt-[103px]"
    >
      <AboutSectionHeader id="about-thanks-heading" title={t("about.thanks.title")}>
        {t("about.thanks.intro")}
      </AboutSectionHeader>
      <a
        href={`https://github.com/${ABOUT_FOUNDER.githubLogin}`}
        target="_blank"
        rel="noopener noreferrer"
        className="glass-card flex w-fit max-w-full items-center gap-3.5 rounded-2xl py-3 ps-3 pe-5 transition-colors hover:border-blue-glow"
      >
        <img
          src={getGithubAvatarUrl(ABOUT_FOUNDER.githubLogin, 112)}
          alt=""
          loading="lazy"
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-[10px] border border-border bg-muted object-cover"
        />
        <span className="flex min-w-0 flex-col gap-1">
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="font-display text-lg font-semibold leading-tight text-foreground">
              {ABOUT_FOUNDER.name}
            </span>
            <span className="rounded-full border border-border px-2 py-0.5 font-display text-[0.6875rem] uppercase leading-none tracking-[0.14em] text-muted-foreground">
              {t("about.founder.title")}
            </span>
          </span>
          <span className="text-sm text-muted-foreground">{t("about.founder.role")}</span>
        </span>
      </a>
      <ul aria-label={t("about.thanks.wallLabel")} className="flex max-w-[700px] flex-wrap gap-1.5">
        {ABOUT_STATS.contributors.map((contributor) => {
          const label = t("about.thanks.contributions", {
            count: contributor.contributions,
            value: format.number(contributor.contributions),
            login: contributor.login,
          });
          return (
            <li key={contributor.login} className="flex">
              <a
                href={`https://github.com/${contributor.login}`}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                aria-label={label}
                {...intlTextProps}
                className="block h-11 w-11 overflow-hidden rounded-[8px] border border-border bg-muted transition-colors hover:border-blue-glow"
              >
                <img
                  src={getGithubAvatarUrl(contributor.login, 88)}
                  alt={contributor.login}
                  loading="lazy"
                  width={44}
                  height={44}
                  className="block h-full w-full object-cover"
                />
              </a>
            </li>
          );
        })}
        <li className="flex">
          <a
            href={FIRST_CONTRIBUTION_URL}
            target="_blank"
            rel="noopener noreferrer"
            title={nextLabel}
            aria-label={nextLabel}
            className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-dashed border-border text-muted-foreground transition-colors hover:border-blue-glow hover:text-foreground"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
          </a>
        </li>
      </ul>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
        <p className="text-pretty text-[1.0625rem] leading-relaxed text-foreground">
          {t("about.thanks.cta")}
        </p>
        <a
          href={FIRST_CONTRIBUTION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(highlightedCtaClassName, "gap-2.5 px-6")}
        >
          {t("about.thanks.firstContribution")}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 rtl:-scale-x-100" />
        </a>
      </div>
    </section>
  );
}

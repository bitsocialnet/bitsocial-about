import { ArrowUpRight, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import AboutSectionHeader from "@/components/about-section-header";
import { highlightedCtaClassName } from "@/components/card-inline-cta";
import { intlTextProps, useAboutFormatters } from "@/lib/about-format";
import { ABOUT_STATS } from "@/lib/about-growth";
import { getGithubAvatarUrl } from "@/lib/about-team";
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

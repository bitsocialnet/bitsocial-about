import { ArrowUpRight, Github, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  EthereumIcon,
  ExternalLinkPill,
  HackerNewsIcon,
  RedditIcon,
  XIcon,
  type AboutLink,
} from "@/components/about-link-pill";
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

const FOUNDER_LINKS: AboutLink[] = [
  {
    label: "X",
    href: "https://x.com/estebanabaroa",
    icon: <XIcon className="h-3.5 w-3.5" />,
  },
  {
    labelKey: "footer.github",
    href: `https://github.com/${ABOUT_FOUNDER.githubLogin}`,
    icon: <Github className="h-4 w-4" />,
  },
  {
    label: "Ethereum Research",
    href: "https://ethresear.ch/u/estebanabaroa",
    icon: <EthereumIcon className="h-4 w-4" />,
  },
  {
    label: "Reddit",
    href: "https://www.reddit.com/user/estebanabaroa/",
    icon: <RedditIcon className="h-4 w-4" />,
  },
  {
    label: "Hacker News",
    href: "https://news.ycombinator.com/user?id=estebanabaroa",
    icon: <HackerNewsIcon className="h-3.5 w-3.5" />,
  },
];

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
      <article className="glass-card flex w-fit max-w-full flex-col gap-4 rounded-2xl p-4 md:max-w-[42rem] md:p-5">
        <div className="flex min-w-0 items-start gap-4 md:gap-5">
          <img
            src={getGithubAvatarUrl(ABOUT_FOUNDER.githubLogin, 144)}
            alt={t("about.memberProfileAlt", { name: ABOUT_FOUNDER.name })}
            loading="lazy"
            width={72}
            height={72}
            className="h-16 w-16 shrink-0 rounded-[12px] border border-border bg-muted object-cover md:h-[72px] md:w-[72px]"
          />
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <h3 className="font-display text-xl font-semibold leading-tight text-foreground">
                {ABOUT_FOUNDER.name}
              </h3>
              <span className="rounded-full border border-border px-2 py-0.5 font-display text-[0.6875rem] uppercase leading-none tracking-[0.14em] text-muted-foreground">
                {t("about.founder.title")}
              </span>
            </div>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              {t("about.founder.role")}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:ps-[5.75rem]">
          {FOUNDER_LINKS.map((link) => (
            <ExternalLinkPill key={link.href} {...link} />
          ))}
        </div>
      </article>
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

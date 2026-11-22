import { Github } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import {
  EthereumIcon,
  ExternalLinkPill,
  HackerNewsIcon,
  RedditIcon,
  XIcon,
  type AboutLink,
} from "@/components/about-link-pill";
import AboutSectionHeader from "@/components/about-section-header";
import { ABOUT_FOUNDER, getGithubAvatarUrl } from "@/lib/about-team";

// The founder's farewell message, posted in the Bitsocial Telegram group on 2026-11-03.
const FAREWELL_MESSAGE_URL = "https://t.me/bitsocialnet/793352";

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

export default function AboutFounder() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="about-founder-heading" className="flex flex-col gap-6">
      <AboutSectionHeader id="about-founder-heading" title={t("about.founder.heading")} />
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
              <Trans
                i18nKey="about.founder.role"
                components={{
                  farewellLink: (
                    <a
                      href={FAREWELL_MESSAGE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-muted-foreground"
                    />
                  ),
                }}
              />
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:ps-[5.75rem]">
          {FOUNDER_LINKS.map((link) => (
            <ExternalLinkPill key={link.href} {...link} />
          ))}
        </div>
      </article>
    </section>
  );
}

import { Github, Globe, Mail, Send } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { BlueskyIcon, ExternalLinkPill, XIcon, type AboutLink } from "@/components/about-link-pill";
import { aboutSectionTitleClassName } from "@/components/about-section-header";
import type { AboutMaintainerId } from "@/lib/about-areas";
import { ABOUT_MAINTAINERS, getGithubAvatarUrl, type AboutMaintainer } from "@/lib/about-team";

type TeamMember = AboutMaintainer & {
  id: AboutMaintainerId;
  roleKey: string;
  /** A second role line; its translation may link Bitsocial Forge with <forgeLink>. */
  secondRoleKey?: string;
  askKey: string;
  links: AboutLink[];
};

const inlineLinkClassName =
  "text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-muted-foreground";

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "rinse",
    ...ABOUT_MAINTAINERS.rinse,
    roleKey: "about.members.rinse.role",
    askKey: "about.members.rinse.ask",
    links: [
      {
        labelKey: "footer.telegram",
        href: ABOUT_MAINTAINERS.rinse.telegram,
        icon: <Send className="h-4 w-4" />,
      },
      {
        label: "rinse@bitsocial.net",
        href: "mailto:rinse@bitsocial.net",
        icon: <Mail className="h-4 w-4" />,
      },
      {
        label: "X",
        href: "https://x.com/rinse_12",
        icon: <XIcon className="h-3.5 w-3.5" />,
      },
      {
        label: "Bluesky",
        href: "https://bsky.app/profile/rinse-bitsocial.bsky.social",
        icon: <BlueskyIcon className="h-3.5 w-3.5" />,
      },
      {
        labelKey: "footer.github",
        href: "https://github.com/rinse12",
        icon: <Github className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "tom",
    ...ABOUT_MAINTAINERS.tom,
    roleKey: "about.members.tommaso.role",
    secondRoleKey: "about.members.tommaso.forgeRole",
    askKey: "about.members.tommaso.ask",
    links: [
      {
        labelKey: "footer.telegram",
        href: ABOUT_MAINTAINERS.tom.telegram,
        icon: <Send className="h-4 w-4" />,
      },
      {
        label: "tom@bitsocial.net",
        href: "mailto:tom@bitsocial.net",
        icon: <Mail className="h-4 w-4" />,
      },
      {
        label: "X",
        href: "https://x.com/tomcasaburi",
        icon: <XIcon className="h-3.5 w-3.5" />,
      },
      {
        labelKey: "footer.github",
        href: "https://github.com/tomcasaburi",
        icon: <Github className="h-4 w-4" />,
      },
      {
        label: "tomcasaburi.com",
        href: "https://tomcasaburi.com",
        icon: <Globe className="h-4 w-4" />,
      },
    ],
  },
];

export default function AboutTeam() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="about-team-heading" className="flex flex-col gap-6">
      <h2 id="about-team-heading" className={aboutSectionTitleClassName}>
        {t("about.team.title")}
      </h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {TEAM_MEMBERS.map((member) => (
          <article key={member.id} className="glass-card surface-pad flex flex-col gap-4">
            <div className="flex min-w-0 items-start gap-4 md:gap-5">
              <img
                src={getGithubAvatarUrl(member.githubLogin, 160)}
                alt={t("about.memberProfileAlt", { name: member.name })}
                loading="lazy"
                width={80}
                height={80}
                className="h-16 w-16 shrink-0 rounded-full border border-border/60 bg-background/70 object-cover md:h-20 md:w-20"
              />
              <div className="flex min-w-0 flex-col gap-1.5">
                <h3 className="card-title-fluid font-display font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                  <span className="block">{t(member.roleKey)}</span>
                  {member.secondRoleKey ? (
                    <span className="block">
                      <Trans
                        i18nKey={member.secondRoleKey}
                        components={{
                          forgeLink: (
                            <a
                              href="https://bitsocialforge.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className={inlineLinkClassName}
                            />
                          ),
                        }}
                      />
                    </span>
                  ) : null}
                </p>
                <p className="text-sm leading-normal text-muted-foreground">
                  <Trans
                    i18nKey={member.askKey}
                    components={{ askLink: <a href="#ask" className={inlineLinkClassName} /> }}
                  />
                </p>
              </div>
            </div>
            {/* Below md the links span the card; from md they line up under the text. */}
            <div className="flex flex-wrap gap-2 md:ps-[6.25rem]">
              {member.links.map((link) => (
                <ExternalLinkPill key={link.href} {...link} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

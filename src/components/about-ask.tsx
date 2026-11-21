import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import AboutSectionHeader from "@/components/about-section-header";
import { ABOUT_AREAS, getAreaColor, type AboutMaintainerId } from "@/lib/about-areas";
import { ABOUT_MAINTAINERS, getGithubAvatarUrl } from "@/lib/about-team";

function MaintainerPill({ id }: { id: AboutMaintainerId }) {
  const { t } = useTranslation();
  const member = ABOUT_MAINTAINERS[id];
  const label = t("about.ask.telegramLabel", { name: member.name });

  return (
    <a
      href={member.telegram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border border-border py-1 pe-3.5 ps-1.5 font-display text-sm font-semibold text-foreground transition-colors hover:border-blue-glow"
    >
      <img
        src={getGithubAvatarUrl(member.githubLogin, 60)}
        alt=""
        loading="lazy"
        width={30}
        height={30}
        className="h-[30px] w-[30px] shrink-0 rounded-full bg-muted object-cover"
      />
      <span>{member.name}</span>
      <Send aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    </a>
  );
}

export default function AboutAsk() {
  const { t } = useTranslation();

  return (
    <section
      id="ask"
      aria-labelledby="about-ask-heading"
      className="flex scroll-mt-[99px] flex-col gap-6 md:scroll-mt-[103px]"
    >
      <AboutSectionHeader id="about-ask-heading" title={t("about.ask.title")}>
        {t("about.ask.intro")}
      </AboutSectionHeader>
      <div className="flex flex-col gap-4">
        <ul className="flex flex-col border-b border-border/60">
          {ABOUT_AREAS.map((area) => (
            <li
              key={area.id}
              className="flex flex-wrap gap-x-10 gap-y-4 border-t border-border/60 py-6"
            >
              <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-2">
                <h3 className="flex items-center gap-2.5 font-display text-xl font-semibold leading-snug text-foreground">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                    style={{ background: getAreaColor(area.id) }}
                  />
                  {t(area.nameKey)}
                </h3>
                <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {t(area.descriptionKey)}
                </p>
              </div>
              <div className="flex min-w-0 flex-[3_1_560px] flex-col gap-2.5">
                {area.groups.map((group) => (
                  <div
                    key={group.maintainers.join("+")}
                    className="flex flex-wrap items-start gap-x-4 gap-y-1"
                  >
                    <div className="flex shrink-0 flex-col items-start gap-1.5 sm:w-48">
                      {group.maintainers.map((id) => (
                        <MaintainerPill key={id} id={id} />
                      ))}
                    </div>
                    <ul className="flex min-w-0 flex-[1_1_260px] flex-wrap gap-x-1.5">
                      {group.repos.map((repo) => (
                        <li key={repo.fullName} className="flex max-w-full">
                          <a
                            href={repo.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={repo.fullName}
                            className="group inline-flex min-h-11 max-w-full items-center rounded-full focus-visible:!shadow-none"
                          >
                            <span className="inline-block max-w-full rounded-full border border-border/60 bg-background/70 px-2.5 py-1 font-mono text-[0.8125rem] leading-[1.125rem] text-muted-foreground transition-colors [overflow-wrap:anywhere] group-hover:border-blue-glow group-hover:text-foreground group-focus-visible:shadow-[var(--focus-app-ring)]">
                              {repo.label}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <p className="text-sm leading-normal text-muted-foreground">{t("about.ask.privateNote")}</p>
      </div>
    </section>
  );
}

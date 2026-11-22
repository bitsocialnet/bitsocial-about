import { Github, Heart } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import AboutAsk from "@/components/about-ask";
import AboutFounder from "@/components/about-founder";
import AboutGrowth from "@/components/about-growth";
import AboutSupport from "@/components/about-support";
import AboutTeam from "@/components/about-team";
import AboutThanks from "@/components/about-thanks";
import { highlightedCtaClassName, prominentCtaClassName } from "@/components/card-inline-cta";
import Footer from "@/components/footer";
import Topbar from "@/components/topbar";
import { cn } from "@/lib/utils";

// Trans replaces each link's text with the organization name from the translation.
const ORGANIZATION_LINKS = Object.fromEntries(
  ["pkcprotocol", "bitsocialnet", "bitsocialforge"].map((org) => [
    org,
    <a
      key={org}
      href={`https://github.com/${org}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-muted-foreground"
    >
      {org}
    </a>,
  ]),
);

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <Topbar />
      <main className="page-main">
        <div className="mx-auto flex max-w-7xl flex-col gap-20 md:gap-24">
          <section aria-labelledby="about-heading" className="flex flex-col gap-8">
            <div className="flex max-w-[52rem] flex-col">
              <p className="route-eyebrow font-display uppercase tracking-[0.2em] text-foreground/45">
                {t("about.sectionLabel")}
              </p>
              <h1
                id="about-heading"
                className="route-title optical-display-start mt-4 font-display font-semibold text-balance text-muted-foreground"
              >
                {t("about.title")}
              </h1>
              <p className="route-lede mt-4 text-pretty text-muted-foreground">
                {t("about.subtitle")}{" "}
                <Trans i18nKey="about.organizations" components={ORGANIZATION_LINKS} />
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#support" className={cn(highlightedCtaClassName, "gap-2.5 px-6")}>
                <Heart aria-hidden="true" className="h-4 w-4" />
                {t("about.supportCta")}
              </a>
              <a href="#thanks" className={cn(prominentCtaClassName, "gap-2.5 px-6")}>
                <Github aria-hidden="true" className="h-4 w-4" />
                {t("about.contributeCta")}
              </a>
            </div>
          </section>
          <AboutTeam />
          <AboutAsk />
          <AboutGrowth />
          <AboutSupport />
          <AboutFounder />
          <AboutThanks />
        </div>
      </main>
      <Footer />
    </div>
  );
}

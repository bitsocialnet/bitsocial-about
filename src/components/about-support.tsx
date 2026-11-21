import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { highlightedCtaClassName } from "@/components/card-inline-cta";
import { aboutSectionTitleClassName } from "@/components/about-section-header";
import { DONATION_URL } from "@/lib/donation";
import { cn } from "@/lib/utils";

export default function AboutSupport() {
  const { t } = useTranslation();
  const buttonClassName = cn(highlightedCtaClassName, "gap-2.5 px-7");
  const icon = <Heart aria-hidden="true" className="h-4 w-4" />;

  return (
    <section
      id="support"
      aria-labelledby="about-support-heading"
      className="scroll-mt-[99px] md:scroll-mt-[103px]"
    >
      <div className="glass-card flex flex-wrap items-center justify-between gap-x-12 gap-y-7 p-[clamp(1.5rem,1rem+2vw,3rem)]">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col items-start gap-3">
          <h2 id="about-support-heading" className={aboutSectionTitleClassName}>
            {t("about.support.title")}
          </h2>
          <p className="route-lede text-pretty text-muted-foreground">{t("about.support.body")}</p>
        </div>
        <div className="flex flex-col items-start gap-2">
          {DONATION_URL ? (
            <a
              href={DONATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName}
            >
              {icon}
              {t("about.support.donate")}
            </a>
          ) : (
            <>
              <button
                type="button"
                disabled
                aria-describedby="about-donate-note"
                className={cn(
                  buttonClassName,
                  "cursor-not-allowed opacity-60 hover:border-blue-core/30 hover:bg-blue-core/[0.08] hover:shadow-none dark:hover:border-blue-core/45 dark:hover:bg-blue-core/[0.18]",
                )}
              >
                {icon}
                {t("about.support.donate")}
              </button>
              <p id="about-donate-note" className="text-sm leading-normal text-muted-foreground">
                {t("about.support.comingSoon")}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

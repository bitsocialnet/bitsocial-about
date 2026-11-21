import type { ReactNode } from "react";

export const aboutSectionTitleClassName =
  "font-display text-[1.75rem] font-semibold leading-tight text-foreground text-balance md:text-4xl";

export default function AboutSectionHeader({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex max-w-[52rem] flex-col gap-3">
      <h2 id={id} className={aboutSectionTitleClassName}>
        {title}
      </h2>
      {children ? <p className="route-lede text-pretty text-muted-foreground">{children}</p> : null}
    </div>
  );
}

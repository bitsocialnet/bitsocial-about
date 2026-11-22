import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export type AboutLink = {
  label?: string;
  labelKey?: string;
  href: string;
  icon: ReactNode;
};

export function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function BlueskyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 530" fill="currentColor" className={className} aria-hidden="true">
      <path d="M130.8 36.2c66.2 49.7 137.4 150.5 169.2 216.3 31.8-65.7 103-166.6 169.2-216.3 47.8-35.8 125.2-63.5 125.2 24.8 0 17.6-10.1 148.1-16.1 169.2-20.9 73.4-97 92.1-164.7 80.5 118.4 20.3 148.5 87.4 83.4 154.5-123.6 127.4-177.6-32-191.4-72.8-2.5-7.5-3.7-11-5.6-11s-3 3.5-5.6 11c-13.7 40.8-67.8 200.2-191.4 72.8-65.1-67.1-34.9-134.2 83.4-154.5-67.8 11.6-143.8-7.1-164.7-80.5-6-21.1-16.1-151.6-16.1-169.2 0-88.2 77.4-60.6 125.2-24.8Z" />
    </svg>
  );
}

// Reddit, Ethereum and Y Combinator marks from Simple Icons (CC0).
export function RedditIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z" />
    </svg>
  );
}

export function EthereumIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
    </svg>
  );
}

export function HackerNewsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896h-1.88z" />
    </svg>
  );
}

export function ExternalLinkPill({ href, label, labelKey, icon }: AboutLink) {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t(labelKey ?? "");
  const isMailto = href.startsWith("mailto:");

  return (
    <a
      href={href}
      {...(isMailto ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      aria-label={resolvedLabel}
      title={resolvedLabel}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-background/70 text-muted-foreground transition-colors hover:border-blue-glow hover:text-foreground"
    >
      {icon}
    </a>
  );
}

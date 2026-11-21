import type { AboutMaintainerId } from "@/lib/about-areas";

export interface AboutMaintainer {
  name: string;
  githubLogin: string;
  telegram: string;
}

/** The current maintainers, in the order the About page shows them. */
export const ABOUT_MAINTAINERS: Record<AboutMaintainerId, AboutMaintainer> = {
  rinse: { name: "Rinse12", githubLogin: "rinse12", telegram: "https://t.me/rinse12" },
  tom: { name: "Tom Casaburi", githubLogin: "tomcasaburi", telegram: "https://t.me/tomcasaburi" },
};

// The avatar host serves images by login directly; github.com/<login>.png redirects there and sets
// github.com cookies, which browsers reject and log as console errors in a cross-site page.
export function getGithubAvatarUrl(login: string, size: number) {
  return `https://avatars.githubusercontent.com/${login}?s=${size}`;
}

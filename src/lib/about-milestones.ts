import type { AboutAreaId } from "@/lib/about-areas";

export interface AboutMilestone {
  /** Year and month, `YYYY-MM`. */
  month: string;
  area: AboutAreaId;
  titleKey: string;
}

/** Project-wide milestones, oldest first. Titles are translated copy under `about.milestones.items`. */
export const ABOUT_MILESTONES: AboutMilestone[] = [
  { month: "2022-01", area: "protocol", titleKey: "about.milestones.items.specification" },
  { month: "2022-01", area: "protocol", titleKey: "about.milestones.items.protocolLibrary" },
  { month: "2022-03", area: "apps", titleKey: "about.milestones.items.reactHooks" },
  { month: "2022-04", area: "protocol", titleKey: "about.milestones.items.signedEncrypted" },
  { month: "2022-10", area: "network", titleKey: "about.milestones.items.cliNode" },
  { month: "2023-01", area: "protocol", titleKey: "about.milestones.items.ed25519" },
  { month: "2023-03", area: "antispam", titleKey: "about.milestones.items.challenges" },
  { month: "2023-04", area: "apps", titleKey: "about.milestones.items.fivechanRelease" },
  { month: "2023-08", area: "protocol", titleKey: "about.milestones.items.rpc" },
  { month: "2023-11", area: "protocol", titleKey: "about.milestones.items.commentUpdates" },
  { month: "2023-12", area: "apps", titleKey: "about.milestones.items.seeditRelease" },
  { month: "2024-02", area: "apps", titleKey: "about.milestones.items.desktopCommunities" },
  { month: "2024-06", area: "apps", titleKey: "about.milestones.items.fivechanTypescript" },
  { month: "2024-09", area: "protocol", titleKey: "about.milestones.items.httpRouter" },
  { month: "2025-01", area: "protocol", titleKey: "about.milestones.items.browserP2p" },
  { month: "2025-05", area: "apps", titleKey: "about.milestones.items.pushNotifications" },
  { month: "2025-11", area: "apps", titleKey: "about.milestones.items.boardDirectories" },
  { month: "2026-01", area: "antispam", titleKey: "about.milestones.items.spamBlocker" },
  { month: "2026-03", area: "network", titleKey: "about.milestones.items.bsoNames" },
  { month: "2026-04", area: "antispam", titleKey: "about.milestones.items.aiModeration" },
  { month: "2026-06", area: "network", titleKey: "about.milestones.items.pubsubVoting" },
  { month: "2026-06", area: "web", titleKey: "about.milestones.items.bsips" },
  { month: "2026-06", area: "services", titleKey: "about.milestones.items.archives" },
  { month: "2026-10", area: "services", titleKey: "about.milestones.items.forgeImages" },
];

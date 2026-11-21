import areasData from "@/data/about-areas.json";

export type AboutAreaId = "protocol" | "network" | "antispam" | "apps" | "services" | "web";
export type AboutMaintainerId = "rinse" | "tom";

export interface AboutRepo {
  fullName: string;
  label: string;
  href: string;
}

export interface AboutAreaGroup {
  maintainers: AboutMaintainerId[];
  repos: AboutRepo[];
}

export interface AboutArea {
  id: AboutAreaId;
  nameKey: string;
  descriptionKey: string;
  groups: AboutAreaGroup[];
}

const AREA_KEYS: Record<AboutAreaId, { nameKey: string; descriptionKey: string }> = {
  protocol: {
    nameKey: "about.areas.protocol.name",
    descriptionKey: "about.areas.protocol.description",
  },
  network: {
    nameKey: "about.areas.network.name",
    descriptionKey: "about.areas.network.description",
  },
  antispam: {
    nameKey: "about.areas.antispam.name",
    descriptionKey: "about.areas.antispam.description",
  },
  apps: {
    nameKey: "about.areas.apps.name",
    descriptionKey: "about.areas.apps.description",
  },
  services: {
    nameKey: "about.areas.services.name",
    descriptionKey: "about.areas.services.description",
  },
  web: {
    nameKey: "about.areas.web.name",
    descriptionKey: "about.areas.web.description",
  },
};

const repoLabels: Record<string, string> = areasData.repoLabels;

/**
 * Areas of the project in chart order, from the base of the stacked chart up. The same JSON
 * maps repositories to areas for `scripts/generate-about-data.mjs`; `unlisted` repositories
 * count in the chart but are not shown on the page.
 */
export const ABOUT_AREAS: AboutArea[] = areasData.areas.map((area) => {
  const id = area.id as AboutAreaId;

  return {
    id,
    ...AREA_KEYS[id],
    groups: area.groups.map((group) => ({
      maintainers: group.maintainers as AboutMaintainerId[],
      repos: group.repos.map((fullName) => ({
        fullName,
        label: repoLabels[fullName] ?? fullName.slice(fullName.indexOf("/") + 1),
        href: `https://github.com/${fullName}`,
      })),
    })),
  };
});

export const ABOUT_AREA_IDS: AboutAreaId[] = ABOUT_AREAS.map((area) => area.id);

export function getAreaNameKey(id: AboutAreaId) {
  return AREA_KEYS[id].nameKey;
}

/** Area colors are theme tokens defined in `src/index.css`. */
export function getAreaColor(id: AboutAreaId) {
  return `var(--about-area-${id})`;
}

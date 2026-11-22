#!/usr/bin/env node

/*
  Regenerates src/data/about-stats.json, the data behind the /about page's growth chart,
  repository counts and contributor wall.

  Usage: corepack yarn about:data

  It lists the public repositories of the Bitsocial GitHub organizations, keeps a bare,
  treeless clone of each in the OS temp directory (fetched again on later runs), and reads
  the non-merge commits of every default branch. Commits by bots and release automation are
  dropped; commits made with AI agents stay, since people directed them. History copied
  between repositories is counted once. Merged pull requests come from the GitHub API. The
  contributor wall lists people whose code was merged; issues alone do not count.

  The GitHub token comes from GITHUB_TOKEN, or from `gh auth token`. Set
  ABOUT_DATA_CACHE_DIR to keep the clones somewhere else. The output never contains
  emails or author names, only GitHub logins of the contributor wall.
*/

import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const areasPath = path.join(repoRoot, "src/data/about-areas.json");
const outputPath = path.join(repoRoot, "src/data/about-stats.json");
const cacheDir = process.env.ABOUT_DATA_CACHE_DIR || path.join(os.tmpdir(), "bitsocial-about-data");

const ORGANIZATIONS = ["pkcprotocol", "bitsocialnet", "bitsocialforge"];
const FALLBACK_AREA = "web";
const API = "https://api.github.com";
// Bots and release automation. AI coding agents (Claude, Cursor, Opencode...) are not listed:
// their commits were directed by people and count as human work.
const BOT_PATTERN =
  /\[bot\]|github-actions|release-bot|semantic-release|dependabot|renovate|greenkeeper|web3-bot|vercel|invalid-email-address/i;
// Accounts that are not people: AI coding agents and the placeholder for deleted users. Their
// commits still count in the chart; they are left off the contributor wall.
const NON_PERSON_LOGINS = new Set(["claude", "copilot", "cursoragent", "ghost"]);
// Merged contributions (commits on a default branch, or merged pull requests) needed to appear on
// the contributor wall. Raise it to keep one-off contributions off the wall.
const MIN_WALL_CONTRIBUTIONS = 1;

async function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    const { stdout } = await execFileAsync("gh", ["auth", "token"]);
    const token = stdout.trim();
    if (token) return token;
  } catch {
    // Fall through to the error below.
  }
  throw new Error("No GitHub token: set GITHUB_TOKEN or sign in with `gh auth login`.");
}

function createApi(token) {
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "bitsocial-about-data",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  async function request(url) {
    const response = await fetch(url.startsWith("http") ? url : `${API}${url}`, { headers });
    return response;
  }

  async function getJson(url) {
    const response = await request(url);
    if (!response.ok) {
      throw new Error(`GitHub API ${response.status} for ${url}`);
    }
    return response.json();
  }

  // Follows the Link header; returns null when the first page answers with an allowed status.
  async function getAllPages(url, allowedStatuses = []) {
    const items = [];
    let next = url;
    while (next) {
      const response = await request(next);
      if (!response.ok) {
        if (next === url && allowedStatuses.includes(response.status)) return null;
        throw new Error(`GitHub API ${response.status} for ${next}`);
      }
      items.push(...(await response.json()));
      next = response.headers.get("link")?.match(/<([^>]+)>;\s*rel="next"/)?.[1] ?? null;
    }
    return items;
  }

  return { getJson, getAllPages };
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let index = 0;
  async function run() {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

async function git(args) {
  const { stdout } = await execFileAsync("git", args, {
    maxBuffer: 256 * 1024 * 1024,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });
  return stdout;
}

async function syncClone(repo) {
  const dir = path.join(cacheDir, `${repo.full_name}.git`);
  const url = `https://github.com/${repo.full_name}.git`;
  if (existsSync(dir)) {
    await git([
      "--git-dir",
      dir,
      "fetch",
      "--quiet",
      "--prune",
      "--filter=tree:0",
      url,
      "+refs/heads/*:refs/heads/*",
    ]);
  } else {
    await mkdir(path.dirname(dir), { recursive: true });
    await git(["clone", "--quiet", "--bare", "--filter=tree:0", url, dir]);
  }
  return dir;
}

async function readCommits(repo, dir) {
  const branch = `refs/heads/${repo.default_branch}`;
  try {
    await git(["--git-dir", dir, "rev-parse", "--verify", "--quiet", branch]);
  } catch {
    console.warn(
      `warning: ${repo.full_name} has no ${repo.default_branch} branch; no commits read`,
    );
    return [];
  }
  const stdout = await git([
    "--git-dir",
    dir,
    "log",
    branch,
    "--no-merges",
    "-z",
    "--format=%H%x1f%ae%x1f%an%x1f%aI%x1f%s",
  ]);
  return stdout
    .split("\0")
    .filter(Boolean)
    .map((record) => {
      const [sha, email, name, date, subject] = record.split("\x1f");
      return { sha, email: email.toLowerCase(), name, date, subject };
    });
}

function monthsBetween(first, last) {
  const months = [];
  let [year, month] = first.split("-").map(Number);
  const [lastYear, lastMonth] = last.split("-").map(Number);
  while (year < lastYear || (year === lastYear && month <= lastMonth)) {
    months.push(`${year}-${String(month).padStart(2, "0")}`);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return months;
}

function isPersonLogin(login, type) {
  return type !== "Bot" && !BOT_PATTERN.test(login) && !NON_PERSON_LOGINS.has(login.toLowerCase());
}

async function main() {
  const areasConfig = JSON.parse(await readFile(areasPath, "utf8"));
  const areaIds = areasConfig.areas.map((area) => area.id);
  const repoArea = new Map();
  for (const area of areasConfig.areas) {
    const repos = [...area.groups.flatMap((group) => group.repos), ...area.unlisted];
    for (const fullName of repos) repoArea.set(fullName.toLowerCase(), area.id);
  }
  // The founder and the maintainers have their own cards on the page, so they stay off the wall.
  const featuredLogins = new Set(
    [...areasConfig.maintainers, areasConfig.founder].map((person) => person.github.toLowerCase()),
  );

  const api = createApi(await getToken());
  console.log(`Organizations: ${ORGANIZATIONS.join(", ")}`);
  console.log(`Clone cache: ${cacheDir}`);

  const repos = [];
  for (const org of ORGANIZATIONS) {
    const orgRepos = await api.getAllPages(`/orgs/${org}/repos?type=public&per_page=100`);
    repos.push(...orgRepos.filter((repo) => !repo.private && !/-ghsa-/i.test(repo.name)));
  }
  // The oldest repository claims history that was later copied into newer ones.
  repos.sort(
    (a, b) => a.created_at.localeCompare(b.created_at) || a.full_name.localeCompare(b.full_name),
  );
  console.log(`Public repositories: ${repos.length}`);

  const unmapped = repos.filter((repo) => !repoArea.has(repo.full_name.toLowerCase()));
  const publicNames = new Set(repos.map((repo) => repo.full_name.toLowerCase()));
  const missing = [...repoArea.keys()].filter((fullName) => !publicNames.has(fullName));

  const clones = await mapLimit(repos, 6, async (repo) => {
    process.stdout.write(`  sync ${repo.full_name}\n`);
    return syncClone(repo);
  });

  const seen = new Set();
  const counts = Object.fromEntries(areaIds.map((id) => [id, new Map()]));
  const repoFirstMonth = new Map();
  const authors = new Map();
  let firstMonth = null;

  for (const [index, repo] of repos.entries()) {
    const area = repoArea.get(repo.full_name.toLowerCase()) ?? FALLBACK_AREA;
    const forkedAt = repo.fork ? new Date(repo.created_at).getTime() : null;
    const commits = await readCommits(repo, clones[index]);
    let repoStart = repo.created_at.slice(0, 7);

    for (const commit of commits) {
      if (BOT_PATTERN.test(commit.name) || BOT_PATTERN.test(commit.email)) continue;
      if (forkedAt !== null && new Date(commit.date).getTime() <= forkedAt) continue;
      const key = `${commit.email}\x1f${commit.date}\x1f${commit.subject}`;
      if (seen.has(key)) continue;
      seen.add(key);

      // Author-local month, as the author saw the date.
      const month = commit.date.slice(0, 7);
      counts[area].set(month, (counts[area].get(month) ?? 0) + 1);
      if (month < repoStart) repoStart = month;
      if (!firstMonth || month < firstMonth) firstMonth = month;

      const time = Date.parse(commit.date);
      const author = authors.get(commit.email);
      if (author) {
        author.commits += 1;
        author.first = Math.min(author.first, time);
      } else {
        authors.set(commit.email, {
          commits: 1,
          first: time,
          sample: { repo: repo.full_name, sha: commit.sha },
        });
      }
    }
    repoFirstMonth.set(repo.full_name, repoStart);
  }

  const generatedAt = new Date().toISOString().slice(0, 10);
  const months = monthsBetween(firstMonth, generatedAt.slice(0, 7));

  const commitsByArea = Object.fromEntries(
    areaIds.map((id) => [id, months.map((month) => counts[id].get(month) ?? 0)]),
  );
  const commitsByYear = {};
  for (const [index, month] of months.entries()) {
    const year = month.slice(0, 4);
    for (const id of areaIds) {
      commitsByYear[year] = (commitsByYear[year] ?? 0) + commitsByArea[id][index];
    }
  }
  const totalCommits = Object.values(commitsByYear).reduce((sum, value) => sum + value, 0);
  const repositoriesByMonth = months.map(
    (month) => [...repoFirstMonth.values()].filter((start) => start <= month).length,
  );

  // Contributor wall: merged code only. Commits on default branches resolved to GitHub logins, and
  // merged pull requests for authors whose commit email is not linked to their account. Issues and
  // unmerged pull requests do not put anyone on the wall.
  const contributors = new Map();
  const credit = (login, field, amount, time) => {
    const keyLogin = login.toLowerCase();
    const entry = contributors.get(keyLogin) ?? { login, commits: 0, mergedPulls: 0, first: time };
    entry[field] += amount;
    entry.first = Math.min(entry.first, time);
    contributors.set(keyLogin, entry);
  };

  let unresolvedCommits = 0;
  // GitHub resolves each email, noreply addresses included, to the account's current login, so
  // renamed accounts land on their new name and deleted ones resolve to nobody.
  await mapLimit([...authors.values()], 8, async (author) => {
    const commit = await api.getJson(`/repos/${author.sample.repo}/commits/${author.sample.sha}`);
    const login = commit.author?.login;
    if (!login) {
      unresolvedCommits += author.commits;
      return;
    }
    if (!isPersonLogin(login, commit.author.type) || featuredLogins.has(login.toLowerCase())) {
      return;
    }
    credit(login, "commits", author.commits, author.first);
  });

  let issueCount = 0;
  let pullCount = 0;
  let mergedPullCount = 0;
  await mapLimit(repos, 4, async (repo) => {
    let items = await api.getAllPages(
      `/repos/${repo.full_name}/issues?state=all&per_page=100`,
      [404, 410],
    );
    // Repositories with issues turned off still have pull requests.
    if (!items) {
      items = await api.getAllPages(`/repos/${repo.full_name}/pulls?state=all&per_page=100`);
      for (const item of items) item.pull_request = item.url;
    }
    for (const item of items) {
      if (!item.user) continue;
      if (!item.pull_request) {
        issueCount += 1;
        continue;
      }
      pullCount += 1;
      // The issues endpoint nests merged_at under pull_request; the pulls endpoint has it on the item.
      const mergedAt = item.pull_request.merged_at ?? item.merged_at;
      if (!mergedAt) continue;
      mergedPullCount += 1;
      const { login, type } = item.user;
      if (!isPersonLogin(login, type) || featuredLogins.has(login.toLowerCase())) continue;
      credit(login, "mergedPulls", 1, Date.parse(mergedAt));
    }
  });

  // A merged pull request lands at least one commit, so the larger of the two counts is the
  // person's merged contributions; it only differs when commit emails are not linked to GitHub.
  const wall = [...contributors.values()]
    .map((entry) => ({ ...entry, contributions: Math.max(entry.commits, entry.mergedPulls) }))
    .filter((entry) => entry.contributions >= MIN_WALL_CONTRIBUTIONS)
    .sort(
      (a, b) =>
        b.contributions - a.contributions ||
        a.first - b.first ||
        a.login.toLowerCase().localeCompare(b.login.toLowerCase()),
    );

  const output = {
    generatedAt,
    organizations: ORGANIZATIONS,
    publicRepositories: repos.length,
    totalCommits,
    commitsByYear,
    months,
    commitsByArea,
    repositoriesByMonth,
    contributors: wall.map(({ login, contributions }) => ({ login, contributions })),
  };
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  // Match the repository formatter so `format:check` stays clean after a regeneration.
  const formatter = path.join(repoRoot, "node_modules/.bin/oxfmt");
  if (existsSync(formatter)) await execFileAsync(formatter, [outputPath]);

  const lastYear = String(Number(generatedAt.slice(0, 4)) - 1);
  const endOfLastYear = months.lastIndexOf(`${lastYear}-12`);
  console.log("");
  console.log(`Wrote ${path.relative(repoRoot, outputPath)} (generated ${generatedAt})`);
  console.log(`Commits by people: ${totalCommits} (${months[0]} to ${months.at(-1)})`);
  console.log(`Commits by year: ${JSON.stringify(commitsByYear)}`);
  console.log(
    `Repositories: ${endOfLastYear >= 0 ? repositoriesByMonth[endOfLastYear] : 0} at the end of ${lastYear}, ${repositoriesByMonth.at(-1)} now`,
  );
  console.log(`Issues: ${issueCount}, pull requests: ${pullCount} (${mergedPullCount} merged)`);
  console.log(`Commits with no GitHub login (chart only): ${unresolvedCommits}`);
  console.log(
    `Contributor wall: ${wall.length} (${wall
      .slice(0, 5)
      .map((entry) => `${entry.login} ${entry.contributions}`)
      .join(", ")}${wall.length > 5 ? ", ..." : ""})`,
  );
  for (const repo of unmapped) {
    console.warn(
      `warning: ${repo.full_name} has no area in src/data/about-areas.json; counted as "${FALLBACK_AREA}"`,
    );
  }
  for (const fullName of missing) {
    console.warn(`warning: ${fullName} in src/data/about-areas.json is not a public repository`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

import { intro, outro, log } from "@clack/prompts";
import cac from "cac";

import { version } from "../package.json";

intro("Welcome to @bjmhe/bjmhe");

const docsMap = {
  fund: {
    label: "FUNDING.yml",
    urls: ["https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/.github/FUNDING.yml"],
    fileName: ".github",
  },
  issue: {
    label: "ISSUE_TEMPLATE",
    urls: [
      "https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/.github/ISSUE_TEMPLATE/bug_report.yml",
      "https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/.github/ISSUE_TEMPLATE/config.yml",
      "https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/.github/ISSUE_TEMPLATE/feature_request.yml",
      "https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/.github/ISSUE_TEMPLATE/typo.yml",
    ],
    fileName: ".github/ISSUE_TEMPLATE",
  },
  pull: {
    label: "PULL_REQUEST_TEMPLATE",
    urls: [
      "https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/.github/PULL_REQUEST_TEMPLATE.md",
    ],
    fileName: ".github",
  },
  coc: {
    label: "CODE_OF_CONDUCT",
    urls: ["https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/CODE_OF_CONDUCT.md"],
    fileName: "",
  },
  license: {
    label: "LICENSE",
    urls: ["https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/LICENSE"],
    fileName: "",
  },
  contribution: {
    label: "CONTRIBUTING",
    urls: ["https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/CONTRIBUTING.md"],
    fileName: "",
  },
  security: {
    label: "SECURITY",
    urls: ["https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/SECURITY.md"],
    fileName: "",
  },
};

function writeFileEnsuringDir(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

const cli = cac();

cli.command("").action(async () => {
  log.info("👋 Hi there, I'm Benjamin He");
  log.info("Software engineer based in Beijing.");
  log.info(
    "I'm building web applications and open-source tools, with a focus on Rust and modern frontend.",
  );
});

async function fetchDocs(type: keyof typeof docsMap) {
  const docs = docsMap[type];
  for (const url of docs.urls) {
    const response = await fetch(url);
    const content = await response.text();
    writeFileEnsuringDir(path.join(process.cwd(), docs.fileName, url.split("/").pop()!), content);
  }
}

cli
  .command("fetch", "Fetch docs from @bjmhe")
  .option(
    "--type <type>",
    "The type of docs to fetch (fund|issue|pull|coc|license|contribution|security|all)",
    {
      default: "all",
    },
  )
  .action(async (options: { type: string }) => {
    const types =
      options.type === "all"
        ? (Object.keys(docsMap) as (keyof typeof docsMap)[])
        : [options.type as keyof typeof docsMap];

    for (const type of types) {
      if (!(type in docsMap)) {
        log.error(
          `Unknown docs type: ${type}. Valid types: ${Object.keys(docsMap).join(", ")}, all`,
        );
        return;
      }
    }

    for (const type of types) {
      await fetchDocs(type);
    }
    log.success("Docs fetched successfully");
  });

cli.help();
cli.version(version);

cli.parse();

outro("Exit...");

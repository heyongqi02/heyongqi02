#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

import { intro, outro, log, select } from "@clack/prompts";
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
    urls: ["https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/.github/PULL_REQUEST_TEMPLATE.md"],
    fileName: ".github",
  },
  coc: {
    label: "CODE_OF_CONDUCT",
    urls: ["https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/CODE_OF_CONDUCT.md"],
    fileName: "",
  }
}

function writeFileEnsuringDir(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

const cli = cac();

cli.command("").action(async () => {
  log.info("👋 Hi there, I'm Benjamin He")
  log.info("Software engineer based in Beijing.")
  log.info("I'm building web applications and open-source tools, with a focus on Rust and modern frontend.")
})

cli.command("fetch", "Fetch docs from @bjmhe")
  .action(async () => {
    const type = await select({
      message: 'Pick a docs type.',
      options: Object.entries(docsMap).map(([value, item]) => ({
        value,
        label: item.label,
      })),
    });
    if (!type) {
      log.error("No docs type selected");
      return;
    }
    const docs = docsMap[type as keyof typeof docsMap];
    if (!docs) {
      log.error("No docs found");
      return;
    }
    for (const url of docs.urls) {
      const response = await fetch(url);
      const content = await response.text();
      writeFileEnsuringDir(path.join(process.cwd(), docs.fileName, url.split("/").pop()!), content);
    }
    log.success("Docs fetched successfully");
  })

cli.help();
cli.version(version);

cli.parse();

outro("Exit...");

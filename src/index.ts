#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

import { intro, log } from "@clack/prompts";
import cac from "cac";

import { version } from "../package.json";

intro("Welcome to @bjmhe/bjmhe");

function writeFileEnsuringDir(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

const cli = cac();

cli.command("fund", "Fetch FUNDING.yml from @bjmhe").action(async () => {
  log.info("Fetching FUNDING.yml from @bjmhe/bjmhe...");
  try {
    // 拉取 https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/.github/FUNDING.yml 到本地的 .github/FUNDING.yml
    const fundingUrl =
      "https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/.github/FUNDING.yml";
    const funding = await fetch(fundingUrl);
    const fundingContent = await funding.text();
    // 当前命令行目录
    const currentDir = process.cwd();
    writeFileEnsuringDir(path.join(currentDir, ".github/FUNDING.yml"), fundingContent);
    log.success("FUNDING.yml fetched successfully");
  } catch (error) {
    log.error("Failed to fetch FUNDING.yml");
    console.error(JSON.stringify(error, null, 2));
  }
});

cli.command("issue", "Fetch ISSUE_TEMPLATE from @bjmhe").action(async () => {
  log.info("Fetching ISSUE_TEMPLATE from @bjmhe/bjmhe...");
  try {
    const issueTemplates = [
      "https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/.github/ISSUE_TEMPLATE/bug_report.yml",
      "https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/.github/ISSUE_TEMPLATE/config.yml",
      "https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/.github/ISSUE_TEMPLATE/feature_request.yml",
      "https://raw.githubusercontent.com/bjmhe/bjmhe/refs/heads/master/.github/ISSUE_TEMPLATE/typo.yml",
    ];

    for (const issueTemplate of issueTemplates) {
      const issueTemplateResponse = await fetch(issueTemplate);
      const issueTemplateContent = await issueTemplateResponse.text();
      // 当前命令行目录
      const currentDir = process.cwd();
      writeFileEnsuringDir(
        path.join(currentDir, ".github/ISSUE_TEMPLATE", issueTemplate.split("/").pop()!),
        issueTemplateContent,
      );
    }
    log.success("ISSUE_TEMPLATE fetched successfully");
  } catch (error) {
    log.error("Failed to fetch ISSUE_TEMPLATE");
    console.error(JSON.stringify(error, null, 2));
  }
});

cli.help();
cli.version(version);

cli.parse();

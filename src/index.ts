#!/usr/bin/env node
import cac from "cac";
import { version } from "../package.json";

const cli = cac();

cli.command("lint [...files]", "Lint files")
  .action((files, options) => {
    console.log(files, options);
  })

cli.help();
cli.version(version);

cli.parse();

#!/usr/bin/env nodej
const { prStats } = require("./prStats.js");
const { argv } = require("yargs");

(async () => {
  if (!argv.url || !argv.apiKey) {
    console.log("You didn't provide arguments");
    return;
  }

  await prStats(argv.url, argv.apiKey.toString());
})();

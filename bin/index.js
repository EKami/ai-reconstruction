#!/usr/bin/env node

const yargs = require("yargs");

const options = yargs
    .usage("Given a WSI as input and patche positions, outputs a WSI thumbnail with its overlay")
    .option("wsi", {describe: "The input WSI", type: "string", demandOption: true})
    .option("patches_positions", {describe: "The patch positions json file", type: "string", demandOption: true})
    .option("max_thumb_size", {describe: "Max thumb size", type: "int", default: 10_000})
    .option("output_file", {describe: "The output file for the WSI + overlay image", type: "string", demandOption: true})
    .argv;

console.log(`Using: ${options.wsi}!`);

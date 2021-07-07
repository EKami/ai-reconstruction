#!/usr/bin/env node

const fs = require('fs');
const yargs = require("yargs");
const sharp = require('sharp');

function main(args) {
    const positions = JSON.parse(fs.readFileSync(args.patches_positions));
    const max_thumb_size = args.max_thumb_size
    const output_file = args.output_file
    const wsi = options.wsi

    console.log(`Using: ${args.wsi}!`);
    sharp(wsi).resize(max_thumb_size).png().toFile(output_file)
    console.log(`Output available in ${output_file}`)
}

const options = yargs
    .usage("Given a WSI as input and patche positions, outputs a WSI thumbnail with its overlay")
    .option("wsi", {describe: "The input WSI", type: "string", demandOption: true})
    .option("patches_positions", {describe: "The patch positions json file", type: "string", demandOption: true})
    .option("max_thumb_size", {describe: "Max thumb size", type: "int", default: 10_000})
    .option("output_file", {describe: "The output file for the WSI + overlay image", type: "string", demandOption: true})
    .argv;

main(options)


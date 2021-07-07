#!/usr/bin/env node

const fs = require('fs');
const yargs = require("yargs");
const sharp = require('sharp');
const {Image, createCanvas} = require('canvas');

async function main(args) {
    const patches_positions = JSON.parse(fs.readFileSync(args.patches_positions));
    const max_thumb_size = args.max_thumb_size
    const output_file = args.output_file
    const wsi = options.wsi

    const full_size_dim = patches_positions["wsi_full_resolution"]

    console.log(`Using: ${args.wsi}!`);
    const wsi_buffer = await sharp(wsi).resize({height: max_thumb_size}).png().toBuffer()
    const wsi_img = new Image()
    wsi_img.src = wsi_buffer

    const width_ratio = full_size_dim[0] / wsi_img.width
    const height_ratio = full_size_dim[1] / wsi_img.height

    const patches_width = Math.round(patches_positions["patches_width"] / width_ratio)
    const patches_height = Math.round(patches_positions["patches_height"] / height_ratio)

    const overlay_canvas = createCanvas(wsi_img.width, wsi_img.height);
    const overlay_context = overlay_canvas.getContext("2d");
    overlay_context.fillStyle = 'rgba(255,0,0, 0.5)';
    const positions = patches_positions["positions"]

    console.log(`Pasting ${positions.length} positions...`)
    positions.forEach(pos => {
        const pos_x = Math.round(pos[0] / width_ratio)
        const pos_y = Math.round(pos[1] / height_ratio)
        overlay_context.fillRect(pos_x, pos_y, patches_width, patches_height)
    })

    const overlay_buffer = overlay_canvas.toBuffer("image/png");
    const combined = await sharp(wsi_buffer)
        .composite([{
            input: overlay_buffer
        }])
        .toBuffer()

    await sharp(combined)
        .png()
        .rotate(90)
        .toFile(output_file, function (err) {
        if (err !== null){
            console.log("Error: ", err)
        }
    });
    console.log(`Output available in ${output_file}`)
}

const options = yargs
    .usage("Given a WSI as input and patche positions, outputs a WSI thumbnail with its overlay")
    .option("wsi", {describe: "The input WSI", type: "string", demandOption: true})
    .option("patches_positions", {describe: "The patch positions json file", type: "string", demandOption: true})
    .option("max_thumb_size", {describe: "Max thumb size", type: "int", default: 10_000})
    .option("output_file", {
        describe: "The output file for the WSI + overlay image",
        type: "string",
        demandOption: true
    })
    .argv;

main(options)


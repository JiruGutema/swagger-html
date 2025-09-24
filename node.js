#!/usr/bin/env node
import fs from "fs";
import chalk from "chalk";
import fetch from "node-fetch";
import { program } from "commander";
import { outputOptions, versionOption } from "./options.js";

program
  .version("1.0.0")
  .description("Generate a single HTML file with embedded Swagger/OpenAPI spec")
  .option("-o, --output <file>", "Output HTML file", "swagger-api-docs.html")
  .option("--versioned", "Use versioned Swagger UI assets", false)
  .argument("<url>", "Swagger UI init.js URL or base URL")
  .parse(process.argv);

const options = program.opts();
const inputArg = program.args[0];
if (!inputArg) {
  console.error("Usage: node node.js <swagger-ui-init.js-URL or base URL>");
  process.exit(1);
}
let swaggerInitUrl = inputArg;
if (!swaggerInitUrl.endsWith('swagger-ui-init.js')) {
  swaggerInitUrl = swaggerInitUrl.replace(/\/+$/, '') + '/swagger-ui-init.js';
}

// Output file handling
let outputFile = outputOptions(options.output);

function makeHtmlWithSpec(spec) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Swagger Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>
  <script>
    // Embed the swagger JSON directly
    const swaggerSpec = ${JSON.stringify(spec, null, 2)};
    window.onload = () => {
      SwaggerUIBundle({
        spec: swaggerSpec,
        dom_id: "#swagger-ui",
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`;
}

(async () => {
  try {
    console.log(chalk.blue.bold("🔄 Fetching swagger-ui-init.js..."));
    const res = await fetch(swaggerInitUrl);
    const text = await res.text();

    // Extract the swaggerDoc object using a balanced-brace parser
    const swaggerDocKey = '"swaggerDoc"';
    const swaggerDocIdx = text.indexOf(swaggerDocKey);
    if (swaggerDocIdx === -1) {
      console.error(chalk.red.bold("❌ Could not find swaggerDoc key inside swagger-ui-init.js"));
      process.exit(1);
    }
    let start = text.indexOf('{', swaggerDocIdx);
    if (start === -1) {
      console.error(chalk.red.bold("❌ Could not find opening brace for swaggerDoc object"));
      process.exit(1);
    }
    let braceCount = 0;
    let end = start;
    for (let i = start; i < text.length; i++) {
      if (text[i] === '{') braceCount++;
      if (text[i] === '}') braceCount--;
      if (braceCount === 0) {
        end = i + 1;
        break;
      }
    }
    if (braceCount !== 0) {
      console.error(chalk.red.bold("❌ Could not find matching closing brace for swaggerDoc object"));
      process.exit(1);
    }
    const jsonText = text.slice(start, end);
    let json;
    try {
      json = JSON.parse(jsonText);
    } catch (e) {
      console.error(chalk.red.bold("❌ Failed to parse swaggerDoc JSON: " + e.message));
      process.exit(1);
    }

    // Adjust output file if versioned option is set
    outputFile = versionOption(options.versioned, outputFile, json);

    // Only output a single HTML file with the spec embedded
    try {
      fs.writeFileSync(outputFile, makeHtmlWithSpec(json));

      console.log(chalk.green.bold("✅ Export complete!"));
      console.log(
        chalk.yellow.bold(
          `Open ${outputFile} in your browser to view docs offline. No separate swagger.json needed.`,
        ),
      );
    } catch (e) {
      console.error(
        chalk.red.bold(`❌ Failed to write output file: ${e.message}`),
      );
      process.exit(1);
    }
  } catch (err) {
    console.error(chalk.red.bold("❌ Failed:"), chalk.red(err.message));
  }
})();

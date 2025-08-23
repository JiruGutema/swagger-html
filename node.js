#!/usr/bin/env node
import fs from "fs";
import fetch from "node-fetch";


const inputArg = process.argv[2];
if (!inputArg) {
  console.error("Usage: node node.js <swagger-ui-init.js-URL or base URL>");
  process.exit(1);
}
let swaggerInitUrl = inputArg;
if (!swaggerInitUrl.endsWith('swagger-ui-init.js')) {
  swaggerInitUrl = swaggerInitUrl.replace(/\/+$/, '') + '/swagger-ui-init.js';
}


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
    console.log("🔄 Fetching swagger-ui-init.js...");
    const res = await fetch(swaggerInitUrl);
    const text = await res.text();

    // Extract the swaggerDoc object using a balanced-brace parser
    const swaggerDocKey = '"swaggerDoc"';
    const swaggerDocIdx = text.indexOf(swaggerDocKey);
    if (swaggerDocIdx === -1) {
      throw new Error("Could not find swaggerDoc key inside swagger-ui-init.js");
    }
    let start = text.indexOf('{', swaggerDocIdx);
    if (start === -1) {
      throw new Error("Could not find opening brace for swaggerDoc object");
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
      throw new Error("Could not find matching closing brace for swaggerDoc object");
    }
    const jsonText = text.slice(start, end);
    let json;
    try {
      json = JSON.parse(jsonText);
    } catch (e) {
      throw new Error("Failed to parse swaggerDoc JSON: " + e.message);
    }

  // Only output a single HTML file with the spec embedded
  fs.writeFileSync("swagger-api-docs.html", makeHtmlWithSpec(json));

  console.log("✅ Export complete!");
  console.log("Open swagger-api-docs.html in your browser to view docs offline. No separate swagger.json needed.");
  } catch (err) {
    console.error("❌ Failed:", err.message);
  }
})();

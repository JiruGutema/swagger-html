import fs from "fs";

function outputOptions(output) {
  if (output) {
    if (fs.existsSync(output) && fs.lstatSync(output).isDirectory()) {
      return output.replace(/\/+$/, "") + "/swagger-api-docs.html";
    } else {
      return !output.endsWith(".html") ? output + ".html" : output;
    }
  }
}

function getVersion(spec) {
  return spec?.info?.version || "unknown";
}

function versionOption(versionFlag, outputFile, spec) {
  // Sanitize version string to be filesystem-friendly
  if (!versionFlag || !spec) return outputFile;
  const version = getVersion(spec).replace(/[^a-zA-Z0-9.-]/g, "-");

  return outputFile.replace(/\.html$/, `-v${version}.html`);
}

export { outputOptions, versionOption };

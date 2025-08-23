# swagger-html

Export your Swagger/OpenAPI docs as a single offline HTML file for easy sharing and viewing—no server required!

## Features
- Generates a single `api-docs.html` file with your full Swagger UI and spec embedded
- No need to serve or host JSON files
- Works with any Swagger/OpenAPI endpoint that exposes `swagger-ui-init.js`
- Simple CLI usage

## Installation

```bash
npm install -g swagger-html
```
You can find it here.

```
https://www.npmjs.com/package/swagger-html
```
## Usage

```bash
swagger-html <swagger-ui-init.js-URL or base URL>
```

### Example

```bash
swagger-html http://localhost:3000/api-docs
```

This will generate `swagger-api-docs.html` in your current directory. Open it in your browser to view your API docs offline.

<!-- ## CLI Options -->
<!--  -->
<!-- - `-h`, `--help`  Show usage instructions -->

## How it works
- Fetches your Swagger UI's `swagger-ui-init.js` file
- Extracts the OpenAPI JSON
- Embeds it directly into a standalone HTML file using Swagger UI

## Requirements
- Node.js v16 or newer

## License
MIT

# Contribution
- You can contribute to the project here [jirugutema/swagger-html](https://github.com/JiruGutema/swagger-html)
---

Made with ❤️ by JiruGutema

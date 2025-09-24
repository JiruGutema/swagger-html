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


[https://www.npmjs.com/package/swagger-html](https://www.npmjs.com/package/swagger-html)

## Usage


```bash
swagger-html <base URL for your swagger docs> [options](optional)
```


### Options
- `-o, --output <file>`: Specify output file or directory. If omitted, the default is `swagger-api-docs.html` in your current directory.
	- If a directory is given, the file will be named `swagger-api-docs.html` inside that directory.
	- If a filename is given, it will ensure the name ends with `.html`.
- `--versioned`: Append the API version to the output filename (e.g., `swagger-api-docs-v1.0.0.html`).

### Example

```bash
swagger-html http://localhost:3000/api-docs
```
This will generate a HTML file in the current directory. Open it in your browser to view your API docs offline.

or

```bash
    swagger-html http://localhost:3000/api-docs -o docs --versioned
```

This will generate a versioned HTML file in the `docs` directory. Open it in your browser to view your API docs offline.

## How it works
- Fetches your Swagger UI's `swagger-ui-init.js` file
- Extracts the OpenAPI JSON
- Embeds it directly into a standalone HTML file using Swagger UI

## Requirements
- Node.js v16 or newer

## License
MIT

# Contribution
- You can contribute to the project here [https://github.com/jirugutema/swagger-html](https://github.com/JiruGutema/swagger-html)
- To contribute, fork the repository, create a new branch, and submit a pull request.
- Make sure to update the documentation as needed.

Developed by JiruGutema


import React from "react";
import ReactDOMServer from "react-dom/server";
import { Data, Config, DefaultComponentProps, Metadata } from "../types";
import { Render } from "../components/Render";
import { resolveAllData } from "./resolve-all-data";

/**
 * Extract styles from document
 */
function extractStyles(): string {
  // Extract styles from document if we're in a browser environment
  if (typeof document !== "undefined") {
    const styles: string[] = [];

    // Get all stylesheets
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];

        // Handle CORS restrictions with external sheets
        if (sheet.cssRules) {
          const cssRules = Array.from(sheet.cssRules);
          const cssText = cssRules.map((rule) => rule.cssText).join("\n");
          styles.push(cssText);
        }
      } catch (e) {
        console.warn("Could not access stylesheet", e);
      }
    }

    return styles.join("\n");
  }

  return "";
}

/**
 * Generate a complete HTML document string from Puck data
 */
export async function generateHtml(
  data: Partial<Data>,
  config: Config,
  options: {
    metadata?: Metadata;
    title?: string;
    includeStyles?: boolean;
    additionalStyles?: string;
    additionalHead?: string;
    doctype?: string;
  } = {},
): Promise<string> {
  const {
    metadata = {},
    title = data?.root?.props?.title || "Generated with Puck",
    includeStyles = true,
    additionalStyles = "",
    additionalHead = "",
    doctype = "<!DOCTYPE html>",
  } = options;

  try {
    // If data needs resolution (for dynamic content)
    let resolvedData = data;
    // Always resolve data to ensure all dynamic content is processed
    resolvedData = await resolveAllData(data, config, metadata);

    // Create the React elements for the HTML document
    const content = ReactDOMServer.renderToStaticMarkup(
      <Render config={config} data={resolvedData} metadata={metadata} />,
    );

    // Extract styles if needed
    const styles = includeStyles
      ? extractStyles() + additionalStyles
      : additionalStyles;

    // Build the complete HTML document
    return `${doctype}
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  ${additionalHead}
  <style>${styles}</style>
</head>
<body>
  ${content}
</body>
</html>`;
  } catch (error) {
    console.error("Error generating HTML:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `<!DOCTYPE html>
<html>
<head>
  <title>Error</title>
</head>
<body>
  <h1>Error generating HTML</h1>
  <pre>${errorMessage}</pre>
</body>
</html>`;
  }
}

/**
 * Extract CSS from the current document
 */
export function extractCss(): string {
  return extractStyles();
}

/**
 * Export component HTML without the full document wrapper
 */
export async function generateComponentHtml(
  data: Partial<Data>,
  config: Config,
  metadata: Metadata = {},
): Promise<string> {
  try {
    // If data needs resolution (for dynamic content)
    let resolvedData = data;
    // Always resolve data to ensure all dynamic content is processed
    resolvedData = await resolveAllData(data, config, metadata);

    // Just render the component without wrapping HTML document
    return ReactDOMServer.renderToStaticMarkup(
      <Render config={config} data={resolvedData} metadata={metadata} />,
    );
  } catch (error) {
    console.error("Error generating component HTML:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `<div class="puck-export-error">
  <h2>Error generating component HTML</h2>
  <pre>${errorMessage}</pre>
</div>`;
  }
}

import * as prettierStandalone from "prettier/standalone";
import * as prettierHtml from "prettier/parser-html";
import * as prettierCss from "prettier/parser-postcss";
import * as prettierBabel from "prettier/parser-babel";

export const formatHtml = async (code: string): Promise<string> => {
  try {
    return await prettierStandalone.format(code, {
      parser: "html",
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: true,
      htmlWhitespaceSensitivity: "css",
      plugins: [prettierHtml],
    });
  } catch (error) {
    console.error("Error formatting HTML:", error);
    return code; // Return unformatted code in case of error
  }
};

export const formatCss = async (code: string): Promise<string> => {
  try {
    return await prettierStandalone.format(code, {
      parser: "css",
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: true,
      plugins: [prettierCss],
    });
  } catch (error) {
    console.error("Error formatting CSS:", error);
    return code; // Return unformatted code in case of error
  }
};

export const formatJson = async (code: string | object): Promise<string> => {
  try {
    const jsonString = typeof code === "string" ? code : JSON.stringify(code);
    return await prettierStandalone.format(jsonString, {
      parser: "json",
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: true,
      plugins: [prettierBabel],
    });
  } catch (error) {
    console.error("Error formatting JSON:", error);
    return typeof code === "string" ? code : JSON.stringify(code, null, 2); // Return simple formatted JSON
  }
};

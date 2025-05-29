import React, { useState } from "react";
import { Button } from "@/core/components/Button";
import { Code, FileJson, Eye } from "lucide-react";
import { exportToHtml, exportHtmlWithCss } from "../lib/html-export";
import { CodeModal } from "./CodeModal";
import { formatHtml, formatCss, formatJson } from "../lib/code-formatter";
import { useAppStoreApi } from "@/core/store";

interface HtmlExportButtonProps {}

export const HtmlExportButton: React.FC<HtmlExportButtonProps> = ({}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [cssContent, setCssContent] = useState("");
  const [jsonContent, setJsonContent] = useState("");
  const appStore = useAppStoreApi();
  const data = appStore.getState().state.data as any;
  const metadata = appStore.getState().metadata as any;

  const handleViewCode = async () => {
    try {
      setIsExporting(true);

      const { html, css } = await exportHtmlWithCss(data, metadata);

      // Format the code using prettier
      const formattedHtml = await formatHtml(html);
      const formattedCss = await formatCss(css);

      setHtmlContent(formattedHtml);
      setCssContent(formattedCss);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error preparing HTML/CSS:", error);
      alert("Failed to prepare HTML/CSS. Check console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewJson = async () => {
    try {
      setIsExporting(true);
      const formattedJson = await formatJson(data);
      setJsonContent(formattedJson);
      setIsJsonModalOpen(true);
    } catch (error) {
      console.error("Error preparing JSON:", error);
      alert("Failed to prepare JSON. Check console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div style={{ display: "flex", gap: "8px" }}>
        <Button
          onClick={handleViewCode}
          icon={<Code size="14px" />}
          disabled={isExporting}
        >
          {isExporting ? "Loading..." : "View HTML/CSS"}
        </Button>
        <Button
          onClick={handleViewJson}
          icon={<FileJson size="14px" />}
          variant="secondary"
          disabled={isExporting}
        >
          View JSON
        </Button>
      </div>

      {/* HTML/CSS Modal */}
      <CodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        html={htmlContent}
        css={cssContent}
        title="HTML & CSS Code"
      />

      {/* JSON Modal */}
      <CodeModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        json={jsonContent}
        title="Page JSON Data"
      />
    </>
  );
};

import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html as htmlLang } from "@codemirror/lang-html";
import { css as cssLang } from "@codemirror/lang-css";
import { json as jsonLang } from "@codemirror/lang-json";
import { githubLight } from "@uiw/codemirror-theme-github";
import { Button } from "@/core/components/Button";
import { X } from "lucide-react";

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  html?: string;
  css?: string;
  json?: string;
  title: string;
}

export const CodeModal: React.FC<CodeModalProps> = ({
  isOpen,
  onClose,
  html,
  css,
  json,
  title,
}) => {
  const [activeTab, setActiveTab] = useState<"html" | "css" | "json">(
    html ? "html" : json ? "json" : "css"
  );

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "1200px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #e1e1e1",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "18px" }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #e1e1e1",
            padding: "0 24px",
          }}
        >
          {html && (
            <button
              onClick={() => setActiveTab("html")}
              style={{
                padding: "12px 20px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                borderBottom:
                  activeTab === "html"
                    ? "2px solid #0070f3"
                    : "2px solid transparent",
                fontWeight: activeTab === "html" ? "bold" : "normal",
              }}
            >
              HTML
            </button>
          )}
          {css && (
            <button
              onClick={() => setActiveTab("css")}
              style={{
                padding: "12px 20px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                borderBottom:
                  activeTab === "css"
                    ? "2px solid #0070f3"
                    : "2px solid transparent",
                fontWeight: activeTab === "css" ? "bold" : "normal",
              }}
            >
              CSS
            </button>
          )}
          {json && (
            <button
              onClick={() => setActiveTab("json")}
              style={{
                padding: "12px 20px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                borderBottom:
                  activeTab === "json"
                    ? "2px solid #0070f3"
                    : "2px solid transparent",
                fontWeight: activeTab === "json" ? "bold" : "normal",
              }}
            >
              JSON
            </button>
          )}
        </div>

        {/* Code Editor Area */}
        <div
          style={{
            padding: "16px 24px",
            flex: 1,
            overflow: "auto",
            minHeight: "400px",
          }}
        >
          {activeTab === "html" && html && (
            <CodeMirror
              value={html}
              height="400px"
              theme={githubLight}
              extensions={[htmlLang()]}
              editable={false}
            />
          )}
          {activeTab === "css" && css && (
            <CodeMirror
              value={css}
              height="400px"
              theme={githubLight}
              extensions={[cssLang()]}
              editable={false}
            />
          )}
          {activeTab === "json" && json && (
            <CodeMirror
              value={json}
              height="400px"
              theme={githubLight}
              extensions={[jsonLang()]}
              editable={false}
            />
          )}
        </div>

        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #e1e1e1",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

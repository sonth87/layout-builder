import React, { useState } from 'react';
import { Button } from '@/core/components/Button';
import { Download } from 'lucide-react';
import { exportToHtml, exportHtmlWithCss } from '../lib/html-export';

interface HtmlExportButtonProps {
  data: any;
  metadata?: Record<string, any>;
}

export const HtmlExportButton: React.FC<HtmlExportButtonProps> = ({ 
  data, 
  metadata = {} 
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const html = await exportToHtml(data, metadata);
      
      // Create downloadable file
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Create download link and trigger click
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data?.root?.props?.title || 'puck-page'}.html`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting HTML:', error);
      alert('Failed to export HTML. Check console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSeparate = async () => {
    try {
      setIsExporting(true);
      const { html, css } = await exportHtmlWithCss(data, metadata);
      
      // Create downloadable HTML file
      const htmlBlob = new Blob([html], { type: 'text/html' });
      const htmlUrl = URL.createObjectURL(htmlBlob);
      
      // Create downloadable CSS file
      const cssBlob = new Blob([css], { type: 'text/css' });
      const cssUrl = URL.createObjectURL(cssBlob);
      
      // Create HTML download link and trigger click
      const htmlLink = document.createElement('a');
      htmlLink.href = htmlUrl;
      htmlLink.download = `${data?.root?.props?.title || 'puck-page'}.html`;
      document.body.appendChild(htmlLink);
      htmlLink.click();
      
      // Small delay to ensure downloads happen in sequence
      setTimeout(() => {
        // Create CSS download link and trigger click
        const cssLink = document.createElement('a');
        cssLink.href = cssUrl;
        cssLink.download = `${data?.root?.props?.title || 'puck-page'}.css`;
        document.body.appendChild(cssLink);
        cssLink.click();
        
        // Clean up
        document.body.removeChild(htmlLink);
        document.body.removeChild(cssLink);
        URL.revokeObjectURL(htmlUrl);
        URL.revokeObjectURL(cssUrl);
      }, 100);
      
    } catch (error) {
      console.error('Error exporting HTML/CSS:', error);
      alert('Failed to export HTML/CSS. Check console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button 
        onClick={handleExport}
        icon={<Download size="14px" />}
        disabled={isExporting}
      >
        {isExporting ? 'Exporting...' : 'Export HTML'}
      </Button>
      <Button 
        onClick={handleExportSeparate}
        icon={<Download size="14px" />}
        variant="secondary"
        disabled={isExporting}
      >
        Export HTML/CSS
      </Button>
    </div>
  );
};
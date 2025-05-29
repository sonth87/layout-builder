import { generateHtml, generateComponentHtml, extractCss } from '@/core';
import config from '../config';
import { UserData } from '../config/types';

/**
 * Exports Puck content as HTML string
 */
export const exportToHtml = async (
  data: Partial<UserData>,
  metadata: Record<string, any> = {}
): Promise<string> => {
  return await generateHtml(data, config, { 
    metadata,
    title: data?.root?.props?.title || 'Puck Generated Page'
  });
};

/**
 * Exports just the component HTML without document wrapper
 */
export const exportComponentHtml = async (
  data: Partial<UserData>,
  metadata: Record<string, any> = {}
): Promise<string> => {
  return await generateComponentHtml(data, config, metadata);
};

/**
 * Extract CSS for current page
 */
export const exportCss = (): string => {
  return extractCss();
};

/**
 * Export both HTML and CSS
 */
export const exportHtmlWithCss = async (
  data: Partial<UserData>,
  metadata: Record<string, any> = {}
): Promise<{ html: string, css: string }> => {
  const css = extractCss();
  const htmlContent = await generateComponentHtml(data, config, metadata);
  
  return {
    html: htmlContent,
    css: css
  };
};
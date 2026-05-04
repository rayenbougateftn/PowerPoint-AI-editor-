/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SlideContent {
  title: string;
  bullets: string[];
  notes?: string;
  layout?: 'title' | 'content' | 'section' | 'twoColumn';
}

export interface Presentation {
  id: string;
  userId: string;
  title: string;
  slides: SlideContent[];
  createdAt: number;
  theme: PresentationTheme;
  pdfUrl?: string;
}

export type PresentationTheme = 'corporate' | 'minimal' | 'creative' | 'academic';

export const THEMES: Record<PresentationTheme, {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  fontSans: string;
  fontSerif?: string;
}> = {
  corporate: {
    name: 'Corporate',
    primary: '#1e3a8a', // Blue 900
    secondary: '#3b82f6', // Blue 500
    accent: '#f59e0b', // Amber 500
    fontSans: 'Inter, sans-serif',
  },
  minimal: {
    name: 'Minimal',
    primary: '#111827', // Gray 900
    secondary: '#6b7280', // Gray 500
    accent: '#10b981', // Emerald 500
    fontSans: 'Inter, sans-serif',
  },
  creative: {
    name: 'Creative',
    primary: '#7c3aed', // Violet 600
    secondary: '#ec4899', // Pink 500
    accent: '#facc15', // Yellow 400
    fontSans: 'Inter, sans-serif',
  },
  academic: {
    name: 'Academic',
    primary: '#451a03', // Orange 950
    secondary: '#92400e', // Amber 800
    accent: '#0369a1', // Sky 700
    fontSans: 'Inter, sans-serif',
    fontSerif: 'Georgia, serif',
  }
};

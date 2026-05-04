/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import pptxgen from "pptxgenjs";
import { SlideContent, THEMES, PresentationTheme } from "../types";

export async function exportToPPTX(title: string, slides: SlideContent[], themeKey: PresentationTheme) {
  const pptx = new pptxgen();
  const theme = THEMES[themeKey];

  pptx.title = title;

  slides.forEach((slideData) => {
    const slide = pptx.addSlide();
    
    // Set background or color if needed
    // slide.background = { color: "#FFFFFF" };

    switch (slideData.layout) {
      case 'title':
        slide.addText(slideData.title, {
          x: 1, y: 2, w: '80%', h: 1.5,
          fontSize: 44, color: theme.primary,
          align: 'center', bold: true
        });
        if (slideData.bullets.length > 0) {
          slide.addText(slideData.bullets.join('\n'), {
            x: 1, y: 3.5, w: '80%', h: 1,
            fontSize: 24, color: theme.secondary,
            align: 'center'
          });
        }
        break;

      case 'section':
        // Background color for section title
        slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: theme.primary } });
        slide.addText(slideData.title, {
          x: 1, y: 2.5, w: '80%', h: 1,
          fontSize: 36, color: '#FFFFFF',
          align: 'center', bold: true
        });
        break;

      case 'content':
      default:
        slide.addText(slideData.title, {
          x: 0.5, y: 0.5, w: '90%', h: 1,
          fontSize: 32, color: theme.primary,
          bold: true
        });
        slide.addText(slideData.bullets.map(b => ({ text: b, options: { bullet: true, indent: 20 } })), {
          x: 0.5, y: 1.5, w: '90%', h: 4,
          fontSize: 18, color: theme.secondary,
        });
        break;
        
      case 'twoColumn':
        slide.addText(slideData.title, {
            x: 0.5, y: 0.5, w: '90%', h: 0.8,
            fontSize: 28, color: theme.primary,
            bold: true
        });
        const half = Math.ceil(slideData.bullets.length / 2);
        const col1 = slideData.bullets.slice(0, half);
        const col2 = slideData.bullets.slice(half);

        slide.addText(col1.map(b => ({ text: b, options: { bullet: true } })), {
            x: 0.5, y: 1.3, w: 4.5, h: 4,
            fontSize: 16, color: theme.secondary,
        });
        slide.addText(col2.map(b => ({ text: b, options: { bullet: true } })), {
            x: 5.2, y: 1.3, w: 4.5, h: 4,
            fontSize: 16, color: theme.secondary,
        });
        break;
    }

    if (slideData.notes) {
      slide.addNotes(slideData.notes);
    }
  });

  await pptx.writeFile({ fileName: `${title || 'presentation'}.pptx` });
}

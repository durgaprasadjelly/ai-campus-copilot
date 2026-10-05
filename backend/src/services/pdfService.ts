import pdfParse from 'pdf-parse';

export interface ExtractedPdf {
  text: string;
  numPages: number;
  pages: { pageNumber: number; text: string }[];
}

export async function extractPdfText(fileBuffer: Buffer): Promise<ExtractedPdf> {
  const pages: { pageNumber: number; text: string }[] = [];

  // Pagerender option callback for pdf-parse to collect individual page content
  const pagerender = (pageData: any) => {
    return pageData.getTextContent({ normalizeWhitespace: true }).then((textContent: any) => {
      let pageText = '';
      let lastY: number | undefined;

      for (const item of textContent.items) {
        if (lastY === undefined || lastY === item.transform[5]) {
          pageText += (pageText.endsWith(' ') || !pageText ? '' : ' ') + item.str;
        } else {
          pageText += '\n' + item.str;
        }
        lastY = item.transform[5];
      }

      pages.push({
        pageNumber: pageData.pageIndex + 1,
        text: pageText.trim()
      });

      return pageText;
    });
  };

  try {
    const data = await pdfParse(fileBuffer, { pagerender });

    // Ensure pages are sorted by pageNumber
    pages.sort((a, b) => a.pageNumber - b.pageNumber);

    // If for any reason page-by-page wasn't captured, fallback to full text
    if (pages.length === 0 && data.text) {
      pages.push({ pageNumber: 1, text: data.text.trim() });
    }

    return {
      text: data.text || pages.map(p => p.text).join('\n\n'),
      numPages: data.numpages || pages.length || 1,
      pages
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF document.');
  }
}

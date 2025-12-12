import pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import { createCanvas } from 'canvas';
import Tesseract from 'tesseract.js';

export async function extractTextFromPDF(buffer: Buffer) {
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const doc = await loadingTask.promise;
  let fullText = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((i: any) => (i.str || '')).join(' ');
    fullText += pageText + '\n\n';
  }
  return { text: fullText.trim(), pages: doc.numPages };
}

export async function extractTextWithOCR(buffer: Buffer) {
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const doc = await loadingTask.promise;
  let fullText = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');
    // render page into canvas
    await page.render({ canvasContext: ctx as any, viewport }).promise;
    const imgBuf = canvas.toBuffer('image/png');
    const res = await Tesseract.recognize(imgBuf, 'eng', { logger: () => {} });
    fullText += (res.data?.text || '') + '\n\n';
  }
  return { text: fullText.trim(), pages: doc.numPages };
}

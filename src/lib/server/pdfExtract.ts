// Defer heavy optional deps (canvas, tesseract, pdfjs) so install failures don't crash the server

export async function extractTextFromPDF(buffer: Buffer) {
  let pdfjsLib: any = null;
  try {
    const r = eval('require');
    pdfjsLib = r('pdfjs-dist/legacy/build/pdf');
  } catch (e) {
    try {
      const r = eval('require');
      pdfjsLib = r('pdfjs-dist');
    } catch (e2) {
      throw new Error('pdfjs-dist not available');
    }
  }

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
  let pdfjsLib: any = null;
  try {
    const r = eval('require');
    pdfjsLib = r('pdfjs-dist/legacy/build/pdf');
  } catch (e) {
    try { const r = eval('require'); pdfjsLib = r('pdfjs-dist'); } catch (e2) { throw new Error('pdfjs-dist not available'); }
  }

  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const doc = await loadingTask.promise;
  let fullText = '';
  // dynamic import to avoid hard dependency failures on systems without build tools
  let createCanvas: any = null;
  let Tesseract: any = null;
  try {
    // Use runtime require that bundlers can't statically analyze
    const r = eval('require');
    const canvasMod = r('canvas');
    createCanvas = canvasMod.createCanvas;
    const tmod = r('tesseract.js');
    Tesseract = tmod?.default || tmod;
  } catch (e) {
    // If optional libs are missing or not usable, return empty text and mark pages
    return { text: '', pages: doc.numPages, ocrUnavailable: true } as any;
  }
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

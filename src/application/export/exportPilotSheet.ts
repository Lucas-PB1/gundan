import { downloadBlob, saveBlobWithPicker } from './saveFile';

function slugify(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'piloto'
  );
}

export function pilotSheetPdfFilename(callSign: string, name: string): string {
  const label = callSign.trim() || name.trim() || 'piloto';
  return `beam-saber-${slugify(label)}.pdf`;
}

export function pilotSheetJsonFilename(callSign: string, name: string): string {
  const label = callSign.trim() || name.trim() || 'piloto';
  return `beam-saber-${slugify(label)}.json`;
}

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

/** Torna o container visível durante a captura (html2canvas ignora `visibility: hidden`). */
async function withPdfCaptureVisible<T>(
  element: HTMLElement,
  run: () => Promise<T>,
): Promise<T> {
  const root = element.closest('.bs-pdf-root') as HTMLElement | null;
  if (!root) return run();

  const prev = {
    visibility: root.style.visibility,
    left: root.style.left,
    top: root.style.top,
    zIndex: root.style.zIndex,
    pointerEvents: root.style.pointerEvents,
  };

  root.style.visibility = 'visible';
  root.style.left = '0';
  root.style.top = '0';
  root.style.zIndex = '99999';
  root.style.pointerEvents = 'none';

  try {
    await waitForPaint();
    return await run();
  } finally {
    root.style.visibility = prev.visibility;
    root.style.left = prev.left;
    root.style.top = prev.top;
    root.style.zIndex = prev.zIndex;
    root.style.pointerEvents = prev.pointerEvents;
  }
}

async function buildPilotSheetPdfBlob(element: HTMLElement): Promise<Blob> {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  return withPdfCaptureVisible(element, async () => {
    const canvas = await html2canvas(element, {
      scale: 2.5,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      onclone: (_doc, clone) => {
        const root = clone.querySelector('.bs-pdf-root') as HTMLElement | null;
        if (root) {
          root.style.visibility = 'visible';
          root.style.left = '0';
          root.style.position = 'static';
        }
      },
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let offsetY = 0;
    let remaining = imgHeight;

    pdf.addImage(imgData, 'PNG', 0, offsetY, pageWidth, imgHeight);
    remaining -= pageHeight;

    while (remaining > 0) {
      offsetY = remaining - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, offsetY, pageWidth, imgHeight);
      remaining -= pageHeight;
    }

    return pdf.output('blob');
  });
}

/** Gera o PDF e abre o diálogo para escolher onde salvar (com fallback para download). */
export async function exportPilotSheetPdf(
  element: HTMLElement,
  filename: string,
): Promise<'saved' | 'cancelled' | 'downloaded'> {
  const blob = await buildPilotSheetPdfBlob(element);
  const result = await saveBlobWithPicker(blob, filename);

  if (result === 'saved' || result === 'cancelled') {
    return result === 'saved' ? 'saved' : 'cancelled';
  }

  downloadBlob(blob, filename);
  return 'downloaded';
}

export function downloadPilotJson(pilot: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(pilot, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  downloadBlob(blob, filename);
}

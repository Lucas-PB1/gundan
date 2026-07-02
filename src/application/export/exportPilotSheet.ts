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

/** Captura um elemento HTML e gera PDF A4 para download. */
export async function exportPilotSheetPdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff',
    logging: false,
    useCORS: true,
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

  pdf.save(filename);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadPilotJson(pilot: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(pilot, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  downloadBlob(blob, filename);
}

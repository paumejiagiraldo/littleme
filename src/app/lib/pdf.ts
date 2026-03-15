'use client';

import { jsPDF } from 'jspdf';
import { BookPage } from './types';

export async function generateBookPdf(
  pages: BookPage[],
  title: string,
  childName: string
): Promise<Blob> {
  // A4 portrait dimensions in mm
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Title page
  doc.setFillColor(245, 243, 255); // light violet
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(88, 28, 135); // violet-900
  const titleLines = doc.splitTextToSize(title, contentWidth);
  doc.text(titleLines, pageWidth / 2, pageHeight / 2 - 30, { align: 'center' });

  doc.setFontSize(18);
  doc.setTextColor(107, 114, 128); // gray-500
  doc.text(`A story for ${childName}`, pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(156, 163, 175);
  doc.text('Made with LittleMe ❤️', pageWidth / 2, pageHeight - 30, { align: 'center' });

  // Story pages
  for (const page of pages) {
    doc.addPage();

    // Add illustration if available
    if (page.illustrationUrl && page.illustrationUrl.startsWith('data:')) {
      try {
        const imgData = page.illustrationUrl;
        // Center image at top of page
        const imgWidth = contentWidth;
        const imgHeight = 140; // fixed height for illustration area
        doc.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      } catch (e) {
        console.error('Failed to add image to PDF:', e);
      }
    }

    // Add text below illustration
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55); // gray-800
    const textY = page.illustrationUrl ? 180 : margin + 20;
    const textLines = doc.splitTextToSize(page.text, contentWidth);
    doc.text(textLines, pageWidth / 2, textY, { align: 'center', maxWidth: contentWidth });

    // Page number
    doc.setFontSize(10);
    doc.setTextColor(156, 163, 175);
    doc.text(`${page.pageNumber}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
  }

  return doc.output('blob');
}

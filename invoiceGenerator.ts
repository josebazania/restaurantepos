
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Sale } from './types';

export const generateInvoicePDF = (sale: Sale) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Color Palette
  const primaryColor = [99, 102, 241]; // Indigo-600

  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('NEXUS POS', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('FACTURA ELECTRÓNICA', pageWidth - 20, 20, { align: 'right' });
  doc.text(`Folio: #${sale.id}`, pageWidth - 20, 27, { align: 'right' });

  // Company Info & Client Info
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Emisor:', 20, 55);
  doc.setFont('helvetica', 'normal');
  doc.text('Nexus Solutions S.A. de C.V.', 20, 60);
  doc.text('RFC: NEX123456ABC', 20, 65);
  doc.text('Calle Innovación #101, Tech City', 20, 70);

  doc.setFont('helvetica', 'bold');
  doc.text('Detalles de Venta:', pageWidth - 80, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${new Date(sale.timestamp).toLocaleString()}`, pageWidth - 80, 60);
  doc.text(`Método de Pago: ${sale.paymentMethod}`, pageWidth - 80, 65);
  doc.text('Cliente: Público en General', pageWidth - 80, 70);

  // Table
  const tableRows = sale.items.map(item => [
    item.name,
    item.quantity.toString(),
    `$${item.price.toFixed(2)}`,
    `$${(item.price * item.quantity).toFixed(2)}`
  ]);

  (doc as any).autoTable({
    startY: 85,
    head: [['Descripción', 'Cant.', 'P. Unitario', 'Subtotal']],
    body: tableRows,
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 20, right: 20 }
  });

  const finalY = (doc as any).lastAutoTable.finalY || 150;

  // Totals
  const totalsX = pageWidth - 20;
  const subtotal = sale.total / 1.16;
  const tax = sale.total - subtotal;

  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalsX - 40, finalY + 15);
  doc.text(`$${subtotal.toFixed(2)}`, totalsX, finalY + 15, { align: 'right' });

  doc.text('IVA (16%):', totalsX - 40, finalY + 22);
  doc.text(`$${tax.toFixed(2)}`, totalsX, finalY + 22, { align: 'right' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('TOTAL:', totalsX - 40, finalY + 32);
  doc.text(`$${sale.total.toFixed(2)}`, totalsX, finalY + 32, { align: 'right' });

  // Footer / Legal
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Este documento es una representación impresa de un CFDI.', pageWidth / 2, finalY + 60, { align: 'center' });
  doc.text('¡Gracias por su compra!', pageWidth / 2, finalY + 65, { align: 'center' });

  // Download
  doc.save(`Factura_${sale.id}.pdf`);
};

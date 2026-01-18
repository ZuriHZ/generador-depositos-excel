import * as XLSX from 'xlsx';
import { Deposit } from '@/hooks/useDeposits';

export const exportDepositsToExcel = (deposits: Deposit[], filename: string = 'depositos.xlsx') => {
  if (deposits.length === 0) {
    throw new Error('No hay depósitos para exportar');
  }

  // Preparar datos para Excel
  const data = deposits.map((deposit) => ({
    Fecha: deposit.fecha,
    'Número de Cuenta': deposit.numeroCuenta,
    'Nombre del Cliente': deposit.nombreCliente,
    Monto: deposit.monto,
    'Tipo de Depósito': deposit.tipoDeposito,
    Remito: deposit.remito || '',
    'Número de Bolsa': deposit.numeroBolsa || '',
  }));

  // Crear libro de trabajo
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Configurar ancho de columnas
  const columnWidths = [
    { wch: 12 }, // Fecha
    { wch: 18 }, // Número de Cuenta
    { wch: 25 }, // Nombre del Cliente
    { wch: 15 }, // Monto
    { wch: 18 }, // Tipo de Depósito
    { wch: 15 }, // Remito
    { wch: 18 }, // Número de Bolsa
  ];
  worksheet['!cols'] = columnWidths;

  // Formatear encabezados
  const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].font = { bold: true, color: { rgb: 'FFFFFF' } };
      worksheet[cellAddress].fill = { fgColor: { rgb: '0066CC' } };
      worksheet[cellAddress].alignment = { horizontal: 'center', vertical: 'center' };
    }
  }

  // Formatear columna de monto como moneda
  for (let row = 1; row <= deposits.length; row++) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: 3 }); // Columna Monto
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].num_fmt = '#,##0.00';
    }
  }

  // Crear libro y agregar hoja
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Depósitos');

  // Descargar archivo
  XLSX.writeFile(workbook, filename);
};

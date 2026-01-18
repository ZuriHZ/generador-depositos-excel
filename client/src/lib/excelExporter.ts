import { Deposit } from "@/hooks/useDepositsWithDB";

export const exportDepositsToExcel = async (
  deposits: Deposit[],
  filename: string = "depositos.xlsx"
) => {
  if (deposits.length === 0) {
    throw new Error("No hay depósitos para exportar");
  }

  // Carga dinámica de XLSX para reducir el tamaño del bundle inicial
  const XLSX = await import("xlsx");

  // Preparar datos para Excel
  const data = deposits.map(deposit => ({
    Fecha: deposit.fecha,
    "Número de Cuenta": deposit.numeroCuenta,
    "Nombre del Cliente": deposit.nombreCliente,
    Monto: deposit.monto,
    "Tipo de Depósito": deposit.tipoDeposito,
    Remito: deposit.remito || "",
    "Número de Bolsa": deposit.numeroBolsa || "",
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
  worksheet["!cols"] = columnWidths;

  // Formatear columna de monto como moneda
  for (let row = 1; row <= deposits.length; row++) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: 3 }); // Columna Monto
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].z = "#,##0.00";
    }
  }

  // Crear libro y agregar hoja
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Depósitos");

  // Descargar archivo
  XLSX.writeFile(workbook, filename);
};

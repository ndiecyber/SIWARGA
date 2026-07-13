import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export interface ExpenseRow {
  date: string;
  description: string;
  category: string;
  amount: number;
  status: string;
  approvedBy: string;
}

export interface ExpenseReportData {
  periodLabel: string;
  printDate: string;
  totalExpenses: number;
  totalCount: number;
  expenses: ExpenseRow[];
  categoryBreakdown: { category: string; total: number }[];
}

const formatRupiah = (value: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },
  header: { fontSize: 16, fontWeight: "bold", textAlign: "center", marginBottom: 4 },
  subHeader: { fontSize: 9, textAlign: "center", color: "#666", marginBottom: 16 },
  infoBox: { border: 1, borderColor: "#ccc", padding: 10, marginBottom: 16 },
  infoRow: { flexDirection: "row", marginBottom: 2 },
  infoLabel: { width: 130, fontWeight: "bold" },
  infoValue: { flex: 1 },
  sectionTitle: { fontSize: 11, fontWeight: "bold", marginTop: 16, marginBottom: 8 },
  summaryBox: { border: 1, borderColor: "#ccc", padding: 10, marginBottom: 16 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  summaryLabel: { fontSize: 10 },
  summaryValue: { fontSize: 10, fontWeight: "bold" },
  table: { border: 1, borderColor: "#ccc", marginBottom: 16 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f0f0f0", borderBottom: 1, borderBottomColor: "#ccc" },
  tableRow: { flexDirection: "row", borderBottom: 1, borderBottomColor: "#eee" },
  tableRowAlt: { backgroundColor: "#fafafa" },
  tableTotalRow: { flexDirection: "row", borderTop: 1, borderTopColor: "#999", backgroundColor: "#f5f5f5" },
  cell: { padding: 5, fontSize: 9 },
  cellBold: { fontWeight: "bold" },
  cellDate: { width: "15%" },
  cellDesc: { width: "30%" },
  cellCategory: { width: "20%" },
  cellAmount: { width: "15%", textAlign: "right" },
  cellStatus: { width: "20%", textAlign: "center" },
  signatureContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 40 },
  signatureBlock: { alignItems: "center", width: "40%" },
  signatureLabel: { fontSize: 9, marginBottom: 4 },
  signatureRole: { fontSize: 9, fontWeight: "bold", marginBottom: 40 },
  signatureLine: { fontSize: 10 },
});

export function ExpenseReportPDF({ data }: { data: ExpenseReportData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>LAPORAN PENGELUARAN KAS RT</Text>
        <Text style={styles.subHeader}>
          Sistem Informasi Warga (SIWARGA)
        </Text>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Periode Laporan</Text>
            <Text style={styles.infoValue}>{data.periodLabel}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tanggal Cetak</Text>
            <Text style={styles.infoValue}>{data.printDate}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Ringkasan</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Pengeluaran</Text>
            <Text style={styles.summaryValue}>Rp {formatRupiah(data.totalExpenses)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Jumlah Transaksi</Text>
            <Text style={styles.summaryValue}>{data.totalCount} transaksi</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>1. Rincian Pengeluaran</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.cellDate]}>Tanggal</Text>
            <Text style={[styles.cell, styles.cellDesc]}>Deskripsi</Text>
            <Text style={[styles.cell, styles.cellCategory]}>Kategori</Text>
            <Text style={[styles.cell, styles.cellAmount]}>Jumlah (Rp)</Text>
            <Text style={[styles.cell, styles.cellStatus]}>Status</Text>
          </View>
          {data.expenses.map((row, i) => (
            <View key={i} style={i % 2 === 0 ? [styles.tableRow, styles.tableRowAlt] : styles.tableRow}>
              <Text style={[styles.cell, styles.cellDate]}>{row.date}</Text>
              <Text style={[styles.cell, styles.cellDesc]}>{row.description}</Text>
              <Text style={[styles.cell, styles.cellCategory]}>{row.category}</Text>
              <Text style={[styles.cell, styles.cellAmount]}>{formatRupiah(row.amount)}</Text>
              <Text style={[styles.cell, styles.cellStatus]}>{row.status}</Text>
            </View>
          ))}
          <View style={styles.tableTotalRow}>
            <Text style={[styles.cell, styles.cellDate]} />
            <Text style={[styles.cell, styles.cellDesc, styles.cellBold]}>TOTAL</Text>
            <Text style={[styles.cell, styles.cellCategory]} />
            <Text style={[styles.cell, styles.cellAmount, styles.cellBold]}>{formatRupiah(data.totalExpenses)}</Text>
            <Text style={[styles.cell, styles.cellStatus]} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>2. Breakdown per Kategori</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, { width: "50%" }]}>Kategori</Text>
            <Text style={[styles.cell, { width: "50%", textAlign: "right" }]}>Total (Rp)</Text>
          </View>
          {data.categoryBreakdown.map((row, i) => (
            <View key={i} style={i % 2 === 0 ? [styles.tableRow, styles.tableRowAlt] : styles.tableRow}>
              <Text style={[styles.cell, { width: "50%" }]}>{row.category}</Text>
              <Text style={[styles.cell, { width: "50%", textAlign: "right" }]}>{formatRupiah(row.total)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.signatureContainer}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Mengetahui,</Text>
            <Text style={styles.signatureRole}>Ketua RT</Text>
            <Text style={styles.signatureLine}>( _________________ )</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Dilaporkan oleh,</Text>
            <Text style={styles.signatureRole}>Bendahara RT</Text>
            <Text style={styles.signatureLine}>( _________________ )</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

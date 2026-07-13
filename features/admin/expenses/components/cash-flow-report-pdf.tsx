import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export interface CashFlowRow {
  label: string;
  income: number;
  expense: number;
}

export interface CashFlowReportData {
  periodLabel: string;
  printDate: string;
  totalIncome: number;
  totalExpense: number;
  netCashFlow: number;
  incomeBreakdown: { label: string; amount: number }[];
  expenseBreakdown: { label: string; amount: number }[];
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
  summaryPositive: { fontSize: 10, fontWeight: "bold", color: "#059669" },
  summaryNegative: { fontSize: 10, fontWeight: "bold", color: "#dc2626" },
  table: { border: 1, borderColor: "#ccc", marginBottom: 16 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f0f0f0", borderBottom: 1, borderBottomColor: "#ccc" },
  tableRow: { flexDirection: "row", borderBottom: 1, borderBottomColor: "#eee" },
  tableRowAlt: { backgroundColor: "#fafafa" },
  cell: { padding: 5, fontSize: 9 },
  cellBold: { fontWeight: "bold" },
  cellLabel: { width: "40%" },
  cellIncome: { width: "30%", textAlign: "right" },
  cellExpense: { width: "30%", textAlign: "right" },
  signatureContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 40 },
  signatureBlock: { alignItems: "center", width: "40%" },
  signatureLabel: { fontSize: 9, marginBottom: 4 },
  signatureRole: { fontSize: 9, fontWeight: "bold", marginBottom: 40 },
  signatureLine: { fontSize: 10 },
});

export function CashFlowReportPDF({ data }: { data: CashFlowReportData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>LAPORAN ARUS KAS RT</Text>
        <Text style={styles.subHeader}>Periode {data.periodLabel}</Text>

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

        <Text style={styles.sectionTitle}>Ringkasan Arus Kas</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Pemasukan (Iuran)</Text>
            <Text style={styles.summaryValue}>Rp {formatRupiah(data.totalIncome)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Pengeluaran</Text>
            <Text style={styles.summaryValue}>Rp {formatRupiah(data.totalExpense)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={data.netCashFlow >= 0 ? styles.summaryPositive : styles.summaryNegative}>
              Rp {formatRupiah(Math.abs(data.netCashFlow))} ({data.netCashFlow >= 0 ? "Surplus" : "Defisit"})
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>1. Breakdown Pemasukan (Iuran)</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.cellLabel]}>Sumber</Text>
            <Text style={[styles.cell, styles.cellExpense]}>Jumlah (Rp)</Text>
          </View>
          {data.incomeBreakdown.map((row, i) => (
            <View key={i} style={i % 2 === 0 ? [styles.tableRow, styles.tableRowAlt] : styles.tableRow}>
              <Text style={[styles.cell, styles.cellLabel]}>{row.label}</Text>
              <Text style={[styles.cell, styles.cellExpense]}>{formatRupiah(row.amount)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>2. Breakdown Pengeluaran</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.cellLabel]}>Kategori</Text>
            <Text style={[styles.cell, styles.cellExpense]}>Jumlah (Rp)</Text>
          </View>
          {data.expenseBreakdown.map((row, i) => (
            <View key={i} style={i % 2 === 0 ? [styles.tableRow, styles.tableRowAlt] : styles.tableRow}>
              <Text style={[styles.cell, styles.cellLabel]}>{row.label}</Text>
              <Text style={[styles.cell, styles.cellExpense]}>{formatRupiah(row.amount)}</Text>
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

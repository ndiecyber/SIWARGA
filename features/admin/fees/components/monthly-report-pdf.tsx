import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export interface PaymentRow {
  date: string;
  houseLabel: string;
  method: string;
  amount: number;
}

export interface ArrearsRow {
  number: number;
  houseLabel: string;
  amount: number;
}

export interface ReportData {
  periodLabel: string;
  printDate: string;
  totalTarget: number;
  totalRealisasi: number;
  totalTunggakan: number;
  payments: PaymentRow[];
  arrears: ArrearsRow[];
}

const formatRupiah = (value: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 9,
    textAlign: "center",
    color: "#666",
    marginBottom: 16,
  },
  infoBox: {
    border: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  infoLabel: {
    width: 130,
    fontWeight: "bold",
  },
  infoValue: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  summaryBox: {
    border: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 10,
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: "bold",
  },
  noteText: {
    fontSize: 8,
    marginTop: 4,
    color: "#666",
    fontStyle: "italic",
  },
  table: {
    border: 1,
    borderColor: "#ccc",
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottom: 1,
    borderBottomColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: 1,
    borderBottomColor: "#eee",
  },
  tableRowAlt: {
    backgroundColor: "#fafafa",
  },
  tableTotalRow: {
    flexDirection: "row",
    borderTop: 1,
    borderTopColor: "#999",
    backgroundColor: "#f5f5f5",
  },
  cell: {
    padding: 5,
    fontSize: 9,
  },
  cellBold: {
    fontWeight: "bold",
  },
  cellDate: {
    width: "15%",
  },
  cellHouse: {
    width: "35%",
  },
  cellMethod: {
    width: "30%",
  },
  cellAmount: {
    width: "20%",
    textAlign: "right",
  },
  cellNo: {
    width: "10%",
    textAlign: "center",
  },
  cellArrearsAmount: {
    width: "55%",
    textAlign: "right",
  },
  cellArrearsHouse: {
    width: "35%",
  },
  noticeTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 8,
    marginBottom: 4,
    color: "#444",
    lineHeight: 1.4,
  },
  signatureContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },
  signatureBlock: {
    alignItems: "center",
    width: "40%",
  },
  signatureLabel: {
    fontSize: 9,
    marginBottom: 4,
  },
  signatureRole: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 40,
  },
  signatureLine: {
    fontSize: 10,
  },
});

export function MonthlyReportPDF({ data }: { data: ReportData }) {
  const persentase =
    data.totalTarget > 0
      ? ((data.totalRealisasi / data.totalTarget) * 100).toFixed(1)
      : "0";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>LAPORAN BULANAN KEUANGAN RT</Text>
        <Text style={styles.subHeader}>
          Sistem Informasi Transparansi Iuran Warga (Open Access)
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
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sifat Dokumen</Text>
            <Text style={styles.infoValue}>
              Terbuka untuk Warga (Open Access)
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Ringkasan Eksekutif (Bulan Berjalan)
        </Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Target Iuran</Text>
            <Text style={styles.summaryValue}>
              Rp {formatRupiah(data.totalTarget)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Realisasi</Text>
            <Text style={styles.summaryValue}>
              Rp {formatRupiah(data.totalRealisasi)} ({persentase}%)
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sisa Tunggakan</Text>
            <Text style={styles.summaryValue}>
              Rp {formatRupiah(data.totalTunggakan)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          1. Rincian Realisasi Pembayaran Masuk
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.cellDate]}>Tanggal</Text>
            <Text style={[styles.cell, styles.cellHouse]}>
              Blok / No. Rumah
            </Text>
            <Text style={[styles.cell, styles.cellMethod]}>
              Metode Transfer
            </Text>
            <Text style={[styles.cell, styles.cellAmount]}>Jumlah (Rp)</Text>
          </View>
          {data.payments.map((row, i) => (
            <View
              key={i}
              style={
                i % 2 === 0
                  ? [styles.tableRow, styles.tableRowAlt]
                  : styles.tableRow
              }
            >
              <Text style={[styles.cell, styles.cellDate]}>{row.date}</Text>
              <Text style={[styles.cell, styles.cellHouse]}>
                {row.houseLabel}
              </Text>
              <Text style={[styles.cell, styles.cellMethod]}>{row.method}</Text>
              <Text style={[styles.cell, styles.cellAmount]}>
                {formatRupiah(row.amount)}
              </Text>
            </View>
          ))}
          <View style={styles.tableTotalRow}>
            <Text style={[styles.cell, styles.cellDate]} />
            <Text style={[styles.cell, styles.cellHouse, styles.cellBold]}>
              TOTAL
            </Text>
            <Text style={[styles.cell, styles.cellMethod]} />
            <Text style={[styles.cell, styles.cellAmount, styles.cellBold]}>
              {formatRupiah(data.totalRealisasi)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          2. Daftar Rumah dengan Status Tunggakan
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.cellNo]}>No</Text>
            <Text style={[styles.cell, styles.cellArrearsHouse]}>
              Blok / No. Rumah
            </Text>
            <Text style={[styles.cell, styles.cellArrearsAmount]}>
              Nilai Tunggakan (Rp)
            </Text>
          </View>
          {data.arrears.map((row, i) => (
            <View
              key={i}
              style={
                i % 2 === 0
                  ? [styles.tableRow, styles.tableRowAlt]
                  : styles.tableRow
              }
            >
              <Text style={[styles.cell, styles.cellNo]}>{row.number}</Text>
              <Text style={[styles.cell, styles.cellArrearsHouse]}>
                {row.houseLabel}
              </Text>
              <Text style={[styles.cell, styles.cellArrearsAmount]}>
                {formatRupiah(row.amount)}
              </Text>
            </View>
          ))}
          <View style={styles.tableTotalRow}>
            <Text style={[styles.cell, styles.cellNo]} />
            <Text
              style={[styles.cell, styles.cellArrearsHouse, styles.cellBold]}
            >
              TOTAL
            </Text>
            <Text
              style={[styles.cell, styles.cellArrearsAmount, styles.cellBold]}
            >
              {formatRupiah(data.totalTunggakan)}
            </Text>
          </View>
        </View>

        <Text style={styles.noticeTitle}>
          Pemberitahuan Transparansi & Privasi Data
        </Text>
        <Text style={styles.noticeText}>
          1. Keamanan Data Pribadi (UU PDP): Nama lengkap, nomor telepon, dan
          dokumen pribadi sengaja tidak ditampilkan demi keamanan privasi.
          Identifikasi rumah menggunakan kode blok dan nomor rumah.
        </Text>
        <Text style={styles.noticeText}>
          2. Laporan ini hanya menampilkan rumah yang dihuni. Rumah kosong
          (tidak berpenghuni) tidak memiliki kewajiban iuran pada periode ini.
        </Text>
        <Text style={styles.noticeText}>
          3. Koreksi Data: Jika Anda merasa sudah melakukan pembayaran namun
          status masih menunjukkan belum lunas, hubungi bendahara RT dengan
          melampirkan bukti transfer asli.
        </Text>

        <View style={styles.signatureContainer}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Mengetahui,</Text>
            <Text style={styles.signatureRole}>Ketua RT 01</Text>
            <Text style={styles.signatureLine}>( _________________ )</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Dilaporkan oleh,</Text>
            <Text style={styles.signatureRole}>Bendahara RT 01</Text>
            <Text style={styles.signatureLine}>( _________________ )</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

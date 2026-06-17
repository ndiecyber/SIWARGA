export default function DashboardLoading() {
  return (
    <div className="fixed inset-0 z-50 grid min-h-dvh place-items-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />

        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            Memuat dashboard
          </p>
          <p className="text-xs text-muted-foreground">
            Mohon tunggu sebentar...
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── File Upload Field ────────────────────────────────────────────────────────

import { Upload } from "lucide-react";
import Image from "next/image";
import React from "react";

function FileUploadField({
  id,
  label,
  description,
  accept,
  value,
  onChange,
  error,
  previewUrl,
}: {
  id: string;
  label: string;
  description?: string;
  accept: string;
  value?: File;
  onChange: (file: File) => void;
  error?: string;
  previewUrl?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-1.5">
      <div
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 text-center transition-colors
          ${
            error
              ? "border-destructive/60 bg-destructive/5 hover:bg-destructive/10"
              : value || previewUrl
                ? "border-primary/40 bg-primary/5 hover:bg-primary/10"
                : "border-border hover:border-muted-foreground/40 hover:bg-muted/50"
          }`}
      >
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          aria-invalid={!!error}
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              onChange(file);
            }

            // Supaya user bisa pilih file yang sama lagi
            e.target.value = "";
          }}
        />

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full ${
            value || previewUrl ? "bg-primary/10" : "bg-muted"
          }`}
        >
          <Upload
            className={`h-4 w-4 ${
              value || previewUrl ? "text-primary" : "text-muted-foreground"
            }`}
          />
        </div>

        {value ? (
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-primary">{value.name}</p>
            <p className="text-xs text-muted-foreground">
              {(value.size / 1024).toFixed(0)} KB · Klik untuk ganti
            </p>
          </div>
        ) : previewUrl ? (
          <div className="space-y-2">
            <div className="relative w-full h-32 mx-auto">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="rounded object-contain"
                sizes="200px"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              File sebelumnya · Klik untuk ganti
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            <p className="text-sm font-medium">{label}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUploadField;

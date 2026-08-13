import React, { useState } from 'react';
import { Language } from '../../types/types';
import { translations } from '../../i18n/translations';
import { Upload, Trash2, Image as ImageIcon, AlertCircle, CheckCircle2, QrCode } from 'lucide-react';

interface UpiUploadCardProps {
  language: Language;
  initialCount?: number;
  onCountChange: (count: number) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  previewUrl: string;
}

export const UpiUploadCard: React.FC<UpiUploadCardProps> = ({
  language,
  initialCount = 0,
  onCountChange
}) => {
  const t = translations[language] || translations.en;

  // Mock initial items if initialCount > 0
  const [files, setFiles] = useState<UploadedFile[]>(() => {
    if (initialCount <= 0) return [];
    return Array.from({ length: Math.min(initialCount, 10) }, (_, i) => ({
      id: `upi_init_${i + 1}`,
      name: `UPI_Screenshot_${i + 1}.png`,
      size: '245 KB',
      previewUrl: ''
    }));
  });

  const [warningMessage, setWarningMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setWarningMessage('');

    const newFilesList: File[] = Array.from(e.target.files);
    const availableSlots = 10 - files.length;

    if (availableSlots <= 0) {
      setWarningMessage(t.upi_limit_notice || 'Maximum limit of 10 UPI screenshots reached.');
      return;
    }

    const filesToTake = newFilesList.slice(0, availableSlots);
    if (newFilesList.length > availableSlots) {
      setWarningMessage(t.upi_limit_notice || 'Maximum limit of 10 UPI screenshots reached. Extra files were skipped.');
    }

    const createdUploads: UploadedFile[] = filesToTake.map((f, idx) => ({
      id: `upi_${Date.now()}_${idx}`,
      name: f.name,
      size: `${(f.size / 1024).toFixed(0)} KB`,
      previewUrl: URL.createObjectURL(f)
    }));

    const updated = [...files, ...createdUploads];
    setFiles(updated);
    onCountChange(updated.length);
  };

  const handleRemove = (id: string) => {
    setWarningMessage('');
    const updated = files.filter(f => f.id !== id);
    setFiles(updated);
    onCountChange(updated.length);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-theme-soft text-theme-accent">
              <QrCode className="h-5 w-5" />
            </div>
            <h3 className="font-serif-lora text-lg font-bold text-theme-primary">
              {t.upi_upload_title}
            </h3>
          </div>
          <p className="text-xs text-theme-secondary leading-relaxed pl-11">
            {t.upi_upload_subtitle}
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-theme-border bg-theme-bg text-xs font-bold text-theme-accent shrink-0">
          <CheckCircle2 className="w-4 h-4 text-theme-accent" />
          <span>{files.length} / 10 Attached</span>
        </div>
      </div>

      {/* Warning Notice */}
      {warningMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-xs font-semibold dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* Dropzone */}
      {files.length < 10 && (
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-theme-border rounded-2xl bg-theme-bg hover:border-theme-accent cursor-pointer transition-colors text-center group">
          <Upload className="w-8 h-8 text-theme-secondary group-hover:text-theme-accent transition-colors mb-2" />
          <span className="text-xs sm:text-sm font-bold text-theme-primary">
            {t.upi_dropzone}
          </span>
          <span className="text-[11px] text-theme-secondary mt-1">
            Accepts PNG, JPG, WEBP (Max 10 files)
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}

      {/* Uploaded Files Grid / List */}
      {files.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold uppercase tracking-wider text-theme-secondary">
            {t.upi_uploaded_label} ({files.length})
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-xl border border-theme-border bg-theme-bg space-x-3"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {file.previewUrl ? (
                    <img
                      src={file.previewUrl}
                      alt={file.name}
                      className="h-10 w-10 rounded-lg object-cover border border-theme-border shrink-0"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-theme-surface border border-theme-border text-theme-accent shrink-0">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-theme-primary truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-theme-secondary font-mono">
                      {file.size}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(file.id)}
                  className="p-1.5 rounded-lg text-theme-secondary hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Remove screenshot"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

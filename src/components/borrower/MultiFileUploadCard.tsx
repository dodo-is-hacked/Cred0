import React, { useState } from 'react';
import { UploadedDoc } from '../../types/types';
import { Upload, FileCheck, FileText, Trash2, Eye, X, ShieldCheck } from 'lucide-react';

interface MultiFileUploadCardProps {
  title: string;
  subtitle?: string;
  files: UploadedDoc[];
  onChange: (files: UploadedDoc[]) => void;
}

export const MultiFileUploadCard: React.FC<MultiFileUploadCardProps> = ({
  title,
  subtitle,
  files,
  onChange,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewDoc, setPreviewDoc] = useState<UploadedDoc | null>(null);

  const simulateAddFiles = (newDocs: { name: string; type: string; size: string }[]) => {
    setIsUploading(true);
    setProgress(15);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          const added: UploadedDoc[] = newDocs.map((d, idx) => ({
            id: `doc_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
            name: d.name,
            type: d.type,
            size: d.size,
            uploadedAt: new Date().toLocaleDateString(),
          }));

          onChange([...files, ...added]);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray: File[] = Array.from(e.target.files);
      const docsToAdd = filesArray.map((f: File) => ({
        name: f.name,
        type: f.type.includes('pdf') ? 'PDF Document' : 'Image Document',
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      }));
      simulateAddFiles(docsToAdd);
    }
  };

  const handleDeleteDoc = (id: string) => {
    const updated = files.filter((d) => d.id !== id);
    onChange(updated);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-theme-border bg-theme-surface p-5 shadow-xs">
      <div>
        <h4 className="font-serif-lora text-lg font-bold text-theme-primary">{title}</h4>
        {subtitle && <p className="text-xs text-theme-secondary mt-0.5">{subtitle}</p>}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-50/40 p-3.5 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Attached Records ({files.length})
            </span>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {files.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-xl border border-theme-border bg-theme-surface shadow-2xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-theme-soft text-theme-accent">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-theme-primary truncate">{doc.name}</p>
                    <p className="text-[10px] text-theme-secondary">
                      {doc.type} · {doc.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(doc)}
                    title="Preview Document"
                    className="p-1 rounded-lg text-theme-secondary hover:text-theme-accent hover:bg-theme-bg"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteDoc(doc.id)}
                    title="Delete Document"
                    className="p-1 rounded-lg text-theme-secondary hover:text-red-500 hover:bg-theme-bg"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploading progress state */}
      {isUploading ? (
        <div className="space-y-3 rounded-xl border border-theme-border bg-theme-bg p-6 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-theme-soft text-theme-accent animate-pulse">
            <FileCheck className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-theme-primary">Uploading document record...</p>
          <div className="mx-auto max-w-xs h-2 w-full overflow-hidden rounded-full bg-theme-border">
            <div
              className="h-full bg-theme-accent transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        /* Dropzone input */
        <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-theme-border bg-theme-bg p-5 text-center transition-all hover:border-theme-accent hover:bg-theme-soft/20 cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-theme-surface text-theme-accent shadow-2xs border border-theme-border">
            <Upload className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-theme-primary">
            Drag & drop or click to upload supporting documents
          </p>
          <p className="text-[11px] text-theme-secondary mt-0.5">PNG, JPG, or PDF (Optional)</p>
        </label>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-theme-accent" />
                <h4 className="font-serif-lora text-base font-bold text-theme-primary truncate max-w-[240px]">
                  {previewDoc.name}
                </h4>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="rounded-lg p-1 text-theme-secondary hover:text-theme-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 py-2">
              <div className="rounded-xl border border-theme-border bg-theme-bg p-4 text-center space-y-1.5">
                <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-theme-primary">Supporting Document Attached</p>
                <p className="text-xs text-theme-secondary">
                  File record added to your borrower verification profile.
                </p>
              </div>

              <div className="space-y-1 text-xs text-theme-secondary">
                <p>
                  <span className="font-semibold text-theme-primary">Type:</span> {previewDoc.type}
                </p>
                <p>
                  <span className="font-semibold text-theme-primary">Size:</span> {previewDoc.size}
                </p>
                <p>
                  <span className="font-semibold text-theme-primary">Uploaded:</span> {previewDoc.uploadedAt}
                </p>
              </div>
            </div>

            <button
              onClick={() => setPreviewDoc(null)}
              className="w-full rounded-xl bg-theme-accent py-2.5 text-xs font-bold text-white shadow-xs"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
